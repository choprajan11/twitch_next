"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Is it safe to buy Twitch followers?",
    a: "Yes! We use safe, organic methods that comply with Twitch's Terms of Service. We never ask for your password, and our delivery methods are designed to look natural and protect your account."
  },
  {
    q: "Can Twitch ban my account for buying followers?",
    a: "When done correctly, no. We deliver followers gradually and naturally, mimicking organic growth patterns. We've helped over 50,000 streamers without any account issues."
  },
  {
    q: "How long does delivery take?",
    a: "Most orders begin within 60 seconds of payment confirmation. Depending on your package size, full delivery typically completes within a few minutes to a few hours for larger orders."
  },
  {
    q: "Are the followers real or bots?",
    a: "We provide high-quality followers from real accounts. Our 0% drop rate guarantee ensures your follower count stays stable after delivery."
  },
  {
    q: "Do you need my Twitch password?",
    a: "Absolutely not! We only need your Twitch username. We never ask for passwords, emails, or any sensitive account information."
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit/debit cards through Stripe, as well as PayPal and cryptocurrency. All transactions are encrypted and secure."
  },
  {
    q: "What if my followers drop?",
    a: "We offer a 30-day refill guarantee. If any followers drop within 30 days of delivery, we'll refill them for free—no questions asked."
  },
  {
    q: "Can I get a refund?",
    a: "Yes, we offer a 100% money-back guarantee if delivery doesn't start within 2 hours. After delivery begins, our 30-day refill policy covers any drops."
  }
];

interface FAQSectionProps {
  hideHeader?: boolean;
}

export default function FAQSection({ hideHeader = false }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={`w-full max-w-7xl mx-auto ${hideHeader ? '' : 'px-4 py-16 lg:py-24'}`}>
      {!hideHeader && (
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-sm font-bold mb-4">
            FAQ
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-zinc-900 dark:text-white">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Everything you need to know about our services
          </p>
        </div>
      )}

      <div className="max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bento-card overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full p-6 text-left flex items-center justify-between gap-4"
            >
              <span className="font-bold text-zinc-900 dark:text-white pr-4">
                {faq.q}
              </span>
              <div
                className={`w-8 h-8 rounded-full bg-[#9146FF]/10 flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#9146FF]"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? "max-h-96" : "max-h-0"
              }`}
            >
              <div className="px-6 pb-6 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {faq.a}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
