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

function getServiceTheme(slug: string) {
  const lower = slug.toLowerCase();
  if (lower.includes("follower"))
    return {
      color: "#9146FF",
      bg: "from-[#9146FF] to-purple-600",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
        </svg>
      ),
    };
  if (lower.includes("viewer") && !lower.includes("clip"))
    return {
      color: "#06b6d4",
      bg: "from-cyan-500 to-blue-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
        </svg>
      ),
    };
  if (lower.includes("chat") || lower.includes("bot"))
    return {
      color: "#22c55e",
      bg: "from-green-500 to-emerald-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
    };
  if (lower.includes("clip"))
    return {
      color: "#ec4899",
      bg: "from-pink-500 to-rose-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      ),
    };
  return {
    color: "#9146FF",
    bg: "from-[#9146FF] to-indigo-500",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
      </svg>
    ),
  };
}

export default async function PricingPage() {
  const services = await prisma.service.findMany({
    where: { status: true },
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="flex flex-col items-center">
      {/* Hero Header */}
      <section className="w-full max-w-7xl mx-auto px-4 pt-12 pb-16 lg:pt-24 lg:pb-20 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#9146FF]/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#9146FF]/10 border border-[#9146FF]/20 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-semibold text-[#9146FF]">Simple & Transparent</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-zinc-900 dark:text-white leading-[1.1]">
            Pay Once, <span className="gradient-text">Grow Forever</span>
          </h1>
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            No hidden fees. No subscriptions. Choose a plan and watch your Twitch channel take off.
          </p>
        </div>
      </section>

      {/* Services + Plans — Two-Column Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {services.map((service) => {
            const plans = (service.plans as unknown as Plan[]) || [];
            if (plans.length === 0) return null;
            const theme = getServiceTheme(service.slug);

            return (
              <div key={service.id} className="bento-card flex flex-col overflow-hidden">
                {/* Service Header with gradient accent */}
                <div className="relative px-6 pt-5 pb-5">
                  <div
                    className="absolute inset-0 opacity-[0.06]"
                    style={{ background: `linear-gradient(135deg, ${theme.color} 0%, transparent 70%)` }}
                  />
                  <div className="relative flex items-center gap-4">
                    <div
                      className={`w-11 h-11 rounded-xl bg-gradient-to-br ${theme.bg} flex items-center justify-center text-white shrink-0 shadow-lg`}
                      style={{ boxShadow: `0 4px 14px -3px ${theme.color}40` }}
                    >
                      {theme.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-bold truncate" style={{ color: theme.color }}>
                        {service.name}
                      </h2>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-1">
                        {service.desc || `Premium ${service.name.toLowerCase()} for your Twitch channel`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Plans */}
                <div className="grid grid-cols-2 gap-3 flex-1 px-6">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative rounded-xl p-4 transition-all duration-300 group ${
                        plan.popular
                          ? "bg-gradient-to-b from-[#9146FF]/10 to-[#9146FF]/5 border-2 border-[#9146FF]/40 shadow-md shadow-[#9146FF]/10"
                          : "bg-zinc-50/50 dark:bg-zinc-800/30 border border-zinc-200/60 dark:border-zinc-700/40 hover:border-[#9146FF]/40 hover:shadow-md hover:shadow-[#9146FF]/5"
                      }`}
                    >
                      {plan.popular && (
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#9146FF] text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md shadow-[#9146FF]/30">
                          Popular
                        </div>
                      )}
                      <div className="text-center">
                        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
                          {plan.name}
                        </p>
                        <div className="flex items-baseline justify-center gap-0.5 mb-1">
                          <span className="text-2xl font-extrabold text-zinc-900 dark:text-white">
                            ${plan.price.toFixed(0)}
                          </span>
                          {plan.price % 1 !== 0 && (
                            <span className="text-sm font-bold text-zinc-400">
                              .{(plan.price % 1).toFixed(2).split('.')[1]}
                            </span>
                          )}
                        </div>
                        {plan.quantity != null && (
                          <p className="text-[11px] text-zinc-400 mb-3">
                            {plan.quantity.toLocaleString()} units
                          </p>
                        )}
                        {plan.quantity == null && <div className="mb-3" />}
                        <Link href={`/checkout?service=${service.slug}&plan=${plan.id}`} className="block">
                          <Button
                            size="sm"
                            className={`w-full font-bold text-xs transition-all ${
                              plan.popular
                                ? "shadow-sm shadow-[#9146FF]/20 hover:shadow-md hover:shadow-[#9146FF]/30"
                                : "group-hover:border-[#9146FF] group-hover:text-[#9146FF]"
                            }`}
                            style={plan.popular ? { backgroundColor: "#9146FF", color: "white" } : {}}
                            variant={plan.popular ? "primary" : "outline"}
                          >
                            Get Started
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Link */}
                <div className="mx-6 mt-5 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 pb-6">
                  <Link
                    href={`/${service.slug}`}
                    className="text-sm font-semibold text-[#9146FF] hover:text-[#7b35de] transition-colors inline-flex items-center gap-1.5"
                  >
                    View details
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Guarantees */}
      <section className="w-full max-w-7xl mx-auto px-4 pb-16 lg:pb-24">
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-sm font-bold mb-4">
            Our Guarantees
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white">
            Every Plan <span className="gradient-text">Includes</span>
          </h2>
        </div>

        <div className="bento-grid grid-cols-1 md:grid-cols-3">
          <div className="bento-card p-6 lg:p-8 text-center group">
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-green-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 group-hover:text-white transition-colors">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">No Subscriptions</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              One-time payment. No recurring charges, ever. What you see is what you pay.
            </p>
          </div>
          <div className="bento-card p-6 lg:p-8 text-center group">
            <div className="w-14 h-14 rounded-2xl bg-[#9146FF]/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-[#9146FF] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#9146FF] group-hover:text-white transition-colors">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">Secure Payments</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              All transactions are encrypted and processed securely via Stripe.
            </p>
          </div>
          <div className="bento-card p-6 lg:p-8 text-center group">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mx-auto mb-5 group-hover:bg-cyan-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-500 group-hover:text-white transition-colors">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">30-Day Guarantee</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Free refills if anything drops within 30 days of purchase. No questions asked.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full max-w-7xl mx-auto px-4 pb-16 lg:pb-24">
        <div className="bento-card p-8 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#9146FF]/10 via-transparent to-cyan-500/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#9146FF]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-zinc-900 dark:text-white">
              Need a <span className="gradient-text">Custom Plan?</span>
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
              Looking for something bigger or a custom package? We offer tailored solutions for larger streamers and agencies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#services">
                <Button
                  size="lg"
                  style={{ backgroundColor: '#9146FF', color: 'white' }}
                  variant="primary"
                  className="font-bold px-10 h-14 text-lg shadow-[#9146FF]/30"
                >
                  Browse Services
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="font-bold px-10 h-14 text-lg border-2 border-zinc-200 dark:border-zinc-700"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
