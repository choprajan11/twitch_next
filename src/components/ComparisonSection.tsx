const features = [
  { text: "100% Real Users", icon: "users" },
  { text: "60-Second Delivery", icon: "zap" },
  { text: "Zero Drop Rate", icon: "shield" },
  { text: "No Password Required", icon: "lock" },
  { text: "24/7 Live Support", icon: "chat" },
  { text: "30-Day Refill Guarantee", icon: "refresh" },
];

const IconMap: Record<string, JSX.Element> = {
  users: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
  zap: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
  shield: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  lock: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
  chat: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>,
  refresh: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6" /><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M3 22v-6h6" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /></svg>,
};

export default function ComparisonSection() {
  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-16 lg:py-24">
      <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Left side - Text content */}
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-3xl lg:text-5xl font-black mb-6 text-zinc-900 dark:text-white leading-tight">
            Trusted by <span className="text-[#9146FF]">10,000+</span> Streamers Worldwide
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-xl">
            Join the community of creators who chose the safest and most reliable way to grow their Twitch presence.
          </p>
          
          {/* Feature pills */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            {features.map((feature, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-[#9146FF]/10 hover:text-[#9146FF] transition-colors"
              >
                <span className="text-[#9146FF]">{IconMap[feature.icon]}</span>
                {feature.text}
              </div>
            ))}
          </div>
        </div>

        {/* Right side - Stats */}
        <div className="flex-shrink-0">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-[#9146FF]/10 to-transparent">
              <div className="text-4xl lg:text-5xl font-black text-[#9146FF] mb-1">2M+</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">Followers Delivered</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-transparent">
              <div className="text-4xl lg:text-5xl font-black text-cyan-500 mb-1">99%</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">Satisfaction Rate</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-green-500/10 to-transparent">
              <div className="text-4xl lg:text-5xl font-black text-green-500 mb-1">60s</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">Avg. Start Time</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 to-transparent">
              <div className="text-4xl lg:text-5xl font-black text-pink-500 mb-1">0%</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400 font-medium">Drop Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
