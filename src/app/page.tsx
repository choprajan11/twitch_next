import { Button } from "@heroui/react";
import Link from "next/link";

const services = [
  {
    id: 1,
    name: "Twitch Followers",
    slug: "buy-followers",
    desc: "Get real, high-quality followers delivered instantly to your channel.",
    price: "From $2.99",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    ),
    color: "#ec4899",
    bgColor: "bg-pink-50 dark:bg-pink-950/30"
  },
  {
    id: 2,
    name: "Live Viewers",
    slug: "buy-viewers",
    desc: "Increase your concurrent viewers and rank higher in categories.",
    price: "From $4.99",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    ),
    color: "#9146FF",
    bgColor: "bg-purple-50 dark:bg-purple-950/30"
  },
  {
    id: 3,
    name: "Chat Engagement",
    slug: "buy-chatbot",
    desc: "Automated realistic chat keeps your stream lively and engaging.",
    price: "From $9.99",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
      </svg>
    ),
    color: "#06b6d4",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/30"
  },
  {
    id: 4,
    name: "Clip Views",
    slug: "buy-clip-views",
    desc: "Make your best moments go viral with high-quality views.",
    price: "From $1.99",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
      </svg>
    ),
    color: "#22c55e",
    bgColor: "bg-green-50 dark:bg-green-950/30"
  }
];

const stats = [
  { value: "50K+", label: "Happy Customers", color: "#9146FF" },
  { value: "10M+", label: "Followers Delivered", color: "#ec4899" },
  { value: "99.9%", label: "Uptime", color: "#22c55e" },
  { value: "24/7", label: "Support", color: "#06b6d4" }
];

const testimonials = [
  {
    name: "Alex Gaming",
    avatar: "AG",
    role: "Twitch Partner",
    text: "Went from 500 to 5K followers in a month. The quality is incredible!",
    color: "#9146FF"
  },
  {
    name: "Sarah Streams",
    avatar: "SS",
    role: "Variety Streamer",
    text: "The chat engagement service changed everything. My streams feel alive now.",
    color: "#ec4899"
  },
  {
    name: "Mike Pro",
    avatar: "MP",
    role: "Esports Player",
    text: "Fast delivery, real engagement. Best investment for my channel.",
    color: "#06b6d4"
  }
];

