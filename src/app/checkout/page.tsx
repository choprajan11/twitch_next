import { redirect } from "next/navigation";
import { Button, Card, Input } from "@heroui/react";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; plan?: string }>;
}) {
  const { service, plan } = await searchParams;

  if (!service || !plan) {
    redirect("/");
  }

  // Placeholder action for Stripe integration
  async function createCheckoutSession(formData: FormData) {
    "use server";
    const link = formData.get("link");
    const paymentMethod = formData.get("paymentMethod");
    
    // In a real app, you would:
    // 1. Verify user session
    // 2. Validate the link/channel
    // 3. Create Stripe/Coinbase Checkout session
    // 4. Redirect to the payment gateway
    
    console.log("Create checkout for:", { service, plan, link, paymentMethod });
    // redirect(session.url);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Complete Your Order</h1>

      <form action={createCheckoutSession} className="space-y-8">
        <Card>
          <Card.Header>
            <Card.Title>Order Details</Card.Title>
            <Card.Description>Review your selected service</Card.Description>
          </Card.Header>
          <Card.Content className="space-y-4">
            <div className="flex justify-between border-b pb-4">
              <span className="font-semibold">Service</span>
              <span>{service}</span>
            </div>
            <div className="flex justify-between border-b pb-4">
              <span className="font-semibold">Plan</span>
              <span>{plan}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>Total</span>
              <span>$0.00</span> {/* Calculate based on plan */}
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Target</Card.Title>
            <Card.Description>Provide your Twitch channel or clip link</Card.Description>
          </Card.Header>
          <Card.Content>
            <div className="space-y-2">
              <label htmlFor="link" className="text-sm font-medium">Twitch Link</label>
              <Input 
                id="link" 
                name="link" 
                required 
                placeholder="https://twitch.tv/yourchannel" 
              />
            </div>
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Payment Method</Card.Title>
          </Card.Header>
          <Card.Content>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800">
                <input type="radio" name="paymentMethod" value="stripe" defaultChecked className="w-4 h-4" />
                <span className="font-medium">Credit Card (Stripe)</span>
              </label>
              <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800">
                <input type="radio" name="paymentMethod" value="coinbase" className="w-4 h-4" />
                <span className="font-medium">Cryptocurrency (Coinbase)</span>
              </label>
              <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800">
                <input type="radio" name="paymentMethod" value="wallet" className="w-4 h-4" />
                <span className="font-medium">Wallet Balance ($0.00)</span>
              </label>
            </div>
          </Card.Content>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="w-full sm:w-auto">
            Proceed to Payment
          </Button>
        </div>
      </form>
    </div>
  );
}
