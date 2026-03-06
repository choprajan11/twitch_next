"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import Link from "next/link";

export default function OrdersPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<{
    id: string;
    status: string;
    service: string;
    quantity: number;
    createdAt: string;
    progress?: number;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrder(null);

    if (!orderId.trim() && !email.trim()) {
      setError("Please enter an order ID or email address");
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch(`/api/orders/track?${orderId ? `orderId=${orderId}` : `email=${email}`}`);
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Order not found");
      } else {
        setOrder(data);
      }
    } catch {
      setError("Failed to fetch order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-500";
      case "processing":
      case "inprogress":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      case "failed":
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-zinc-500";
    }
  };

  const inputClass = "w-full h-12 px-4 bg-zinc-50 dark:bg-zinc-800/50 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl text-base text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none transition-colors hover:border-[#9146FF]/50 focus:border-[#9146FF] focus:ring-2 focus:ring-[#9146FF]/20";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-12 pb-24">
      {/* Header */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-500 text-sm font-bold mb-4">
          Order Tracking
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-zinc-900 dark:text-white">
          Track Your <span className="gradient-text">Order</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Enter your order ID or email to check the status of your purchase.
        </p>
      </div>

      {/* Search Form */}
      <div className="max-w-xl mx-auto">
        <div className="bento-card p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Order ID
              </label>
              <input
                type="text"
                placeholder="e.g., ORD-12345678"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700"></div>
              <span className="text-sm text-zinc-500 font-medium">or</span>
              <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700"></div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full h-12 font-bold text-base"
              style={{ backgroundColor: "#9146FF", color: "white" }}
              isDisabled={loading}
            >
              Track Order
            </Button>
          </form>

          {order && (
            <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h3 className="font-bold text-zinc-900 dark:text-white text-lg">Order Found</h3>
              </div>
              
              <div className="space-y-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4">
                <div className="flex justify-between items-center py-2 border-b border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-600 dark:text-zinc-400 text-sm">Order ID</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-white">{order.id}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-600 dark:text-zinc-400 text-sm">Service</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">{order.service}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-600 dark:text-zinc-400 text-sm">Quantity</span>
                  <span className="font-semibold text-zinc-900 dark:text-white">{order.quantity.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-600 dark:text-zinc-400 text-sm">Status</span>
                  <span className={`px-3 py-1 rounded-full text-white text-xs font-bold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-zinc-600 dark:text-zinc-400 text-sm">Order Date</span>
                  <span className="text-zinc-900 dark:text-white">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                {order.progress !== undefined && (
                  <div className="pt-4 mt-2 border-t border-zinc-200 dark:border-zinc-700">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-zinc-600 dark:text-zinc-400">Progress</span>
                      <span className="font-bold text-[#9146FF]">{order.progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#9146FF] to-cyan-500 rounded-full transition-all duration-500"
                        style={{ width: `${order.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Help Text */}
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400 mt-6">
          Can&apos;t find your order?{" "}
          <Link href="/contact" className="text-[#9146FF] hover:underline font-semibold">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}
