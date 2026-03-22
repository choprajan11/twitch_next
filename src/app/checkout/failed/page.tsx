"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const FAILURE_REASONS: Record<string, string> = {
  crypto_coming_soon:
    "Cryptocurrency payments are coming soon. Please use a credit/debit card or wallet balance instead.",
  card_declined:
    "Your card was declined. Please check your card details or try a different payment method.",
  expired:
    "Your payment session expired. Please return to the service page and try again.",
  insufficient_funds:
    "Your wallet balance is insufficient for this purchase. Please add funds or use a different payment method.",
};

const DEFAULT_REASON =
  "Your payment was not completed. No charges were made to your account.";

function FailedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const service = searchParams.get("service");
  const failureMessage = FAILURE_REASONS[reason || ""] || DEFAULT_REASON;

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center py-12 px-4">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-500/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#9146FF]/10 blur-[120px] pointer-events-none z-0" />

      <div className="max-w-lg w-full mx-auto relative z-10 text-center">
        <div className="bento-card-static p-8 sm:p-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-red-500"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>

          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white mb-3">
            Payment <span className="text-red-500">Failed</span>
          </h1>
          <p className="text-zinc-500 mb-8 leading-relaxed">{failureMessage}</p>

          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Link
              href={service ? `/${service}` : "/"}
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
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
              </svg>
              {service ? "Try Again" : "Browse Services"}
            </Link>
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center h-12 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold rounded-xl transition-all"
            >
              Back to Home
            </Link>
          </div>

          <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-xs text-zinc-400 mb-3">
              Need help? Our support team is here for you.
            </p>
            <a
              href="mailto:support@growtwitch.com"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#9146FF] hover:underline"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-zinc-500">Loading...</div>
        </div>
      }
    >
      <FailedContent />
    </Suspense>
  );
}