const steps = [
  {
    step: "01",
    title: "Choose Service",
    desc: "Select the service that fits your growth goals",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    )
  },
  {
    step: "02",
    title: "Enter Details",
    desc: "Provide your Twitch username and quantity",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    )
  },
  {
    step: "03",
    title: "Secure Payment",
    desc: "Pay safely with Stripe or cryptocurrency",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
        <line x1="1" y1="10" x2="23" y2="10"></line>
      </svg>
    )
  },
  {
    step: "04",
    title: "Watch It Grow",
    desc: "See results within minutes of purchase",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
        <polyline points="16 7 22 7 22 13"></polyline>
      </svg>
    )
  }
];

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section - Bento Grid Style */}
      <section className="w-full max-w-7xl mx-auto px-4 pt-8 pb-16 lg:pt-16 lg:pb-24">
        <div className="bento-grid grid-cols-1 lg:grid-cols-12 lg:grid-rows-[auto_auto_auto]">
          
          {/* Main Hero Card */}
          <div className="bento-card lg:col-span-8 lg:row-span-2 p-8 lg:p-12 relative overflow-hidden">
            <div className="absolute top-6 left-8 flex gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-400"></span>
              <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
              <span className="w-3 h-3 rounded-full bg-[#9146FF]"></span>
            </div>
            
            <div className="mt-8 lg:mt-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#9146FF]/10 border border-[#9146FF]/20 mb-6">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-sm font-semibold text-[#9146FF]">Trusted by 50,000+ Streamers</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 text-zinc-900 dark:text-white leading-[1.1]">
                Grow Your Twitch
                <br />
                <span className="gradient-text">Channel Instantly</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 max-w-xl mb-8 leading-relaxed">
                The most reliable platform to boost your Twitch presence. Get real followers, viewers, and engagement—fast and secure.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="#services">
                  <Button 
                    size="lg" 
                    style={{ backgroundColor: '#9146FF', color: 'white' }} 
                    variant="shadow" 
                    className="font-bold px-8 h-14 text-lg shadow-[#9146FF]/30 glow-animation"
                  >
                    Get Started
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button 
                    size="lg" 
                    variant="bordered" 
                    className="font-bold px-8 h-14 text-lg border-2 border-zinc-200 dark:border-zinc-700 hover:border-[#9146FF] transition-colors"
                  >
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Followers Stats Card */}
          <div className="bento-card lg:col-span-4 p-6 float-animation">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-pink-100 dark:bg-pink-950/50 flex items-center justify-center text-pink-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Total Followers</p>
                <p className="text-3xl font-bold text-zinc-900 dark:text-white stat-number">10,502</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-green-500 text-sm font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
              </svg>
              +2,340 this week
            </div>
          </div>

          {/* Live Viewers Card */}
          <div className="bento-card lg:col-span-4 p-6 float-animation-delayed">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/50 flex items-center justify-center text-red-500 relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse flex items-center justify-center">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                </span>
              </div>
              <div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Live Viewers</p>
                <p className="text-3xl font-bold text-zinc-900 dark:text-white stat-number">1,240</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded-full bg-red-100 dark:bg-red-950/50 text-red-500 text-xs font-bold">LIVE NOW</span>
              <span className="text-zinc-500 text-sm">Peak: 2,890</span>
            </div>
          </div>

          {/* Chat Preview Card */}
          <div className="bento-card lg:col-span-4 p-6 hidden lg:block">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Live Chat</span>
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#9146FF] to-cyan-400"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#9146FF]">StreamFan</span>
                    <span className="text-xs text-zinc-400">just now</span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">Amazing stream! 🔥</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400"></div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-pink-500">GameLover42</span>
                    <span className="text-xs text-zinc-400">2m ago</span>
                  </div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">Let&apos;s gooo! 🎮</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Badge Card */}
          <div className="bento-card lg:col-span-4 p-6 hidden lg:flex items-center gap-4 bg-gradient-to-br from-[#9146FF]/5 to-cyan-500/5">
            <div className="w-12 h-12 rounded-xl bg-[#9146FF] flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10H12V2z"></path>
                <path d="M12 2a10 10 0 0 1 10 10"></path>
                <circle cx="12" cy="12" r="6"></circle>
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-white">Smart Analytics</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Track your growth in real-time</p>
            </div>
          </div>

        </div>
      </section>

      {/* Services Section - Bento Grid */}
      <section id="services" className="w-full max-w-7xl mx-auto px-4 py-16 lg:py-24">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-[#9146FF]/10 text-[#9146FF] text-sm font-bold mb-4">
            Our Services
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-zinc-900 dark:text-white">
            Everything You Need to <span className="gradient-text">Grow</span>
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Premium services designed to help you reach Twitch Partner faster
          </p>
        </div>

        <div className="bento-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <Link href={`/${service.slug}`} key={service.id} className="block group">
              <div className={`bento-card h-full p-6 ${index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
                <div 
                  className={`w-14 h-14 rounded-2xl ${service.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  style={{ color: service.color }}
                >
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-white group-hover:text-[#9146FF] transition-colors">
                  {service.name}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4 text-sm leading-relaxed">
                  {service.desc}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#9146FF]">{service.price}</span>
                  <span className="text-zinc-400 group-hover:text-[#9146FF] group-hover:translate-x-1 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Section - Bento Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 py-16 lg:py-24">
        <div className="bento-grid grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="bento-card p-6 lg:p-8 text-center">
              <p 
                className="text-4xl lg:text-5xl font-extrabold mb-2 stat-number"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-16 lg:py-24">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-500 text-sm font-bold mb-4">
            How It Works
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-zinc-900 dark:text-white">
            Get Started in <span className="gradient-text">Minutes</span>
          </h2>
        </div>

        <div className="bento-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => (
            <div key={index} className="bento-card p-6 lg:p-8 relative group">
              <div className="absolute top-4 right-4 text-6xl font-black text-zinc-100 dark:text-zinc-800 group-hover:text-[#9146FF]/20 transition-colors">
                {item.step}
              </div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-[#9146FF]/10 flex items-center justify-center text-[#9146FF] mb-6 group-hover:bg-[#9146FF] group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-white">{item.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-16 lg:py-24">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-pink-500/10 text-pink-500 text-sm font-bold mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-zinc-900 dark:text-white">
            Loved by <span className="gradient-text">Streamers</span>
          </h2>
        </div>

        <div className="bento-grid grid-cols-1 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bento-card p-6 lg:p-8">
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: testimonial.color }}
                >
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-bold text-zinc-900 dark:text-white">{testimonial.name}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-16 lg:py-24">
        <div className="bento-card p-8 lg:p-16 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#9146FF]/10 via-transparent to-cyan-500/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#9146FF]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-zinc-900 dark:text-white">
              Ready to <span className="gradient-text">Level Up?</span>
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
              Join thousands of streamers who have transformed their Twitch channels with our premium services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#services">
                <Button 
                  size="lg" 
                  style={{ backgroundColor: '#9146FF', color: 'white' }} 
                  variant="shadow" 
                  className="font-bold px-10 h-14 text-lg shadow-[#9146FF]/30"
                >
                  Get Started Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button 
                  size="lg" 
                  variant="bordered" 
                  className="font-bold px-10 h-14 text-lg border-2 border-zinc-200 dark:border-zinc-700"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-6">
              Start for free. No credit card required.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
