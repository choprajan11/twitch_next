import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { processStripeRequest } from "@/lib/stripe";
import { rateLimit } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { allowed } = rateLimit(`retry-payment:${session.userId}`, 5, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { service: true, user: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.userId !== session.userId && session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (order.status !== "payment") {
      return NextResponse.json(
        { error: "Order is not pending payment" },
        { status: 400 }
      );
    }

    const stripeResult = await processStripeRequest({
      orderId: order.id,
      oid: order.oid || order.id,
      email: order.user.email,
      amount: order.price,
      serviceSlug: order.service.slug,
      quantity: order.quantity,
    });

    if (!stripeResult) {
      return NextResponse.json(
        { error: "Failed to create payment session" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: stripeResult.redirectUrl });
  } catch (error: any) {
    console.error("Retry payment error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
