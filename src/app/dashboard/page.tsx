import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { refreshUserOrderStatuses } from '@/lib/orderProcessor';
import OrderStatusBadge from '@/components/dashboard/OrderStatusBadge';

export const metadata = {
  title: 'My Dashboard - GrowTwitch',
  description: 'Manage your GrowTwitch orders and account',
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role === 'admin') {
    redirect('/admin');
  }

  // Sync processing orders with API before displaying
  await refreshUserOrderStatuses(user.id).catch(() => {});

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { service: true },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  const totalOrders = await prisma.order.count({
    where: { userId: user.id },
  });

  const activeOrders = await prisma.order.count({
    where: { 
      userId: user.id,
      status: { in: ['processing', 'pending', 'inprogress'] },
    },
  });

  return (
    <>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Overview</h1>
        <p className="text-zinc-500 mt-1">Welcome back, {user.name || user.email}</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500 mb-1">Total Orders</p>
              <p className="text-2xl font-black text-zinc-900 dark:text-white">{totalOrders}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#9146FF]/10 flex items-center justify-center text-[#9146FF]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><line x1="3" x2="21" y1="6" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500 mb-1">Active Orders</p>
              <p className="text-2xl font-black text-[#9146FF]">{activeOrders}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" /><path d="M21 3v5h-5" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-zinc-500 mb-1">Wallet Balance</p>
              <p className="text-2xl font-black text-green-500">${user.funds.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="5" rx="2" /><path d="M2 10h20" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
          <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-xs font-semibold text-[#9146FF] hover:text-[#7b35de] transition-colors">
            View All
          </Link>
        </div>
        
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {orders.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-4">
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
          ) : (
            orders.map((order) => (
              <div key={order.id} className="px-5 py-4 flex items-center justify-between hover:bg-zinc-50/50 dark:hover:bg-zinc-800/20 transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#9146FF]/10 flex items-center justify-center text-[#9146FF] shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white truncate">{order.service.name}</p>
                    <p className="text-xs text-zinc-500">{order.quantity.toLocaleString()} · {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
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
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">${order.price.toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
