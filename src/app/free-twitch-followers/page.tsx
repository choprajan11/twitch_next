import { Button, Input } from "@heroui/react";
import Link from "next/link";

export const metadata = {
  title: "Get Free Twitch Followers Instantly - GrowTwitch",
  description: "Try our premium Twitch follower delivery service absolutely free. No password required, instant start.",
};

export default function FreeFollowersPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-12 pb-24">
      {/* Header Section */}
      <div className="mb-12 text-center max-w-3xl mx-auto relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-pulse"></span>
          <span className="text-sm font-semibold text-pink-500">Limited Time Offer</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-zinc-900 dark:text-white">
          Get <span className="gradient-text">10 Free</span> Twitch Followers
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
          See the quality of our service for yourself. Enter your Twitch username below to receive 10 high-quality followers instantly, absolutely free. No credit card required.
        </p>
      </div>

      <div className="max-w-xl mx-auto">
        <div className="bento-card p-6 lg:p-10 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#9146FF]/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6 text-center text-zinc-900 dark:text-white">Claim Your Free Followers</h2>
            
            <form className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Twitch Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">@</span>
                  <Input 
                    id="username"
                    name="username"
                    placeholder="your_channel_name" 
                    variant="bordered"
                    size="lg"
                    classNames={{
                      input: "pl-2 text-lg",
                      inputWrapper: "h-14 bg-white dark:bg-zinc-900/50 border-2 border-zinc-200 dark:border-zinc-800 hover:border-[#9146FF] focus-within:!border-[#9146FF]"
                    }}
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-2">Make sure your channel is public.</p>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">Email Address</label>
                <Input 
                  id="email"
                  type="email"
                  name="email"
                  placeholder="hello@example.com" 
                  variant="bordered"
                  size="lg"
                  classNames={{
                    input: "text-lg",
                    inputWrapper: "h-14 bg-white dark:bg-zinc-900/50 border-2 border-zinc-200 dark:border-zinc-800 hover:border-[#9146FF] focus-within:!border-[#9146FF]"
                  }}
                />
                <p className="text-xs text-zinc-500 mt-2">We'll send your delivery confirmation here.</p>
              </div>

              <Button 
                type="button"
                size="lg" 
                style={{ backgroundColor: '#9146FF', color: 'white' }} 
                variant="shadow" 
                className="w-full font-bold h-14 text-lg shadow-[#9146FF]/30 mt-4"
              >
                Send My Free Followers
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
              <p>By claiming, you agree to our <Link href="/terms" className="text-[#9146FF] hover:underline">Terms of Service</Link>.</p>
              <p className="mt-2">Only one free trial per Twitch channel / IP address.</p>
            </div>
          </div>
        </div>

        {/* Social Proof for the free page */}
        <div className="mt-12 text-center">
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-6">Over 10,000+ Free Trials Delivered</p>
          <div className="flex justify-center gap-2">
             {[...Array(5)].map((_, i) => (
              <div key={i} className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}