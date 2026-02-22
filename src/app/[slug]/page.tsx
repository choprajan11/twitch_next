import { notFound } from "next/navigation";
import { Button } from "@heroui/react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Type for the plans stored in JSON
type Plan = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  popular?: boolean;
};

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const service = await prisma.service.findUnique({
    where: { slug, status: true },
    include: { category: true }
  });

  if (!service || !service.plans) {
    notFound();
  }

  const plans = service.plans as Plan[];

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Background decorative elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#9146FF]/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none z-0" />

      <div className="w-full max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-12 text-center max-w-3xl mx-auto relative">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white dark:bg-[var(--card-bg)] shadow-xl shadow-[#9146FF]/10 border border-[rgba(145,70,255,0.1)] mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#9146FF]">
              <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
            </svg>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white mb-4">
            Buy <span className="gradient-text">{service.name}</span>
          </h1>
          <p className="text-lg text-zinc-500">
            {service.desc || `Get high-quality ${service.name.toLowerCase()} delivered instantly to your channel.`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Plans Selection */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bento-card-static relative overflow-hidden">
              <div className="p-6 border-b border-[rgba(145,70,255,0.08)] bg-zinc-50/50 dark:bg-zinc-900/20">
                <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-[#9146FF]/10 text-[#9146FF] flex items-center justify-center text-sm font-black">1</span>
                  Select a Package
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {plans.map((plan) => (
                    <div 
                      key={plan.id} 
                      className={`relative p-5 rounded-xl border-2 transition-all ${
                        plan.popular 
                          ? 'border-[#9146FF] bg-[#9146FF]/5' 
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 hover:border-[#9146FF]/50'
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#9146FF] to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          Most Popular
                        </div>
                      )}
                      
                      <div className="pt-2">
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">{plan.name}</h3>
                        <div className="flex items-baseline gap-1 mb-4">
                          <span className="text-2xl font-black text-[#9146FF]">${plan.price.toFixed(2)}</span>
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">one-time</span>
                        </div>
                      </div>

                      <Link href={`/checkout?service=${service.slug}&plan=${plan.id}`} className="w-full block">
                        <Button 
                          className={`w-full font-bold h-11 ${plan.popular ? 'shadow-lg shadow-[#9146FF]/30' : ''}`}
                          style={plan.popular ? { backgroundColor: '#9146FF', color: 'white' } : {}}
                          variant={plan.popular ? "solid" : "flat"}
                          color="secondary"
                        >
                          Buy Now
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Features */}
          <div className="lg:col-span-5">
            <div className="bento-card-static sticky top-8">
              <div className="p-6 border-b border-[rgba(145,70,255,0.08)] bg-zinc-50/50 dark:bg-zinc-900/20">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Why Choose Us?</h3>
              </div>
              
              <div className="p-6 space-y-5">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 text-green-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm mb-1">Instant Delivery</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Your order begins processing the moment payment is confirmed.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#9146FF]/10 flex items-center justify-center flex-shrink-0 text-[#9146FF]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm mb-1">100% Secure & Private</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">We never ask for your password. All payments are encrypted via Stripe.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0 text-cyan-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm mb-1">30-Day Refill Guarantee</h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">If any numbers drop within 30 days, we will automatically refill them.</p>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <span className="text-xs text-zinc-500 font-medium">Secured by</span>
                    <svg width="40" height="17" viewBox="0 0 60 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M60 12.8C60 8.5 57.9 5 53.8 5C49.7 5 47.2 8.5 47.2 12.8C47.2 17.9 50.3 20.5 54.6 20.5C56.7 20.5 58.3 20 59.5 19.3V15.9C58.3 16.5 56.9 16.9 55.2 16.9C53.5 16.9 52 16.3 51.8 14.3H59.9C59.9 14.1 60 13.2 60 12.8ZM51.7 11.2C51.7 9.3 52.8 8.4 54 8.4C55.1 8.4 56.2 9.3 56.2 11.2H51.7Z" fill="#6772E5"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M40.8 5C39 5 37.9 5.9 37.3 6.5L37.1 5.2H33.2V24.7L37.5 23.8V19.5C38.1 19.9 39 20.5 40.7 20.5C44.1 20.5 47.2 17.8 47.2 12.5C47.2 7.7 44 5 40.8 5ZM39.8 16.7C38.6 16.7 37.9 16.3 37.5 15.8V9.5C37.9 9 38.7 8.6 39.8 8.6C41.7 8.6 43 10.4 43 12.6C43 14.9 41.7 16.7 39.8 16.7Z" fill="#6772E5"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M28.2 4.1L32.5 3.2V0L28.2 0.9V4.1Z" fill="#6772E5"/>
                      <path d="M32.5 5.3H28.2V20.2H32.5V5.3Z" fill="#6772E5"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M23.7 6.6L23.4 5.3H19.6V20.2H23.9V10C24.8 8.8 26.4 9.1 26.9 9.3V5.3C26.4 5.1 24.5 4.7 23.7 6.6Z" fill="#6772E5"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M15.1 1.8L10.9 2.7L10.9 16C10.9 18.6 12.8 20.5 15.4 20.5C16.8 20.5 17.9 20.3 18.5 20V16.6C17.9 16.8 15.1 17.7 15.1 15V8.9H18.5V5.3H15.1V1.8Z" fill="#6772E5"/>
                      <path fillRule="evenodd" clipRule="evenodd" d="M4.3 9.5C4.3 8.8 4.9 8.5 5.8 8.5C7.1 8.5 8.7 8.9 10 9.6V5.6C8.6 5 7.2 4.7 5.8 4.7C2.3 4.7 0 6.5 0 9.7C0 14.7 6.9 13.9 6.9 16.1C6.9 16.9 6.2 17.2 5.2 17.2C3.8 17.2 2 16.6 0.6 15.8V19.9C2.2 20.6 3.8 20.9 5.2 20.9C8.8 20.9 11.3 19.2 11.3 15.9C11.3 10.5 4.3 11.4 4.3 9.5Z" fill="#6772E5"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}