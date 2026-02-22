"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@heroui/react";
import { getAllUsers, toggleUserStatus } from "../actions";

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
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setIsLoading(true);
    try {
      const data = await getAllUsers(1, 50);
      setUsers(data.users);
      setTotal(data.total);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = async (userId: string) => {
    startTransition(async () => {
      const result = await toggleUserStatus(userId);
      if (result.success) {
        setUsers(users.map(user => 
          user.id === userId 
            ? { ...user, status: user.status === 'active' ? 'banned' : 'active' }
            : user
        ));
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Manage Users</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">View and manage all registered users including admins.</p>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2.5 border border-[rgba(145,70,255,0.1)] rounded-xl bg-[var(--card-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[#9146FF]/30 focus:border-[#9146FF]/30 transition-all min-w-[200px]"
          />
          <Button 
            style={{ backgroundColor: '#9146FF', color: 'white' }} 
            className="font-bold shadow-lg shadow-[#9146FF]/20 rounded-xl"
          >
            + Add User
          </Button>
        </div>
      </div>

      <div className="bento-card-static overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[var(--bento-bg)] border-b border-[rgba(145,70,255,0.08)]">
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Funds</th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Orders</th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Registered</th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(145,70,255,0.06)]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500 text-sm">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[var(--bento-bg)] transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="font-bold text-sm text-zinc-900 dark:text-white">{user.name}</div>
                      <div className="text-xs text-zinc-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold ring-1 ${
                        user.role === 'admin' 
                          ? 'bg-[#9146FF]/10 text-[#9146FF] ring-[#9146FF]/20' 
                          : 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 ring-zinc-500/20'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-sm font-bold text-green-500 tabular-nums">${user.funds.toFixed(2)}</td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-zinc-900 dark:text-white tabular-nums">{user.ordersCount}</td>
                    <td className="px-6 py-3.5 text-sm text-zinc-500">{formatDate(user.createdAt)}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold ring-1 ${
                        user.status === 'active' 
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400 ring-green-500/20' 
                          : 'bg-red-500/10 text-red-600 dark:text-red-400 ring-red-500/20'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="bordered" 
                          className="font-semibold border-[rgba(145,70,255,0.15)] rounded-xl hover:border-[#9146FF]/30"
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="flat"
                          color={user.status === 'active' ? 'danger' : 'success'}
                          className="font-semibold rounded-xl"
                          isLoading={isPending}
                          onPress={() => handleToggleStatus(user.id)}
                        >
                          {user.status === 'active' ? 'Ban' : 'Unban'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500 text-sm">
                    {searchQuery ? 'No users found matching your search.' : 'No users yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-3 border-t border-[rgba(145,70,255,0.08)] flex justify-between items-center text-sm text-zinc-500">
          <span>Showing {filteredUsers.length} of {total} users</span>
          <div className="flex gap-1.5">
            <button className="px-3 py-1 border border-[rgba(145,70,255,0.1)] rounded-lg text-xs font-semibold disabled:opacity-40 transition-colors" disabled>Prev</button>
            <button className="px-3 py-1 rounded-lg bg-[#9146FF] text-white text-xs font-bold shadow-sm shadow-[#9146FF]/20">1</button>
            <button className="px-3 py-1 border border-[rgba(145,70,255,0.1)] rounded-lg text-xs font-semibold disabled:opacity-40 transition-colors" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
