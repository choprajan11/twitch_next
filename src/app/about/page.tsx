import Link from "next/link";
import { Button } from "@heroui/react";

export const metadata = {
  title: "About Us - GrowTwitch",
  description: "Learn about GrowTwitch - the most trusted platform for Twitch growth services.",
};

const stats = [
  { value: "50K+", label: "Happy Customers" },
  { value: "10M+", label: "Followers Delivered" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

const team = [
  {
    name: "The Vision",
    role: "Our Mission",
    description: "We believe every streamer deserves a chance to be seen. Our mission is to help creators reach their potential by providing safe, reliable growth services.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>
    ),
    color: "#9146FF",
  },
  {
    name: "The Promise",
    role: "Our Values",
    description: "Transparency, security, and customer satisfaction are at the core of everything we do. We never compromise on quality or safety.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <polyline points="9 12 11 14 15 10"></polyline>
      </svg>
    ),
    color: "#22c55e",
  },
  {
    name: "The Support",
    role: "Always Here",
    description: "Our dedicated support team is available 24/7 to help you with any questions or concerns. We treat every customer like family.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    ),
    color: "#06b6d4",
  },
];

export default function AboutPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-12 pb-24">
      {/* Hero */}
      <div className="text-center mb-20 max-w-3xl mx-auto">
        <span className="inline-block px-4 py-2 rounded-full bg-[#9146FF]/10 text-[#9146FF] text-sm font-bold mb-4">
          About Us
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-zinc-900 dark:text-white">
          Helping Streamers <span className="gradient-text">Succeed</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Since 2020, we&apos;ve helped over 50,000 streamers grow their channels with safe, 
          reliable services. We&apos;re passionate about the streaming community and committed 
          to helping creators reach their goals.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
        {stats.map((stat, index) => (
          <div key={index} className="bento-card p-6 lg:p-8 text-center">
            <p className="text-3xl lg:text-4xl font-extrabold text-[#9146FF] mb-2">
              {stat.value}
            </p>
            <p className="text-zinc-600 dark:text-zinc-400 font-medium text-sm">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Our Story */}
      <div className="bento-card p-8 lg:p-12 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-500 text-sm font-bold mb-4">
              Our Story
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white mb-6">
              Built by Streamers, for Streamers
            </h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                GrowTwitch was founded by a group of passionate streamers who understood 
                the challenges of building an audience from scratch. We knew how hard it 
                was to get noticed in a sea of content creators.
              </p>
              <p>
                After years of trial and error, we developed methods to help streamers 
                gain visibility safely and effectively. What started as helping friends 
                grew into a platform trusted by thousands worldwide.
              </p>
              <p>
                Today, we&apos;re proud to be the most trusted name in Twitch growth services, 
                with a 99.9% satisfaction rate and zero account bans.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#9146FF]/20 to-cyan-500/20 flex items-center justify-center">
              <div className="w-32 h-32 rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="currentColor" className="text-[#9146FF]">
                  <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            What Sets Us Apart
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Our core values guide everything we do
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {team.map((item, index) => (
            <div key={index} className="bento-card p-6 lg:p-8 text-center">
              <div
                className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: `${item.color}15`, color: item.color }}
              >
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                {item.name}
              </h3>
              <p className="text-sm text-[#9146FF] font-semibold mb-4">{item.role}</p>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bento-card p-8 lg:p-16 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#9146FF]/10 via-transparent to-cyan-500/10"></div>
        <div className="relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-white mb-4">
            Ready to Grow Your Channel?
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
            Join thousands of successful streamers who trust GrowTwitch.
          </p>
          <Link href="/#services">
            <Button
              size="lg"
              style={{ backgroundColor: "#9146FF", color: "white" }}
              variant="primary"
              className="font-bold px-10 h-14 text-lg shadow-[#9146FF]/30"
            >
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
