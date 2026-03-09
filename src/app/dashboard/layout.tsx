"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import SignOutButton from "@/components/auth/SignOutButton";
import SetPasswordBanner from "@/components/dashboard/SetPasswordBanner";

interface UserInfo {
  name: string | null;
  email: string;
  funds: number;
}

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    name: "New Order",
    href: "/dashboard/new-order",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="M8 12h8" />
      </svg>
    ),
  },
  {
    name: "My Orders",
    href: "/dashboard/orders",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><line x1="3" x2="21" y1="6" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    name: "Wallet",
    href: "/dashboard/wallet",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line>
      </svg>
    ),
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [hasPassword, setHasPassword] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.user) {
          setUserInfo({ name: data.user.name, email: data.user.email, funds: data.user.funds });
          setHasPassword(data.user.hasPassword ?? true);
        }
      })
      .catch(() => {});
  }, []);

  const avatarLetter = (userInfo?.name?.[0] || userInfo?.email?.[0] || "U").toUpperCase();
  const displayName = userInfo?.name || userInfo?.email?.split("@")[0] || "User";
  const walletBalance = userInfo?.funds?.toFixed(2) ?? "0.00";

  return (
    <div className="min-h-screen flex flex-col md:flex-row md:p-4 md:gap-4">
      {/* Mobile header */}
      <header className="md:hidden h-14 flex items-center px-4 glass-effect justify-between sticky top-0 z-30 border-b border-[rgba(145,70,255,0.08)]">
        <Link href="/dashboard" className="font-black text-zinc-900 dark:text-white flex items-center gap-2">
          <span className="text-[#9146FF]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
            </svg>
          </span>
          GrowTwitch
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/wallet"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#9146FF]/10 text-[#9146FF] text-xs font-bold hover:bg-[#9146FF]/15 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
            ${walletBalance}
          </Link>
          <ThemeSwitcher />
          <button
            className="p-2 text-zinc-500 hover:text-[#9146FF] transition-colors rounded-xl hover:bg-[#9146FF]/5"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
          rounded-r-3xl md:rounded-3xl
          md:relative md:translate-x-0 md:w-60 md:shrink-0
          flex flex-col bg-[var(--card-bg)] md:bento-card-static md:h-[calc(100vh-2rem)] md:sticky md:top-4
          border-r border-[rgba(145,70,255,0.08)] md:border-r-0
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-14 flex items-center justify-between px-5 border-b border-[rgba(145,70,255,0.06)] shrink-0">
          <Link href="/?home=true" className="text-lg font-black tracking-tighter flex items-center gap-2 group">
            <span className="text-[#9146FF] group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z" />
              </svg>
            </span>
            <span className="text-zinc-900 dark:text-white">
              Grow<span className="text-[#9146FF]">T</span>
            </span>
          </Link>
          <button
            className="md:hidden text-zinc-500 hover:text-[#9146FF] transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3">
          <nav className="space-y-0.5 px-2.5">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#9146FF]/10 text-[#9146FF]"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-[#9146FF]/5 hover:text-[#9146FF]"
                  }`}
                >
                  <span className={isActive ? "text-[#9146FF]" : ""}>{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="px-2.5 mt-6">
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Quick Actions</p>
            <Link
              href="/?home=true#services"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-[#9146FF]/5 hover:text-[#9146FF] transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="M8 12h8" />
              </svg>
              Buy Services
            </Link>
            <Link
              href="/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-[#9146FF]/5 hover:text-[#9146FF] transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              Track Order
            </Link>
          </div>
        </div>

        <div className="p-3 border-t border-[rgba(145,70,255,0.06)] shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 px-1 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9146FF] to-cyan-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-[#9146FF]/20 shrink-0">
                {avatarLetter}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">{displayName}</p>
                <p className="text-[11px] text-[#9146FF] font-semibold truncate">${walletBalance}</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <ThemeSwitcher />
              <div className="w-[1px] h-4 bg-zinc-200 dark:bg-zinc-800"></div>
              <SignOutButton />
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 md:bento-card-static md:h-[calc(100vh-2rem)] md:sticky md:top-4 md:overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {!hasPassword && <SetPasswordBanner />}
          {children}
        </div>
      </div>
    </div>
  );
}
