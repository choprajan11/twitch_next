"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@heroui/react";
import { Suspense } from "react";
import TwitchUsernameInput from "@/components/TwitchUsernameInput";
import { getSessionEmail } from "@/lib/sessionClient";

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceSlug = searchParams.get("service");
  const planId = searchParams.get("plan");
  const [resolvedServiceName, setResolvedServiceName] = useState(searchParams.get("serviceName") || "");
  const [resolvedPlanName, setResolvedPlanName] = useState(searchParams.get("planName") || "");
  const [resolvedPrice, setResolvedPrice] = useState(searchParams.get("price") || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!searchParams.get("price"));

  useEffect(() => {
    setSessionEmail(getSessionEmail());
  }, []);

  // Fetch service details if query params are missing
  useEffect(() => {
    if (resolvedPrice && resolvedServiceName && resolvedPlanName) {
      setIsLoading(false);
      return;
    }
    if (!serviceSlug || !planId) return;

    fetch(`/api/services/${serviceSlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.name) setResolvedServiceName(data.name);
        if (data.plans) {
          const plans = typeof data.plans === "string" ? JSON.parse(data.plans) : data.plans;
          const plan = plans.find((p: { id: string }) => p.id === planId);
          if (plan) {
            setResolvedPlanName(plan.name);
            setResolvedPrice(String(plan.price));
          }
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [serviceSlug, planId, resolvedPrice, resolvedServiceName, resolvedPlanName]);

  const isLinkService = serviceSlug?.includes("clip") || serviceSlug?.includes("video");
  const isChatbotService = serviceSlug?.includes("chat") || serviceSlug?.includes("bot");

  if (!serviceSlug || !planId) {
    router.push("/");
    return null;
  }

  const serviceName = resolvedServiceName || "Service";
  const planName = resolvedPlanName || "Selected Plan";
  const securePrice = Number(resolvedPrice || "0").toFixed(2);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const link = formData.get("link") as string;
    const email = formData.get("email") as string;
    const paymentMethod = formData.get("paymentMethod") as string;
    const comments = formData.get("comments") as string;

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceSlug,
          planId,
          link,
          email,
          comments: comments || undefined,
          paymentMethod: paymentMethod || "stripe",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setIsSubmitting(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Network error. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
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

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-7 space-y-6">
              <div className="bento-card-static relative overflow-hidden">
                <div className="p-6 border-b border-[rgba(145,70,255,0.08)] bg-zinc-50/50 dark:bg-zinc-900/20">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-[#9146FF]/10 text-[#9146FF] flex items-center justify-center text-sm font-black">1</span>
                    Order Details
                  </h2>
                </div>
                <div className="p-6 space-y-5">
                  {isLinkService ? (
                    <div>
                      <label htmlFor="link" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                        {serviceSlug?.includes("clip") ? "Twitch Clip Link" : "Twitch Video Link"}
                      </label>
                      <input
                        type="text"
                        id="link"
                        name="link"
                        required
                        placeholder={serviceSlug?.includes("clip") ? "https://clips.twitch.tv/YourClipHere" : "https://twitch.tv/videos/123456789"}
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-[#9146FF] focus:border-transparent outline-none transition-all dark:text-white"
                      />
                      <p className="text-xs font-medium text-zinc-500 mt-2">Paste the full link to your {serviceSlug?.includes("clip") ? "clip" : "video"}.</p>
                    </div>
                  ) : (
                    <TwitchUsernameInput />
                  )}

                  {isChatbotService && (
                    <div>
                      <label htmlFor="comments" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                        Chat Messages <span className="text-zinc-400 font-normal">(optional)</span>
                      </label>
                      <textarea
                        id="comments"
                        name="comments"
                        rows={4}
                        placeholder={"Enter custom chat messages, one per line.\nLeave empty for default random messages."}
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-[#9146FF] focus:border-transparent outline-none transition-all dark:text-white resize-none"
                      />
                      <p className="text-xs font-medium text-zinc-500 mt-2">One message per line. Bots will rotate through these messages randomly.</p>
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                      Email Address (For Receipt &amp; Tracking)
                    </label>
                    {sessionEmail && (
                      <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-2 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        Logged in as {sessionEmail}
                      </p>
                    )}
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      defaultValue={sessionEmail || ""}
                      readOnly={!!sessionEmail}
                      placeholder="you@example.com"
                      className={`w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-[#9146FF] focus:border-transparent outline-none transition-all dark:text-white ${sessionEmail ? "opacity-70 cursor-not-allowed" : ""}`}
                    />
                    <p className="text-xs font-medium text-zinc-500 mt-2">We&apos;ll create a dashboard for you to track your order.</p>
                  </div>
                </div>
              </div>

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
                    <label className="flex items-center justify-between p-4 border-2 border-transparent bg-zinc-50 dark:bg-zinc-900/50 rounded-xl cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all">
                      <div className="flex items-center gap-3">
                        <input type="radio" name="paymentMethod" value="wallet" className="w-4 h-4 text-[#9146FF] focus:ring-[#9146FF]" />
                        <span className="font-bold text-zinc-900 dark:text-white">Wallet Balance</span>
                      </div>
                      <div className="text-xs font-bold text-green-500">Pay with funds</div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="bento-card-static sticky top-8">
                <div className="p-6 border-b border-[rgba(145,70,255,0.08)] bg-zinc-50/50 dark:bg-zinc-900/20">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Summary</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500 font-medium">Service</span>
                    {isLoading ? (
                      <span className="w-24 h-7 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
                    ) : (
                      <span className="font-bold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg">{serviceName}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-500 font-medium">Package</span>
                    {isLoading ? (
                      <span className="w-20 h-7 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
                    ) : (
                      <span className="font-bold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-lg">{planName}</span>
                    )}
                  </div>
                  <div className="border-t border-[rgba(145,70,255,0.08)] pt-6 mt-6">
                    <div className="flex justify-between items-end mb-6">
                      <span className="font-bold text-zinc-900 dark:text-white text-lg">Total</span>
                      {isLoading ? (
                        <span className="w-28 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
                      ) : (
                        <span className="text-4xl font-black text-[#9146FF]">${securePrice}</span>
                      )}
                    </div>
                    <Button
                      type="submit"
                      isDisabled={isSubmitting}
                      className="w-full h-14 bg-[#9146FF] hover:bg-[#7b35de] text-white font-bold text-lg shadow-lg shadow-[#9146FF]/30 transition-transform active:scale-95 glow-animation rounded-xl"
                    >
                      {isSubmitting ? "Processing..." : "Pay Securely"}
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

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-zinc-500">Loading checkout...</div>
      </div>
    }>
      <CheckoutForm />
    </Suspense>
  );
}
