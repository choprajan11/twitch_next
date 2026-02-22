import Link from "next/link";
import { Button } from "@heroui/react";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="glass-effect rounded-2xl border border-white/20 dark:border-zinc-800/50 shadow-lg shadow-black/5">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-10">
              <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-2.5 group">
                <span className="text-[#9146FF] group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
                  </svg>
                </span>
                <span className="text-zinc-900 dark:text-white">
                  GrowTwitch
                </span>
              </Link>
              <div className="hidden md:flex md:items-center md:gap-1">
                <Link 
                  href="/#services" 
                  className="px-4 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-[#9146FF] hover:bg-[#9146FF]/10 rounded-xl transition-all"
                >
                  Services
                </Link>
                <Link 
                  href="/pricing" 
                  className="px-4 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-[#9146FF] hover:bg-[#9146FF]/10 rounded-xl transition-all"
                >
                  Pricing
                </Link>
                <Link 
                  href="/orders" 
                  className="px-4 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-[#9146FF] hover:bg-[#9146FF]/10 rounded-xl transition-all"
                >
                  Track Order
                </Link>
                <Link 
                  href="/contact" 
                  className="px-4 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-[#9146FF] hover:bg-[#9146FF]/10 rounded-xl transition-all"
                >
                  Contact
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              <Link href="/login" className="hidden sm:flex">
                <Button 
                  variant="light" 
                  className="font-semibold text-zinc-700 dark:text-zinc-300 hover:text-[#9146FF] hover:bg-[#9146FF]/10"
                >
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button 
                  style={{ backgroundColor: '#9146FF', color: 'white' }} 
                  variant="shadow" 
                  className="font-bold shadow-[#9146FF]/30 rounded-xl"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
