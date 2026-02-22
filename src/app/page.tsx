import { Button, Card } from "@heroui/react";
import Link from "next/link";

const services = [
  {
    id: 1,
    name: "Twitch Followers",
    slug: "buy-followers",
    desc: "Get real, high-quality followers delivered instantly to your channel. Boost your credibility.",
    price: "From $2.99"
  },
  {
    id: 2,
    name: "Twitch Viewers",
    slug: "buy-viewers",
    desc: "Increase your live concurrent viewers. Great for ranking higher in your game category.",
    price: "From $4.99"
  },
  {
    id: 3,
    name: "Twitch Chatbot",
    slug: "buy-chatbot",
    desc: "Automated realistic chat interaction for your stream. Keeps your audience engaged.",
    price: "From $9.99"
  },
  {
    id: 4,
    name: "Clip Views",
    slug: "buy-clip-views",
    desc: "Make your best moments go viral with high-quality clip views.",
    price: "From $1.99"
  }
];

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-white dark:bg-zinc-950 py-24 lg:py-40 flex flex-col items-center text-center px-4 border-b border-zinc-100 dark:border-zinc-900">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 z-0 flex justify-center items-center pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[#9146FF]/20 dark:bg-[#9146FF]/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/20 dark:bg-cyan-600/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          <svg className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        {/* Floating UI Elements (Hidden on small screens) */}
        <div className="hidden lg:block absolute inset-0 z-0 pointer-events-none">
          {/* Followers Badge */}
          <div className="absolute top-[20%] left-[2%] xl:left-[10%] lg:scale-75 xl:scale-100 origin-left bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-4 animate-[bounce_4s_infinite]">
            <div className="w-12 h-12 rounded-full bg-[#9146FF]/10 flex items-center justify-center text-[#9146FF]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </div>
            <div className="text-left">
              <p className="text-xs text-zinc-500 font-medium">Followers</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-white">10,502</p>
            </div>
          </div>

          {/* Live Viewers Badge */}
          <div className="absolute bottom-[25%] right-[2%] xl:right-[10%] lg:scale-75 xl:scale-100 origin-right bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-4 animate-[bounce_5s_infinite_reverse]">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </div>
            <div className="text-left">
              <p className="text-xs text-zinc-500 font-medium">Live Viewers</p>
              <p className="text-xl font-bold text-zinc-900 dark:text-white">1,240</p>
            </div>
          </div>

          {/* Chat Mockup Badge */}
          <div className="absolute top-[25%] right-[2%] xl:right-[15%] lg:scale-75 xl:scale-100 origin-right bg-white dark:bg-zinc-900 p-3 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-3 animate-[bounce_6s_infinite]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#9146FF] to-cyan-400"></div>
            <div className="flex flex-col gap-1.5">
              <div className="w-24 h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full"></div>
              <div className="w-16 h-2 bg-[#9146FF]/30 rounded-full"></div>
            </div>
            <svg className="text-[#9146FF] ml-2" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
          </div>
          
          {/* Bounding Box Mockup */}
          <div className="absolute bottom-[20%] left-[2%] xl:left-[15%] lg:scale-75 xl:scale-100 origin-left w-32 h-20 border-2 border-[#9146FF] border-dashed rounded-lg flex items-center justify-center animate-pulse bg-[#9146FF]/5 dark:bg-[#9146FF]/10 backdrop-blur-sm">
            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white dark:bg-zinc-900 border-2 border-[#9146FF] rounded-sm"></div>
            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white dark:bg-zinc-900 border-2 border-[#9146FF] rounded-sm"></div>
            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white dark:bg-zinc-900 border-2 border-[#9146FF] rounded-sm"></div>
            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white dark:bg-zinc-900 border-2 border-[#9146FF] rounded-sm"></div>
            <span className="text-[#9146FF] font-bold text-lg tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              LIVE
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 mb-8 backdrop-blur-md shadow-sm">
            <span className="flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Trusted by 10,000+ Streamers</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-tight mb-8 text-balance max-w-5xl text-zinc-900 dark:text-white leading-[1.1]">
            Level Up Your Twitch <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-[#9146FF] via-purple-500 to-cyan-500 bg-clip-text text-transparent animate-pulse inline-block mt-2">
              Channel Instantly
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl mb-12 font-medium leading-relaxed">
            The most reliable platform to buy Twitch followers, viewers, and chat engagement. Safe, lightning-fast, and backed by 24/7 support.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="#services" className="w-full sm:w-auto z-10 pointer-events-auto">
              <Button size="lg" style={{ backgroundColor: '#9146FF', color: 'white' }} variant="shadow" className="w-full sm:w-auto font-bold px-8 h-14 text-lg shadow-[#9146FF]/30">
                Get Started Now
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" variant="bordered" className="w-full sm:w-auto font-bold px-8 h-14 text-lg bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="w-full max-w-7xl mx-auto py-20 px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-zinc-900 dark:text-white">Our Services</h2>
          <p className="text-zinc-600 dark:text-zinc-400">Select a service to boost your Twitch career.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="h-full flex flex-col hover:shadow-lg transition-shadow bg-white dark:bg-zinc-800 border dark:border-zinc-700">
              <Card.Header>
                <Card.Title className="text-xl font-semibold text-zinc-900 dark:text-white">{service.name}</Card.Title>
                <Card.Description className="mt-2 text-zinc-600 dark:text-zinc-400">{service.desc}</Card.Description>
              </Card.Header>
              <Card.Footer className="mt-auto flex justify-between items-center pt-6 border-t border-zinc-100 dark:border-zinc-700">
                <span className="font-semibold text-zinc-900 dark:text-white">{service.price}</span>
                <Link href={`/${service.slug}`}>
                  <Button size="sm" color="primary">
                    Buy Now
                  </Button>
                </Link>
              </Card.Footer>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-zinc-50 dark:bg-zinc-900/50 py-20 px-4 border-t border-zinc-100 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">Instant Delivery</h3>
            <p className="text-zinc-600 dark:text-zinc-400">Orders start processing immediately after payment is confirmed.</p>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">High Quality</h3>
            <p className="text-zinc-600 dark:text-zinc-400">We provide the highest quality accounts and realistic engagement.</p>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">24/7 Support</h3>
            <p className="text-zinc-600 dark:text-zinc-400">Our support team is always ready to help you with any issues.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
