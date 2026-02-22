import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const payload = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event: Stripe.Event;

  try {
    if (!sig) throw new Error('No signature provided');
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
  } catch (err: any) {
    return NextResponse.json({ error: \`Webhook Error: ${err.message}\` }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    // Fulfill the purchase...
    console.log('Payment successful for session:', session.id);
    
    // 1. Find order in DB by session.client_reference_id or metadata
    // 2. Update status to 'pending' (from 'payment')
    // 3. Trigger API fulfillment (connectApi)
  }

  return NextResponse.json({ received: true });
}
