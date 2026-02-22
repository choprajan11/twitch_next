import { getAllOrders } from "../actions";

export const metadata = { title: "Orders Management - GrowTwitch Admin" };

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getStatusBadgeClass(status: string): string {
  const statusLower = status.toLowerCase();
  if (statusLower === 'completed' || statusLower === 'complete') {
    return 'bg-green-500/10 text-green-600 dark:text-green-400 ring-1 ring-green-500/20';
  }
  if (statusLower === 'processing' || statusLower === 'inprogress' || statusLower === 'in_progress') {
    return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20';
  }
  if (statusLower === 'pending' || statusLower === 'payment') {
    return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 ring-1 ring-yellow-500/20';
  }
  if (statusLower === 'refunded' || statusLower === 'cancelled' || statusLower === 'canceled') {
    return 'bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/20';
  }
  return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 ring-1 ring-zinc-500/20';
}

function getPaymentBadgeClass(gateway: string | null): string {
  if (!gateway) return 'text-yellow-500';
  return 'text-green-500';
}

export default async function OrdersPage() {
  const { orders, total, pages } = await getAllOrders(1, 20);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Orders Management</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">View and manage all customer orders.</p>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Search Order ID or Channel..." 
            className="px-4 py-2.5 border border-[rgba(145,70,255,0.1)] rounded-xl bg-[var(--card-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[#9146FF]/30 focus:border-[#9146FF]/30 transition-all"
          />
          <button className="px-4 py-2.5 bg-[#9146FF] text-white font-bold rounded-xl text-sm hover:bg-[#7b3be6] transition-colors shadow-lg shadow-[#9146FF]/20">
            Export CSV
          </button>
        </div>
      </div>

      <div className="bento-card-static overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[var(--bento-bg)] border-b border-[rgba(145,70,255,0.08)]">
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Order ID & Date</th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Service & Target</th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Amount & Payment</th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Delivery Status</th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(145,70,255,0.06)]">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[var(--bento-bg)] transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="font-bold text-sm text-zinc-900 dark:text-white">{order.id}</div>
                      <div className="text-xs text-zinc-500">{formatDate(order.date)}</div>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-zinc-600 dark:text-zinc-400">
                      <div>{order.customerName || 'Unknown'}</div>
                      <div className="text-xs text-zinc-500">{order.customer}</div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="text-sm font-semibold text-zinc-900 dark:text-white">{order.service}</div>
                      <div className="text-xs font-mono text-[#9146FF] max-w-[180px] truncate">{order.target}</div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="font-bold text-sm text-zinc-900 dark:text-white tabular-nums">${order.amount.toFixed(2)}</div>
                      <div className={`text-[11px] uppercase font-bold tracking-wider ${getPaymentBadgeClass(order.gateway)}`}>
                        {order.gateway || 'unpaid'}
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold capitalize ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button className="text-sm font-semibold text-zinc-400 hover:text-[#9146FF] transition-colors">Manage</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 text-sm">
                    No orders found. Orders will appear here once customers start purchasing.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-[rgba(145,70,255,0.08)] flex justify-between items-center text-sm text-zinc-500">
          <span>Showing {orders.length} of {total} entries</span>
          <div className="flex gap-1.5">
            <button className="px-3 py-1 border border-[rgba(145,70,255,0.1)] rounded-lg text-xs font-semibold disabled:opacity-40 transition-colors hover:border-[#9146FF]/30" disabled>Prev</button>
            <button className="px-3 py-1 rounded-lg bg-[#9146FF] text-white text-xs font-bold shadow-sm shadow-[#9146FF]/20">1</button>
            {pages > 1 && (
              <button className="px-3 py-1 border border-[rgba(145,70,255,0.1)] rounded-lg text-xs font-semibold hover:border-[#9146FF]/30 transition-colors">Next</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
