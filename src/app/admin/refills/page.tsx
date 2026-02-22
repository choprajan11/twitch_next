"use client";

import { useState } from "react";
import { Button } from "@heroui/react";

const initialRefills = [
  { id: "REF-001", orderId: "ORD-9811", customer: "j.doe@example.com", target: "ninja_fan123", requestedAt: "2 hours ago", status: "Pending Review" },
  { id: "REF-002", orderId: "ORD-9750", customer: "markus@streamer.net", target: "pro_gamer_x", requestedAt: "5 hours ago", status: "Approved" },
];

export default function RefillsPage() {
  const [refills, setRefills] = useState(initialRefills);

  const handleAction = (id: string, newStatus: string) => {
    setRefills(refills.map(refill => 
      refill.id === id ? { ...refill, status: newStatus } : refill
    ));
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
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Requested</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {refills.map((refill) => (
                <tr key={refill.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                  <td className="p-4 font-bold text-zinc-900 dark:text-white">{refill.id}</td>
                  <td className="p-4 font-semibold text-[#9146FF] cursor-pointer hover:underline">{refill.orderId}</td>
                  <td className="p-4">
                    <div className="text-sm text-zinc-500">{refill.customer}</div>
                    <div className="text-xs font-mono font-bold text-zinc-900 dark:text-white">@{refill.target}</div>
                  </td>
                  <td className="p-4 text-sm text-zinc-500">{refill.requestedAt}</td>
                   <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold
                      ${refill.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                      ${refill.status === 'Rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                      ${refill.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500' : ''}
                    `}>
                      {refill.status}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    {refill.status === 'Pending Review' && (
                      <>
                        <Button 
                          size="sm" 
                          style={{ backgroundColor: '#9146FF', color: 'white' }} 
                          className="font-bold"
                          onPress={() => handleAction(refill.id, 'Approved')}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          color="danger" 
                          variant="flat" 
                          className="font-bold"
                          onPress={() => handleAction(refill.id, 'Rejected')}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}