import Link from "next/link";
import { Button } from "@heroui/react";
import { HeroFloatingElements } from "@/components/HeroFloatingElements";
import ServicesGrid from "@/components/ServicesGrid";
import FeaturesSection from "@/components/FeaturesSection";
import ComparisonSection from "@/components/ComparisonSection";
import FAQSection from "@/components/FAQSection";
import TrustBadges from "@/components/TrustBadges";
import HeroEmailForm from "@/components/HeroEmailForm";

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
      {/* Hero Section - Full-Width with Floating Elements */}
      <section className="w-full max-w-7xl mx-auto px-4 pt-12 pb-20 lg:pt-24 lg:pb-36 relative">
        
        {/* Animated Floating Elements */}
        <HeroFloatingElements />

        {/* Center Content */}
        <div className="relative z-20 text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#9146FF]/10 border border-[#9146FF]/20 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-semibold text-[#9146FF]">Trusted by 50,000+ Streamers</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-zinc-900 dark:text-white leading-[1.05]">
            Grow Your Twitch
            <br />
            <span className="gradient-text">Channel Instantly</span>
          </h1>

          {/* Subtext */}
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The #1 platform for premium Twitch services. Get real followers, viewers, and chat engagement—delivered fast and secure.
          </p>

          {/* Email Signup CTA */}
          <HeroEmailForm />

          {/* Social Proof Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            {/* Avatars */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {['from-[#9146FF] to-purple-600', 'from-pink-500 to-rose-500', 'from-cyan-500 to-blue-500', 'from-green-500 to-emerald-500'].map((gradient, i) => (
                  <div key={i} className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} border-2 border-white dark:border-zinc-900 flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                    {['A', 'S', 'M', 'K'][i]}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-zinc-900 dark:text-white">2,500+</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Happy customers</p>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-10 bg-zinc-200 dark:bg-zinc-700"></div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#f59e0b">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <span className="text-sm font-bold text-zinc-900 dark:text-white">4.9/5</span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">from reviews</span>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-10 bg-zinc-200 dark:bg-zinc-700"></div>

            {/* Delivery */}
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">Instant Delivery</span>
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

        <ServicesGrid />
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

      {/* Features/Guarantees Section */}
      <FeaturesSection />

      {/* Comparison Section */}
      <ComparisonSection />

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

      {/* FAQ Section */}
      <FAQSection />

      {/* Trust Badges / Payment Section */}
      <TrustBadges />

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
