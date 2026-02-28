"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@heroui/react";
import { getAllUsers, toggleUserStatus, updateUserFunds } from "../actions";

interface User {
  id: string;
  name: string;
  email: string;
  funds: number;
  status: string;
  role: string;
  ordersCount: number;
  createdAt: Date;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [fundModal, setFundModal] = useState<{
    userId: string;
    name: string;
    funds: number;
  } | null>(null);
  const [fundAmount, setFundAmount] = useState("");
  const [fundType, setFundType] = useState<"add" | "remove">("add");
  const [fundError, setFundError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setIsLoading(true);
    try {
      const data = await getAllUsers(1, 50);
      setUsers(data.users);
      setTotal(data.total);
    } catch {
      console.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function handleToggleStatus(userId: string) {
    startTransition(async () => {
      const result = await toggleUserStatus(userId);
      if (result.success) {
        setUsers(
          users.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  status: user.status === "active" ? "banned" : "active",
                }
              : user
          )
        );
      }
    });
  }

  function handleFundSubmit() {
    const amount = parseFloat(fundAmount);
    if (isNaN(amount) || amount <= 0) {
      setFundError("Enter a valid amount");
      return;
    }
    if (!fundModal) return;
    setFundError(null);

    startTransition(async () => {
      const result = await updateUserFunds(fundModal.userId, amount, fundType);
      if (result.success) {
        setUsers(
          users.map((u) =>
            u.id === fundModal.userId
              ? { ...u, funds: result.newFunds ?? u.funds }
              : u
          )
        );
        setFundModal(null);
        setFundAmount("");
      } else {
        setFundError(result.error || "Failed to update funds");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
            Manage Users
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
            View and manage all registered users.
          </p>
        </div>
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2.5 border border-[rgba(145,70,255,0.1)] rounded-xl bg-[var(--card-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[#9146FF]/30 focus:border-[#9146FF]/30 transition-all min-w-[200px]"
        />
      </div>

      {/* Fund Management Modal */}
      {fundModal && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setFundModal(null)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-[rgba(145,70,255,0.1)] w-full max-w-md p-6">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">
                Manage Funds
              </h3>
              <p className="text-sm text-zinc-500 mb-4">
                {fundModal.name} — Current: ${fundModal.funds.toFixed(2)}
              </p>

              {fundError && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-semibold">
                  {fundError}
                </div>
              )}

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setFundType("add")}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                    fundType === "add"
                      ? "bg-green-500/10 text-green-600 ring-1 ring-green-500/20"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                  }`}
                >
                  Add Funds
                </button>
                <button
                  onClick={() => setFundType("remove")}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                    fundType === "remove"
                      ? "bg-red-500/10 text-red-600 ring-1 ring-red-500/20"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                  }`}
                >
                  Remove Funds
                </button>
              </div>

              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">
                  $
                </span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={fundAmount}
                  onChange={(e) => setFundAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-[#9146FF] focus:border-transparent outline-none dark:text-white"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onPress={handleFundSubmit}
                  isLoading={isPending}
                  className={`flex-1 font-bold rounded-xl ${
                    fundType === "add"
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  }`}
                >
                  {fundType === "add" ? "Add" : "Remove"} Funds
                </Button>
                <Button
                  variant="flat"
                  onPress={() => {
                    setFundModal(null);
                    setFundError(null);
                    setFundAmount("");
                  }}
                  className="font-bold rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="bento-card-static overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[var(--bento-bg)] border-b border-[rgba(145,70,255,0.08)]">
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Funds
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Registered
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
                    colSpan={7}
                    className="px-6 py-12 text-center text-zinc-500 text-sm"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-[var(--bento-bg)] transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <div className="font-bold text-sm text-zinc-900 dark:text-white">
                        {user.name}
                      </div>
                      <div className="text-xs text-zinc-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold ring-1 ${
                          user.role === "admin"
                            ? "bg-[#9146FF]/10 text-[#9146FF] ring-[#9146FF]/20"
                            : "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 ring-zinc-500/20"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <button
                        onClick={() =>
                          setFundModal({
                            userId: user.id,
                            name: user.name,
                            funds: user.funds,
                          })
                        }
                        className="text-sm font-bold text-green-500 tabular-nums hover:underline underline-offset-4"
                      >
                        ${user.funds.toFixed(2)}
                      </button>
                    </td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-zinc-900 dark:text-white tabular-nums">
                      {user.ordersCount}
                    </td>
                    <td className="px-6 py-3.5 text-sm text-zinc-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold ring-1 ${
                          user.status === "active"
                            ? "bg-green-500/10 text-green-600 dark:text-green-400 ring-green-500/20"
                            : "bg-red-500/10 text-red-600 dark:text-red-400 ring-red-500/20"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Button
                        size="sm"
                        variant="flat"
                        color={user.status === "active" ? "danger" : "success"}
                        className="font-semibold rounded-xl"
                        isLoading={isPending}
                        onPress={() => handleToggleStatus(user.id)}
                      >
                        {user.status === "active" ? "Ban" : "Unban"}
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-zinc-500 text-sm"
                  >
                    {searchQuery
                      ? "No users found matching your search."
                      : "No users yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 border-t border-[rgba(145,70,255,0.08)] flex justify-between items-center text-sm text-zinc-500">
          <span>
            Showing {filteredUsers.length} of {total} users
          </span>
        </div>
      </div>
    </div>
  );
}
