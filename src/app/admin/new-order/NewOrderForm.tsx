"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import TwitchUsernameInput from "@/components/TwitchUsernameInput";

type Plan = {
  id: string;
  name: string;
  price: number;
  quantity: number;
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

export default function AdminNewOrderForm({ services }: Props) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [customQuantity, setCustomQuantity] = useState("");
  const [useCustomQty, setUseCustomQty] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdOrder, setCreatedOrder] = useState<string | null>(null);

  const isLinkService =
    selectedService?.slug?.includes("clip") ||
    selectedService?.slug?.includes("video");

  const activeQuantity = useCustomQty
    ? Number(customQuantity) || 0
    : selectedPlan?.quantity || 0;

  const canSubmit =
    selectedService &&
    activeQuantity > 0 &&
    email.trim().length > 0;

  function handleSelectService(svc: Service) {
    setSelectedService(svc);
    setSelectedPlan(null);
    setUseCustomQty(false);
    setCustomQuantity("");
  }

  function handleSelectPlan(plan: Plan) {
    setSelectedPlan(plan);
    setUseCustomQty(false);
    setCustomQuantity("");
  }

  function resetForm() {
    setSelectedService(null);
    setSelectedPlan(null);
    setUseCustomQty(false);
    setCustomQuantity("");
    setEmail("");
    setError(null);
    setCreatedOrder(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedService || !canSubmit) return;
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const link = formData.get("link") as string;

    try {
      const res = await fetch("/api/admin/new-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          planId: useCustomQty ? null : selectedPlan?.id,
          link,
          email,
          customQuantity: useCustomQty ? Number(customQuantity) : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setIsSubmitting(false);
        return;
      }

      setCreatedOrder(data.oid);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const grouped = services.reduce<Record<string, Service[]>>((acc, svc) => {
    const cat = svc.category.name;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(svc);
    return acc;
  }, {});

  if (createdOrder) {
    return (
      <div className="max-w-xl">
        <div className="bento-card-static text-center py-10 px-6">
          <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <h2 className="text-lg font-black text-zinc-900 dark:text-white mb-1">Order Created</h2>
          <p className="text-sm font-mono font-bold text-[#9146FF] mb-5">{createdOrder}</p>
          <div className="text-left space-y-2 text-sm border-t border-[rgba(145,70,255,0.08)] pt-4 mb-6">
            <div className="flex justify-between">
              <span className="text-zinc-500">Service</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{selectedService?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Quantity</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{activeQuantity.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Customer</span>
              <span className="font-semibold text-zinc-900 dark:text-white">{email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Status</span>
              <span className="inline-flex items-center gap-1.5 font-semibold text-yellow-600 dark:text-yellow-400">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                Pending
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onPress={resetForm} style={{ backgroundColor: "#9146FF", color: "white" }} className="flex-1 h-10 font-bold rounded-xl shadow-sm shadow-[#9146FF]/20">
              Create Another
            </Button>
            <Button as="a" href="/admin/orders" variant="bordered" className="flex-1 h-10 font-semibold rounded-xl border-[rgba(145,70,255,0.15)] hover:border-[#9146FF]/30">
              View Orders
            </Button>
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

      {/* 2. Plan / Quantity */}
      {selectedService && (
        <div>
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Select Quantity</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {(selectedService.plans as Plan[])?.filter((p) => p && p.quantity).map((plan) => {
              const active = selectedPlan?.id === plan.id && !useCustomQty;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => handleSelectPlan(plan)}
                  className={`bento-card p-5 flex flex-col justify-between h-28 relative overflow-hidden text-left ${
                    active ? "!border-[#9146FF] !shadow-xl !shadow-[#9146FF]/20 ring-2 ring-[#9146FF]" : ""
                  }`}
                >
                  {active && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#9146FF]/10 to-[#9146FF]/5 pointer-events-none" />
                  )}
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider relative">
                    {plan.name || "Plan"}
                  </p>
                  <span className="text-2xl font-black text-[#9146FF] relative tabular-nums">
                    {(plan.quantity ?? 0).toLocaleString()}
                  </span>
                </button>
              );
            })}

            {/* Custom quantity card */}
            <div className={`bento-card p-5 flex flex-col justify-between h-28 relative overflow-hidden text-left ${
              useCustomQty && customQuantity ? "!border-[#9146FF] !shadow-xl !shadow-[#9146FF]/20 ring-2 ring-[#9146FF]" : ""
            }`}>
              {useCustomQty && customQuantity && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#9146FF]/10 to-[#9146FF]/5 pointer-events-none" />
              )}
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider relative">Custom</p>
              <input
                type="number"
                min="1"
                value={customQuantity}
                onFocus={() => { setUseCustomQty(true); setSelectedPlan(null); }}
                onChange={(e) => {
                  setCustomQuantity(e.target.value);
                  setUseCustomQty(true);
                  setSelectedPlan(null);
                }}
                placeholder="0"
                className="text-2xl font-black text-[#9146FF] tabular-nums bg-transparent border-none outline-none placeholder:text-zinc-300 dark:placeholder:text-zinc-600 relative w-full"
              />
            </div>
          </div>
          {(selectedPlan || (useCustomQty && activeQuantity > 0)) && (
            <p className="text-xs text-zinc-500 mt-3">
              {activeQuantity.toLocaleString()} units — created at $0 (admin comp)
            </p>
          )}
        </div>
      )}

      {/* 3. Details */}
      {selectedService && activeQuantity > 0 && (
        <div>
          <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-4">Order Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Target */}
            <div className="bento-card-static p-5">
              {isLinkService ? (
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                    {selectedService.slug?.includes("clip") ? "Clip Link" : "Video Link"}
                  </label>
                  <input
                    type="text"
                    name="link"
                    required
                    placeholder={selectedService.slug?.includes("clip") ? "https://clips.twitch.tv/..." : "https://twitch.tv/videos/..."}
                    className="w-full px-4 py-3 border border-[rgba(145,70,255,0.1)] rounded-xl bg-[var(--card-bg)] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9146FF]/30 focus:border-[#9146FF]/30 transition-all text-sm"
                  />
                </div>
              ) : (
                <TwitchUsernameInput />
              )}
            </div>

            {/* Customer email */}
            <div className="bento-card-static p-5">
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Customer Email
              </label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="customer@example.com"
                className="w-full px-4 py-3 border border-[rgba(145,70,255,0.1)] rounded-xl bg-[var(--card-bg)] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9146FF]/30 focus:border-[#9146FF]/30 transition-all text-sm"
              />
              <p className="text-xs text-zinc-500 mt-1.5">
                A new user will be created if this email doesn&apos;t exist.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Submit */}
      {canSubmit && (
        <div className="flex items-center gap-4">
          <Button
            type="submit"
            isLoading={isSubmitting}
            style={{ backgroundColor: "#9146FF", color: "white" }}
            className="h-12 px-10 font-bold rounded-2xl shadow-lg shadow-[#9146FF]/20 text-base"
          >
            {isSubmitting ? "Creating..." : "Create Order (Free)"}
          </Button>
          <span className="text-sm text-zinc-400">
            {activeQuantity.toLocaleString()} {selectedService?.name} — $0.00
          </span>
        </div>
      )}
    </form>
  );
}
