import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { refreshUserOrderStatuses } from '@/lib/orderProcessor';
import OrderStatusBadge from '@/components/dashboard/OrderStatusBadge';

export const metadata = {
  title: 'My Orders - GrowTwitch',
  description: 'View and track your GrowTwitch orders',
};

export default async function DashboardOrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role === 'admin') {
    redirect('/admin/orders');
  }

  await refreshUserOrderStatuses(user.id).catch(() => {});

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { service: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white">My Orders</h1>
        <p className="text-zinc-500 mt-1">Track and manage all your orders</p>
      </div>

      <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-800/50">
              <tr>
                <th className="px-5 py-3 font-medium">Order ID</th>
                <th className="px-5 py-3 font-medium">Service</th>
                <th className="px-5 py-3 font-medium">Quantity</th>
                <th className="px-5 py-3 font-medium">Start Count</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
                          <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
                        </svg>
                      </div>
                      <p className="text-sm text-zinc-500 mb-4">No orders yet</p>
                      <Link 
                        href="/#services" 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#9146FF] text-white text-sm font-semibold rounded-xl hover:bg-[#7b35de] transition-colors"
                      >
                        Browse Services
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-zinc-900 dark:text-white">
                      {order.oid || order.id.slice(0, 8)}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-zinc-900 dark:text-white text-sm">{order.service.name}</p>
                    </td>
                    <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400">
                      {order.quantity.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-zinc-600 dark:text-zinc-400 text-xs">
                      {order.startCount > 0 ? (
                        <span>
                          <span className="block">{order.startCount.toLocaleString()}</span>
                          {["completed", "partial"].includes(order.status) && (
                            <span className="text-green-500 font-medium">
                              → {(order.startCount + order.quantity - order.remains).toLocaleString()}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-zinc-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-zinc-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      <OrderStatusBadge
                        status={order.status}
                        orderId={order.id}
                        oid={order.oid || order.id}
                        price={order.price}
                        serviceName={order.service.name}
                        serviceSlug={order.service.slug}
                        quantity={order.quantity}
                        link={order.link}
                      />
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-zinc-900 dark:text-white">
                      ${order.price.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
