import { NextResponse } from "next/server";
import {
  sendPendingOrders,
  updateProcessingOrders,
  cleanupStalePaymentOrders,
  cancelStalePendingOrders,
} from "@/lib/orderProcessor";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [updated, cleaned, retried, cancelledPending] = await Promise.all([
      updateProcessingOrders(),
      cleanupStalePaymentOrders(),
      sendPendingOrders(),
      cancelStalePendingOrders(),
    ]);

    return NextResponse.json({
      success: true,
      updated,
      cleaned,
      retried,
      cancelledPending,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron processing error:", error);
    return NextResponse.json(
      { error: "Processing failed" },
      { status: 500 }
    );
  }
}
