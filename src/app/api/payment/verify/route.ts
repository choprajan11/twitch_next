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

      if (type === "wallet") {
        const txnId = url.searchParams.get("txn");
        if (response.status && txnId) {
          // Validate that the Stripe session metadata matches the requested txnId
          if (response.metadata?.txnId && response.metadata.txnId !== txnId) {
            console.error(`Payment metadata mismatch: expected ${txnId}, got ${response.metadata.txnId}`);
            return NextResponse.redirect(`${BASE_URL}/dashboard/wallet?funded=false`);
          }

          // Atomic conditional update: only update if status is still "pending"
          const updated = await prisma.transaction.updateMany({
            where: { txnId, status: "pending" },
            data: {
              status: "complete",
              gatewayTxn: response.txnId,
            },
          });

          if (updated.count > 0) {
            const transaction = await prisma.transaction.findUnique({
              where: { txnId },
            });

            if (transaction) {
              // Validate userId matches Stripe metadata if available
              if (response.metadata?.userId && response.metadata.userId !== transaction.userId) {
                console.error(`User mismatch for txn ${txnId}`);
                return NextResponse.redirect(`${BASE_URL}/dashboard/wallet?funded=false`);
              }

              const amount = response.amount || transaction.amount;

              await prisma.$transaction([
                prisma.user.update({
                  where: { id: transaction.userId },
                  data: { funds: { increment: amount } },
                }),
                prisma.fundLog.create({
                  data: {
                    userId: transaction.userId,
                    type: "add",
                    amount,
                    oldFunds: 0,
                    newFunds: 0,
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

      if (response.status && response.oid) {
        // Atomic: only update if status is still "payment"
        const updated = await prisma.order.updateMany({
          where: { oid: response.oid, status: "payment", txnId: null },
          data: {
            status: "pending",
            txnId: response.txnId,
            price: response.amount,
          },
        });

        if (updated.count > 0) {
          const order = await prisma.order.findUnique({
            where: { oid: response.oid },
          });
          if (order) {
            const processed = await processOrderImmediately(order.id);
            console.log(`Stripe order ${response.oid} verified and processed:`, processed);
          }

          return NextResponse.redirect(
            `${BASE_URL}/checkout/success?order=${response.oid}`
          );
        }

        const existingOrder = await prisma.order.findUnique({
          where: { oid: response.oid },
        });
        if (existingOrder && existingOrder.status !== "payment") {
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
