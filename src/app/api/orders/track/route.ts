import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get("orderId");
  const email = searchParams.get("email");

  if (!orderId && !email) {
    return NextResponse.json(
      { error: "Please provide an order ID or email" },
      { status: 400 }
    );
  }

  try {
    let order;

    if (orderId) {
      order = await prisma.order.findFirst({
        where: {
          OR: [
            { id: orderId },
            { oid: orderId },
          ],
        },
        include: {
          service: true,
        },
      });
    } else if (email) {
      order = await prisma.order.findFirst({
        where: {
          user: {
            email: email,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          service: true,
        },
      });
    }

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
