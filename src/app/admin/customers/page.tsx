export const metadata = { title: "Customers - GrowTwitch Admin" };

const customers = [
  { id: "CUS-12", email: "j.doe@example.com", name: "John Doe", ltv: "$450.00", orders: 12, joined: "Jan 12, 2023", status: "Active" },
  { id: "CUS-34", email: "markus@streamer.net", name: "Markus V.", ltv: "$1,200.50", orders: 34, joined: "Feb 05, 2023", status: "Active" },
  { id: "CUS-56", email: "sarah99@gmail.com", name: "Sarah J.", ltv: "$24.99", orders: 1, joined: "Oct 24, 2023", status: "Active" },
  { id: "CUS-78", email: "fraud@hacker.io", name: "Unknown", ltv: "$0.00", orders: 0, joined: "Oct 23, 2023", status: "Banned" },
];

export default function CustomersPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Customers</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">View and manage your registered users and lifetime value (LTV).</p>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Search email or name..." 
            className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#9146FF]"
          />
        </div>
      </div>

      <div className="bento-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Customer</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">LTV (Revenue)</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Total Orders</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Joined Date</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-zinc-900 dark:text-white">{customer.name}</div>
                    <div className="text-sm text-zinc-500">{customer.email}</div>
                  </td>
                  <td className="p-4 text-sm font-black text-green-500">{customer.ltv}</td>
                  <td className="p-4 text-sm font-semibold text-zinc-900 dark:text-white">{customer.orders}</td>
                  <td className="p-4 text-sm text-zinc-500">{customer.joined}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold
                      ${customer.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                      ${customer.status === 'Banned' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                    `}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-sm font-semibold text-[#9146FF] hover:underline transition-colors">View Profile</button>
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