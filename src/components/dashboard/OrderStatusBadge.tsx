"use client";

import { useState } from "react";

interface OrderStatusBadgeProps {
  status: string;
  orderId: string;
  oid: string;
  price: number;
  serviceName: string;
  serviceSlug: string;
  quantity: number;
  link?: string | null;
  showRetry?: boolean;
}

export default function OrderStatusBadge({
  status,
  orderId,
  oid,
  price,
  serviceName,
  serviceSlug,
  quantity,
  link,
  showRetry = true,
}: OrderStatusBadgeProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const isPaymentPending = status === "payment";

  async function handleRetryPayment() {
    setIsRetrying(true);
    try {
      const res = await fetch("/api/orders/retry-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to retry payment");
        setIsRetrying(false);
      }
    } catch {
      alert("Network error. Please try again.");
      setIsRetrying(false);
    }
  }

  const displayStatus = isPaymentPending ? "Payment Pending" : status.charAt(0).toUpperCase() + status.slice(1);

  const badgeClass = 
    status === "completed" ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400" :
    status === "processing" || status === "inprogress" ? "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400" :
    status === "pending" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400" :
    status === "payment" ? "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400" :
    status === "cancelled" || status === "failed" ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400" :
    "bg-zinc-100 text-zinc-700 dark:bg-zinc-500/10 dark:text-zinc-400";

  return (
    <div className="flex items-center gap-2">
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeClass}`}>
        {(status === "processing" || status === "inprogress") && (
          <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse"></span>
        )}
        {isPaymentPending && (
          <span className="w-1 h-1 rounded-full bg-orange-500"></span>
        )}
        {displayStatus}
      </span>
      
      {isPaymentPending && showRetry && (
        <button
          onClick={handleRetryPayment}
          disabled={isRetrying}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#9146FF] text-white hover:bg-[#7b35de] transition-colors disabled:opacity-50"
        >
          {isRetrying ? (
            <>
              <svg className="w-3 h-3 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Retrying...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
              Retry Payment
            </>
          )}
        </button>
      )}
    </div>
  );
}
