"use client";

import { Suspense } from "react";
import { useState, useEffect, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@heroui/react";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  oldFunds: number;
  newFunds: number;
  note: string | null;
  createdAt: string;
}

function WalletContent() {
  const searchParams = useSearchParams();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addAmount, setAddAmount] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const funded = searchParams.get("funded");
    if (funded === "true") {
      setSuccess("Payment received! Your funds will be credited shortly.");
    } else if (funded === "false") {
      setError("Payment was cancelled.");
    }
    loadWalletData();
  }, [searchParams]);

  async function loadWalletData() {
    try {
      const res = await fetch("/api/wallet");
      const data = await res.json();
      if (data.success) {
        setBalance(data.balance);
        setTransactions(data.transactions);
      }
    } catch {
      console.error("Failed to load wallet");
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddFunds() {
    const amount = parseFloat(addAmount);
    if (isNaN(amount) || amount < 1) {
      setError("Minimum amount is $1");
      return;
    }
    if (amount > 500) {
      setError("Maximum amount is $500");
      return;
    }
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/wallet/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount }),
        });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to process");
          return;
        }

        if (data.url) {
          window.location.href = data.url;
        } else {
          setSuccess("Funds added successfully!");
          loadWalletData();
          setAddAmount("");
        }
      } catch {
        setError("Network error. Please try again.");
      }
    });
  }

  function getTypeColor(type: string) {
    if (type === "add" || type === "refund") return "text-green-500";
    return "text-red-500";
  }

  function getTypeLabel(type: string) {
    const labels: Record<string, string> = {
      add: "Added",
      deduct: "Deducted",
      refund: "Refunded",
    };
    return labels[type] || type;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
          Wallet
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
          Manage your funds and view transaction history.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Balance Card */}
        <div className="bento-card p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#9146FF]/10 to-[#9146FF]/5 pointer-events-none" />
          <div className="relative">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Available Balance
            </p>
            <p className="text-4xl font-black text-[#9146FF] tabular-nums">
              {isLoading ? "..." : `$${balance.toFixed(2)}`}
            </p>
          </div>
        </div>

        {/* Add Funds Card */}
        <div className="lg:col-span-2 bento-card-static p-6">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white mb-4">
            Add Funds
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-semibold">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-600 dark:text-green-400 text-sm font-semibold">
              {success}
            </div>
          )}

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">
                $
              </span>
              <input
                type="number"
                min="1"
                max="500"
                step="1"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="10.00"
                className="w-full pl-8 pr-4 py-3 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-[#9146FF] focus:border-transparent outline-none transition-all dark:text-white"
              />
            </div>
            <Button
              onPress={handleAddFunds}
              isDisabled={isPending}
              className="h-auto bg-[#9146FF] hover:bg-[#7b35de] text-white font-bold rounded-xl shadow-lg shadow-[#9146FF]/20 px-6"
            >
              Add Funds
            </Button>
          </div>

          <div className="flex gap-2 mt-3">
            {[5, 10, 25, 50, 100].map((amt) => (
              <button
                key={amt}
                onClick={() => setAddAmount(String(amt))}
                className="px-4 py-1.5 text-xs font-bold bg-zinc-100 dark:bg-zinc-800 hover:bg-[#9146FF]/10 hover:text-[#9146FF] rounded-lg transition-all"
              >
                ${amt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bento-card-static overflow-hidden">
        <div className="px-6 py-4 border-b border-[rgba(145,70,255,0.08)]">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">
            Transaction History
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bento-bg)] border-b border-[rgba(145,70,255,0.08)]">
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Note
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(145,70,255,0.06)]">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-zinc-500 text-sm"
                  >
                    Loading...
                  </td>
                </tr>
              ) : transactions.length > 0 ? (
                transactions.map((txn) => (
                  <tr
                    key={txn.id}
                    className="hover:bg-[var(--bento-bg)] transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold capitalize ${
                          txn.type === "add" || txn.type === "refund"
                            ? "bg-green-500/10 text-green-600 dark:text-green-400 ring-1 ring-green-500/20"
                            : "bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/20"
                        }`}
                      >
                        {getTypeLabel(txn.type)}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-3.5 text-sm font-bold tabular-nums ${getTypeColor(txn.type)}`}
                    >
                      {txn.type === "deduct" ? "-" : "+"}${txn.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-3.5 text-sm text-zinc-600 dark:text-zinc-400 tabular-nums">
                      ${txn.oldFunds.toFixed(2)} → ${txn.newFunds.toFixed(2)}
                    </td>
                    <td className="px-6 py-3.5 text-sm text-zinc-500 max-w-[200px] truncate">
                      {txn.note || "-"}
                    </td>
                    <td className="px-6 py-3.5 text-sm text-zinc-500 whitespace-nowrap">
                      {new Date(txn.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-zinc-500 text-sm"
                  >
                    No transactions yet. Add funds to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function WalletPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
              Wallet
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
              Loading wallet...
            </p>
          </div>
        </div>
      }
    >
      <WalletContent />
    </Suspense>
  );
}
