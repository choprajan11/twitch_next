"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface CopyButtonProps {
  text: string;
  children: React.ReactNode;
  className?: string;
  successMessage?: string;
}

export default function CopyButton({ 
  text, 
  children, 
  className = "",
  successMessage = "Copied!"
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setTooltipPos({
          top: rect.top - 30,
          left: rect.left + rect.width / 2,
        });
      }
      
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleCopy}
        className={`group inline-flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity ${className}`}
        title={`Click to copy: ${text}`}
      >
        {children}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="opacity-0 group-hover:opacity-50 transition-opacity text-zinc-400 shrink-0"
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
      </button>
      {mounted && copied && createPortal(
        <span 
          className="fixed z-[9999] px-2.5 py-1.5 bg-zinc-900 dark:bg-zinc-700 text-white text-xs font-medium rounded-lg whitespace-nowrap shadow-xl pointer-events-none"
          style={{ 
            top: tooltipPos.top, 
            left: tooltipPos.left, 
            transform: 'translateX(-50%)',
            animation: 'fadeInUp 0.2s ease-out'
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1 text-green-400">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {successMessage}
        </span>,
        document.body
      )}
    </>
  );
}
