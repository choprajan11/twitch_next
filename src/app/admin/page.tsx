export const metadata = { title: "Admin Dashboard - GrowTwitch" };

const stats = [
  { name: "Total Revenue", value: "$12,450", change: "+12.5%", color: "text-[#9146FF]" },
  { name: "Orders Today", value: "84", change: "+5.2%", color: "text-cyan-500" },
  { name: "Active Refills", value: "12", change: "-2.4%", color: "text-pink-500" },
  { name: "New Customers", value: "32", change: "+18.1%", color: "text-green-500" },
];

const recentOrders = [
  { id: "ORD-9821", service: "1000 Twitch Followers", target: "ninja_fan123", status: "Completed", amount: "$22.99", date: "10 mins ago" },
  { id: "ORD-9820", service: "500 Live Viewers", target: "pro_gamer_x", status: "Processing", amount: "$34.99", date: "25 mins ago" },
  { id: "ORD-9819", service: "Pro Chatbot (3 Hours)", target: "variety_streams", status: "Pending", amount: "$24.99", date: "1 hour ago" },
  { id: "ORD-9818", service: "5000 Clip Views", target: "epic_moments", status: "Completed", amount: "$7.99", date: "2 hours ago" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bento-card p-6 flex flex-col justify-between h-32">
            <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">{stat.name}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-zinc-900 dark:text-white">{stat.value}</span>
              <span className={`text-sm font-bold ${stat.color}`}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bento-card overflow-hidden">
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Recent Orders</h2>
          <button className="text-sm font-semibold text-[#9146FF] hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Order ID</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Service</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Target Channel</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Amount</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                  <td className="p-4 text-sm font-medium text-zinc-900 dark:text-white">{order.id}</td>
                  <td className="p-4 text-sm text-zinc-600 dark:text-zinc-400">{order.service}</td>
                  <td className="p-4 text-sm text-zinc-600 dark:text-zinc-400 font-mono">@{order.target}</td>
                  <td className="p-4 text-sm font-medium text-zinc-900 dark:text-white">{order.amount}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold
                      ${order.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                      ${order.status === 'Processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                      ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500' : ''}
                    `}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-zinc-500 whitespace-nowrap">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}