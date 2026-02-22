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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Manage Users</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">View and manage all registered users including admins.</p>
        </div>
        <div className="flex items-center gap-3">
          <input 
            type="text" 
            placeholder="Search users..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#9146FF] min-w-[200px]"
          />
          <Button 
            style={{ backgroundColor: '#9146FF', color: 'white' }} 
            className="font-bold shadow-[#9146FF]/30"
          >
            + Add User
          </Button>
        </div>
      </div>

      <div className="bento-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">User</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Role</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Funds</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Orders</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Registered</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-zinc-500">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-zinc-900 dark:text-white">{user.name}</div>
                      <div className="text-sm text-zinc-500">{user.email}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' 
                          : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-bold text-green-500">${user.funds.toFixed(2)}</td>
                    <td className="p-4 text-sm font-semibold text-zinc-900 dark:text-white">{user.ordersCount}</td>
                    <td className="p-4 text-sm text-zinc-500">{formatDate(user.createdAt)}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="bordered" 
                          className="font-semibold border-zinc-200 dark:border-zinc-800"
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="flat"
                          color={user.status === 'active' ? 'danger' : 'success'}
                          className="font-semibold"
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
                  <td colSpan={7} className="p-12 text-center text-zinc-500">
                    {searchQuery ? 'No users found matching your search.' : 'No users yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-sm text-zinc-500">
          Showing {filteredUsers.length} of {total} users
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-zinc-200 dark:border-zinc-800 rounded disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 border border-zinc-200 dark:border-zinc-800 rounded bg-[#9146FF] text-white border-transparent">1</button>
            <button className="px-3 py-1 border border-zinc-200 dark:border-zinc-800 rounded disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
