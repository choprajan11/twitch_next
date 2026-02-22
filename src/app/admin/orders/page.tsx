export const metadata = { title: "Orders Management - GrowTwitch Admin" };

const allOrders = [
  { id: "ORD-9821", customer: "j.doe@example.com", service: "1000 Twitch Followers", target: "ninja_fan123", status: "Completed", stripe: "paid", amount: "$22.99", date: "Oct 24, 10:42 AM" },
  { id: "ORD-9820", customer: "markus@streamer.net", service: "500 Live Viewers", target: "pro_gamer_x", status: "Processing", stripe: "paid", amount: "$34.99", date: "Oct 24, 10:25 AM" },
  { id: "ORD-9819", customer: "sarah99@gmail.com", service: "Pro Chatbot (3 Hours)", target: "variety_streams", status: "Pending", stripe: "unpaid", amount: "$24.99", date: "Oct 24, 09:15 AM" },
  { id: "ORD-9818", customer: "clips123@yahoo.com", service: "5000 Clip Views", target: "epic_moments", status: "Completed", stripe: "paid", amount: "$7.99", date: "Oct 24, 08:00 AM" },
  { id: "ORD-9817", customer: "refund.me@test.com", service: "500 Followers", target: "banned_user", status: "Refunded", stripe: "refunded", amount: "$12.99", date: "Oct 23, 11:30 PM" },
];

export default function OrdersPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Orders Management</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">View and manage all customer orders.</p>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Search Order ID or Channel..." 
            className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#9146FF]"
          />
          <button className="px-4 py-2 bg-[#9146FF] text-white font-bold rounded-lg text-sm hover:bg-[#7b3be6] transition-colors">
            Export CSV
          </button>
        </div>
      </div>

      <div className="bento-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Order ID & Date</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Customer</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Service & Target</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Amount & Stripe</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Delivery Status</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {allOrders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-zinc-900 dark:text-white">{order.id}</div>
                    <div className="text-xs text-zinc-500">{order.date}</div>
                  </td>
                  <td className="p-4 text-sm text-zinc-600 dark:text-zinc-400">{order.customer}</td>
                  <td className="p-4">
                    <div className="text-sm font-semibold text-zinc-900 dark:text-white">{order.service}</div>
                    <div className="text-xs font-mono text-[#9146FF]">@{order.target}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-zinc-900 dark:text-white">{order.amount}</div>
                    <div className={`text-xs uppercase font-bold tracking-wider
                      ${order.stripe === 'paid' ? 'text-green-500' : ''}
                      ${order.stripe === 'unpaid' ? 'text-yellow-500' : ''}
                      ${order.stripe === 'refunded' ? 'text-red-500' : ''}
                    `}>
                      {order.stripe}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold
                      ${order.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                      ${order.status === 'Processing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : ''}
                      ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500' : ''}
                      ${order.status === 'Refunded' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                    `}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-sm font-semibold text-zinc-500 hover:text-[#9146FF] transition-colors">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-sm text-zinc-500">
          Showing 1 to 5 of 5 entries
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-zinc-200 dark:border-zinc-800 rounded disabled:opacity-50">Prev</button>
            <button className="px-3 py-1 border border-zinc-200 dark:border-zinc-800 rounded bg-[#9146FF] text-white border-transparent">1</button>
            <button className="px-3 py-1 border border-zinc-200 dark:border-zinc-800 rounded disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}