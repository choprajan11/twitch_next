import Link from "next/link";
import { getAdminStats, getRecentOrders } from "./actions";

export const metadata = { title: "Admin Dashboard - GrowTwitch" };

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} mins ago`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
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

export default async function AdminDashboard() {
  const [stats, recentOrders] = await Promise.all([
    getAdminStats(),
    getRecentOrders(5),
  ]);

  const statsDisplay = [
    { 
      name: "Total Revenue", 
      value: `$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
      color: "text-[#9146FF]",
      bg: "from-[#9146FF]/10 to-[#9146FF]/5",
    },
    { name: "Orders Today", value: stats.ordersToday.toString(), color: "text-cyan-500", bg: "from-cyan-500/10 to-cyan-500/5" },
    { name: "Pending Refills", value: stats.pendingRefills.toString(), color: "text-pink-500", bg: "from-pink-500/10 to-pink-500/5" },
    { name: "New Customers", value: stats.newCustomers.toString(), color: "text-green-500", bg: "from-green-500/10 to-green-500/5" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Dashboard Overview</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">Welcome back. Here&apos;s what&apos;s happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsDisplay.map((stat) => (
          <div key={stat.name} className="bento-card p-5 flex flex-col justify-between h-28 relative overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} pointer-events-none`} />
            <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider relative">{stat.name}</h3>
            <span className={`text-2xl font-black ${stat.color} relative tabular-nums`}>{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="bento-card-static overflow-hidden">
        <div className="px-6 py-4 border-b border-[rgba(145,70,255,0.08)] flex justify-between items-center">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs font-bold text-[#9146FF] hover:underline underline-offset-4">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bento-bg)] border-b border-[rgba(145,70,255,0.08)]">
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Target</th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(145,70,255,0.06)]">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-[var(--bento-bg)] transition-colors">
                    <td className="px-6 py-3.5 text-sm font-semibold text-zinc-900 dark:text-white">{order.id}</td>
                    <td className="px-6 py-3.5 text-sm text-zinc-600 dark:text-zinc-400">{order.service}</td>
                    <td className="px-6 py-3.5 text-sm text-zinc-600 dark:text-zinc-400 font-mono max-w-[200px] truncate">
                      {order.target}
                    </td>
                    <td className="px-6 py-3.5 text-sm font-bold text-zinc-900 dark:text-white tabular-nums">
                      ${order.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold capitalize ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-zinc-500 whitespace-nowrap">
                      {formatTimeAgo(new Date(order.date))}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 text-sm">
                    No orders yet. Orders will appear here once customers start purchasing.
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
