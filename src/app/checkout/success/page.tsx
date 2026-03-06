"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order") || searchParams.get("oid");

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center py-12 px-4">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-green-500/10 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#9146FF]/10 blur-[120px] pointer-events-none z-0" />

      <div className="max-w-lg w-full mx-auto relative z-10 text-center">
        <div className="bento-card-static p-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>

          <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-3">
            Payment <span className="text-green-500">Successful</span>
          </h1>
          <p className="text-zinc-500 mb-6">
            Your order has been placed and will begin processing shortly.
          </p>

          {orderId && (
            <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-xl p-4 mb-8 border border-[rgba(145,70,255,0.08)]">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Order ID</p>
              <p className="text-lg font-black text-[#9146FF] font-mono">{orderId}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/orders${orderId ? `?search=${orderId}` : ""}`}
              className="flex-1 inline-flex items-center justify-center h-12 bg-[#9146FF] hover:bg-[#7b35de] text-white font-bold rounded-xl shadow-lg shadow-[#9146FF]/20 transition-all"
            >
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-zinc-500">Loading...</div></div>}>
      <SuccessContent />
    </Suspense>
  );
}
