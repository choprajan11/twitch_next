"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@heroui/react";
import {
  getAllOrders,
  updateOrderStatus,
  refundOrder,
  resendOrder,
} from "../actions";

interface Order {
  id: string;
  service: string;
  target: string;
  status: string;
  amount: number;
  customer: string;
  customerName: string | null;
  date: Date;
  gateway: string | null;
  quantity: number;
}

const ORDER_STATUSES = [
  "payment",
  "pending",
  "processing",
  "completed",
  "cancelled",
  "partial",
  "refunded",
];

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusBadgeClass(status: string): string {
  const s = status.toLowerCase();
  if (s === "completed" || s === "complete")
    return "bg-green-500/10 text-green-600 dark:text-green-400 ring-1 ring-green-500/20";
  if (s === "processing" || s === "inprogress")
    return "bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20";
  if (s === "pending" || s === "payment")
    return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 ring-1 ring-yellow-500/20";
  if (s === "refunded" || s === "cancelled")
    return "bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/20";
  return "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 ring-1 ring-zinc-500/20";
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadOrders(currentPage);
  }, [currentPage]);

  async function loadOrders(page: number) {
    setIsLoading(true);
    try {
      const data = await getAllOrders(page, 20);
      setOrders(data.orders);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      console.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }

  function handleStatusChange(orderId: string, newStatus: string) {
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
      setActiveMenu(null);
    });
  }

  function handleRefund(orderId: string) {
    if (!confirm("Refund this order? Funds will be added to the user wallet."))
      return;
    startTransition(async () => {
      const result = await refundOrder(orderId);
      if (result.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: "refunded" } : o
          )
        );
      }
      setActiveMenu(null);
    });
  }

  function handleResend(orderId: string) {
    if (!confirm("Reset and resend this order to the API provider?")) return;
    startTransition(async () => {
      const result = await resendOrder(orderId);
      if (result.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: "pending" } : o
          )
        );
      }
      setActiveMenu(null);
    });
  }

  const filteredOrders = searchQuery
    ? orders.filter(
        (o) =>
          o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
          o.customer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : orders;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
            Orders Management
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
            View and manage all customer orders.
          </p>
        </div>
        <input
          type="text"
          placeholder="Search Order ID or Channel..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2.5 border border-[rgba(145,70,255,0.1)] rounded-xl bg-[var(--card-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[#9146FF]/30 focus:border-[#9146FF]/30 transition-all min-w-[240px]"
        />
      </div>

      <div className="bento-card-static overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[var(--bento-bg)] border-b border-[rgba(145,70,255,0.08)]">
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Order ID & Date
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Service & Target
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(145,70,255,0.06)]">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-zinc-500 text-sm"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-[var(--bento-bg)] transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <div className="font-bold text-sm text-zinc-900 dark:text-white">
                        {order.id}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {formatDate(order.date)}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-zinc-600 dark:text-zinc-400">
                      <div>{order.customerName || "Unknown"}</div>
                      <div className="text-xs text-zinc-500">
                        {order.customer}
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                        {order.service}
                      </div>
                      <div className="text-xs font-mono text-[#9146FF] max-w-[180px] truncate">
                        {order.target}
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="font-bold text-sm text-zinc-900 dark:text-white tabular-nums">
                        ${order.amount.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-zinc-500">
                        Qty: {order.quantity}
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold capitalize ${getStatusBadgeClass(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right relative">
                      <Button
                        size="sm"
                        variant="outline"
                        onPress={() =>
                          setActiveMenu(
                            activeMenu === order.id ? null : order.id
                          )
                        }
                        className="font-semibold border-[rgba(145,70,255,0.15)] rounded-xl hover:border-[#9146FF]/30"
                      >
                        Manage
                      </Button>

                      {activeMenu === order.id && (
                        <div className="absolute right-6 top-14 z-20 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-[rgba(145,70,255,0.1)] py-1.5 overflow-hidden">
                          <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                            Set Status
                          </div>
                          {ORDER_STATUSES.filter(
                            (s) => s !== order.status
                          ).map((status) => (
                            <button
                              key={status}
                              onClick={() =>
                                handleStatusChange(order.id, status)
                              }
                              disabled={isPending}
                              className="w-full text-left px-3 py-1.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-[#9146FF]/5 hover:text-[#9146FF] transition-colors capitalize"
                            >
                              {status}
                            </button>
                          ))}
                          <div className="border-t border-[rgba(145,70,255,0.08)] my-1" />
                          <button
                            onClick={() => handleResend(order.id)}
                            disabled={isPending}
                            className="w-full text-left px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-500/5 transition-colors"
                          >
                            Resend to API
                          </button>
                          <button
                            onClick={() => handleRefund(order.id)}
                            disabled={isPending}
                            className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-500/5 transition-colors"
                          >
                            Refund Order
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-zinc-500 text-sm"
                  >
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-[rgba(145,70,255,0.08)] flex justify-between items-center text-sm text-zinc-500">
          <span>
            Showing {filteredOrders.length} of {total} entries
          </span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-[rgba(145,70,255,0.1)] rounded-lg text-xs font-semibold disabled:opacity-40 transition-colors hover:border-[#9146FF]/30"
            >
              Prev
            </button>
            <span className="px-3 py-1 rounded-lg bg-[#9146FF] text-white text-xs font-bold shadow-sm shadow-[#9146FF]/20">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(pages, p + 1))}
              disabled={currentPage >= pages}
              className="px-3 py-1 border border-[rgba(145,70,255,0.1)] rounded-lg text-xs font-semibold disabled:opacity-40 transition-colors hover:border-[#9146FF]/30"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
