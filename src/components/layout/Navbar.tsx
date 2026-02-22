import Link from "next/link";
import { Button } from "@heroui/react";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <span className="text-[#9146FF]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>
            </span>
            <span className="text-zinc-900 dark:text-white">
              GrowTwitch
            </span>
          </Link>
          <div className="hidden md:flex md:items-center md:gap-8 ml-4">
            <Link href="/services" className="text-sm font-semibold text-zinc-900 dark:text-white hover:text-[#9146FF] transition-colors">
              Services
            </Link>
            <Link href="/orders" className="text-sm font-semibold text-zinc-900 dark:text-white hover:text-[#9146FF] transition-colors">
              Track Order
            </Link>
            <Link href="/contact" className="text-sm font-semibold text-zinc-900 dark:text-white hover:text-[#9146FF] transition-colors">
              Contact
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden sm:flex">
            <Button variant="light" className="font-semibold text-zinc-900 dark:text-white hover:text-[#9146FF]">
              Log in
            </Button>
          </Link>
          <Link href="/register">
            <Button style={{ backgroundColor: '#9146FF', color: 'white' }} variant="shadow" className="font-bold shadow-[#9146FF]/30">
              Sign up
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
