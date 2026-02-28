import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (!sig) throw new Error("No signature provided");
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Wallet top-up flow
      if (session.metadata?.type === "wallet_topup") {
        const { userId, txnId, amount } = session.metadata;
        const numAmount = parseFloat(amount);

        const transaction = await prisma.transaction.findUnique({
          where: { txnId },
        });

        if (transaction && transaction.status === "pending") {
          const user = await prisma.user.findUnique({
            where: { id: userId },
          });

          if (user) {
            await prisma.$transaction([
              prisma.user.update({
                where: { id: userId },
                data: { funds: { increment: numAmount } },
              }),
              prisma.transaction.update({
                where: { txnId },
                data: {
                  status: "complete",
                  oldFunds: user.funds,
                  gatewayTxn: session.payment_intent as string,
                },
              }),
              prisma.fundLog.create({
                data: {
                  userId,
                  type: "add",
                  amount: numAmount,
                  oldFunds: user.funds,
                  newFunds: user.funds + numAmount,
                  note: "Wallet top-up via Stripe",
                },
              }),
            ]);
          }
        }
        return NextResponse.json({ received: true });
      }

      // Order payment flow
      const oid = session.client_reference_id;
      if (oid) {
        const order = await prisma.order.findUnique({ where: { oid } });

        if (order && order.status === "payment") {
          await prisma.order.update({
            where: { oid },
            data: {
              status: "pending",
              txnId: session.payment_intent as string,
            },
          });
        }
      }
    } catch (error) {
      console.error("Webhook processing error:", error);
    }
  }

  return NextResponse.json({ received: true });
}
