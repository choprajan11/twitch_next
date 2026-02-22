import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';

export const metadata = {
  title: 'Settings - GrowTwitch',
  description: 'Manage your GrowTwitch account settings',
};

export default async function DashboardSettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role === 'admin') {
    redirect('/admin/settings');
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Settings</h1>
        <p className="text-zinc-500 mt-1">Manage your account preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Profile Information</h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9146FF] to-cyan-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-[#9146FF]/20">
                {(user.name?.[0] || user.email[0]).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-zinc-900 dark:text-white">{user.name || 'No name set'}</p>
                <p className="text-sm text-zinc-500">{user.email}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5">Full Name</label>
                <input
                  type="text"
                  defaultValue={user.name || ''}
                  placeholder="Enter your name"
                  className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#9146FF]/50"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1.5">Email Address</label>
                <input
                  type="email"
                  defaultValue={user.email}
                  disabled
                  className="w-full px-3 py-2 text-sm bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Account Details</h2>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4">
                <p className="text-xs font-medium text-zinc-500 mb-1">Wallet Balance</p>
                <p className="text-xl font-black text-green-500">${user.funds.toFixed(2)}</p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4">
                <p className="text-xs font-medium text-zinc-500 mb-1">Account Type</p>
                <p className="text-xl font-black text-zinc-900 dark:text-white capitalize">{user.role}</p>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-4">
                <p className="text-xs font-medium text-zinc-500 mb-1">Member Since</p>
                <p className="text-xl font-black text-zinc-900 dark:text-white">
                  {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">Security</h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-zinc-900 dark:text-white text-sm">Password</p>
                <p className="text-xs text-zinc-500">Change your account password</p>
              </div>
              <button className="px-4 py-2 text-sm font-semibold text-[#9146FF] bg-[#9146FF]/10 rounded-xl hover:bg-[#9146FF]/20 transition-colors">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
