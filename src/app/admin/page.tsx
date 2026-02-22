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
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  }
  if (statusLower === 'processing' || statusLower === 'inprogress' || statusLower === 'in_progress') {
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
  }
  if (statusLower === 'pending' || statusLower === 'payment') {
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500';
  }
  if (statusLower === 'refunded' || statusLower === 'cancelled' || statusLower === 'canceled') {
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  }
  return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-400';
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
      color: "text-[#9146FF]" 
    },
    { name: "Orders Today", value: stats.ordersToday.toString(), color: "text-cyan-500" },
    { name: "Pending Refills", value: stats.pendingRefills.toString(), color: "text-pink-500" },
    { name: "New Customers", value: stats.newCustomers.toString(), color: "text-green-500" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">Welcome back. Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsDisplay.map((stat) => (
          <div key={stat.name} className="bento-card p-6 flex flex-col justify-between h-32">
            <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">{stat.name}</h3>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black ${stat.color}`}>{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bento-card overflow-hidden">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm font-semibold text-[#9146FF] hover:underline">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Order ID</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Service</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Target</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Amount</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                    <td className="p-4 text-sm font-medium text-zinc-900 dark:text-white">{order.id}</td>
                    <td className="p-4 text-sm text-zinc-600 dark:text-zinc-400">{order.service}</td>
                    <td className="p-4 text-sm text-zinc-600 dark:text-zinc-400 font-mono max-w-[200px] truncate">
                      {order.target}
                    </td>
                    <td className="p-4 text-sm font-medium text-zinc-900 dark:text-white">
                      ${order.amount.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-zinc-500 whitespace-nowrap">
                      {formatTimeAgo(new Date(order.date))}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-500">
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
