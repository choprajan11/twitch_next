import crypto from "crypto";

const OXAPAY_MERCHANT_API_KEY = process.env.OXAPAY_API_KEY!;
const OXAPAY_API_URL = "https://api.oxapay.com/v1";

export interface OxaPayInvoiceResponse {
  data: {
    track_id: string;
    payment_url: string;
    expired_at: number;
    date: number;
  };
  message: string;
  status: number;
  version?: string;
  error: { type: string; key: string; message: string } | null;
}

export interface OxaPayWebhookPayload {
  track_id: string;
  status: "Paying" | "Paid" | "Expired" | "Failed";
  type: string;
  amount: number;
  value: number;
  currency: string;
  order_id: string;
  email: string;
  description: string;
  date: number;
  txs: Array<{
    status: string;
    tx_hash: string;
    sent_amount: number;
    received_amount: number;
    currency: string;
    network: string;
    address: string;
    confirmations: number;
    date: number;
  }>;
}

export async function createOxaPayInvoice(params: {
  amount: number;
  orderId: string;
  email: string;
  description: string;
  returnUrl: string;
  callbackUrl: string;
}): Promise<OxaPayInvoiceResponse> {
  const response = await fetch(`${OXAPAY_API_URL}/payment/invoice`, {
    method: "POST",
    headers: {
      merchant_api_key: OXAPAY_MERCHANT_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: params.amount,
      lifetime: 60,
      fee_paid_by_payer: 1,
      callback_url: params.callbackUrl,
      return_url: params.returnUrl,
      order_id: params.orderId,
      email: params.email,
      description: params.description,
    }),
  });

  const data = await response.json() as OxaPayInvoiceResponse;

  const hasError = data.error && typeof data.error === "object" && data.error.message;
  if (hasError) {
    throw new Error(`OxaPay API error: ${data.error!.message}`);
  }

  if (!data.data?.payment_url) {
    throw new Error(
      `OxaPay API error: No payment URL in response — ${JSON.stringify({ status: data.status, message: data.message, error: data.error })}`
    );
  }

  return data;
}

export function verifyOxaPayHmac(
  rawBody: string,
  hmacHeader: string
): boolean {
  const calculated = crypto
    .createHmac("sha512", OXAPAY_MERCHANT_API_KEY)
    .update(rawBody)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(calculated, "hex"),
    Buffer.from(hmacHeader, "hex")
  );
}
