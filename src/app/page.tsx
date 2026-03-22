import Link from "next/link";
import { Button } from "@heroui/react";
import { HeroFloatingElements } from "@/components/HeroFloatingElements";
import ServicesGrid from "@/components/ServicesGrid";
import FeaturesSection from "@/components/FeaturesSection";
import ComparisonSection from "@/components/ComparisonSection";
import FAQSection from "@/components/FAQSection";
import { FaStripe, FaCcVisa, FaCcMastercard, FaBitcoin, FaLock, FaShieldAlt } from "react-icons/fa";

const testimonials = [
  {
    name: "Jordan Rivera",
    avatar: "JR",
    role: "Twitch Partner",
    metric: "800 → 12K followers",
    text: "The gradual delivery made my growth look completely organic. Reached Partner status in just 2 months after years of grinding.",
    rating: 5,
    color: "#9146FF"
  },
  {
    name: "Priya Sharma",
    avatar: "PS",
    role: "Variety Streamer",
    metric: "2x avg. watch time",
    text: "Chat engagement service was a game-changer. Active chat makes new viewers stick around — my average retention doubled within three weeks.",
    rating: 5,
    color: "#ec4899"
  },
  {
    name: "Marcus Chen",
    avatar: "MC",
    role: "Esports Content Creator",
    metric: "Landed first sponsor",
    text: "Was skeptical at first, but the viewer boost during my tournament streams got me noticed by an org. Support team was helpful when I had questions.",
    rating: 4,
    color: "#06b6d4"
  },
  {
    name: "Emily Nakamura",
    avatar: "EN",
    role: "Art Streamer",
    metric: "3K → 18K followers",
    text: "I was stuck at 3K for over a year. The follower boost kickstarted the algorithm and organic growth followed. Best money I've spent on my channel.",
    rating: 5,
    color: "#22c55e"
  }
];

const steps = [
  {
    step: "01",
    title: "Choose Your Service",
    desc: "Browse our services and select the package that fits your growth goals",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
      </svg>
    )
  },
  {
    step: "02",
    title: "Secure Payment",
    desc: "Pay safely with Stripe or cryptocurrency — no password needed",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
        <line x1="1" y1="10" x2="23" y2="10"></line>
      </svg>
    )
  },
  {
    step: "03",
    title: "Watch It Grow",
    desc: "Delivery starts within 60 seconds — track progress in real time",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
        <polyline points="16 7 22 7 22 13"></polyline>
      </svg>
    )
  }
];

