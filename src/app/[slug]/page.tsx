import { notFound } from "next/navigation";
import { Button, Input } from "@heroui/react";
import Link from "next/link";

// Mock data mimicking the database
const mockServices = [
  {
    id: "1",
    name: "Twitch Followers",
    slug: "buy-followers",
    headline: "Buy Twitch Followers",
    desc: "Get real, high-quality followers delivered instantly to your channel. Boost your credibility and rank higher in the Twitch directory.",
    icon: "📈",
    plans: [
      { id: "100_followers", name: "100 Followers", price: 2.99, quantity: 100 },
      { id: "500_followers", name: "500 Followers", price: 12.99, quantity: 500, popular: true },
      { id: "1000_followers", name: "1000 Followers", price: 22.99, quantity: 1000 },
      { id: "5000_followers", name: "5000 Followers", price: 89.99, quantity: 5000 },
    ]
  },
  {
    id: "2",
    name: "Twitch Viewers",
    slug: "buy-viewers",
    headline: "Buy Live Twitch Viewers",
    desc: "Increase your live concurrent viewers instantly. Great for ranking higher in your game category and attracting organic traffic.",
    icon: "👁️",
    plans: [
      { id: "50_viewers", name: "50 Viewers (1 Hour)", price: 4.99, quantity: 50 },
      { id: "100_viewers", name: "100 Viewers (1 Hour)", price: 8.99, quantity: 100, popular: true },
      { id: "500_viewers", name: "500 Viewers (1 Hour)", price: 34.99, quantity: 500 },
    ]
  },
  {
    id: "3",
    name: "Twitch Chatbot",
    slug: "buy-chatbot",
    headline: "Buy Twitch Chat Engagement",
    desc: "Automated, realistic chat interaction for your stream. Keeps your audience engaged and makes your stream look highly active.",
    icon: "💬",
    plans: [
      { id: "basic_chat", name: "Basic Chat (1 Hour)", price: 9.99, quantity: 1 },
      { id: "pro_chat", name: "Pro Chat (3 Hours)", price: 24.99, quantity: 3, popular: true },
    ]
  },
  {
    id: "4",
    name: "Clip Views",
    slug: "buy-clip-views",
    headline: "Buy Twitch Clip Views",
    desc: "Make your best moments go viral with high-quality clip views. Push your clips to the top of the category page.",
    icon: "🎬",
    plans: [
      { id: "1000_clip_views", name: "1000 Clip Views", price: 1.99, quantity: 1000 },
      { id: "5000_clip_views", name: "5000 Clip Views", price: 7.99, quantity: 5000, popular: true },
    ]
  },
  {
    id: "5",
    name: "Video Views (VOD)",
    slug: "buy-video-views",
    headline: "Buy Twitch VOD Views",
    desc: "Increase the view count on your past broadcasts and highlights to show sponsors your channel has consistent traffic.",
    icon: "📺",
    plans: [
      { id: "1000_vod_views", name: "1000 Video Views", price: 2.99, quantity: 1000 },
      { id: "5000_vod_views", name: "5000 Video Views", price: 11.99, quantity: 5000, popular: true },
    ]
  }
];

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const service = mockServices.find(s => s.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-12 pb-24">
      {/* Header Section */}
      <div className="mb-16 text-center max-w-3xl mx-auto relative">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#9146FF]/10 text-4xl mb-6">
          {service.icon}
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-zinc-900 dark:text-white">
          {service.headline.split(' ').map((word, i, arr) => 
            i === arr.length - 1 ? <span key={i} className="gradient-text"> {word}</span> : word + ' '
          )}
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {service.desc}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Plans Selection */}
        <div className="col-span-1 lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Select a Package</h2>
          </div>
          
          <div className="bento-grid grid-cols-1 sm:grid-cols-2">
            {service.plans.map((plan) => (
              <div key={plan.id} className={`bento-card relative p-6 flex flex-col justify-between ${plan.popular ? 'border-[#9146FF] shadow-[0_0_20px_rgba(145,70,255,0.15)] dark:shadow-[0_0_30px_rgba(145,70,255,0.1)]' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#9146FF] to-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}
                
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-3xl font-extrabold text-[#9146FF]">${plan.price.toFixed(2)}</span>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">one-time</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <Link href={`/checkout?service=${service.slug}&plan=${plan.id}`} className="w-full block">
                    <Button 
                      className="w-full font-bold h-12 text-md"
                      style={plan.popular ? { backgroundColor: '#9146FF', color: 'white' } : {}}
                      variant={plan.popular ? "solid" : "flat"}
                      color="secondary"
                    >
                      Buy Now
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Features */}
        <div className="col-span-1 lg:col-span-4">
          <div className="bento-card p-6 lg:p-8 sticky top-24">
            <h3 className="text-xl font-bold mb-6 text-zinc-900 dark:text-white">Why Choose Us?</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-sm mb-1">Instant Delivery</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Your order begins processing the moment payment is confirmed.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-[#9146FF]/10 flex items-center justify-center flex-shrink-0 text-[#9146FF]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-sm mb-1">100% Secure & Private</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">We never ask for your password. All payments are encrypted via Stripe.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0 text-cyan-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <div>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-sm mb-1">30-Day Refill Guarantee</h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">If any numbers drop within 30 days, we will automatically refill them.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center justify-center gap-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#6772E5"><path d="M11.996 0C5.371 0 .002 5.366.002 11.993c0 6.623 5.369 11.993 11.994 11.993 6.623 0 11.992-5.37 11.992-11.993C23.988 5.366 18.619 0 11.996 0zm5.833 8.356c-.05.518-.328 1.905-.623 2.94-1.298 4.542-4.502 6.666-8.981 6.666-3.155 0-5.467-1.396-6.421-3.665-.24-.567-.367-1.196-.367-1.84 0-.154.01-.309.027-.463l.365-2.222c.07-.428.188-1.118.272-1.579.176-1.07.411-2.434.469-2.731.065-.333.197-.481.385-.481h.831c.361 0 .541.248.601.554l.011.054c.054.269.213 1.151.343 1.942l.275 1.638c.159.95.318 1.914.862 2.508.435.475 1.059.721 1.88.721 1.83 0 3.298-1.258 3.791-3.136.216-.826.43-1.879.544-2.613.064-.412.128-.84.171-1.12.062-.41.282-.544.601-.544h.798c.451 0 .618.303.541.776z"/></svg>
                <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Secured by Stripe</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}