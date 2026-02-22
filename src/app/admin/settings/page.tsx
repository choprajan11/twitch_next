export const metadata = { title: "Settings - GrowTwitch Admin" };

export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">Admin Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">Manage your platform integrations, API keys, and business details.</p>
      </div>

      <div className="space-y-6">
        {/* Stripe Settings */}
        <div className="bento-card p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#6772E5"><path d="M11.996 0C5.371 0 .002 5.366.002 11.993c0 6.623 5.369 11.993 11.994 11.993 6.623 0 11.992-5.37 11.992-11.993C23.988 5.366 18.619 0 11.996 0zm5.833 8.356c-.05.518-.328 1.905-.623 2.94-1.298 4.542-4.502 6.666-8.981 6.666-3.155 0-5.467-1.396-6.421-3.665-.24-.567-.367-1.196-.367-1.84 0-.154.01-.309.027-.463l.365-2.222c.07-.428.188-1.118.272-1.579.176-1.07.411-2.434.469-2.731.065-.333.197-.481.385-.481h.831c.361 0 .541.248.601.554l.011.054c.054.269.213 1.151.343 1.942l.275 1.638c.159.95.318 1.914.862 2.508.435.475 1.059.721 1.88.721 1.83 0 3.298-1.258 3.791-3.136.216-.826.43-1.879.544-2.613.064-.412.128-.84.171-1.12.062-.41.282-.544.601-.544h.798c.451 0 .618.303.541.776z"/></svg>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Stripe Integration</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Publishable Key</label>
              <input type="text" value="pk_live_************************" disabled className="w-full px-4 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-500 font-mono" />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Secret Key</label>
              <input type="password" value="sk_live_************************" disabled className="w-full px-4 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-500 font-mono" />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Webhook Secret</label>
              <input type="password" value="whsec_************************" disabled className="w-full px-4 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-500 font-mono" />
              <p className="text-xs text-zinc-500 mt-2">Required to receive payment success events from Stripe to fulfill orders automatically.</p>
            </div>
          </div>
        </div>

        {/* API Settings */}
        <div className="bento-card p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <span className="text-[#9146FF] text-2xl">🔌</span>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Fulfillment API Provider</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">API Endpoint URL</label>
              <input type="text" placeholder="https://provider.example.com/api/v2" className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:ring-2 focus:ring-[#9146FF] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">API Key</label>
              <input type="password" placeholder="Enter provider API key" className="w-full px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:ring-2 focus:ring-[#9146FF] outline-none" />
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <button className="px-4 py-2 bg-[#9146FF] text-white font-bold rounded-lg text-sm hover:bg-[#7b3be6] transition-colors">
                Save API Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}