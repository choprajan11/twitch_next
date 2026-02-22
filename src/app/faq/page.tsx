import Link from "next/link";
import { Button } from "@heroui/react";
import FAQSection from "@/components/FAQSection";

export const metadata = {
  title: "FAQ - GrowTwitch",
  description: "Frequently asked questions about GrowTwitch services, delivery, safety, and refunds.",
};

export default function FAQPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-12 pb-24">
      {/* Header */}
      <div className="text-center mb-8 max-w-3xl mx-auto">
        <span className="inline-block px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-sm font-bold mb-4">
          Help Center
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-zinc-900 dark:text-white">
          Frequently Asked <span className="gradient-text">Questions</span>
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Find answers to the most common questions about our services.
        </p>
      </div>

      {/* FAQ Component */}
      <FAQSection hideHeader />

      {/* Still need help */}
      <div className="max-w-3xl mx-auto mt-16">
        <div className="bento-card p-8 lg:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#9146FF]/10 via-transparent to-cyan-500/10"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-[#9146FF]/10 flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#9146FF]">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
              Still have questions?
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-8">
              Our support team is available 24/7 to help you with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  style={{ backgroundColor: "#9146FF", color: "white" }}
                  className="font-bold px-8"
                >
                  Contact Support
                </Button>
              </Link>
              <Link href="/orders">
                <Button
                  size="lg"
                  variant="bordered"
                  className="font-bold px-8 border-2"
                >
                  Track Order
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
