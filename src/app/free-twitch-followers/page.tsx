import Link from "next/link";
import FreeFollowersForm from "./FreeFollowersForm";

export const metadata = {
  title: "Get Free Twitch Followers Instantly - GrowTwitch",
  description: "Try our premium Twitch follower delivery service absolutely free. No password required, instant start.",
};

export default function FreeFollowersPage() {
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
          <FreeFollowersForm />

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