export const metadata = { title: "Settings - GrowTwitch Admin" };

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Admin Settings</h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">Manage your platform integrations, API keys, and business details.</p>
      </div>

      <div className="space-y-4">
        <div className="bento-card-static p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6 border-b border-[rgba(145,70,255,0.08)] pb-4">
            <div className="w-8 h-8 rounded-xl bg-[#6772E5]/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#6772E5">
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">Stripe Integration</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Publishable Key</label>
              <input type="text" value="pk_live_************************" disabled className="w-full px-4 py-2.5 bg-[var(--bento-bg)] border border-[rgba(145,70,255,0.08)] rounded-xl text-sm text-zinc-500 font-mono" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Secret Key</label>
              <input type="password" value="sk_live_************************" disabled className="w-full px-4 py-2.5 bg-[var(--bento-bg)] border border-[rgba(145,70,255,0.08)] rounded-xl text-sm text-zinc-500 font-mono" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Webhook Secret</label>
              <input type="password" value="whsec_************************" disabled className="w-full px-4 py-2.5 bg-[var(--bento-bg)] border border-[rgba(145,70,255,0.08)] rounded-xl text-sm text-zinc-500 font-mono" />
              <p className="text-xs text-zinc-500 mt-2">Required to receive payment success events from Stripe to fulfill orders automatically.</p>
            </div>
          </div>
        </div>

        <div className="bento-card-static p-6 lg:p-8">
          <div className="flex items-center gap-3 mb-6 border-b border-[rgba(145,70,255,0.08)] pb-4">
            <div className="w-8 h-8 rounded-xl bg-[#9146FF]/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9146FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m15 9-6 6" /><path d="M9 9h.01" /><path d="M15 15h.01" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-white">Fulfillment API Provider</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">API Endpoint URL</label>
              <input type="text" placeholder="https://provider.example.com/api/v2" className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[rgba(145,70,255,0.1)] rounded-xl text-sm focus:ring-2 focus:ring-[#9146FF]/30 focus:border-[#9146FF]/30 outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">API Key</label>
              <input type="password" placeholder="Enter provider API key" className="w-full px-4 py-2.5 bg-[var(--card-bg)] border border-[rgba(145,70,255,0.1)] rounded-xl text-sm focus:ring-2 focus:ring-[#9146FF]/30 focus:border-[#9146FF]/30 outline-none transition-all" />
            </div>
            <div className="flex gap-2 justify-end mt-2">
              <button className="px-5 py-2.5 bg-[#9146FF] text-white font-bold rounded-xl text-sm hover:bg-[#7b3be6] transition-colors shadow-lg shadow-[#9146FF]/20">
                Save API Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
