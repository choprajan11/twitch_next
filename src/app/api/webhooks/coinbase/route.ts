import { NextResponse } from 'next/server';
import crypto from 'crypto';

const webhookSecret = process.env.COINBASE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const payload = await req.text();
  const signature = req.headers.get('x-cc-webhook-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  try {
    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(payload);
    const expectedSignature = hmac.digest('hex');

    if (signature !== expectedSignature) {
      throw new Error('Invalid signature');
    }
    
    const event = JSON.parse(payload);
    
    // Handle the charge:confirmed event
    if (event.event.type === 'charge:confirmed') {
      const charge = event.event.data;
      console.log('Coinbase payment confirmed:', charge.id);
      
      // 1. Find order in DB by charge.metadata.order_id
      // 2. Update status
      // 3. Trigger API fulfillment
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: \`Webhook Error: ${err.message}\` }, { status: 400 });
  }
}
