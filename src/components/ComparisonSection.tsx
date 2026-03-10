const comparisonFeatures = [
  { feature: "100% Real Users", us: true, others: false },
  { feature: "Delivery Under 60 Seconds", us: true, others: false },
  { feature: "No Password Required", us: true, others: false },
  { feature: "30-Day Refill Guarantee", us: true, others: false },
  { feature: "24/7 Live Support", us: true, others: "partial" as const },
  { feature: "Zero Drop Rate", us: true, others: false },
  { feature: "Money-Back Guarantee", us: true, others: false },
  { feature: "Gradual Natural Delivery", us: true, others: false },
];

function CheckIcon() {
  return (
    <div className="w-8 h-8 rounded-full bg-green-500/15 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    </div>
  );
}

function XIcon() {
  return (
    <div className="w-8 h-8 rounded-full bg-red-500/15 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </div>
  );
}

function PartialIcon() {
  return (
    <div className="w-8 h-8 rounded-full bg-amber-500/15 flex items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </div>
  );
}

export default function ComparisonSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16 lg:py-24">
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-2 rounded-full bg-[#9146FF]/10 text-[#9146FF] text-sm font-bold mb-4">
          Why Choose Us
        </span>
        <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-zinc-900 dark:text-white">
          GrowTwitch vs <span className="gradient-text">The Rest</span>
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          See why 50,000+ streamers trust us over the competition
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bento-card overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-6 py-4 bg-zinc-50/80 dark:bg-zinc-800/30 border-b border-zinc-200/50 dark:border-zinc-700/50">
            <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Feature</span>
            <span className="w-24 text-center text-sm font-bold text-[#9146FF] uppercase tracking-wider">Us</span>
            <span className="w-24 text-center text-sm font-bold text-zinc-400 uppercase tracking-wider">Others</span>
          </div>

          {/* Table Rows */}
          {comparisonFeatures.map((item, index) => (
            <div
              key={index}
              className={`grid grid-cols-[1fr_auto_auto] items-center gap-4 px-6 py-4 transition-colors hover:bg-[#9146FF]/[0.03] ${
                index < comparisonFeatures.length - 1 ? 'border-b border-zinc-100 dark:border-zinc-800/50' : ''
              }`}
            >
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {item.feature}
              </span>
              <div className="w-24 flex justify-center">
                <CheckIcon />
              </div>
              <div className="w-24 flex justify-center">
                {item.others === "partial" ? <PartialIcon /> : <XIcon />}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="text-center p-5 rounded-2xl bg-[#9146FF]/[0.06] border border-[#9146FF]/10">
            <div className="text-2xl lg:text-3xl font-black text-[#9146FF] mb-0.5 stat-number">50K+</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Happy Streamers</div>
          </div>
          <div className="text-center p-5 rounded-2xl bg-cyan-500/[0.06] border border-cyan-500/10">
            <div className="text-2xl lg:text-3xl font-black text-cyan-500 mb-0.5 stat-number">99.9%</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Uptime</div>
          </div>
          <div className="text-center p-5 rounded-2xl bg-green-500/[0.06] border border-green-500/10">
            <div className="text-2xl lg:text-3xl font-black text-green-500 mb-0.5 stat-number">&lt;60s</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Avg. Start Time</div>
          </div>
          <div className="text-center p-5 rounded-2xl bg-pink-500/[0.06] border border-pink-500/10">
            <div className="text-2xl lg:text-3xl font-black text-pink-500 mb-0.5 stat-number">24/7</div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Live Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}
