"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@heroui/react";
import { getSessionEmail } from "@/lib/sessionClient";

function SetPasswordInline() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
        <p className="text-sm font-bold text-green-600 dark:text-green-400">
          Password set! You can now sign in anytime.
        </p>
        <Link
          href="/dashboard"
          className="text-sm text-[#9146FF] hover:underline font-medium mt-1 inline-block"
        >
          Go to Dashboard &rarr;
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Min. 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setDone(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-gradient-to-r from-[#9146FF]/5 to-cyan-500/5 border border-[#9146FF]/15 rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#9146FF]"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <p className="text-sm font-bold text-zinc-900 dark:text-white">
          Set a password to track your orders
        </p>
      </div>
      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password (min. 8 chars)"
          className="w-full h-9 px-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:border-[#9146FF] dark:text-white placeholder:text-zinc-400"
        />
        <input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
          className="w-full h-9 px-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm outline-none focus:border-[#9146FF] dark:text-white placeholder:text-zinc-400"
        />
        <Button
          type="submit"
          size="sm"
          className="w-full h-9 font-bold text-xs"
          style={{ backgroundColor: "#9146FF", color: "white" }}
          isDisabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Password"}
        </Button>
      </form>
    </div>
  );
}

const NEXT_STEPS = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#9146FF]"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    title: "Confirmation email sent",
    desc: "Check your inbox for the receipt",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-cyan-500"
      >
        <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: "Delivery begins shortly",
    desc: "Most orders start within minutes",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-green-500"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
    title: "Track in your dashboard",
    desc: "Monitor progress in real-time",
  },
];

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order") || searchParams.get("oid");
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  useEffect(() => {
    const hasSession = !!getSessionEmail();
    if (hasSession) {
      fetch("/api/user/profile")
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.user && !data.user.hasPassword) {
            setShowPasswordPrompt(true);
          }
        })
        .catch(() => {});
    }
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center py-12 px-4">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-500/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#9146FF]/10 blur-[120px] pointer-events-none z-0" />

      <div className="max-w-lg w-full mx-auto relative z-10 text-center">
        <div className="bento-card-static p-8 sm:p-10">
          {/* Success icon with animated ring */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500/20 mb-6 relative">
            <div className="absolute inset-0 rounded-full border-2 border-green-500/30 animate-ping" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-500"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-2">
            Payment <span className="text-green-500">Successful</span>
          </h1>
          <p className="text-zinc-500 mb-6">
            Your order has been placed and will begin processing shortly.
          </p>

          {/* Order ID */}
          {orderId && (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-4 mb-6 border border-[rgba(145,70,255,0.08)]">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Order ID
              </p>
              <p className="text-lg font-black text-[#9146FF] font-mono">
                {orderId}
              </p>
            </div>
          )}

          {/* What's Next */}
          <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-5 mb-6 border border-[rgba(145,70,255,0.08)] text-left">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4 text-center">
              What happens next
            </h3>
            <div className="space-y-4">
              {NEXT_STEPS.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {step.title}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Password prompt */}
          {showPasswordPrompt && (
            <div className="mb-6 text-left">
              <SetPasswordInline />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/orders${orderId ? `?search=${orderId}` : ""}`}
              className="flex-1 inline-flex items-center justify-center gap-2 h-12 bg-[#9146FF] hover:bg-[#7b35de] text-white font-bold rounded-xl shadow-lg shadow-[#9146FF]/20 transition-all"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Track Order
            </Link>
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center h-12 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold rounded-xl transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <svg
              className="animate-spin h-8 w-8 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-sm font-medium text-zinc-500">Loading...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
