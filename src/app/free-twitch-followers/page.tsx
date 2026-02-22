import { Button } from "@heroui/react";
import Link from "next/link";

export const metadata = {
  title: "Get Free Twitch Followers Instantly - GrowTwitch",
  description: "Try our premium Twitch follower delivery service absolutely free. No password required, instant start.",
};

export default function FreeFollowersPage() {
  const inputClass = "w-full h-12 px-4 bg-zinc-50 dark:bg-zinc-800/50 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl text-base text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none transition-colors hover:border-[#9146FF]/50 focus:border-[#9146FF] focus:ring-2 focus:ring-[#9146FF]/20";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-12 pb-24">
      {/* Header */}
      <div className="text-center mb-12 max-w-3xl mx-auto">
        <span className="inline-block px-4 py-2 rounded-full bg-pink-500/10 text-pink-500 text-sm font-bold mb-4">
          Free Trial
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-zinc-900 dark:text-white">
          Get <span className="gradient-text">10 Free</span> Twitch Followers
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          See the quality of our service for yourself. No credit card required.
        </p>
      </div>

      {/* Form Card */}
      <div className="max-w-xl mx-auto">
        <div className="bento-card p-6 lg:p-8">
          <form className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Twitch Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                placeholder="your_channel_name"
                className={inputClass}
              />
              <p className="text-xs text-zinc-500 mt-2">Make sure your channel is public.</p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="hello@example.com"
                className={inputClass}
              />
              <p className="text-xs text-zinc-500 mt-2">We&apos;ll send your delivery confirmation here.</p>
            </div>

            <Button 
              type="submit"
              size="lg" 
              className="w-full h-12 font-bold text-base"
              style={{ backgroundColor: "#9146FF", color: "white" }}
            >
              Send My Free Followers
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-500 dark:text-zinc-400">
            <p>By claiming, you agree to our <Link href="/terms" className="text-[#9146FF] hover:underline">Terms of Service</Link>.</p>
            <p className="mt-1">Only one free trial per Twitch channel / IP address.</p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-10 text-center">
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4">Over 10,000+ Free Trials Delivered</p>
          <div className="flex justify-center -space-x-2">
            {['from-[#9146FF] to-purple-600', 'from-pink-500 to-rose-500', 'from-cyan-500 to-blue-500', 'from-green-500 to-emerald-500', 'from-orange-500 to-amber-500'].map((gradient, i) => (
              <div key={i} className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} border-2 border-white dark:border-zinc-900 flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                {['A', 'S', 'M', 'K', 'J'][i]}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}