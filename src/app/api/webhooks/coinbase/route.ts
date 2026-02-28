import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const webhookSecret = process.env.COINBASE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get("x-cc-webhook-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  try {
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(payload)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const body = JSON.parse(payload);
    const eventType = body.event?.type;
    const eventData = body.event?.data;

    if (!eventData?.metadata?.order_id) {
      return NextResponse.json({ received: true });
    }

    const txnId = eventData.metadata.order_id;
    const transaction = await prisma.transaction.findUnique({
      where: { txnId },
    });

    if (!transaction || transaction.status !== "pending") {
      return NextResponse.json({ received: true });
    }

    if (eventType === "charge:confirmed" || eventType === "charge:resolved") {
      const user = await prisma.user.findUnique({
        where: { id: transaction.userId },
      });

      if (user) {
        await prisma.$transaction([
          prisma.user.update({
            where: { id: user.id },
            data: { funds: { increment: transaction.amount } },
          }),
          prisma.transaction.update({
            where: { txnId },
            data: {
              status: "complete",
              oldFunds: user.funds,
              gatewayTxn: eventData.code || eventData.id,
            },
          }),
          prisma.fundLog.create({
            data: {
              userId: user.id,
              type: "add",
              amount: transaction.amount,
              oldFunds: user.funds,
              newFunds: user.funds + transaction.amount,
              note: "Wallet top-up via Coinbase",
            },
          }),
        ]);
      }
    } else if (eventType === "charge:failed") {
      await prisma.transaction.update({
        where: { txnId },
        data: { status: "failed" },
      });
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Coinbase webhook error:", err);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }
}
