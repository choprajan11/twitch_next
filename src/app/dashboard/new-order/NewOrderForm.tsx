"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import TwitchUsernameInput from "@/components/TwitchUsernameInput";
import Link from "next/link";

type Plan = {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  duration?: number;
  popular?: boolean;
};

type Service = {
  id: string;
  name: string;
  slug: string;
  type: string | null;
  plans: Plan[];
  category: { name: string };
};

interface Props {
  services: Service[];
  userEmail: string;
  walletBalance: number;
}

function getIcon(slug: string, size = 24) {
  if (slug.includes("follower"))
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    );
  if (slug.includes("viewer") || slug.includes("view"))
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
    );
  if (slug.includes("clip") || slug.includes("video"))
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/></svg>
    );
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
  );
}

export default function NewOrderForm({ services, userEmail, walletBalance }: Props) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [gateway, setGateway] = useState<"stripe" | "wallet">("stripe");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<{ oid: string } | null>(null);

  const isLinkService =
    selectedService?.slug?.includes("clip") ||
    selectedService?.slug?.includes("video");
  const isChatbotService =
    selectedService?.slug?.includes("chat") ||
    selectedService?.slug?.includes("bot");

  function getPlanValue(plan: Plan): number {
    return plan.quantity ?? plan.duration ?? 0;
  }

  function getPlanUnitLabel(plan: Plan): string {
    if (plan.duration) {
      return `${plan.duration} hr${plan.duration === 1 ? "" : "s"}`;
    }
    return `${getPlanValue(plan).toLocaleString()} units`;
  }

  function handleSelectService(svc: Service) {
    setSelectedService(svc);
    setSelectedPlan(null);
  }

  function resetForm() {
    setSelectedService(null);
    setSelectedPlan(null);
    setGateway("stripe");
    setError(null);
    setOrderSuccess(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedService || !selectedPlan) return;
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const link = formData.get("link") as string;
    const comments = formData.get("comments") as string;

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceSlug: selectedService.slug,
          planId: selectedPlan.id,
          link,
          email: userEmail,
          comments: comments || undefined,
          paymentMethod: gateway,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setIsSubmitting(false);
        return;
      }

      if (gateway === "wallet" && data.oid) {
        setOrderSuccess({ oid: data.oid });
        setIsSubmitting(false);
      } else if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Network error. Please try again.");
      setIsSubmitting(false);
    }
  }

  const grouped = services.reduce<Record<string, Service[]>>((acc, svc) => {
    const cat = svc.category.name;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(svc);
    return acc;
  }, {});

  if (orderSuccess) {
    return (
      <div className="max-w-xl">
        <div className="bento-card-static text-center py-10 px-6">
          <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h2 className="text-lg font-black text-zinc-900 dark:text-white mb-1">Order Placed</h2>
          <p className="text-sm font-mono font-bold text-[#9146FF] mb-5">{orderSuccess.oid}</p>
          <div className="text-left space-y-2 text-sm border-t border-[rgba(145,70,255,0.08)] pt-4 mb-6">
            <div className="flex justify-between">
              <span className="text-zinc-500">Service</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Plan</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{selectedPlan?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Paid</span>
              <span className="font-semibold text-green-600 dark:text-green-400">${selectedPlan?.price.toFixed(2)} via Wallet</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Status</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-yellow-600 dark:text-yellow-400">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                Processing
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onPress={resetForm} style={{ backgroundColor: "#9146FF", color: "white" }} className="flex-1 h-10 font-bold rounded-xl shadow-sm shadow-[#9146FF]/20">
              New Order
            </Button>
            <Link href="/dashboard/orders" className="flex-1">
              <Button variant="outline" className="w-full h-10 font-semibold rounded-xl border-[rgba(145,70,255,0.15)] hover:border-[#9146FF]/30">
                My Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-semibold">
          {error}
        </div>
      )}

      {/* 1. Service Selection */}
      <div>
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Select Service</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {services.map((svc) => {
            const active = selectedService?.id === svc.id;
            return (
              <button
                key={svc.id}
                type="button"
                onClick={() => handleSelectService(svc)}
                className={`bento-card p-5 flex flex-col justify-between h-28 relative overflow-hidden text-left ${
                  active ? "!border-[#9146FF] !shadow-xl !shadow-[#9146FF]/20 ring-2 ring-[#9146FF]" : ""
                }`}
              >
                {active && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#9146FF]/10 to-[#9146FF]/5 pointer-events-none" />
                )}
                <div className="flex items-center gap-2 relative">
                  <span className="text-[#9146FF]">{getIcon(svc.slug, 18)}</span>
                  <span className="text-[11px] font-bold text-[#9146FF] uppercase tracking-wider">{svc.category.name}</span>
                </div>
                <h3 className="text-sm font-black text-zinc-900 dark:text-white relative">{svc.name}</h3>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Plan Selection */}
      {selectedService && (
        <div>
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Select Plan</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {(selectedService.plans as unknown as Plan[])?.filter((p) => p && (p.quantity || p.duration) && p.price != null).map((plan) => {
              const active = selectedPlan?.id === plan.id;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan)}
                  className={`bento-card p-5 flex flex-col justify-between h-28 relative overflow-hidden text-left ${
                    active ? "!border-[#9146FF] !shadow-xl !shadow-[#9146FF]/20 ring-2 ring-[#9146FF]" : ""
                  }`}
                >
                  {active && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#9146FF]/10 to-[#9146FF]/5 pointer-events-none" />
                  )}
                  {plan.popular && (
                    <span className="absolute top-2.5 right-2.5 px-1.5 py-0.5 bg-[#9146FF] text-white text-[9px] font-bold rounded-full z-10">
                      HOT
                    </span>
                  )}
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider relative">
                    {plan.name || "Plan"}
                  </p>
                  <div className="relative">
                    <span className="text-2xl font-black text-[#9146FF] tabular-nums">
                      ${(plan.price ?? 0).toFixed(2)}
                    </span>
                    <span className="text-xs text-zinc-400 ml-1.5">
                      {getPlanUnitLabel(plan)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Details & Payment */}
      {selectedPlan && (
        <div>
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Order Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Target */}
            <div className="bento-card-static p-5">
              {isLinkService ? (
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                    {selectedService?.slug?.includes("clip") ? "Clip Link" : "Video Link"}
                  </label>
                  <input
                    type="text"
                    name="link"
                    required
                    placeholder={selectedService?.slug?.includes("clip") ? "https://clips.twitch.tv/..." : "https://twitch.tv/videos/..."}
                    className="w-full px-4 py-3 border border-[rgba(145,70,255,0.1)] rounded-xl bg-[var(--card-bg)] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9146FF]/30 focus:border-[#9146FF]/30 transition-all text-sm"
                  />
                </div>
              ) : (
                <TwitchUsernameInput />
              )}

              {isChatbotService && (
                <div className="mt-5">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                    Chat Messages <span className="normal-case text-zinc-400 font-medium">(optional)</span>
                  </label>
                  <textarea
                    name="comments"
                    rows={4}
                    placeholder={"Enter custom chat messages, one per line.\nLeave empty for default random messages."}
                    className="w-full px-4 py-3 border border-[rgba(145,70,255,0.1)] rounded-xl bg-[var(--card-bg)] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9146FF]/30 focus:border-[#9146FF]/30 transition-all text-sm resize-none"
                  />
                  <p className="text-xs font-medium text-zinc-500 mt-2">
                    One message per line. Bots will rotate through these messages randomly.
                  </p>
                </div>
              )}
            </div>

            {/* Payment */}
            <div className="bento-card-static p-5">
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGateway("stripe")}
                  className={`p-3 rounded-xl text-center transition-all duration-200 ${
                    gateway === "stripe"
                      ? "bg-[#9146FF] text-white shadow-lg shadow-[#9146FF]/25"
                      : "bg-[var(--bento-bg)] border border-[rgba(145,70,255,0.08)] text-zinc-700 dark:text-zinc-300 hover:border-[#9146FF]/30"
                  }`}
                >
                  <div className="flex justify-center gap-1 mb-1.5">
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${gateway === "stripe" ? "bg-white/20 text-white" : "bg-[#1a1f36] text-white"}`}>VISA</span>
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${gateway === "stripe" ? "bg-white/20 text-white" : "bg-[#1a1f36] text-white"}`}>MC</span>
                  </div>
                  <p className="text-xs font-bold">Card</p>
                </button>
                <button
                  type="button"
                  onClick={() => setGateway("wallet")}
                  className={`p-3 rounded-xl text-center transition-all duration-200 ${
                    gateway === "wallet"
                      ? "bg-[#9146FF] text-white shadow-lg shadow-[#9146FF]/25"
                      : "bg-[var(--bento-bg)] border border-[rgba(145,70,255,0.08)] text-zinc-700 dark:text-zinc-300 hover:border-[#9146FF]/30"
                  }`}
                >
                  <p className={`text-sm font-black tabular-nums mb-0.5 ${
                    gateway === "wallet" ? "text-white" : walletBalance >= selectedPlan.price ? "text-green-500" : "text-red-500"
                  }`}>
                    ${walletBalance.toFixed(2)}
                  </p>
                  <p className="text-xs font-bold">Wallet</p>
                </button>
              </div>
              {gateway === "wallet" && walletBalance < selectedPlan.price && (
                <p className="text-xs text-red-500 font-medium mt-2">
                  Need ${(selectedPlan.price - walletBalance).toFixed(2)} more.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Submit */}
      {selectedPlan && (
        <div className="flex items-center gap-4">
          <Button
            type="submit"
            isDisabled={isSubmitting || (gateway === "wallet" && walletBalance < selectedPlan.price)}
            style={{ backgroundColor: "#9146FF", color: "white" }}
            className="h-12 px-10 font-bold rounded-2xl shadow-lg shadow-[#9146FF]/20 text-base"
          >
            {isSubmitting ? "Processing..." : `Pay $${selectedPlan.price.toFixed(2)}`}
          </Button>
          <span className="text-sm text-zinc-400">
            {getPlanUnitLabel(selectedPlan)} {selectedService?.name}
          </span>
        </div>
      )}
    </form>
  );
}
