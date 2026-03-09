import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { processOrderImmediately } from "@/lib/orderProcessor";
import { stripe, stripeConfig } from "@/lib/stripe";

const endpointSecret = stripeConfig.webhookSecret;

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (!sig) throw new Error("No signature provided");
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      if (session.metadata?.type === "wallet_topup") {
        const { userId, txnId, amount } = session.metadata;
        const numAmount = parseFloat(amount);

        // Atomic: only update if still pending — prevents double credit on retries
        const updated = await prisma.transaction.updateMany({
          where: { txnId, status: "pending" },
          data: {
            status: "complete",
            gatewayTxn: session.payment_intent as string,
          },
        });

        if (updated.count > 0) {
          await prisma.$transaction([
            prisma.user.update({
              where: { id: userId },
              data: { funds: { increment: numAmount } },
            }),
            prisma.fundLog.create({
              data: {
                userId,
                type: "add",
                amount: numAmount,
                oldFunds: 0,
                newFunds: 0,
                note: "Wallet top-up via Stripe",
              },
            }),
          ]);
        }

        return NextResponse.json({ received: true });
      }

      const oid = session.metadata?.oid || session.client_reference_id;
      if (oid) {
        // Atomic: only update if still in "payment" status
        const updated = await prisma.order.updateMany({
          where: { oid, status: "payment" },
          data: {
            status: "pending",
            txnId: session.payment_intent as string,
          },
        });

        if (updated.count > 0) {
          const order = await prisma.order.findUnique({ where: { oid } });
          if (order) {
            const processed = await processOrderImmediately(order.id);
            console.log(`Stripe order ${oid} processing result:`, processed);
          }
        }
      }
    } catch (error) {
      console.error("Webhook processing error:", error);
    }
  }

  return NextResponse.json({ received: true });
}
