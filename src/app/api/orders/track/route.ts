import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { rateLimit } from "@/lib/security";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json(
      { error: "Please log in to track orders" },
      { status: 401 }
    );
  }

  const { allowed } = rateLimit(`track:${session.userId}`, 20, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json(
      { error: "Please provide an order ID" },
      { status: 400 }
    );
  }

  try {
    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: orderId },
          { oid: orderId },
        ],
        userId: session.userId,
      },
      include: {
        service: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const progress = order.quantity > 0 
      ? Math.round(((order.quantity - order.remains) / order.quantity) * 100)
      : 0;

    return NextResponse.json({
      id: order.oid || order.id,
      status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
      service: order.service.name,
      quantity: order.quantity,
      createdAt: order.createdAt.toISOString(),
      progress: progress,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
