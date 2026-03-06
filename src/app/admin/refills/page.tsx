"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@heroui/react";
import { getRefillRequests, updateOrderStatus } from "../actions";

interface Refill {
  id: string;
  orderId: string;
  customer: string;
  target: string;
  service: string;
  requestedAt: Date;
  status: string;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - new Date(date).getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} mins ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

export default function RefillsPage() {
  const [refills, setRefills] = useState<Refill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    loadRefills();
  }, []);

  async function loadRefills() {
    setIsLoading(true);
    try {
      const data = await getRefillRequests();
      setRefills(data);
    } catch (error) {
      console.error("Failed to load refills:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAction = async (id: string, newStatus: string) => {
    startTransition(async () => {
      const result = await updateOrderStatus(id, newStatus);
      if (result.success) {
        setRefills(refills.map(refill => 
          refill.id === id 
            ? { ...refill, status: newStatus === 'completed' ? 'Approved' : 'Rejected' } 
            : refill
        ));
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Refills Queue</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">Manage customer drop reports under the 30-Day Guarantee.</p>
      </div>

      <div className="bento-card-static overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
             <thead>
              <tr className="bg-[var(--bento-bg)] border-b border-[rgba(145,70,255,0.08)]">
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Refill ID</th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Original Order</th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Customer & Target</th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Requested</th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(145,70,255,0.06)]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500 text-sm">
                    Loading refills...
                  </td>
                </tr>
              ) : refills.length > 0 ? (
                refills.map((refill) => (
                  <tr key={refill.id} className="hover:bg-[var(--bento-bg)] transition-colors">
                    <td className="px-6 py-3.5 font-bold text-sm text-zinc-900 dark:text-white">{refill.id.slice(0, 8)}...</td>
                    <td className="px-6 py-3.5 font-semibold text-sm text-[#9146FF] cursor-pointer hover:underline underline-offset-4">{refill.orderId.slice(0, 8)}...</td>
                    <td className="px-6 py-3.5">
                      <div className="text-sm text-zinc-500">{refill.customer}</div>
                      <div className="text-xs font-mono font-bold text-zinc-900 dark:text-white max-w-[150px] truncate">{refill.target}</div>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-zinc-600 dark:text-zinc-400">{refill.service}</td>
                    <td className="px-6 py-3.5 text-sm text-zinc-500">{formatTimeAgo(refill.requestedAt)}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold ring-1 ${
                        refill.status === 'Approved' 
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400 ring-green-500/20' 
                          : refill.status === 'Rejected'
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400 ring-red-500/20'
                          : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 ring-yellow-500/20'
                      }`}>
                        {refill.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      {refill.status === 'Pending Review' && (
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            style={{ backgroundColor: '#9146FF', color: 'white' }} 
                            className="font-bold rounded-xl shadow-sm shadow-[#9146FF]/20"
                            isDisabled={isPending}
                            onPress={() => handleAction(refill.id, 'completed')}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="font-bold rounded-xl bg-red-500/10 text-red-600 dark:text-red-400"
                            isDisabled={isPending}
                            onPress={() => handleAction(refill.id, 'rejected')}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500 text-sm">
                    No refill requests pending. Refill requests will appear here when customers report drops.
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
