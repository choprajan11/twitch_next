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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Refills Queue</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">Manage customer drop reports under the 30-Day Guarantee.</p>
      </div>

      <div className="bento-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
             <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Refill ID</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Original Order</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Customer & Target</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Service</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Requested</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-zinc-500">
                    Loading refills...
                  </td>
                </tr>
              ) : refills.length > 0 ? (
                refills.map((refill) => (
                  <tr key={refill.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                    <td className="p-4 font-bold text-zinc-900 dark:text-white">{refill.id.slice(0, 8)}...</td>
                    <td className="p-4 font-semibold text-[#9146FF] cursor-pointer hover:underline">{refill.orderId.slice(0, 8)}...</td>
                    <td className="p-4">
                      <div className="text-sm text-zinc-500">{refill.customer}</div>
                      <div className="text-xs font-mono font-bold text-zinc-900 dark:text-white max-w-[150px] truncate">{refill.target}</div>
                    </td>
                    <td className="p-4 text-sm text-zinc-600 dark:text-zinc-400">{refill.service}</td>
                    <td className="p-4 text-sm text-zinc-500">{formatTimeAgo(refill.requestedAt)}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        refill.status === 'Approved' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                          : refill.status === 'Rejected'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500'
                      }`}>
                        {refill.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {refill.status === 'Pending Review' && (
                        <div className="flex justify-end gap-2">
                          <Button 
                            size="sm" 
                            style={{ backgroundColor: '#9146FF', color: 'white' }} 
                            className="font-bold"
                            isLoading={isPending}
                            onPress={() => handleAction(refill.id, 'completed')}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            color="danger" 
                            variant="flat" 
                            className="font-bold"
                            isLoading={isPending}
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
                  <td colSpan={7} className="p-12 text-center text-zinc-500">
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
