"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Checkbox, CheckboxGroup, RadioGroup, Radio, Label } from "@heroui/react";
import { Suspense } from "react";
import TwitchUsernameInput from "@/components/TwitchUsernameInput";
import { getSessionEmail } from "@/lib/sessionClient";
import { CHAT_CATEGORIES, CATEGORY_MESSAGES, type ChatCategory } from "@/lib/chatMessages";

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceSlug = searchParams.get("service");
  const planId = searchParams.get("plan");
  const [resolvedServiceName, setResolvedServiceName] = useState("");
  const [resolvedPlanName, setResolvedPlanName] = useState("");
  const [resolvedPrice, setResolvedPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSessionEmail(getSessionEmail());
  }, []);

  // Always load service details (name, plan name, price) from backend — URL only has variant
  useEffect(() => {
    if (!serviceSlug || !planId) return;

    setIsLoading(true);
    fetch(`/api/services/${serviceSlug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          setError("Service not found");
          return;
        }
        if (data.name) setResolvedServiceName(data.name);
        if (data.plans) {
          const plans = typeof data.plans === "string" ? JSON.parse(data.plans) : data.plans;
          const plan = plans.find((p: { id: string }) => p.id === planId);
          if (plan) {
            setResolvedPlanName(plan.name);
            setResolvedPrice(String(plan.price));
          } else {
            setError("Plan not found");
          }
        }
      })
      .catch(() => setError("Failed to load service details"))
      .finally(() => setIsLoading(false));
  }, [serviceSlug, planId]);

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");

  const chatCategories = Object.entries(CHAT_CATEGORIES).map(([id, { label, desc }]) => ({
    id,
    label,
    desc,
    defaultOn: id === "random",
  }));
  const [selectedChatCategories, setSelectedChatCategories] = useState<string[]>(["random"]);
  const [chatMode, setChatMode] = useState<"presets" | "custom">("presets");
  const [viewingCategory, setViewingCategory] = useState<ChatCategory | null>(null);

  const isLinkService = serviceSlug?.includes("clip") || serviceSlug?.includes("video");
  const isChatbotService = serviceSlug?.includes("chat") || serviceSlug?.includes("bot");

  if (!serviceSlug || !planId) {
    router.push("/");
    return null;
  }

  const serviceName = resolvedServiceName || "Service";
  const planName = resolvedPlanName || "Selected Plan";
  const securePrice = Number(resolvedPrice || "0").toFixed(2);
  const canSubmit = !isLoading && resolvedPrice && !error && agreedToTerms;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const link = formData.get("link") as string;
    const email = formData.get("email") as string;
    const paymentMethod = formData.get("paymentMethod") as string;
    const customMessages = formData.get("customMessages") as string;
    
    // For chatbot: use custom messages if provided, otherwise use category IDs
    let comments: string | undefined;
    if (isChatbotService) {
      if (chatMode === "custom" && customMessages?.trim()) {
        // Send custom messages prefixed with "custom:" so backend knows to use them directly
        comments = `custom:${customMessages}`;
      } else if (chatMode === "presets" && selectedChatCategories.length > 0) {
        // Send category IDs prefixed with "categories:" 
        comments = `categories:${selectedChatCategories.join(",")}`;
      }
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceSlug,
          planId,
          link,
          email,
          comments,
          agreedToTerms,
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
                  {!isLinkService && !isChatbotService && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500 shrink-0 mt-0.5">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                      <div>
                        <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">Twitch Account Requirements</p>
                        <p className="text-xs text-amber-600 dark:text-amber-400/80 mt-0.5">
                          Your Twitch account must have a <strong>verified email</strong> and <strong>verified phone number</strong> to receive followers. 
                          Unverified accounts may experience delivery issues.
                        </p>
                      </div>
                    </div>
                  )}

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
                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-[rgba(145,70,255,0.1)] rounded-xl text-sm focus:ring-2 focus:ring-[#9146FF]/30 focus:border-[#9146FF]/30 outline-none transition-all dark:text-white"
                      />
                      <p className="text-xs font-medium text-zinc-500 mt-2">Paste the full link to your {serviceSlug?.includes("clip") ? "clip" : "video"}.</p>
                    </div>
                  ) : (
                    <TwitchUsernameInput />
                  )}

                  {isChatbotService && (
                    <div>
                      <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3">
                        Chat Messages
                      </label>
                      
                      {/* Tabs */}
                      <div className="flex mb-4 bg-zinc-100 dark:bg-zinc-900/50 rounded-xl p-1">
                        <button
                          type="button"
                          onClick={() => setChatMode("presets")}
                          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                            chatMode === "presets"
                              ? "bg-white dark:bg-zinc-800 text-[#9146FF] shadow-sm"
                              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                          }`}
                        >
                          <span className="flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                            Preset Messages
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setChatMode("custom")}
                          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                            chatMode === "custom"
                              ? "bg-white dark:bg-zinc-800 text-[#9146FF] shadow-sm"
                              : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                          }`}
                        >
                          <span className="flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Custom Messages
                          </span>
                        </button>
                      </div>

                      {/* Presets Tab Content */}
                      {chatMode === "presets" && (
                        <div>
                          <p className="text-xs text-zinc-500 mb-3">Select one or more message categories. Click &quot;View&quot; to preview messages.</p>
                          <CheckboxGroup 
                            value={selectedChatCategories} 
                            onChange={(values) => setSelectedChatCategories(values as string[])}
                            className="gap-0"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {chatCategories.map((cat) => {
                                const isSelected = selectedChatCategories.includes(cat.id);
                                const messageCount = CATEGORY_MESSAGES[cat.id as ChatCategory]?.length || 0;
                                return (
                                  <div
                                    key={cat.id}
                                    className={`rounded-xl border-2 transition-all ${
                                      isSelected
                                        ? "border-[#9146FF] bg-[#9146FF]/5"
                                        : "border-[rgba(145,70,255,0.1)] bg-zinc-50 dark:bg-zinc-900/50 hover:border-[#9146FF]/30"
                                    }`}
                                  >
                                    <div className="flex items-start gap-3 p-3">
                                      <Checkbox 
                                        value={cat.id}
                                        className="flex-1 min-w-0 items-start [&_[data-slot=control]]:mt-0.5"
                                      >
                                        <Checkbox.Control>
                                          <Checkbox.Indicator />
                                        </Checkbox.Control>
                                        <Checkbox.Content>
                                          <Label className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight cursor-pointer">{cat.label}</Label>
                                          <span className="text-xs text-zinc-500 dark:text-zinc-400 block">{cat.desc}</span>
                                        </Checkbox.Content>
                                      </Checkbox>
                                      <button
                                        type="button"
                                        onClick={() => setViewingCategory(cat.id as ChatCategory)}
                                        className="px-2 py-1 text-[10px] font-bold text-[#9146FF] bg-[#9146FF]/10 rounded-md hover:bg-[#9146FF]/20 transition-colors shrink-0"
                                      >
                                        View ({messageCount})
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </CheckboxGroup>
                          {selectedChatCategories.length === 0 && (
                            <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 font-medium">
                              Please select at least one category
                            </p>
                          )}
                        </div>
                      )}

                      {/* Custom Tab Content */}
                      {chatMode === "custom" && (
                        <div>
                          <p className="text-xs text-zinc-500 mb-3">Enter your own custom messages, one per line. Minimum 5 messages recommended.</p>
                          <textarea
                            id="customMessages"
                            name="customMessages"
                            rows={6}
                            placeholder={"Enter your custom chat messages here...\n\nExamples:\nLET'S GOOO!\nGreat stream!\nYou're so good at this\nLove the content\nKeep up the great work"}
                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-[rgba(145,70,255,0.1)] rounded-xl text-sm focus:ring-2 focus:ring-[#9146FF]/30 focus:border-[#9146FF]/30 outline-none transition-all dark:text-white resize-none"
                          />
                          <p className="text-xs font-medium text-zinc-500 mt-2">
                            One message per line. More variety = more natural chat experience.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* View Messages Modal */}
                  {viewingCategory && (
                    <>
                      <div 
                        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
                        onClick={() => setViewingCategory(null)}
                      />
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[70vh] flex flex-col overflow-hidden">
                          <div className="p-5 flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                                {CHAT_CATEGORIES[viewingCategory].label}
                              </h3>
                              <p className="text-xs text-zinc-500 mt-0.5">
                                {CATEGORY_MESSAGES[viewingCategory]?.length || 0} messages in this category
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setViewingCategory(null)}
                              className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
                                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                              </svg>
                            </button>
                          </div>
                          <div className="flex-1 overflow-y-auto px-5 pb-2">
                            <div className="space-y-2">
                              {CATEGORY_MESSAGES[viewingCategory]?.map((msg, idx) => (
                                <div 
                                  key={idx}
                                  className="px-3 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl text-sm text-zinc-700 dark:text-zinc-300"
                                >
                                  {msg}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="p-5 pt-3">
                            <Button
                              type="button"
                              onPress={() => {
                                if (!selectedChatCategories.includes(viewingCategory)) {
                                  setSelectedChatCategories(prev => [...prev, viewingCategory]);
                                }
                                setViewingCategory(null);
                              }}
                              className="w-full bg-[#9146FF] text-white font-semibold rounded-xl"
                            >
                              {selectedChatCategories.includes(viewingCategory) ? "Close" : "Add This Category"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
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
                      className={`w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-[rgba(145,70,255,0.1)] rounded-xl text-sm focus:ring-2 focus:ring-[#9146FF]/30 focus:border-[#9146FF]/30 outline-none transition-all dark:text-white ${sessionEmail ? "opacity-70 cursor-not-allowed" : ""}`}
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
                  <RadioGroup 
                    value={paymentMethod} 
                    onChange={setPaymentMethod}
                    name="paymentMethod"
                    className="gap-3"
                  >
                    <Radio 
                      value="stripe"
                      className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all w-full m-0 ${
                        paymentMethod === "stripe" 
                          ? "border-[#9146FF] bg-[#9146FF]/5" 
                          : "border-transparent bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <Radio.Control>
                        <Radio.Indicator />
                      </Radio.Control>
                      <Radio.Content className="flex-1 flex items-center justify-between">
                        <Label className="font-bold text-zinc-900 dark:text-white cursor-pointer">Credit / Debit Card</Label>
                        <div className="flex gap-1.5">
                          <div className="w-9 h-6 bg-[#1a1f36] rounded border border-zinc-700 text-[9px] text-white flex items-center justify-center font-bold">VISA</div>
                          <div className="w-9 h-6 bg-[#1a1f36] rounded border border-zinc-700 text-[9px] text-white flex items-center justify-center font-bold">MC</div>
                        </div>
                      </Radio.Content>
                    </Radio>
                    <Radio 
                      value="crypto"
                      className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all w-full m-0 ${
                        paymentMethod === "crypto" 
                          ? "border-[#9146FF] bg-[#9146FF]/5" 
                          : "border-transparent bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <Radio.Control>
                        <Radio.Indicator />
                      </Radio.Control>
                      <Radio.Content className="flex-1 flex items-center justify-between">
                        <Label className="font-bold text-zinc-900 dark:text-white cursor-pointer">Cryptocurrency</Label>
                        <div className="flex gap-1.5">
                          <div className="w-9 h-6 bg-[#f7931a] rounded text-[9px] text-white flex items-center justify-center font-bold">BTC</div>
                          <div className="w-9 h-6 bg-[#627eea] rounded text-[9px] text-white flex items-center justify-center font-bold">ETH</div>
                        </div>
                      </Radio.Content>
                    </Radio>
                    <Radio 
                      value="wallet"
                      className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all w-full m-0 ${
                        paymentMethod === "wallet" 
                          ? "border-[#9146FF] bg-[#9146FF]/5" 
                          : "border-transparent bg-zinc-50 dark:bg-zinc-900/50 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <Radio.Control>
                        <Radio.Indicator />
                      </Radio.Control>
                      <Radio.Content className="flex-1 flex items-center justify-between">
                        <Label className="font-bold text-zinc-900 dark:text-white cursor-pointer">Wallet Balance</Label>
                        <div className="text-xs font-bold text-green-500">Pay with funds</div>
                      </Radio.Content>
                    </Radio>
                  </RadioGroup>
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
                    <Checkbox 
                      isSelected={agreedToTerms}
                      onChange={setAgreedToTerms}
                      className="mb-5 items-start [&_[data-slot=control]]:mt-0.5"
                    >
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                      <Checkbox.Content>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                          I agree to the{" "}
                          <a href="/terms" target="_blank" className="text-[#9146FF] hover:underline font-medium">
                            Terms of Service
                          </a>{" "}
                          and{" "}
                          <a href="/refund-policy" target="_blank" className="text-[#9146FF] hover:underline font-medium">
                            Refund Policy
                          </a>
                          . I understand that results may vary and delivery times are estimates.
                        </span>
                      </Checkbox.Content>
                    </Checkbox>
                    <Button
                      type="submit"
                      isDisabled={isSubmitting || !canSubmit}
                      className="w-full h-14 bg-[#9146FF] hover:bg-[#7b35de] text-white font-bold text-lg shadow-lg shadow-[#9146FF]/30 transition-transform active:scale-95 glow-animation rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
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
