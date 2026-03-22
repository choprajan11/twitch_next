const features = [
  {
    title: "Instant Delivery",
    description: "Orders begin processing within 60 seconds. Watch your channel grow in real-time.",
    stats: [
      { value: "60s", label: "Start Time" },
      { value: "99.9%", label: "Success Rate" }
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    ),
    color: "#f59e0b",
    bgColor: "bg-amber-500/10"
  },
  {
    title: "100% Real Followers",
    description: "No bots, no fake accounts. Only genuine profiles that boost your credibility.",
    stats: [
      { value: "0%", label: "Drop Rate" },
      { value: "100%", label: "Real Users" }
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    color: "#22c55e",
    bgColor: "bg-green-500/10"
  },
  {
    title: "24/7 Premium Support",
    description: "Our team is always available via live chat and email to assist you.",
    stats: [
      { value: "5min", label: "Response Time" },
      { value: "24/7", label: "Availability" }
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    ),
    color: "#06b6d4",
    bgColor: "bg-cyan-500/10"
  },
  {
    title: "Money-Back Guarantee",
    description: "100% refund if delivery doesn't start within 2 hours. No questions asked.",
    stats: [
      { value: "30-Day", label: "Refill" },
      { value: "100%", label: "Refund" }
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <polyline points="9 12 11 14 15 10"></polyline>
      </svg>
    ),
    color: "#9146FF",
    bgColor: "bg-[#9146FF]/10"
  }
];

export default function FeaturesSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16 lg:py-24">
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-2 rounded-full bg-amber-500/10 text-amber-500 text-sm font-bold mb-4">
          Our Guarantees
        </span>
        <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-zinc-900 dark:text-white">
          Why Streamers <span className="gradient-text">Trust Us</span>
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
          Every order is backed by real guarantees — not empty promises
        </p>
      </div>

      <div className="bento-grid grid-cols-1 md:grid-cols-2">
        {features.map((feature, index) => (
          <div key={index} className="bento-card p-6 lg:p-8 group">
            <div className="flex items-start gap-5">
              <div 
                className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                style={{ color: feature.color }}
              >
                {feature.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-4">
                  {feature.description}
                </p>
                <div className="flex gap-6">
                  {feature.stats.map((stat, statIndex) => (
                    <div key={statIndex}>
                      <p 
                        className="text-2xl font-extrabold stat-number"
                        style={{ color: feature.color }}
                      >
                        {stat.value}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
