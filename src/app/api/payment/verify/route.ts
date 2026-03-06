import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyStripeSession } from "@/lib/stripe";
import { processOrderImmediately } from "@/lib/orderProcessor";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const gateway = url.searchParams.get("gateway")?.toLowerCase();
  const sessionId = url.searchParams.get("session");
  const type = url.searchParams.get("type");

  if (gateway === "stripe" && sessionId) {
    try {
      const response = await verifyStripeSession(sessionId);

      // Handle wallet top-up
      if (type === "wallet") {
        const txnId = url.searchParams.get("txn");
        if (response.status && txnId) {
          const transaction = await prisma.transaction.findUnique({
            where: { txnId },
          });

          if (transaction && transaction.status === "pending") {
            const user = await prisma.user.findUnique({
              where: { id: transaction.userId },
            });

            if (user) {
              const amount = response.amount || transaction.amount;
              await prisma.$transaction([
                prisma.user.update({
                  where: { id: transaction.userId },
                  data: { funds: { increment: amount } },
                }),
                prisma.transaction.update({
                  where: { txnId },
                  data: {
                    status: "complete",
                    oldFunds: user.funds,
                    gatewayTxn: response.txnId,
                  },
                }),
                prisma.fundLog.create({
                  data: {
                    userId: transaction.userId,
                    type: "add",
                    amount,
                    oldFunds: user.funds,
                    newFunds: user.funds + amount,
                    note: "Wallet top-up via Stripe",
                  },
                }),
              ]);

              console.log(`Wallet top-up ${txnId} verified for user ${transaction.userId}`);
              return NextResponse.redirect(`${BASE_URL}/dashboard/wallet?funded=true`);
            }
          }
        }
        return NextResponse.redirect(`${BASE_URL}/dashboard/wallet?funded=false`);
      }

      // Handle order payment
      if (response.status && response.oid) {
        const order = await prisma.order.findUnique({
          where: { oid: response.oid },
        });

        if (order && order.status === "payment" && !order.txnId) {
          await prisma.order.update({
            where: { oid: response.oid },
            data: {
              status: "pending",
              txnId: response.txnId,
              price: response.amount || order.price,
            },
          });

          const processed = await processOrderImmediately(order.id);
          console.log(`Stripe order ${response.oid} verified and processed:`, processed);

          return NextResponse.redirect(
            `${BASE_URL}/checkout/success?order=${response.oid}`
          );
        }

        if (order && order.status !== "payment") {
          return NextResponse.redirect(
            `${BASE_URL}/checkout/success?order=${response.oid}`
          );
        }
      }

      console.error("Payment verification failed:", response);
      return NextResponse.redirect(`${BASE_URL}/checkout/failed?reason=verification_failed`);
    } catch (error) {
      console.error("Payment verify error:", error);
      return NextResponse.redirect(`${BASE_URL}/checkout/failed?reason=error`);
    }
  }

  return NextResponse.redirect(`${BASE_URL}/checkout/failed?reason=invalid_gateway`);
}
