import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { createOxaPayInvoice } from "@/lib/oxapay";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amount } = body;
    const numAmount = Number(amount);

    if (isNaN(numAmount) || numAmount < 1) {
      return NextResponse.json(
        { error: "Minimum amount is $1" },
        { status: 400 }
      );
    }

    if (numAmount > 500) {
      return NextResponse.json(
        { error: "Maximum amount is $500" },
        { status: 400 }
      );
    }

    const formattedAmount = Number(numAmount.toFixed(2));
    const txnId = `WAL-${Date.now()}-${crypto.randomBytes(4).toString("hex").slice(0, 6)}`;

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { funds: true, email: true },
    });

    await prisma.transaction.create({
      data: {
        userId: session.userId,
        txnId,
        gatewayId: "oxapay",
        amount: formattedAmount,
        oldFunds: user?.funds ?? 0,
        status: "pending",
      },
    });

    const invoice = await createOxaPayInvoice({
      amount: formattedAmount,
      orderId: txnId,
      email: user?.email || "",
      description: `Wallet Top-up: $${formattedAmount}`,
      returnUrl: `${APP_URL}/dashboard/wallet?funded=true`,
      callbackUrl: `${APP_URL}/api/webhooks/oxapay`,
    });

    return NextResponse.json({
      success: true,
      url: invoice.data.payment_url,
    });
  } catch (error: any) {
    console.error("Add funds error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
