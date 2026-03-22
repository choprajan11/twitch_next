import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { processOrderImmediately } from "@/lib/orderProcessor";
import { verifyOxaPayHmac, type OxaPayWebhookPayload } from "@/lib/oxapay";

async function handleWalletTopup(txnId: string, trackId: string) {
  const updated = await prisma.transaction.updateMany({
    where: { txnId, status: "pending" },
    data: { status: "complete", gatewayTxn: trackId },
  });

  if (updated.count === 0) return;

  const transaction = await prisma.transaction.findUnique({ where: { txnId } });
  if (!transaction) return;

  const user = await prisma.user.findUnique({
    where: { id: transaction.userId },
    select: { funds: true },
  });
  if (!user) return;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: transaction.userId },
      data: { funds: { increment: transaction.amount } },
    }),
    prisma.fundLog.create({
      data: {
        userId: transaction.userId,
        type: "add",
        amount: transaction.amount,
        oldFunds: user.funds,
        newFunds: user.funds + transaction.amount,
        note: "Wallet top-up via Crypto",
      },
    }),
  ]);

  console.log(`Wallet top-up ${txnId} credited: $${transaction.amount}`);
}

async function handleOrderPayment(oid: string, trackId: string) {
  const updated = await prisma.order.updateMany({
    where: { oid, status: "payment" },
    data: { status: "pending", txnId: trackId },
  });

  if (updated.count > 0) {
    const order = await prisma.order.findUnique({ where: { oid } });
    if (order) {
      const processed = await processOrderImmediately(order.id);
      console.log(`OxaPay order ${oid} processing result:`, processed);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const hmacHeader = req.headers.get("hmac");

    if (!hmacHeader) {
      return new Response("Missing HMAC", { status: 400 });
    }

    let isValid = false;
    try {
      isValid = verifyOxaPayHmac(rawBody, hmacHeader);
    } catch {
      return new Response("Invalid HMAC", { status: 401 });
    }

    if (!isValid) {
      console.error("OxaPay webhook: invalid HMAC signature");
      return new Response("Invalid HMAC", { status: 401 });
    }

    const payload: OxaPayWebhookPayload = JSON.parse(rawBody);

    if (payload.status === "Paid" && payload.order_id) {
      if (payload.order_id.startsWith("wallet_")) {
        await handleWalletTopup(payload.order_id, payload.track_id);
      } else {
        await handleOrderPayment(payload.order_id, payload.track_id);
      }
    }

    return new Response("ok", { status: 200 });
  } catch (error) {
    console.error("OxaPay webhook error:", error);
    return new Response("ok", { status: 200 });
  }
}
