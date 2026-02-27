"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function FailedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center py-12 px-4">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-500/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#9146FF]/10 blur-[120px] pointer-events-none z-0" />

      <div className="max-w-lg w-full mx-auto relative z-10 text-center">
        <div className="bento-card-static p-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </div>

          <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-3">
            Payment <span className="text-red-500">Failed</span>
          </h1>
          <p className="text-zinc-500 mb-8">
            Your payment was not completed. No charges were made. Please try again or use a different payment method.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.history.back()}
              className="flex-1 inline-flex items-center justify-center h-12 bg-[#9146FF] hover:bg-[#7b35de] text-white font-bold rounded-xl shadow-lg shadow-[#9146FF]/20 transition-all"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center h-12 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-white font-bold rounded-xl transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutFailedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-zinc-500">Loading...</div></div>}>
      <FailedContent />
    </Suspense>
  );
}
