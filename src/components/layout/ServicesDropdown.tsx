"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

interface Service {
  name: string;
  slug: string;
}

let cachedServices: Service[] | null = null;

const serviceIcons: Record<string, React.ReactNode> = {
  follower: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
    </svg>
  ),
  viewer: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  chat: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  clip: (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
};

function getIcon(slug: string) {
  const lower = slug.toLowerCase();
  if (lower.includes("follower")) return serviceIcons.follower;
  if (lower.includes("viewer") && !lower.includes("clip")) return serviceIcons.viewer;
  if (lower.includes("chat") || lower.includes("bot")) return serviceIcons.chat;
  if (lower.includes("clip")) return serviceIcons.clip;
  return serviceIcons.follower;
}

function getColor(slug: string) {
  const lower = slug.toLowerCase();
  if (lower.includes("follower")) return "#9146FF";
  if (lower.includes("viewer") && !lower.includes("clip")) return "#06b6d4";
  if (lower.includes("chat") || lower.includes("bot")) return "#22c55e";
  if (lower.includes("clip")) return "#ec4899";
  return "#9146FF";
}

export default function ServicesDropdown() {
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState<Service[]>(cachedServices || []);
  const ref = useRef<HTMLDivElement>(null);
  const timeout = useRef<NodeJS.Timeout | null>(null);
  const fetched = useRef(!!cachedServices);

  const fetchServices = useCallback(async () => {
    if (fetched.current) return;
    fetched.current = true;
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      cachedServices = data;
      setServices(data);
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleEnter = () => {
    if (timeout.current) clearTimeout(timeout.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timeout.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div ref={ref} className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all flex items-center gap-1.5 ${
          open
            ? "text-[#9146FF] bg-[#9146FF]/10"
            : "text-zinc-700 dark:text-zinc-300 hover:text-[#9146FF] hover:bg-[#9146FF]/10"
        }`}
      >
        Services
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-56 py-2 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xl shadow-black/10 dark:shadow-black/30 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
          {services.map((service) => {
            const color = getColor(service.slug);
            return (
              <Link
                key={service.slug}
                href={`/${service.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group"
              >
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                  style={{ backgroundColor: `${color}15`, color }}
                >
                  {getIcon(service.slug)}
                </span>
                <span className="group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                  {service.name}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
