"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import Link from "next/link";

type PartnerTier = 'affiliate' | 'partner' | 'top_partner';

const partnerTierInfo = {
  affiliate: { label: 'Affiliate', subShare: 0.50, color: '#9146FF' },
  partner: { label: 'Partner', subShare: 0.60, color: '#22c55e' },
  top_partner: { label: 'Top Partner', subShare: 0.70, color: '#f59e0b' },
};

export default function EarningsCalculatorPage() {
  const [avgViewers, setAvgViewers] = useState<number>(150);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(20);
  const [tier1Subs, setTier1Subs] = useState<number>(100);
  const [tier2Subs, setTier2Subs] = useState<number>(10);
  const [tier3Subs, setTier3Subs] = useState<number>(5);
  const [bitsPerMonth, setBitsPerMonth] = useState<number>(5000);
  const [partnerTier, setPartnerTier] = useState<PartnerTier>('affiliate');
  const [adsPerHour, setAdsPerHour] = useState<number>(3);

  const [subRevenue, setSubRevenue] = useState(0);
  const [adRevenue, setAdRevenue] = useState(0);
  const [bitRevenue, setBitRevenue] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    const subShare = partnerTierInfo[partnerTier].subShare;
    
    // Sub prices: Tier 1 = $4.99, Tier 2 = $9.99, Tier 3 = $24.99
    const tier1Rev = tier1Subs * 4.99 * subShare;
    const tier2Rev = tier2Subs * 9.99 * subShare;
    const tier3Rev = tier3Subs * 24.99 * subShare;
    const subs = tier1Rev + tier2Rev + tier3Rev;
    
    // Ad Revenue: CPM varies by region ($2-$14), use conservative $3.50 average
    // Each ad break is ~30 seconds, so adsPerHour * 0.5 minutes of ads
    // Formula: (viewers * hours * ads_per_hour) / 1000 * CPM
    const hoursPerMonth = hoursPerWeek * 4.33;
    const cpm = 3.50;
    const ads = (avgViewers * hoursPerMonth * adsPerHour) / 1000 * cpm;

    // Bits: Streamers receive $0.01 per bit
    const bits = bitsPerMonth * 0.01;

    setSubRevenue(subs);
    setAdRevenue(ads);
    setBitRevenue(bits);
    setTotalRevenue(subs + ads + bits);
  }, [avgViewers, hoursPerWeek, tier1Subs, tier2Subs, tier3Subs, bitsPerMonth, partnerTier, adsPerHour]);

  const formatCurrency = (num: number) => {
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-12 pb-24">
      {/* Hero Section */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 text-white mb-6 shadow-lg shadow-green-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-zinc-900 dark:text-white">
          Twitch Earnings <span className="gradient-text">Calculator</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Estimate your potential Twitch income from Subscriptions, Ads, and Bits. See what you could earn as your channel grows.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
        
        {/* Left Side: Input Controls */}
        <div className="col-span-1 lg:col-span-7 space-y-6">
          {/* Partner Tier Selection */}
          <div className="bento-card p-6 lg:p-8">
            <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">Your Status</h2>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(partnerTierInfo) as PartnerTier[]).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setPartnerTier(tier)}
                  className={`p-4 rounded-xl border-2 transition-all text-center ${
                    partnerTier === tier 
                      ? 'border-[#9146FF] bg-[#9146FF]/10' 
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <div 
                    className="text-2xl font-bold mb-1"
                    style={{ color: partnerTierInfo[tier].color }}
                  >
                    {Math.round(partnerTierInfo[tier].subShare * 100)}%
                  </div>
                  <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    {partnerTierInfo[tier].label}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Sub share
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-zinc-500 mt-4">
              Affiliates get 50%, Partners 60%, and Top Partners (Premium tier) can negotiate up to 70%.
            </p>
          </div>

          {/* Viewer & Stream Stats */}
          <div className="bento-card p-6 lg:p-8">
            <h2 className="text-xl font-bold mb-6 text-zinc-900 dark:text-white">Stream Stats</h2>
            
            <div className="space-y-8">
              {/* Average Viewers */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Average Concurrent Viewers</label>
                  <span className="font-mono text-[#9146FF] font-bold text-lg">{avgViewers.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="10000" step="10"
                  value={avgViewers} 
                  onChange={(e) => setAvgViewers(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#9146FF]"
                />
                <p className="text-xs text-zinc-500 mt-2">Affects ad revenue and sponsor potential. 75+ required for Partner.</p>
              </div>

              {/* Hours Per Week */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Hours Streamed Per Week</label>
                  <span className="font-mono text-cyan-500 font-bold text-lg">{hoursPerWeek} hrs</span>
                </div>
                <input 
                  type="range" 
                  min="1" max="60" step="1"
                  value={hoursPerWeek} 
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <p className="text-xs text-zinc-500 mt-2">More hours = more ad impressions and sub opportunities.</p>
              </div>

              {/* Ads Per Hour */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Ad Breaks Per Hour</label>
                  <span className="font-mono text-purple-500 font-bold text-lg">{adsPerHour}</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="8" step="1"
                  value={adsPerHour} 
                  onChange={(e) => setAdsPerHour(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <p className="text-xs text-zinc-500 mt-2">Twitch requires Partners to run 3+ mins/hr. Affiliates can opt out.</p>
              </div>
            </div>
          </div>

          {/* Subscription Stats */}
          <div className="bento-card p-6 lg:p-8">
            <h2 className="text-xl font-bold mb-6 text-zinc-900 dark:text-white">Subscriptions</h2>
            
            <div className="space-y-6">
              {/* Tier 1 */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">
                    Tier 1 Subs <span className="text-zinc-400 font-normal">($4.99)</span>
                  </label>
                  <span className="font-mono text-pink-500 font-bold text-lg">{tier1Subs.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="5000" step="5"
                  value={tier1Subs} 
                  onChange={(e) => setTier1Subs(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>

              {/* Tier 2 */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">
                    Tier 2 Subs <span className="text-zinc-400 font-normal">($9.99)</span>
                  </label>
                  <span className="font-mono text-blue-500 font-bold text-lg">{tier2Subs.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="500" step="1"
                  value={tier2Subs} 
                  onChange={(e) => setTier2Subs(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>

              {/* Tier 3 */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">
                    Tier 3 Subs <span className="text-zinc-400 font-normal">($24.99)</span>
                  </label>
                  <span className="font-mono text-amber-500 font-bold text-lg">{tier3Subs.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" step="1"
                  value={tier3Subs} 
                  onChange={(e) => setTier3Subs(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Bits */}
          <div className="bento-card p-6 lg:p-8">
            <h2 className="text-xl font-bold mb-6 text-zinc-900 dark:text-white">Bits & Cheers</h2>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-bold text-zinc-700 dark:text-zinc-300">Bits Received Per Month</label>
                <span className="font-mono text-amber-500 font-bold text-lg">{bitsPerMonth.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="0" max="100000" step="500"
                value={bitsPerMonth} 
                onChange={(e) => setBitsPerMonth(Number(e.target.value))}
                className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <p className="text-xs text-zinc-500 mt-2">You earn $0.01 per bit cheered on your channel.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Results */}
        <div className="col-span-1 lg:col-span-5">
          <div className="bento-card p-6 lg:p-8 sticky top-24">
            <div className="bg-gradient-to-br from-[#9146FF]/10 via-transparent to-green-500/10 absolute inset-0 rounded-2xl pointer-events-none"></div>
            
            <div className="relative">
              <h3 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                Estimated Monthly Income
              </h3>
              <div className="text-5xl sm:text-6xl font-black text-zinc-900 dark:text-white mb-2 tracking-tighter">
                ${formatCurrency(totalRevenue)}
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
                ~${formatCurrency(totalRevenue * 12)}/year
              </p>

              {/* Revenue Breakdown */}
              <div className="space-y-4 mb-8 border-t border-zinc-200 dark:border-zinc-800 pt-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-pink-500"></span>
                    <div>
                      <span className="text-zinc-700 dark:text-zinc-300 font-semibold">Subscriptions</span>
                      <p className="text-xs text-zinc-500">{tier1Subs + tier2Subs + tier3Subs} total subs</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-zinc-900 dark:text-white">${formatCurrency(subRevenue)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-[#9146FF]"></span>
                    <div>
                      <span className="text-zinc-700 dark:text-zinc-300 font-semibold">Ad Revenue</span>
                      <p className="text-xs text-zinc-500">~$3.50 CPM average</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-zinc-900 dark:text-white">${formatCurrency(adRevenue)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                    <div>
                      <span className="text-zinc-700 dark:text-zinc-300 font-semibold">Bits</span>
                      <p className="text-xs text-zinc-500">{bitsPerMonth.toLocaleString()} bits</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-zinc-900 dark:text-white">${formatCurrency(bitRevenue)}</span>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-zinc-100 dark:bg-zinc-800/50 rounded-xl p-4 mb-6">
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  <strong>Note:</strong> This is an estimate based on publicly known Twitch payout structures. 
                  Actual earnings vary by region, audience demographics, and individual contracts. 
                  Does not include donations, sponsorships, or merchandise.
                </p>
              </div>

              {/* Upsell CTA */}
              <div className="bg-zinc-900 dark:bg-zinc-100 rounded-2xl p-6 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#9146FF]/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <h4 className="text-xl font-bold text-white dark:text-zinc-900 mb-2 relative z-10">
                  Want to increase these numbers?
                </h4>
                <p className="text-sm text-zinc-400 dark:text-zinc-600 mb-5 relative z-10">
                  Higher viewer counts unlock better CPMs, more subs, and sponsorship opportunities.
                </p>
                <Link href="/buy-viewers" className="relative z-10 block">
                  <Button 
                    size="lg" 
                    className="w-full font-bold h-12 text-md"
                    style={{ backgroundColor: '#9146FF', color: 'white' }}
                  >
                    Boost My Viewers
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
