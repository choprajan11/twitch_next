"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  RadioGroup,
  Radio,
  Label,
} from "@heroui/react";
import { Suspense } from "react";
import TwitchUsernameInput from "@/components/TwitchUsernameInput";
import TwitchLinkInput from "@/components/TwitchLinkInput";
import { getSessionEmail } from "@/lib/sessionClient";
import {
  CHAT_CATEGORIES,
  CATEGORY_MESSAGES,
  type ChatCategory,
} from "@/lib/chatMessages";

type Plan = {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  duration?: number;
  popular?: boolean;
  frequency?: "daily" | "weekly" | "monthly";
};

type AddonConfig = {
  quantity: number;
  price: number;
};

function getServiceTheme(slug: string | null) {
  if (!slug) return { color: "#9146FF", label: "Service" };
  const s = slug.toLowerCase();
  if (s.includes("follower")) return { color: "#9146FF", label: "Followers" };
  if (s.includes("viewer") && !s.includes("clip"))
    return { color: "#06b6d4", label: "Viewers" };
  if (s.includes("chat") || s.includes("bot"))
    return { color: "#22c55e", label: "Chat Engagement" };
  if (s.includes("clip")) return { color: "#ec4899", label: "Clip Views" };
  if (s.includes("video")) return { color: "#f59e0b", label: "Video Views" };
  return { color: "#9146FF", label: "Service" };
}

function getDeliveryEstimate(type: string | null, slug: string | null) {
  const t = type || "";
  const s = (slug || "").toLowerCase();
  if (t === "followers" || s.includes("follower")) return "Starts within 5–15 min";
  if (t === "viewers" || (s.includes("viewer") && !s.includes("clip"))) return "Activates when you go live";
  if (t === "chatbot" || s.includes("chat") || s.includes("bot")) return "Activates when you go live";
  if (t === "clip_views" || s.includes("clip")) return "Starts within 5–10 min";
  if (t === "video_views" || s.includes("video")) return "Starts within 5–10 min";
  return "Starts within minutes";
}

