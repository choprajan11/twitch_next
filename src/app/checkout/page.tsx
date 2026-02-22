import { redirect } from "next/navigation";
import { Button } from "@heroui/react";
import { prisma } from "@/lib/prisma";

// Type for the plans stored in JSON
type Plan = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  popular?: boolean;
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; plan?: string }>;
}) {
  const { service: serviceSlug, plan: planId } = await searchParams;

  if (!serviceSlug || !planId) {
    redirect("/");
  }

  // Fetch the service from the database
  const service = await prisma.service.findUnique({
    where: { slug: serviceSlug, status: true },
  });

  if (!service || !service.plans) {
    redirect("/");
  }

  const plans = service.plans as Plan[];
  const selectedPlan = plans.find(p => p.id === planId);

  if (!selectedPlan) {
    redirect("/");
  }

  const securePrice = selectedPlan.price.toFixed(2);
  const serviceName = service.name;

  // Placeholder action for Stripe integration
  async function createCheckoutSession(formData: FormData) {
    "use server";
    const link = formData.get("link");
    const email = formData.get("email");
    const paymentMethod = formData.get("paymentMethod");
    
    // Re-fetch from DB in server action to guarantee security
    const svc = await prisma.service.findUnique({
      where: { slug: serviceSlug as string, status: true },
    });
    
    if (!svc || !svc.plans) {
      throw new Error("Service not found");
    }
    
    const plns = svc.plans as Plan[];
    const plan = plns.find(p => p.id === planId);
    
    if (!plan) {
      throw new Error("Plan not found");
    }
    
    const finalPrice = plan.price;
    
    console.log("Create checkout for:", { service: svc.name, plan: plan.name, price: finalPrice, link, email, paymentMethod });
    // redirect(session.url);
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Background decorative elements matching homepage */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#9146FF]/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none z-0" />

      <div className="max-w-4xl w-full mx-auto relative z-10">
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-[var(--card-bg)] shadow-xl shadow-[#9146FF]/10 border border-[rgba(145,70,255,0.1)] mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#9146FF]">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          </div>
          <h1 className="text-4xl font-black text-zinc-900 dark:text-white mb-3">Complete Your <span className="text-[#9146FF]">Order</span></h1>
          <p className="text-lg text-zinc-500">Secure, fast, and anonymous checkout.</p>
        </div>

        <form action={createCheckoutSession}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Left Column: Form */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Order Details Card */}
              <div className="bento-card-static relative overflow-hidden">
                <div className="p-6 border-b border-[rgba(145,70,255,0.08)] bg-zinc-50/50 dark:bg-zinc-900/20">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-[#9146FF]/10 text-[#9146FF] flex items-center justify-center text-sm font-black">1</span>
                    Order Details
                  </h2>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <label htmlFor="link" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                      Twitch Link (Target)
                    </label>
                    <input
                      type="url"
                      id="link"
                      name="link"
                      required
                      placeholder="https://twitch.tv/yourchannel"
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-[#9146FF] focus:border-transparent outline-none transition-all dark:text-white"
                    />
                    <p className="text-xs font-medium text-zinc-500 mt-2">Make sure the account is public.</p>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                      Email Address (For Receipt & Tracking)
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-[#9146FF] focus:border-transparent outline-none transition-all dark:text-white"
                    />
                    <p className="text-xs font-medium text-zinc-500 mt-2">We'll create a dashboard for you to track your order.</p>
                  </div>
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="bento-card-static relative overflow-hidden">
                <div className="p-6 border-b border-[rgba(145,70,255,0.08)] bg-zinc-50/50 dark:bg-zinc-900/20">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-[#9146FF]/10 text-[#9146FF] flex items-center justify-center text-sm font-black">2</span>
                    Payment Method
                  </h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 border-2 border-[#9146FF] bg-[#9146FF]/5 rounded-xl cursor-pointer transition-all">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="paymentMethod" value="stripe" defaultChecked className="w-4 h-4 text-[#9146FF] focus:ring-[#9146FF]" />
                        <span className="font-bold text-zinc-900 dark:text-white">Credit / Debit Card</span>
                      </div>
                      <div className="flex gap-1.5">
                        <div className="w-9 h-6 bg-[#1a1f36] rounded border border-zinc-700 text-[9px] text-white flex items-center justify-center font-bold">VISA</div>
                        <div className="w-9 h-6 bg-[#1a1f36] rounded border border-zinc-700 text-[9px] text-white flex items-center justify-center font-bold">MC</div>
                      </div>
                    </label>
                    
                    <label className="flex items-center justify-between p-4 border-2 border-transparent bg-zinc-50 dark:bg-zinc-900/50 rounded-xl cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="paymentMethod" value="crypto" className="w-4 h-4 text-[#9146FF] focus:ring-[#9146FF]" />
                        <span className="font-bold text-zinc-900 dark:text-white">Cryptocurrency</span>
                      </div>
                      <div className="flex gap-1.5">
                        <div className="w-9 h-6 bg-[#f7931a] rounded text-[9px] text-white flex items-center justify-center font-bold">BTC</div>
                        <div className="w-9 h-6 bg-[#627eea] rounded text-[9px] text-white flex items-center justify-center font-bold">ETH</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5">
              <div className="bento-card-static sticky top-8">
                <div className="p-6 border-b border-[rgba(145,70,255,0.08)] bg-zinc-50/50 dark:bg-zinc-900/20">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Summary</h2>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500 font-medium">Service</span>
                    <span className="font-bold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg">{serviceName}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500 font-medium">Package</span>
                    <span className="font-bold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg">{selectedPlan.name}</span>
                  </div>
                  
                  <div className="border-t border-[rgba(145,70,255,0.08)] pt-6 mt-6">
                    <div className="flex justify-between items-end mb-6">
                      <span className="font-bold text-zinc-900 dark:text-white text-lg">Total</span>
                      <span className="text-4xl font-black text-[#9146FF]">${securePrice}</span>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-14 bg-[#9146FF] hover:bg-[#7b35de] text-white font-bold text-lg shadow-lg shadow-[#9146FF]/30 transition-transform active:scale-95 glow-animation rounded-xl"
                    >
                      Pay Securely
                    </Button>
                    <p className="text-center text-xs font-medium text-zinc-500 mt-4 flex items-center justify-center gap-1.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      256-bit SSL Encrypted Checkout
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
}