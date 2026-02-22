"use client";

import { useState, useEffect } from "react";
import { Button, Input } from "@heroui/react";
import Link from "next/link";

export default function EarningsCalculatorPage() {
  // Calculator State
  const [avgViewers, setAvgViewers] = useState<number>(150);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(20);
  const [tier1Subs, setTier1Subs] = useState<number>(100);
  const [bitsPerMonth, setBitsPerMonth] = useState<number>(5000);

  // Results State
  const [subRevenue, setSubRevenue] = useState(0);
  const [adRevenue, setAdRevenue] = useState(0);
  const [bitRevenue, setBitRevenue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  // Live calculation effect
  useEffect(() => {
    // 1. Sub Revenue (Assuming a standard 50/50 split on a $4.99 sub = ~$2.50)
    const subs = tier1Subs * 2.50;
    
    // 2. Ad Revenue Estimate
    // Avg 3 mins of ads per hour * hours streamed per month
    // Estimate a $3.50 CPM (Cost Per Mille / 1000 viewers)
    const hoursPerMonth = hoursPerWeek * 4.33; 
    const adMinsPerHour = 3;
    const adImpressions = (avgViewers * adMinsPerHour * hoursPerMonth);
    const ads = (adImpressions / 1000) * 3.50;

    // 3. Bit Revenue (1 Bit = $0.01)
    const bits = bitsPerMonth * 0.01;

    setSubRevenue(subs);
    setAdRevenue(ads);
    setBitRevenue(bits);
    setTotalRevenue(subs + ads + bits);
  }, [avgViewers, hoursPerWeek, tier1Subs, bitsPerMonth]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-12 pb-24">
      {/* Hero Section */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/10 text-green-500 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-zinc-900 dark:text-white">
          Twitch Earnings <span className="gradient-text">Calculator</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
          Estimate exactly how much money you could be making on Twitch from Subscriptions, Ads, and Bits. See what your potential income looks like as your channel grows!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
        
        {/* Left Side: The Input Controls */}
        <div className="col-span-1 lg:col-span-7 space-y-6">
          <div className="bento-card p-6 lg:p-8">
            <h2 className="text-2xl font-bold mb-6 text-zinc-900 dark:text-white">Adjust Your Stats</h2>
            
            <div className="space-y-8">
              {/* Average Viewers */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Average Concurrent Viewers</label>
                  <span className="font-mono text-[#9146FF] font-bold">{avgViewers.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="10000" step="10"
                  value={avgViewers} 
                  onChange={(e) => setAvgViewers(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#9146FF]"
                />
                <p className="text-xs text-zinc-500 mt-2">Drives your Ad Revenue and sponsor potential.</p>
              </div>

              {/* Tier 1 Subs */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Active Subscribers (Tier 1)</label>
                  <span className="font-mono text-pink-500 font-bold">{tier1Subs.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="5000" step="5"
                  value={tier1Subs} 
                  onChange={(e) => setTier1Subs(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
                <p className="text-xs text-zinc-500 mt-2">Assuming a standard 50/50 revenue split with Twitch.</p>
              </div>

              {/* Hours Streamed per week */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Hours Streamed Per Week</label>
                  <span className="font-mono text-cyan-500 font-bold">{hoursPerWeek} hrs</span>
                </div>
                <input 
                  type="range" 
                  min="1" max="100" step="1"
                  value={hoursPerWeek} 
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>

              {/* Bits Per Month */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Bits Received Per Month</label>
                  <span className="font-mono text-amber-500 font-bold">{bitsPerMonth.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100000" step="500"
                  value={bitsPerMonth} 
                  onChange={(e) => setBitsPerMonth(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: The Results Output */}
        <div className="col-span-1 lg:col-span-5">
          <div className="bento-card p-6 lg:p-8 sticky top-24 bg-gradient-to-b from-[#9146FF]/5 to-transparent">
            <h3 className="text-lg font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">Estimated Monthly Income</h3>
            <div className="text-5xl sm:text-6xl font-black text-zinc-900 dark:text-white mb-8 tracking-tighter">
              ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>

            <div className="space-y-4 mb-8 border-t border-zinc-200 dark:border-zinc-800 pt-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-pink-500"></span>
                  <span className="text-zinc-700 dark:text-zinc-300 font-semibold">Subscriptions</span>
                </div>
                <span className="font-mono font-bold text-zinc-900 dark:text-white">${subRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#9146FF]"></span>
                  <span className="text-zinc-700 dark:text-zinc-300 font-semibold">Ad Revenue</span>
                </div>
                <span className="font-mono font-bold text-zinc-900 dark:text-white">${adRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span className="text-zinc-700 dark:text-zinc-300 font-semibold">Twitch Bits</span>
                </div>
                <span className="font-mono font-bold text-zinc-900 dark:text-white">${bitRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Strategic Lead Gen Upsell */}
            <div className="mt-8 bg-zinc-900 dark:bg-zinc-100 rounded-xl p-6 text-center shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#9146FF]/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h4 className="text-xl font-bold text-white dark:text-zinc-900 mb-2 relative z-10">Want to double this number?</h4>
              <p className="text-sm text-zinc-400 dark:text-zinc-600 mb-6 relative z-10">
                A higher average viewer count unlocks better sponsorships and organic discovery. Boost your numbers instantly.
              </p>
              <Link href="/buy-viewers" className="relative z-10 block">
                <Button 
                  size="lg" 
                  className="w-full font-bold h-12 text-md"
                  style={{ backgroundColor: '#9146FF', color: 'white' }}
                >
                  Increase My Viewers
                </Button>
              </Link>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}