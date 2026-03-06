"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@heroui/react";
import {
  getProviders,
  addProvider,
  deleteProvider,
  checkBalance,
} from "./actions";

interface Provider {
  id: string;
  name: string;
  url: string;
  balance: number | null;
  currency: string;
  servicesCount: number;
  ordersCount: number;
  createdAt: Date;
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newKey, setNewKey] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [checkingId, setCheckingId] = useState<string | null>(null);

  useEffect(() => {
    loadProviders();
  }, []);

  async function loadProviders() {
    setIsLoading(true);
    try {
      const data = await getProviders();
      setProviders(data);
    } catch {
      console.error("Failed to load providers");
    } finally {
      setIsLoading(false);
    }
  }

  function handleAdd() {
    if (!newUrl || !newKey) {
      setError("Please fill in all fields");
      return;
    }
    setError(null);

    startTransition(async () => {
      const result = await addProvider(newUrl, newKey);
      if (result.success) {
        setShowAddForm(false);
        setNewUrl("");
        setNewKey("");
        loadProviders();
      } else {
        setError(result.error || "Failed to add provider");
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Remove this provider? Its services will be deactivated."))
      return;
    startTransition(async () => {
      await deleteProvider(id);
      loadProviders();
    });
  }

  function handleCheckBalance(id: string) {
    setCheckingId(id);
    startTransition(async () => {
      const result = await checkBalance(id);
      if (result.success) {
        setProviders((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  balance: result.balance ?? p.balance,
                  currency: result.currency || p.currency,
                }
              : p
          )
        );
      }
      setCheckingId(null);
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
            API Providers
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
            Manage external API providers for order fulfillment.
          </p>
        </div>
        <Button
          onPress={() => setShowAddForm(!showAddForm)}
          className="bg-[#9146FF] text-white font-bold rounded-xl shadow-lg shadow-[#9146FF]/20"
        >
          + Add Provider
        </Button>
      </div>

      {showAddForm && (
        <div className="bento-card-static p-6">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white mb-4">
            Add New Provider
          </h2>
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-semibold">
              {error}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                API URL
              </label>
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://provider.com/api/v2"
                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-[#9146FF] focus:border-transparent outline-none transition-all dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                API Key
              </label>
              <input
                type="text"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="Your API key"
                className="w-full px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-[#9146FF] focus:border-transparent outline-none transition-all dark:text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onPress={handleAdd}
              isDisabled={isPending}
              className="bg-[#9146FF] text-white font-bold rounded-xl"
            >
              Verify & Add
            </Button>
            <Button
              variant="secondary"
              onPress={() => {
                setShowAddForm(false);
                setError(null);
              }}
              className="font-bold rounded-xl"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="bento-card-static overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[var(--bento-bg)] border-b border-[rgba(145,70,255,0.08)]">
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Balance
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Services
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Orders
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
                    colSpan={5}
                    className="px-6 py-12 text-center text-zinc-500 text-sm"
                  >
                    Loading providers...
                  </td>
                </tr>
              ) : providers.length > 0 ? (
                providers.map((provider) => (
                  <tr
                    key={provider.id}
                    className="hover:bg-[var(--bento-bg)] transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <div className="font-bold text-sm text-zinc-900 dark:text-white capitalize">
                        {provider.name}
                      </div>
                      <div className="text-xs text-zinc-500 font-mono truncate max-w-[200px]">
                        {provider.url}
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="text-sm font-bold text-green-500 tabular-nums">
                        {provider.balance !== null
                          ? `$${provider.balance.toFixed(2)}`
                          : "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-zinc-900 dark:text-white tabular-nums">
                      {provider.servicesCount}
                    </td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-zinc-900 dark:text-white tabular-nums">
                      {provider.ordersCount}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          isDisabled={checkingId === provider.id}
                          onPress={() => handleCheckBalance(provider.id)}
                          className="font-semibold border-[rgba(145,70,255,0.15)] rounded-xl hover:border-[#9146FF]/30"
                        >
                          Check Balance
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onPress={() => handleDelete(provider.id)}
                          className="font-semibold rounded-xl bg-red-500/10 text-red-600 dark:text-red-400"
                        >
                          Remove
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-zinc-500 text-sm"
                  >
                    No API providers configured. Add one to start fulfilling
                    orders.
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