function StarIcon({ filled }: { filled?: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#f59e0b" : "#d4d4d8"}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col items-center overflow-x-hidden">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto px-4 pt-12 pb-20 lg:pt-24 lg:pb-36 relative overflow-hidden">
        <HeroFloatingElements />

        <div className="relative z-20 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#9146FF]/10 border border-[#9146FF]/20 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-semibold text-[#9146FF]">Trusted by 50,000+ Streamers</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-zinc-900 dark:text-white leading-[1.05]">
            Grow Your Twitch
            <br />
            <span className="gradient-text">Channel Instantly</span>
          </h1>

          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The #1 platform for premium Twitch growth. Real followers, live viewers, and chat engagement — delivered fast and secure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="#services">
              <Button
                size="lg"
                className="btn-primary font-bold px-10 h-14 text-lg w-full sm:w-auto"
              >
                Browse Services
              </Button>
            </Link>
            <Link href="/free-twitch-followers">
              <Button
                size="lg"
                variant="outline"
                className="font-bold px-10 h-14 text-lg border-2 border-zinc-300 dark:border-zinc-700 hover:border-[#9146FF] hover:text-[#9146FF] transition-all w-full sm:w-auto"
              >
                Try For Free
              </Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {['from-[#9146FF] to-purple-600', 'from-pink-500 to-rose-500', 'from-cyan-500 to-blue-500', 'from-green-500 to-emerald-500'].map((gradient, i) => (
                  <div key={i} className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} border-2 border-white dark:border-zinc-900 flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                    {['J', 'P', 'M', 'E'][i]}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-zinc-900 dark:text-white">50,000+</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Happy streamers</p>
              </div>
            </div>

            <div className="hidden sm:block w-px h-10 bg-zinc-200 dark:bg-zinc-700"></div>

            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span className="text-sm font-bold text-zinc-900 dark:text-white">4.9/5</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">from 2,800+ reviews</span>
            </div>

            <div className="hidden sm:block w-px h-10 bg-zinc-200 dark:bg-zinc-700"></div>

            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Instant Delivery</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
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
        <ServicesGrid />
      </section>

      {/* How It Works Section — different header style for visual variety */}
      <section className="w-full max-w-7xl mx-auto px-4 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-12">
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-500 text-sm font-bold mb-4">
              How It Works
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-zinc-900 dark:text-white">
              Get Started in <span className="gradient-text">Minutes</span>
            </h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-md lg:text-right">
            Three simple steps to start growing your Twitch channel today
          </p>
        </div>

        <div className="relative">
          {/* Connecting line between steps (desktop only) */}
          <div className="hidden md:block absolute top-12 left-[16.67%] right-[16.67%] h-px border-t-2 border-dashed border-[#9146FF]/20 z-0"></div>

          <div className="bento-grid grid-cols-1 md:grid-cols-3 relative z-10">
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
        </div>
      </section>

      {/* Features/Guarantees — full-bleed background for visual variety */}
      <div className="w-full bg-zinc-100/60 dark:bg-white/[0.02] border-y border-zinc-200/50 dark:border-zinc-800/50">
        <FeaturesSection />
      </div>

      {/* Comparison Section */}
      <ComparisonSection />

      {/* Testimonials Section — left-aligned header for variety */}
      <section className="w-full max-w-7xl mx-auto px-4 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-12">
          <div>
            <span className="inline-block px-4 py-2 rounded-full bg-pink-500/10 text-pink-500 text-sm font-bold mb-4">
              Testimonials
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-zinc-900 dark:text-white">
              Loved by <span className="gradient-text">Streamers</span>
            </h2>
          </div>
          <p className="text-zinc-600 dark:text-zinc-400 max-w-md lg:text-right">
            Real results from real creators who grew their channels with us
          </p>
        </div>

        <div className="bento-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bento-card p-6 lg:p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: testimonial.color }}
                >
                  {testimonial.avatar}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-sm text-zinc-900 dark:text-white truncate">{testimonial.name}</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="#9146FF" className="shrink-0">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{testimonial.role}</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-[11px] font-bold mb-3 w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                  <polyline points="16 7 22 7 22 13"></polyline>
                </svg>
                {testimonial.metric}
              </div>
              <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed flex-1">&ldquo;{testimonial.text}&rdquo;</p>
              <div className="flex gap-0.5 mt-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} filled={i < testimonial.rating} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* CTA Section — merged with Trust Badges */}
      <section className="w-full max-w-7xl mx-auto px-4 py-16 lg:py-24">
        <div className="bento-card p-6 sm:p-8 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#9146FF]/10 via-transparent to-cyan-500/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#9146FF]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-zinc-900 dark:text-white">
              Ready to <span className="gradient-text">Level Up?</span>
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
              Join 50,000+ streamers who have transformed their Twitch channels with our premium services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button
                  size="lg"
                  className="btn-primary font-bold px-10 h-14 text-lg w-full sm:w-auto"
                >
                  Get Started Now
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="font-bold px-10 h-14 text-lg border-2 border-zinc-200 dark:border-zinc-700 hover:border-[#9146FF] hover:text-[#9146FF] transition-all w-full sm:w-auto"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-6 mb-10">
              No credit card required. Delivery starts in under 60 seconds.
            </p>

            {/* Trust Badges — inline within CTA */}
            <div className="border-t border-zinc-200/50 dark:border-zinc-700/50 pt-8">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mb-5">
                <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity" title="Stripe">
                  <FaStripe className="w-10 h-10 text-[#635BFF] dark:text-[#a29bfe]" />
                </div>
                <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity" title="Visa">
                  <FaCcVisa className="w-8 h-8 text-[#1A1F71] dark:text-[#6c7ce0]" />
                </div>
                <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity" title="Mastercard">
                  <FaCcMastercard className="w-8 h-8 text-[#EB001B] dark:text-[#ff6b6b]" />
                </div>
                <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity" title="Cryptocurrency">
                  <FaBitcoin className="w-7 h-7 text-[#F7931A] dark:text-[#ffc078]" />
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Crypto</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
                  <FaLock className="w-3 h-3 text-green-500" />
                  <span className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">
                    SSL Secured
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#9146FF]/10 border border-[#9146FF]/20">
                  <FaShieldAlt className="w-3 h-3 text-[#9146FF]" />
                  <span className="text-[10px] font-bold text-[#9146FF] uppercase tracking-wider">
                    Safe & Private
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
