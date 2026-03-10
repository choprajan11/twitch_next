import Link from "next/link";
import { Button } from "@heroui/react";

export default function NotFound() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-12 pb-24 min-h-[70vh] flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto relative">
        {/* Background decorations */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#9146FF]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          {/* Twitch-style 404 icon */}
          <div className="mb-8 inline-flex items-center justify-center">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="120"
                height="120"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-[#9146FF]/20"
              >
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-black text-[#9146FF]">?</span>
              </div>
            </div>
          </div>

          {/* 404 Number */}
          <h1 className="text-8xl sm:text-9xl font-black tracking-tighter mb-4">
            <span className="text-zinc-200 dark:text-zinc-800">4</span>
            <span className="gradient-text">0</span>
            <span className="text-zinc-200 dark:text-zinc-800">4</span>
          </h1>

          {/* Message */}
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-white mb-4">
            Stream Not Found
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
            Looks like this page went offline. The content you&apos;re looking for 
            might have been moved or doesn&apos;t exist.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button
                size="lg"
                className="btn-primary font-bold px-8 h-12"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Back to Home
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="font-bold px-8 h-12 border-2"
              >
                Contact Support
              </Button>
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              Maybe you were looking for:
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { label: "Services", href: "/#services" },
                { label: "Services", href: "/#services" },
                { label: "Track Order", href: "/orders" },
                { label: "FAQ", href: "/faq" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-[#9146FF]/10 hover:text-[#9146FF] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
