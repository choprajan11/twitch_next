"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: "📊" },
  { name: "Orders", href: "/admin/orders", icon: "🛒" },
  { name: "Refills", href: "/admin/refills", icon: "🔄" },
  { name: "Services", href: "/admin/services", icon: "📦" },
  { name: "Customers", href: "/admin/customers", icon: "👥" },
  { name: "Users", href: "/admin/users", icon: "🔐" },
  { name: "Settings", href: "/admin/settings", icon: "⚙️" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background text-foreground relative">
      
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        flex flex-col border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800">
          <Link href="/" className="text-xl font-black tracking-tighter flex items-center gap-2">
            <span className="text-[#9146FF]">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>
              </svg>
            </span>
            <span className="text-zinc-900 dark:text-white">GrowTwitch <span className="text-xs text-[#9146FF] uppercase tracking-widest ml-1">Admin</span></span>
          </Link>
          <button 
            className="md:hidden text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive 
                      ? "bg-[#9146FF]/10 text-[#9146FF]" 
                      : "text-zinc-700 dark:text-zinc-300 hover:bg-[#9146FF]/10 hover:text-[#9146FF]"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9146FF] to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg">
              A
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-900 dark:text-white">Admin User</p>
              <p className="text-xs text-zinc-500">admin@growtwitch.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden w-full">
        {/* Mobile Header */}
        <header className="md:hidden h-16 flex items-center px-4 border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/20 backdrop-blur-xl justify-between sticky top-0 z-30">
          <span className="font-black text-zinc-900 dark:text-white">GrowTwitch Admin</span>
          <button 
            className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}