function getQuantityUnit(type: string | null, slug: string | null) {
  const t = type || "";
  const s = (slug || "").toLowerCase();
  if (t === "followers" || s.includes("follower")) return "followers";
  if (t === "viewers" || (s.includes("viewer") && !s.includes("clip"))) return "concurrent viewers";
  if (t === "chatbot" || s.includes("chat") || s.includes("bot")) return "hours";
  if (t === "clip_views" || s.includes("clip")) return "clip views";
  if (t === "video_views" || s.includes("video")) return "video views";
  return "";
}

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceSlug = searchParams.get("service");
  const planId = searchParams.get("plan");

  const [resolvedServiceName, setResolvedServiceName] = useState("");
  const [serviceType, setServiceType] = useState<string | null>(null);
  const [allPlans, setAllPlans] = useState<Plan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState(planId || "");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [walletLoading, setWalletLoading] = useState(false);

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPlanDropdown, setShowPlanDropdown] = useState(false);

  const [addonConfig, setAddonConfig] = useState<AddonConfig | null>(null);
  const [addonSelected, setAddonSelected] = useState(false);

  const [selectedChatCategories, setSelectedChatCategories] = useState<string[]>(["random"]);
  const [chatMode, setChatMode] = useState<"presets" | "custom">("presets");
  const [viewingCategory, setViewingCategory] = useState<ChatCategory | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  const chatModalRef = useRef<HTMLDivElement>(null);
  const paymentModalRef = useRef<HTMLDivElement>(null);

  const theme = getServiceTheme(serviceSlug);
  const currentPlan = allPlans.find((p) => p.id === selectedPlanId) || null;
  const serviceName = resolvedServiceName || "Service";
  const planName = currentPlan?.name || "Selected Plan";
  const basePrice = currentPlan?.price || 0;
  const addonPrice = addonSelected && addonConfig ? addonConfig.price : 0;
  let price = basePrice + addonPrice;
  
  // Apply visual discounts based on payment method
  if (paymentMethod === "crypto") {
    price = price * 0.7; // 30% discount
  } else if (paymentMethod === "stripe") {
    price = price * 0.85; // 15% discount
  }
  
  const securePrice = price.toFixed(2);
  const displayQuantity = currentPlan?.quantity || currentPlan?.duration || null;
  const quantityUnit = getQuantityUnit(serviceType, serviceSlug);
  const deliveryEstimate = getDeliveryEstimate(serviceType, serviceSlug);

  const isLinkService = serviceType
    ? ["clip_views", "video_views"].includes(serviceType)
    : serviceSlug?.includes("clip") || serviceSlug?.includes("video");
  const isChatbotService = serviceType
    ? serviceType === "chatbot"
    : serviceSlug?.includes("chat") || serviceSlug?.includes("bot");

  const chatValid = !isChatbotService || chatMode === "custom" || selectedChatCategories.length > 0;
  const canPay = !isLoading && currentPlan && !error && agreedToTerms && chatValid;

  const chatCategories = Object.entries(CHAT_CATEGORIES).map(([id, { label, desc }]) => ({ id, label, desc }));

  useEffect(() => { setSessionEmail(getSessionEmail()); }, []);

  useEffect(() => {
    if (!serviceSlug) return;
    setIsLoading(true);
    fetch(`/api/services/${serviceSlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError("Service not found"); return; }
        if (data.name) setResolvedServiceName(data.name);
        if (data.type) setServiceType(data.type);
        if (data.plans) {
          const plans: Plan[] = typeof data.plans === "string" ? JSON.parse(data.plans) : data.plans;
          setAllPlans(plans);
          if (planId && !plans.find((p) => p.id === planId) && plans.length > 0) {
            setSelectedPlanId(plans[0].id);
          }
        }
        const cfg = data.config as Record<string, unknown> | null;
        if (cfg?.addon && typeof cfg.addon === "object") {
          const a = cfg.addon as { quantity?: number; price?: number };
          if (a.quantity && a.quantity > 0 && a.price && a.price > 0) {
            setAddonConfig({ quantity: a.quantity, price: a.price });
          }
        }
      })
      .catch(() => setError("Failed to load service details"))
      .finally(() => setIsLoading(false));
  }, [serviceSlug, planId]);

  useEffect(() => {
    if (!showPaymentModal || !sessionEmail) return;
    setWalletLoading(true);
    fetch("/api/wallet")
      .then((r) => r.json())
      .then((data) => { if (data.success) setWalletBalance(data.balance); })
      .catch(() => {})
      .finally(() => setWalletLoading(false));
  }, [showPaymentModal, sessionEmail]);

  useEffect(() => {
    if (!showPlanDropdown) return;
    function handleClick(e: MouseEvent) {
      if (!(e.target as Element).closest("[data-plan-dropdown]")) setShowPlanDropdown(false);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [showPlanDropdown]);

  function useFocusTrap(ref: React.RefObject<HTMLDivElement | null>, isOpen: boolean, onClose: () => void) {
    useEffect(() => {
      if (!isOpen || !ref.current) return;
      const modal = ref.current;
      const focusable = modal.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length > 0) focusable[0].focus();
      function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") { onClose(); return; }
        if (e.key !== "Tab" || focusable.length === 0) return;
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, ref, onClose]);
  }

  useFocusTrap(chatModalRef, !!viewingCategory, () => setViewingCategory(null));
  useFocusTrap(paymentModalRef, showPaymentModal, () => setShowPaymentModal(false));

  if (!serviceSlug || !planId) { router.push("/"); return null; }

  function openPaymentModal() {
    if (!formRef.current?.reportValidity()) return;
    if (!agreedToTerms) { setError("Please agree to the Terms of Service"); return; }
    setError(null);
    setShowPaymentModal(true);
  }

  async function handleSubmit() {
    if (!formRef.current) return;
    setIsSubmitting(true);
    setError(null);

    const fd = new FormData(formRef.current);
    const link = fd.get("link") as string;
    const email = fd.get("email") as string;
    const customMessages = fd.get("customMessages") as string;

    let comments: string | undefined;
    if (isChatbotService) {
      if (chatMode === "custom" && customMessages?.trim()) comments = `custom:${customMessages}`;
      else if (chatMode === "presets" && selectedChatCategories.length > 0) comments = `categories:${selectedChatCategories.join(",")}`;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceSlug, planId: selectedPlanId, link, email, comments, agreedToTerms, paymentMethod, addon: addonSelected }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong"); setShowPaymentModal(false); setIsSubmitting(false); return; }
      if (data.url) window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
      setShowPaymentModal(false);
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#9146FF]/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none z-0" />

      <div className="max-w-4xl w-full mx-auto relative z-10">
        {/* ── Compact Stepper ── */}
        <nav aria-label="Checkout progress" className="mb-6">
          <ol className="flex items-center justify-center">
            {[
              { label: "Package", done: true },
              { label: "Checkout", active: true },
              { label: "Done", upcoming: true },
            ].map((step, i) => (
              <li key={step.label} className="flex items-center">
                {step.done ? (
                  <a href={serviceSlug ? `/${serviceSlug}` : "/"} className="flex items-center gap-1.5 group" aria-label="Back to packages">
                    <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center group-hover:bg-green-600 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <span className="text-[11px] sm:text-xs font-semibold text-green-600 dark:text-green-400 group-hover:underline">{step.label}</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step.active ? "text-white" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"}`} style={step.active ? { backgroundColor: theme.color } : {}}>
                      {i + 1}
                    </div>
                    <span className={`text-[11px] sm:text-xs font-semibold ${step.active ? "text-zinc-900 dark:text-white" : "text-zinc-400"}`}>{step.label}</span>
                  </div>
                )}
                {i < 2 && <div className={`w-8 sm:w-12 h-0.5 mx-2 rounded-full ${i === 0 ? "bg-green-500" : "bg-zinc-300 dark:bg-zinc-700"}`} />}
              </li>
            ))}
          </ol>
        </nav>

        {/* ── Compact Header ── */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white">
            Complete Your <span style={{ color: theme.color }}>Order</span>
          </h1>
        </div>

        {/* ── Error ── */}
        {error && (
          <div role="alert" aria-live="assertive" className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 shrink-0"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
            <span className="text-sm font-semibold text-red-600 dark:text-red-400">{error}</span>
          </div>
        )}

        {/* ── Form ── */}
        <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6">
            {/* ─── LEFT: Order Details ─── */}
            <div className="lg:col-span-7">
              <div className="bento-card-static relative overflow-hidden">
                <div className="px-4 py-3.5 sm:px-5 sm:py-4 border-b bg-zinc-50/50 dark:bg-zinc-900/20" style={{ borderColor: `${theme.color}12` }}>
                  <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black" style={{ backgroundColor: `${theme.color}18`, color: theme.color }}>1</span>
                    Order Details
                  </h2>
                </div>
                <div className="p-4 sm:p-5 space-y-4">
                  {!isLinkService && !isChatbotService && (
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-start gap-2.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 shrink-0 mt-0.5">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      <p className="text-[11px] text-amber-600 dark:text-amber-400/80 leading-relaxed">
                        Your Twitch account must have a <strong>verified email</strong> and <strong>phone number</strong> to receive followers.
                      </p>
                    </div>
                  )}

                  {isLinkService ? (
                    <TwitchLinkInput
                      linkType={serviceSlug?.includes("clip") ? "clip" : "video"}
                    />
                  ) : (
                    <TwitchUsernameInput />
                  )}

                  {addonConfig && !isLoading && (
                    <div
                      onClick={() => setAddonSelected(!addonSelected)}
                      className={`rounded-xl border-2 p-3 cursor-pointer transition-all ${
                        addonSelected
                          ? "border-green-500 bg-green-500/5"
                          : "border-[rgba(145,70,255,0.1)] bg-zinc-50 dark:bg-zinc-900/50 hover:border-green-500/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox isSelected={addonSelected} onChange={setAddonSelected} className="[&_[data-slot=control]]:mt-0">
                          <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
                        </Checkbox>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded-full bg-green-500 text-white uppercase tracking-wide">Offer</span>
                            Add {addonConfig.quantity.toLocaleString()} more {quantityUnit} for just ${addonConfig.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {isChatbotService && (
                    <div>
                      <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Chat Messages</label>
                      <div className="flex mb-3 bg-zinc-100 dark:bg-zinc-900/50 rounded-lg p-0.5" role="tablist">
                        {(["presets", "custom"] as const).map((mode) => (
                          <button key={mode} type="button" role="tab" aria-selected={chatMode === mode} onClick={() => setChatMode(mode)}
                            className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-all ${chatMode === mode ? "bg-white dark:bg-zinc-800 text-[#9146FF] shadow-sm" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"}`}
                          >
                            {mode === "presets" ? "Preset Messages" : "Custom Messages"}
                          </button>
                        ))}
                      </div>
                      {chatMode === "presets" ? (
                        <div role="tabpanel">
                          <CheckboxGroup value={selectedChatCategories} onChange={(v) => setSelectedChatCategories(v as string[])} className="gap-0" aria-label="Chat categories">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {chatCategories.map((cat) => {
                                const isSelected = selectedChatCategories.includes(cat.id);
                                const count = CATEGORY_MESSAGES[cat.id as ChatCategory]?.length || 0;
                                return (
                                  <div key={cat.id} className={`rounded-lg border-2 transition-all ${isSelected ? "border-[#9146FF] bg-[#9146FF]/5" : "border-[rgba(145,70,255,0.1)] bg-zinc-50 dark:bg-zinc-900/50 hover:border-[#9146FF]/30"}`}>
                                    <div className="flex items-start gap-2 p-2.5">
                                      <Checkbox value={cat.id} className="flex-1 min-w-0 items-start [&_[data-slot=control]]:mt-0.5">
                                        <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
                                        <Checkbox.Content>
                                          <Label className="text-xs font-semibold text-zinc-900 dark:text-white leading-tight cursor-pointer">{cat.label}</Label>
                                          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 block">{cat.desc}</span>
                                        </Checkbox.Content>
                                      </Checkbox>
                                      <button type="button" onClick={() => setViewingCategory(cat.id as ChatCategory)} className="px-1.5 py-0.5 text-[9px] font-bold text-[#9146FF] bg-[#9146FF]/10 rounded hover:bg-[#9146FF]/20 transition-colors shrink-0" aria-label={`Preview ${cat.label} (${count})`}>
                                        {count}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </CheckboxGroup>
                          {selectedChatCategories.length === 0 && <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1.5 font-medium" role="alert">Select at least one category</p>}
                        </div>
                      ) : (
                        <div role="tabpanel">
                          <textarea id="customMessages" name="customMessages" rows={5}
                            placeholder={"LET'S GOOO!\nGreat stream!\nYou're so good at this\nLove the content\nKeep up the great work"}
                            className="w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-[rgba(145,70,255,0.1)] rounded-xl text-sm focus:ring-2 focus:ring-[#9146FF]/30 focus:border-[#9146FF]/30 outline-none transition-all dark:text-white resize-none"
                          />
                          <p className="text-[11px] font-medium text-zinc-500 mt-1.5">One per line. More variety = more natural.</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">Email Address</label>
                    {sessionEmail && (
                      <p className="text-[11px] font-medium text-green-600 dark:text-green-400 mb-1.5 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                        {sessionEmail}
                      </p>
                    )}
                    <input type="email" id="email" name="email" required defaultValue={sessionEmail || ""} readOnly={!!sessionEmail} placeholder="you@example.com"
                      className={`w-full px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-[rgba(145,70,255,0.1)] rounded-xl text-sm focus:ring-2 focus:ring-[#9146FF]/30 focus:border-[#9146FF]/30 outline-none transition-all dark:text-white ${sessionEmail ? "opacity-70 cursor-not-allowed" : ""}`}
                    />
                    <p className="text-[11px] font-medium text-zinc-500 mt-1.5">Receipt &amp; tracking link will be sent here.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ─── RIGHT: Order Summary ─── */}
            <div className="lg:col-span-5">
              <div className="bento-card-static sticky top-6">
                <div className="px-4 py-3.5 sm:px-5 sm:py-4 border-b bg-zinc-50/50 dark:bg-zinc-900/20" style={{ borderColor: `${theme.color}12` }}>
                  <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">Order Summary</h2>
                </div>
                <div className="p-4 sm:p-5">
                  {/* Service */}
                  <div className="flex justify-between items-center text-sm mb-3">
                    <span className="text-zinc-500 text-xs font-medium">Service</span>
                    {isLoading ? <span className="w-24 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" /> : (
                      <span className="font-bold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-md text-xs">{serviceName}</span>
                    )}
                  </div>

                  {/* Package — Dropdown */}
                  <div className="flex justify-between items-center text-sm mb-3">
                    <span className="text-zinc-500 text-xs font-medium">Package</span>
                    {isLoading ? <span className="w-28 h-6 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" /> : allPlans.length > 1 ? (
                      <div className="relative" data-plan-dropdown>
                        <button type="button" onClick={() => setShowPlanDropdown(!showPlanDropdown)}
                          className="flex items-center gap-1.5 font-bold text-xs text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                          aria-haspopup="listbox" aria-expanded={showPlanDropdown}
                        >
                          {planName}
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${showPlanDropdown ? "rotate-180" : ""}`}><polyline points="6 9 12 15 18 9" /></svg>
                        </button>
                        {showPlanDropdown && (
                          <div className="absolute right-0 top-full mt-1.5 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 z-30 py-1 min-w-[220px] overflow-hidden" role="listbox">
                            {allPlans.map((plan) => (
                              <button key={plan.id} type="button" role="option" aria-selected={plan.id === selectedPlanId}
                                onClick={() => { setSelectedPlanId(plan.id); setShowPlanDropdown(false); }}
                                className={`w-full text-left px-3.5 py-2.5 text-sm flex items-center justify-between gap-3 transition-colors ${plan.id === selectedPlanId ? "bg-[#9146FF]/8 text-[#9146FF]" : "hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"}`}
                              >
                                <span className="flex items-center gap-2">
                                  <span className="font-semibold">{plan.name}</span>
                                  {plan.frequency && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500 text-white capitalize">{plan.frequency}</span>}
                                  {plan.popular && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ backgroundColor: theme.color }}>Popular</span>}
                                </span>
                                <span className="font-bold">${plan.price.toFixed(2)}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="font-bold text-zinc-900 dark:text-white bg-zinc-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-md text-xs">{planName}</span>
                    )}
                  </div>

                  {/* Quantity */}
                  {!isLoading && displayQuantity != null && quantityUnit && (
                    <div className="flex justify-between items-center text-sm mb-3">
                      <span className="text-zinc-500 text-xs font-medium">Quantity</span>
                      <span className="font-bold text-xs text-zinc-900 dark:text-white flex items-center gap-1.5">
                        {displayQuantity.toLocaleString()} {quantityUnit}
                        {currentPlan?.frequency && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-cyan-500 text-white capitalize">{currentPlan.frequency}</span>
                        )}
                      </span>
                    </div>
                  )}

                  {/* Delivery */}
                  {!isLoading && (
                    <div className="flex justify-between items-center text-sm mb-3">
                      <span className="text-zinc-500 text-xs font-medium">Delivery</span>
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-green-600 dark:text-green-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                        {deliveryEstimate}
                      </span>
                    </div>
                  )}

                  {/* Price breakdown */}
                  <div className="border-t pt-3 mt-1 space-y-1.5" style={{ borderColor: `${theme.color}12` }}>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">Subtotal</span>
                      {isLoading ? <span className="w-14 h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" /> : <span className="font-semibold text-zinc-700 dark:text-zinc-300">${basePrice.toFixed(2)}</span>}
                    </div>
                    {addonSelected && addonConfig && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-green-600 dark:text-green-400 font-medium">+ {addonConfig.quantity.toLocaleString()} {quantityUnit}</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">+${addonConfig.price.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-zinc-500">Processing Fee</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">Free</span>
                    </div>
                    {paymentMethod === "crypto" && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-green-600 dark:text-green-400 font-medium">Crypto Discount (30%)</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">-${((basePrice + addonPrice) * 0.3).toFixed(2)}</span>
                      </div>
                    )}
                    {paymentMethod === "stripe" && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-green-600 dark:text-green-400 font-medium">Card Discount (15%)</span>
                        <span className="font-semibold text-green-600 dark:text-green-400">-${((basePrice + addonPrice) * 0.15).toFixed(2)}</span>
                      </div>
                    )}
                  </div>

                  {/* Total */}
                  <div className="border-t pt-3 mt-3" style={{ borderColor: `${theme.color}12` }}>
                    <div className="flex justify-between items-end mb-4">
                      <span className="font-bold text-zinc-900 dark:text-white text-sm">Total</span>
                      {isLoading ? <span className="w-24 h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" /> : (
                        <span className="text-2xl sm:text-3xl font-extrabold" style={{ color: theme.color }}>${securePrice}</span>
                      )}
                    </div>

                    {/* Terms */}
                    <Checkbox isSelected={agreedToTerms} onChange={setAgreedToTerms} className="mb-4 items-start [&_[data-slot=control]]:mt-0.5">
                      <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
                      <Checkbox.Content>
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                          I agree to the <a href="/terms" target="_blank" className="text-[#9146FF] hover:underline font-medium">Terms</a> and <a href="/refund-policy" target="_blank" className="text-[#9146FF] hover:underline font-medium">Refund Policy</a>.
                        </span>
                      </Checkbox.Content>
                    </Checkbox>

                    {/* Pay button — opens modal */}
                    <Button type="button" isDisabled={isSubmitting || !canPay} onPress={openPaymentModal}
                      className="w-full h-12 text-white font-bold text-sm sm:text-base shadow-lg transition-all active:scale-[0.98] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: theme.color, boxShadow: `0 4px 14px -2px ${theme.color}40` }}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                          Processing...
                        </span>
                      ) : `Pay $${securePrice}`}
                    </Button>

                    <div className="mt-3 flex items-center justify-center gap-4">
                      <span className="flex items-center gap-1 text-[10px] font-medium text-zinc-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                        SSL Encrypted
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-medium text-zinc-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                        30-Day Guarantee
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* ── Trust Footer ── */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
          {[
            { icon: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>, label: "Instant Delivery" },
            { icon: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>, label: "30-Day Refill Guarantee" },
            { icon: <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9146FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>, label: "50,000+ Orders" },
          ].map((b) => (
            <span key={b.label} className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-500">{b.icon}{b.label}</span>
          ))}
        </div>
      </div>

      {/* ── Payment Method Modal ── */}
      {showPaymentModal && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={() => !isSubmitting && setShowPaymentModal(false)} aria-hidden="true" />
          <div ref={paymentModalRef} role="dialog" aria-modal="true" aria-label="Select payment method" className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-t-3xl sm:rounded-2xl shadow-2xl w-full sm:max-w-[380px] overflow-hidden border border-[rgba(145,70,255,0.1)]">
              <div className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">Payment Method</h3>
                  <button type="button" onClick={() => !isSubmitting && setShowPaymentModal(false)} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" aria-label="Close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>

                {/* Payment Options */}
                <div className="space-y-2 mb-5">
                  {/* Card Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("stripe")}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                      paymentMethod === "stripe"
                        ? "border-[#9146FF] bg-[#9146FF]/5"
                        : "border-transparent bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${paymentMethod === "stripe" ? "bg-[#9146FF]" : "bg-zinc-200 dark:bg-zinc-700"}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                    </div>
                    <div className="flex-1 text-left">
                      <p className={`text-sm font-semibold ${paymentMethod === "stripe" ? "text-zinc-900 dark:text-white" : "text-zinc-700 dark:text-zinc-300"}`}>Credit / Debit Card</p>
                      <p className="text-[10px] text-green-500 font-bold">15% Discount</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === "stripe" ? "border-[#9146FF] bg-[#9146FF]" : "border-zinc-300 dark:border-zinc-600"}`}>
                      {paymentMethod === "stripe" && <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                    </div>
                  </button>

                  {/* Wallet Option */}
                  <div className={`rounded-xl border-2 transition-all ${
                    paymentMethod === "wallet" && sessionEmail && walletBalance !== null && walletBalance >= price
                      ? "border-[#9146FF] bg-[#9146FF]/5"
                      : "border-transparent bg-zinc-50 dark:bg-zinc-800/50"
                  }`}>
                    <button
                      type="button"
                      onClick={() => sessionEmail && walletBalance !== null && walletBalance >= price && setPaymentMethod("wallet")}
                      disabled={!sessionEmail || walletBalance === null || walletBalance < price}
                      className={`w-full flex items-center gap-3 p-3 transition-all ${
                        !sessionEmail || (walletBalance !== null && walletBalance < price)
                          ? "opacity-60 cursor-not-allowed"
                          : "hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50"
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${paymentMethod === "wallet" && sessionEmail && walletBalance !== null && walletBalance >= price ? "bg-[#9146FF]" : "bg-zinc-200 dark:bg-zinc-700"}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" /><path d="M3 5v14a2 2 0 0 0 2 2h16v-5" /><path d="M18 12a2 2 0 0 0 0 4h4v-4Z" /></svg>
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`text-sm font-semibold ${paymentMethod === "wallet" ? "text-zinc-900 dark:text-white" : "text-zinc-700 dark:text-zinc-300"}`}>Wallet Balance</p>
                        <p className="text-[10px]">
                          {!sessionEmail ? <span className="text-zinc-400">Sign in to use wallet</span>
                            : walletLoading ? <span className="text-zinc-400">Loading...</span>
                            : walletBalance !== null ? (
                              walletBalance >= price
                                ? <span className="text-green-600 dark:text-green-400 font-medium">${walletBalance.toFixed(2)} available</span>
                                : <span className="text-amber-600 dark:text-amber-400">${walletBalance.toFixed(2)} — need ${securePrice}</span>
                            ) : <span className="text-zinc-400">Instant payment</span>}
                        </p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === "wallet" && sessionEmail && walletBalance !== null && walletBalance >= price ? "border-[#9146FF] bg-[#9146FF]" : "border-zinc-300 dark:border-zinc-600"}`}>
                        {paymentMethod === "wallet" && sessionEmail && walletBalance !== null && walletBalance >= price && <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                      </div>
                    </button>
                    {/* Add Funds link */}
                    {sessionEmail && walletBalance !== null && walletBalance < price && (
                      <div className="px-3 pb-3 pt-0">
                        <a href="/dashboard/wallet" className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#9146FF] hover:underline">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                          Add funds to wallet
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Crypto */}
                  <button type="button" onClick={() => setPaymentMethod("crypto")}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all w-full text-left ${paymentMethod === "crypto" ? "ring-2 bg-green-50/50 dark:bg-green-900/10" : "bg-zinc-50/50 dark:bg-zinc-800/30 hover:bg-zinc-100/50 dark:hover:bg-zinc-700/30"}`}
                    style={paymentMethod === "crypto" ? { ringColor: theme.color, borderColor: theme.color } : {}}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: paymentMethod === "crypto" ? `${theme.color}15` : undefined }} >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={paymentMethod === "crypto" ? "text-green-600" : "text-zinc-400"}><circle cx="12" cy="12" r="10" /><path d="M12 6v12M9 9h4.5a1.5 1.5 0 0 1 0 3H9m0 0h5a1.5 1.5 0 0 1 0 3H9" /></svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Cryptocurrency</p>
                      <p className="text-[10px] text-zinc-500">BTC, ETH, USDT & more</p>
                    </div>
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">-30%</span>
                  </button>
                </div>

                {/* CTA */}
                <Button type="button" onPress={handleSubmit}
                  isDisabled={isSubmitting || (paymentMethod === "wallet" && (!sessionEmail || walletBalance === null || walletBalance < price))}
                  className="w-full h-11 text-white font-bold text-sm transition-all active:scale-[0.98] rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: theme.color, boxShadow: `0 4px 14px -2px ${theme.color}40` }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                      Processing...
                    </span>
                  ) : `Pay $${securePrice}`}
                </Button>

                <p className="text-center text-[10px] text-zinc-400 mt-3 flex items-center justify-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  Secure checkout with 30-day guarantee
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Chat Preview Modal ── */}
      {viewingCategory && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={() => setViewingCategory(null)} aria-hidden="true" />
          <div ref={chatModalRef} role="dialog" aria-modal="true" aria-label={`${CHAT_CATEGORIES[viewingCategory].label} preview`} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[70vh] flex flex-col overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white">{CHAT_CATEGORIES[viewingCategory].label}</h3>
                  <p className="text-[11px] text-zinc-500">{CATEGORY_MESSAGES[viewingCategory]?.length || 0} messages</p>
                </div>
                <button type="button" onClick={() => setViewingCategory(null)} className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" aria-label="Close">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 pb-2">
                <div className="space-y-1.5">
                  {CATEGORY_MESSAGES[viewingCategory]?.map((msg, idx) => (
                    <div key={idx} className="px-3 py-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg text-sm text-zinc-700 dark:text-zinc-300">{msg}</div>
                  ))}
                </div>
              </div>
              <div className="p-4 pt-2">
                <Button type="button" onPress={() => { if (!selectedChatCategories.includes(viewingCategory)) setSelectedChatCategories((prev) => [...prev, viewingCategory]); setViewingCategory(null); }} className="w-full bg-[#9146FF] text-white font-semibold rounded-xl text-sm">
                  {selectedChatCategories.includes(viewingCategory) ? "Close" : "Add Category"}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <svg className="animate-spin h-7 w-7 text-[#9146FF]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
          <p className="text-xs font-medium text-zinc-500">Loading checkout...</p>
        </div>
      </div>
    }>
      <CheckoutForm />
    </Suspense>
  );
}
