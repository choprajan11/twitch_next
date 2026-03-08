"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { NavbarAuthButton } from "./NavbarAuthButton";
import ServicesDropdown from "./ServicesDropdown";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on route change (link click)
  const closeMenu = () => setMobileOpen(false);

  // Close menu when clicking outside
  useEffect(() => {
    if (!mobileOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [mobileOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <nav className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="glass-effect rounded-2xl border border-white/20 dark:border-zinc-800/50 shadow-lg shadow-black/5">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-10">
              <Link href="/?home=true" className="text-2xl font-black tracking-tighter flex items-center gap-2.5 group">
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
                  href="/free-twitch-followers"
                  className="px-4 py-2 text-sm font-semibold text-pink-500 hover:text-pink-600 hover:bg-pink-500/10 rounded-xl transition-all flex items-center gap-1"
                >
                  <span className="flex h-1.5 w-1.5 rounded-full bg-pink-500 animate-pulse"></span>
                  Free Trial
                </Link>
                <ServicesDropdown />
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
            <div className="flex items-center gap-3">
              <ThemeSwitcher />
              <div className="hidden md:block">
                <NavbarAuthButton />
              </div>
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden" aria-hidden="true" />
      )}

      {/* Mobile menu panel */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white dark:bg-zinc-900 shadow-2xl transform transition-all duration-300 ease-in-out md:hidden ${
          mobileOpen ? "translate-x-0 visible" : "translate-x-full invisible"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200 dark:border-zinc-800">
          <span className="text-lg font-bold text-zinc-900 dark:text-white">Menu</span>
          <button
            onClick={closeMenu}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col px-4 py-4 gap-1 overflow-y-auto h-[calc(100%-80px)]">
          <Link
            href="/free-twitch-followers"
            onClick={closeMenu}
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-pink-500 hover:bg-pink-500/10 rounded-xl transition-all"
          >
            <span className="flex h-2 w-2 rounded-full bg-pink-500 animate-pulse"></span>
            Free Trial
          </Link>

          <Link
            href="/pricing"
            onClick={closeMenu}
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-[#9146FF] hover:bg-[#9146FF]/10 rounded-xl transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            Pricing
          </Link>

          <Link
            href="/orders"
            onClick={closeMenu}
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-[#9146FF] hover:bg-[#9146FF]/10 rounded-xl transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
            </svg>
            Track Order
          </Link>

          <Link
            href="/contact"
            onClick={closeMenu}
            className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:text-[#9146FF] hover:bg-[#9146FF]/10 rounded-xl transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
            </svg>
            Contact
          </Link>

          <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2" />

          {/* Services section in mobile */}
          <p className="px-4 py-2 text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Services</p>
          <ServicesDropdown />

          <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-2" />

          <div className="px-4 py-3">
            <NavbarAuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
