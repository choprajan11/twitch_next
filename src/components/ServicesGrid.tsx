import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Plan = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  popular?: boolean;
};

type ServiceTheme = { icon: React.ReactNode; color: string; gradient: string; label: string };

const serviceThemes: Record<string, ServiceTheme> = {
  "buy-followers": {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    ),
    color: "#ec4899",
    gradient: "from-[#9146FF] via-purple-500 to-pink-500",
    label: "Most Popular",
  },
  "buy-viewers": {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
      </svg>
    ),
    color: "#9146FF",
    gradient: "from-purple-600 to-indigo-600",
    label: "Top Rated",
  },
  "buy-chatbot": {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
      </svg>
    ),
    color: "#06b6d4",
    gradient: "from-cyan-500 to-blue-500",
    label: "Engagement",
  },
  "buy-clip-views": {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
      </svg>
    ),
    color: "#22c55e",
    gradient: "from-green-500 to-emerald-500",
    label: "Viral Growth",
  },
  "buy-video-views": {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="15" rx="2" ry="2" /><polyline points="17 2 12 7 7 2" />
      </svg>
    ),
    color: "#f59e0b",
    gradient: "from-amber-500 to-orange-500",
    label: "Content Boost",
  },
  "buy-profile-views": {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" />
        <path d="M22 21l-3.5-3.5" /><circle cx="18" cy="17" r="3" />
      </svg>
    ),
    color: "#8b5cf6",
    gradient: "from-violet-500 to-purple-600",
    label: "Visibility",
  },
  "buy-story-views": {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="4" /><path d="M9 6h6" /><path d="M9 18h6" />
      </svg>
    ),
    color: "#f97316",
    gradient: "from-orange-500 to-red-500",
    label: "Discovery",
  },
};

const defaultTheme: ServiceTheme = {
  icon: (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
    </svg>
  ),
  color: "#9146FF",
  gradient: "from-[#9146FF] to-indigo-500",
  label: "Premium",
};

function getLowestPrice(plans: Plan[]): number | null {
  if (!plans || plans.length === 0) return null;
  return Math.min(...plans.map(p => p.price));
}

function HeroCard({ service, theme, price }: { service: { slug: string; name: string; desc: string | null }; theme: ServiceTheme; price: number | null }) {
  return (
    <Link href={`/${service.slug}`} className="block group md:col-span-7 md:row-span-2">
      <div className={`bento-card-hero relative h-full min-h-[280px] md:min-h-[380px] p-8 md:p-10 lg:p-12 flex flex-col justify-between bg-gradient-to-br ${theme.gradient} overflow-hidden`}>
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full bg-white/[0.07] blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[200px] h-[200px] rounded-full bg-black/[0.08] blur-[60px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-[150px] h-[150px] rounded-full bg-white/[0.05] blur-[50px] pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-bold text-white/90 tracking-wide uppercase">{theme.label}</span>
          </div>

          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-500">
            {theme.icon}
          </div>

          <h3 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-white tracking-tight leading-[1.1] mb-3">
            {service.name}
          </h3>
          <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-md">
            {service.desc || `Premium ${service.name.toLowerCase()} with instant delivery and 30-day guarantee.`}
          </p>
        </div>

        <div className="relative z-10 flex items-end justify-between mt-6">
          <div>
            {price !== null && (
              <>
                <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-1">Starting from</p>
                <p className="text-3xl md:text-4xl font-black text-white stat-number">${price.toFixed(2)}</p>
              </>
            )}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-white/25 group-hover:translate-x-1 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

function MediumCard({ service, theme, price }: { service: { slug: string; name: string; desc: string | null }; theme: ServiceTheme; price: number | null }) {
  return (
    <Link href={`/${service.slug}`} className="block group md:col-span-5">
      <div className="bento-card h-full p-6 md:p-7 flex flex-col justify-between relative overflow-hidden min-h-[170px]">
        {/* Subtle accent glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-[50px] pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity duration-500" style={{ backgroundColor: theme.color }} />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
              style={{ backgroundColor: `${theme.color}12`, color: theme.color }}
            >
              {theme.icon}
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
              style={{ backgroundColor: `${theme.color}10`, color: theme.color }}
            >
              {theme.label}
            </span>
          </div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-1.5 group-hover:text-[#9146FF] transition-colors duration-300">
            {service.name}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
            {service.desc || `Premium ${service.name.toLowerCase()} delivered instantly.`}
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
          {price !== null ? (
            <span className="text-lg font-extrabold stat-number" style={{ color: theme.color }}>
              ${price.toFixed(2)}
              <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 ml-1.5">starting</span>
            </span>
          ) : (
            <span className="text-sm font-semibold text-zinc-400">Contact us</span>
          )}
          <span className="text-zinc-300 dark:text-zinc-600 group-hover:text-[#9146FF] group-hover:translate-x-1 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function ServicesGrid() {
  const services = await prisma.service.findMany({
    where: { status: true },
    orderBy: { createdAt: "asc" },
    take: 7,
  });

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">No services available yet.</p>
      </div>
    );
  }

  const hero = services[0];
  const medium = services.slice(1, 3);
  const compact = services.slice(3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
      {/* Hero — large left card */}
      <HeroCard
        service={hero}
        theme={serviceThemes[hero.slug] || defaultTheme}
        price={getLowestPrice((hero.plans as unknown as Plan[]) || [])}
      />

      {/* Medium — stacked right of hero */}
      {medium.map((service) => (
        <MediumCard
          key={service.id}
          service={service}
          theme={serviceThemes[service.slug] || defaultTheme}
          price={getLowestPrice((service.plans as unknown as Plan[]) || [])}
        />
      ))}

      {/* Compact — bottom row */}
      {compact.map((service) => {
        const total = compact.length;
        const span = total === 1 ? "md:col-span-12" : total === 2 ? "md:col-span-6" : total === 3 ? "md:col-span-4" : "md:col-span-3";
        return (
          <Link href={`/${service.slug}`} key={service.id} className={`block group ${span}`}>
            <div className="bento-card h-full p-5 md:p-6 flex flex-col justify-between relative overflow-hidden min-h-[150px]">
              {(() => {
                const theme = serviceThemes[service.slug] || defaultTheme;
                const plans = (service.plans as unknown as Plan[]) || [];
                const price = getLowestPrice(plans);
                return (
                  <>
                    <div className="absolute -bottom-8 -right-8 w-24 h-24 rounded-full blur-[40px] pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-500" style={{ backgroundColor: theme.color }} />
                    <div className="relative z-10 flex items-start gap-4">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500"
                        style={{ backgroundColor: `${theme.color}12`, color: theme.color }}
                      >
                        {theme.icon}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-[#9146FF] transition-colors duration-300 truncate">
                          {service.name}
                        </h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: theme.color }}>
                          {theme.label}
                        </span>
                      </div>
                    </div>
                    <div className="relative z-10 flex items-center justify-between mt-4">
                      {price !== null ? (
                        <span className="text-base font-extrabold stat-number" style={{ color: theme.color }}>
                          From ${price.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-sm font-semibold text-zinc-400">Contact us</span>
                      )}
                      <span className="text-zinc-300 dark:text-zinc-600 group-hover:text-[#9146FF] group-hover:translate-x-1 transition-all duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                        </svg>
                      </span>
                    </div>
                  </>
                );
              })()}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
