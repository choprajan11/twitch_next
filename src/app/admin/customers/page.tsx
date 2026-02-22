import { getCustomers } from "../actions";

export const metadata = { title: "Customers - GrowTwitch Admin" };

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default async function CustomersPage() {
  const { customers, total } = await getCustomers(1, 20);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Customers</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">View and manage your registered users and lifetime value (LTV).</p>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            placeholder="Search email or name..." 
            className="px-4 py-2.5 border border-[rgba(145,70,255,0.1)] rounded-xl bg-[var(--card-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[#9146FF]/30 focus:border-[#9146FF]/30 transition-all"
          />
        </div>
      </div>

      <div className="bento-card-static overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[var(--bento-bg)] border-b border-[rgba(145,70,255,0.08)]">
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">LTV (Revenue)</th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Total Orders</th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Joined Date</th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(145,70,255,0.06)]">
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-[var(--bento-bg)] transition-colors">
                    <td className="px-6 py-3.5">
                      <div className="font-bold text-sm text-zinc-900 dark:text-white">{customer.name}</div>
                      <div className="text-xs text-zinc-500">{customer.email}</div>
                    </td>
                    <td className="px-6 py-3.5 text-sm font-black text-green-500 tabular-nums">
                      ${customer.ltv.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-zinc-900 dark:text-white tabular-nums">{customer.ordersCount}</td>
                    <td className="px-6 py-3.5 text-sm text-zinc-500">{formatDate(customer.createdAt)}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold ring-1 ${
                        customer.status === 'Active' 
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400 ring-green-500/20' 
                          : 'bg-red-500/10 text-red-600 dark:text-red-400 ring-red-500/20'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <button className="text-sm font-semibold text-[#9146FF] hover:underline underline-offset-4 transition-colors">View Profile</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 text-sm">
                    No customers yet. Customers will appear here once they register.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-[rgba(145,70,255,0.08)] flex justify-between items-center text-sm text-zinc-500">
          Showing {customers.length} of {total} customers
        </div>
      </div>
    </div>
  );
}
