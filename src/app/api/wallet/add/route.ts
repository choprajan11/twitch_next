import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { stripe, stripeConfig } from "@/lib/stripe";

// NOTE: The Stripe webhook at /api/webhooks/stripe/route.ts must also handle
// checkout.session.completed events where metadata.type === 'wallet_topup'.
// When that event fires, it should: find the Transaction by txnId (client_reference_id),
// credit the user's funds, create a FundLog entry, and mark the Transaction as 'completed'.

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, gateway = "stripe" } = body;
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

    if (gateway === "crypto") {
      return NextResponse.json(
        { error: "Crypto payments coming soon" },
        { status: 400 }
      );
    }

    if (gateway !== "stripe") {
      return NextResponse.json(
        { error: "Invalid payment gateway" },
        { status: 400 }
      );
    }

    const formattedAmount = Number(numAmount.toFixed(2));
    const txnId = `wallet_${session.userId}_${crypto.randomUUID()}`;

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { funds: true },
    });

    await prisma.transaction.create({
      data: {
        userId: session.userId,
        txnId,
        gatewayId: "stripe",
        amount: formattedAmount,
        oldFunds: user?.funds ?? 0,
        status: "pending",
      },
    });

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Add $${formattedAmount} to Wallet`,
              description: "GrowTwitch Wallet Top-up (Non-refundable)",
            },
            unit_amount: Math.round(formattedAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      allow_promotion_codes: true,
      client_reference_id: txnId,
      metadata: {
        type: "wallet_topup",
        userId: session.userId,
        txnId,
        amount: String(formattedAmount),
      },
      success_url: `${stripeConfig.contentcageRoute}?session={CHECKOUT_SESSION_ID}&method=verify&type=wallet&txn=${txnId}`,
      cancel_url: `${stripeConfig.contentcageRoute}?session={CHECKOUT_SESSION_ID}&method=verify&type=wallet&txn=${txnId}`,
    });

    const hash = Buffer.from(`${stripeSession.id}||${stripeConfig.publishKey}`).toString("base64");
    const redirectUrl = `${stripeConfig.contentcageRoute}?hash=${hash}`;

    return NextResponse.json({
      success: true,
      url: redirectUrl,
    });
  } catch (error: any) {
    console.error("Add funds error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
