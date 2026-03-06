"use client";

import { useState } from "react";

interface FAQ {
  q: string;
  a: string;
}

export default function ServiceFAQ({ faqs, color }: { faqs: FAQ[]; color: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className={`bento-card-static overflow-hidden transition-all duration-300 ${
              isOpen ? "ring-1" : ""
            }`}
            style={
              isOpen
                ? {
                    borderColor: `${color}25`,
                    boxShadow: `0 0 0 1px ${color}30`,
                  }
                : undefined
            }
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between p-5 text-left gap-4"
            >
              <span className="text-sm font-bold text-zinc-900 dark:text-white">{faq.q}</span>
              <span
                className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isOpen ? "rotate-45" : ""
                }`}
                style={{ backgroundColor: isOpen ? color : `${color}15`, color: isOpen ? "white" : color }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-5 pb-5 pt-0">
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{faq.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
