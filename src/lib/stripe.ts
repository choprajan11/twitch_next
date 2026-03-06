import Stripe from "stripe";

const SERVICE_CODES: Record<string, string> = {
  "buy-followers": "TW-FLW",
  "buy-viewers": "TW-LIV",
  "buy-chatbot": "TW-BOT",
  "buy-clip-views": "TW-CLV",
  "buy-video-views": "TW-VID",
};

export function getServiceCode(slug: string, quantity: number): string {
  const code = SERVICE_CODES[slug] || "TW-SVC";
  return `${quantity}-${code}`;
}

export const stripeConfig = {
  secretKey: process.env.STRIPE_SECRET_KEY!,
  publishKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
  contentcageRoute: "https://contentcage.com/pay/stripe.php",
};

export const stripe = new Stripe(stripeConfig.secretKey, {
  apiVersion: "2026-01-28.clover",
});

interface ProcessRequestData {
  orderId: string;
  oid: string;
  email: string;
  amount: number;
  serviceSlug: string;
  quantity: number;
}

interface VerifyResponse {
  status: boolean;
  orderId?: string;
  oid?: string;
  txnId?: string;
  amount?: number;
  errorMessage?: string;
}

export async function processStripeRequest(data: ProcessRequestData): Promise<{
  sessionId: string;
  redirectUrl: string;
} | null> {
  try {
    const productCode = getServiceCode(data.serviceSlug, data.quantity);
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: data.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(data.amount * 100),
            product_data: {
              name: productCode,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      allow_promotion_codes: true,
      metadata: {
        orderId: data.orderId,
        oid: data.oid,
      },
      success_url: `${stripeConfig.contentcageRoute}?session={CHECKOUT_SESSION_ID}&method=verify&order=${data.oid}`,
      cancel_url: `${stripeConfig.contentcageRoute}?session={CHECKOUT_SESSION_ID}&method=verify&order=${data.oid}`,
    });

    if (!session.id) {
      return null;
    }

    const hash = Buffer.from(`${session.id}||${stripeConfig.publishKey}`).toString("base64");
    const redirectUrl = `${stripeConfig.contentcageRoute}?hash=${hash}`;

    return {
      sessionId: session.id,
      redirectUrl,
    };
  } catch (error) {
    console.error("Stripe processRequest error:", error);
    return null;
  }
}

export async function verifyStripeSession(sessionId: string): Promise<VerifyResponse> {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return { status: false, errorMessage: "Session not found" };
    }

    const orderId = session.metadata?.orderId;
    const oid = session.metadata?.oid || session.client_reference_id;
    let txnId = session.payment_intent as string | null;
    let status = false;
    let amount = 0;

    if (session.payment_intent) {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        session.payment_intent as string
      );
      status = paymentIntent.status === "succeeded";
      amount = paymentIntent.amount / 100;
      txnId = paymentIntent.id;
    } else {
      status = session.payment_status === "paid";
      amount = (session.amount_total || 0) / 100;
      txnId = session.id;
    }

    return {
      status,
      orderId,
      oid: oid ?? undefined,
      txnId: txnId ?? undefined,
      amount,
    };
  } catch (error: any) {
    console.error("Stripe verifyData error:", error);
    return { status: false, errorMessage: error.message };
  }
}
