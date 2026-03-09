import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { logSecurityEvent, getClientIp } from "@/lib/security-monitor";

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
      logSecurityEvent({
        type: "webhook_signature_failure",
        severity: "critical",
        ip: getClientIp(req),
        path: "/api/webhooks/coinbase",
        method: "POST",
        details: { gateway: "coinbase" },
        blocked: true,
      });
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
    if (eventType === "charge:confirmed" || eventType === "charge:resolved") {
      const claimed = await prisma.transaction.updateMany({
        where: { txnId, status: "pending" },
        data: {
          status: "complete",
          gatewayTxn: String(eventData.code || eventData.id),
        },
      });

      if (claimed.count === 0) {
        return NextResponse.json({ received: true });
      }

      const transaction = await prisma.transaction.findUnique({
        where: { txnId },
      });
      if (!transaction) {
        return NextResponse.json({ received: true });
      }

      const user = await prisma.user.findUnique({
        where: { id: transaction.userId },
      });

      if (user) {
        await prisma.$transaction([
          prisma.user.update({
            where: { id: user.id },
            data: { funds: { increment: transaction.amount } },
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
      await prisma.transaction.updateMany({
        where: { txnId, status: "pending" },
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
