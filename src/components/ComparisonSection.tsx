const comparisonData = [
  {
    feature: "Real Followers",
    us: "100% Real Users",
    usIcon: "check",
    others: "Often Bots",
    othersIcon: "x"
  },
  {
    feature: "Delivery Speed",
    us: "60-Second Start",
    usIcon: "check",
    others: "Hours or Days",
    othersIcon: "x"
  },
  {
    feature: "Drop Rate",
    us: "0% Guaranteed",
    usIcon: "check",
    others: "High Drop Rates",
    othersIcon: "x"
  },
  {
    feature: "Password Required",
    us: "Never Required",
    usIcon: "check",
    others: "Often Required",
    othersIcon: "x"
  },
  {
    feature: "Support",
    us: "24/7 Live Chat",
    usIcon: "check",
    others: "Limited/None",
    othersIcon: "x"
  },
  {
    feature: "Refill Guarantee",
    us: "30-Day Free Refills",
    usIcon: "check",
    others: "No Guarantee",
    othersIcon: "x"
  },
  {
    feature: "Payment Options",
    us: "Cards, PayPal, Crypto",
    usIcon: "check",
    others: "Limited Options",
    othersIcon: "x"
  },
  {
    feature: "Account Safety",
    us: "100% Safe",
    usIcon: "check",
    others: "Risk of Ban",
    othersIcon: "x"
  }
];

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default function ComparisonSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16 lg:py-24">
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-2 rounded-full bg-[#9146FF]/10 text-[#9146FF] text-sm font-bold mb-4">
          Why Choose Us
        </span>
        <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-zinc-900 dark:text-white">
          How We <span className="gradient-text">Compare</span>
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          See why thousands of streamers trust us over the competition
        </p>
      </div>

      <div className="bento-card overflow-hidden max-w-4xl mx-auto">
        {/* Header Row */}
        <div className="grid grid-cols-3 bg-[#9146FF]/5 dark:bg-[#9146FF]/10">
          <div className="p-4 lg:p-6 font-bold text-zinc-900 dark:text-white">
            Feature
          </div>
          <div className="p-4 lg:p-6 text-center">
            <div className="inline-flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9146FF] to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                G
              </div>
              <span className="font-bold text-[#9146FF]">GrowTwitch</span>
            </div>
          </div>
          <div className="p-4 lg:p-6 text-center font-bold text-zinc-500 dark:text-zinc-400">
            Others
          </div>
        </div>

        {/* Comparison Rows */}
        {comparisonData.map((row, index) => (
          <div
            key={index}
            className={`grid grid-cols-3 ${
              index !== comparisonData.length - 1
                ? "border-b border-zinc-100 dark:border-zinc-800"
                : ""
            }`}
          >
            <div className="p-4 lg:p-6 font-medium text-zinc-900 dark:text-white text-sm lg:text-base">
              {row.feature}
            </div>
            <div className="p-4 lg:p-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <CheckIcon />
                <span className="text-sm lg:text-base text-zinc-700 dark:text-zinc-300 hidden sm:inline">
                  {row.us}
                </span>
              </div>
            </div>
            <div className="p-4 lg:p-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <XIcon />
                <span className="text-sm lg:text-base text-zinc-500 dark:text-zinc-400 hidden sm:inline">
                  {row.others}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
