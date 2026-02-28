import { NextResponse } from "next/server";
import {
  sendPendingOrders,
  updateProcessingOrders,
  cleanupStalePaymentOrders,
} from "@/lib/orderProcessor";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [sent, updated, cleaned] = await Promise.all([
      sendPendingOrders(),
      updateProcessingOrders(),
      cleanupStalePaymentOrders(),
    ]);

    return NextResponse.json({
      success: true,
      sent,
      updated,
      cleaned,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Cron processing error:", error);
    return NextResponse.json(
      { error: error.message || "Processing failed" },
      { status: 500 }
    );
  }
}
