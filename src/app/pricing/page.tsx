import Link from "next/link";
import { Button } from "@heroui/react";
import { prisma } from "@/lib/prisma";

type Plan = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  popular?: boolean;
};

export const metadata = {
  title: "Pricing - GrowTwitch",
  description: "Affordable pricing for Twitch growth services. Get followers, viewers, and chat engagement at competitive rates.",
};

export default async function PricingPage() {
  const services = await prisma.service.findMany({
    where: { status: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-12 pb-24">
      {/* Header */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <span className="inline-block px-4 py-2 rounded-full bg-[#9146FF]/10 text-[#9146FF] text-sm font-bold mb-4">
          Pricing
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-zinc-900 dark:text-white">
          Simple, <span className="gradient-text">Transparent</span> Pricing
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          No hidden fees. No subscriptions. Pay once and watch your channel grow.
        </p>
      </div>

      {/* Services Grid */}
      <div className="space-y-16">
        {services.map((service) => {
          const plans = (service.plans as Plan[]) || [];
          if (plans.length === 0) return null;

          return (
            <div key={service.id} className="bento-card p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-200 dark:border-zinc-800">
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
                    {service.name}
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                    {service.desc || `Premium ${service.name.toLowerCase()} for your Twitch channel`}
                  </p>
                </div>
                <Link href={`/${service.slug}`}>
                  <Button
                    variant="flat"
                    className="font-semibold"
                  >
                    View Details
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`relative p-6 rounded-2xl border-2 transition-all hover:border-[#9146FF] ${
                      plan.popular
                        ? "border-[#9146FF] bg-[#9146FF]/5"
                        : "border-zinc-200 dark:border-zinc-800"
                    }`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#9146FF] text-white text-xs font-bold px-3 py-1 rounded-full">
                        Popular
                      </div>
                    )}
                    <div className="text-center">
                      <h3 className="font-bold text-zinc-900 dark:text-white mb-2">
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline justify-center gap-1 mb-4">
                        <span className="text-3xl font-extrabold text-[#9146FF]">
                          ${plan.price.toFixed(2)}
                        </span>
                      </div>
                      <Link href={`/checkout?service=${service.slug}&plan=${plan.id}`}>
                        <Button
                          size="sm"
                          className="w-full font-semibold"
                          style={plan.popular ? { backgroundColor: "#9146FF", color: "white" } : {}}
                          variant={plan.popular ? "solid" : "bordered"}
                        >
                          Buy Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Features */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bento-card p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h3 className="font-bold text-zinc-900 dark:text-white mb-2">No Subscriptions</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Pay once for what you need. No recurring charges.
          </p>
        </div>
        <div className="bento-card p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#9146FF]/10 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#9146FF]">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h3 className="font-bold text-zinc-900 dark:text-white mb-2">Secure Payments</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            All transactions are encrypted via Stripe.
          </p>
        </div>
        <div className="bento-card p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-500">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h3 className="font-bold text-zinc-900 dark:text-white mb-2">30-Day Guarantee</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Free refills if anything drops within 30 days.
          </p>
        </div>
      </div>
    </div>
  );
}
