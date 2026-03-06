"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@heroui/react";
import { getBannedUsers, addBannedUser, removeBannedUser } from "./actions";

interface BannedUser {
  id: string;
  username: string;
  createdAt: Date;
}

export default function BanListPage() {
  const [bannedUsers, setBannedUsers] = useState<BannedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadBanList();
  }, []);

  async function loadBanList() {
    setIsLoading(true);
    try {
      const data = await getBannedUsers();
      setBannedUsers(data);
    } catch {
      console.error("Failed to load ban list");
    } finally {
      setIsLoading(false);
    }
  }

  function handleAdd() {
    if (!newUsername.trim()) {
      setError("Username is required");
      return;
    }
    setError(null);

    startTransition(async () => {
      const result = await addBannedUser(newUsername);
      if (result.success) {
        setNewUsername("");
        loadBanList();
      } else {
        setError(result.error || "Failed to add");
      }
    });
  }

  function handleRemove(id: string) {
    startTransition(async () => {
      await removeBannedUser(id);
      setBannedUsers((prev) => prev.filter((u) => u.id !== id));
    });
  }

  const filteredUsers = searchQuery
    ? bannedUsers.filter((u) =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : bannedUsers;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
          Ban List
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">
          Manage restricted Twitch usernames that cannot place orders.
        </p>
      </div>

      {/* Add banned user */}
      <div className="bento-card-static p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-semibold">
            {error}
          </div>
        )}
        <div className="flex gap-3">
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Twitch username to ban..."
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            className="flex-1 px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:ring-2 focus:ring-[#9146FF] focus:border-transparent outline-none transition-all dark:text-white"
          />
          <Button
            onPress={handleAdd}
            isDisabled={isPending}
            className="bg-[#9146FF] text-white font-bold rounded-xl shadow-lg shadow-[#9146FF]/20 px-6"
          >
            Ban Username
          </Button>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search banned usernames..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="px-4 py-2.5 border border-[rgba(145,70,255,0.1)] rounded-xl bg-[var(--card-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[#9146FF]/30 focus:border-[#9146FF]/30 transition-all w-full max-w-xs"
      />

      {/* List */}
      <div className="bento-card-static overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bento-bg)] border-b border-[rgba(145,70,255,0.08)]">
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                  Banned On
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
                    colSpan={3}
                    className="px-6 py-12 text-center text-zinc-500 text-sm"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-[var(--bento-bg)] transition-colors"
                  >
                    <td className="px-6 py-3.5 text-sm font-bold text-zinc-900 dark:text-white font-mono">
                      {user.username}
                    </td>
                    <td className="px-6 py-3.5 text-sm text-zinc-500">
                      {new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        isDisabled={isPending}
                        onPress={() => handleRemove(user.id)}
                        className="font-semibold rounded-xl bg-green-500/10 text-green-600 dark:text-green-400"
                      >
                        Unban
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-12 text-center text-zinc-500 text-sm"
                  >
                    {searchQuery
                      ? "No matching usernames found."
                      : "No banned usernames. The ban list is empty."}
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
