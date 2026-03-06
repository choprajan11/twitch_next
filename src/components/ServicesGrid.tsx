import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Type for plans stored in JSON
type Plan = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  popular?: boolean;
};

// Icon mapping based on service type/slug
const serviceIcons: Record<string, { icon: React.ReactNode; color: string; bgColor: string }> = {
  "buy-followers": {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    ),
    color: "#ec4899",
    bgColor: "bg-pink-50 dark:bg-pink-950/30"
  },
  "buy-viewers": {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    ),
    color: "#9146FF",
    bgColor: "bg-purple-50 dark:bg-purple-950/30"
  },
  "buy-chatbot": {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
      </svg>
    ),
    color: "#06b6d4",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/30"
  },
  "buy-clip-views": {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
      </svg>
    ),
    color: "#22c55e",
    bgColor: "bg-green-50 dark:bg-green-950/30"
  },
  "buy-video-views": {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
        <polyline points="17 2 12 7 7 2"></polyline>
      </svg>
    ),
    color: "#f59e0b",
    bgColor: "bg-amber-50 dark:bg-amber-950/30"
  },
  default: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
      </svg>
    ),
    color: "#9146FF",
    bgColor: "bg-purple-50 dark:bg-purple-950/30"
  }
};

function getLowestPrice(plans: Plan[]): string {
  if (!plans || plans.length === 0) return "Contact us";
  const lowest = Math.min(...plans.map(p => p.price));
  return `From $${lowest.toFixed(2)}`;
}

export default async function ServicesGrid() {
  const services = await prisma.service.findMany({
    where: { status: true },
    orderBy: { createdAt: "asc" },
    take: 8,
  });

  if (services.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-500">No services available yet.</p>
      </div>
    );
  }

  return (
    <div className="bento-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {services.map((service, index) => {
        const plans = (service.plans as unknown as Plan[]) || [];
        const iconData = serviceIcons[service.slug] || serviceIcons.default;
        
        return (
          <Link href={`/${service.slug}`} key={service.id} className="block group">
            <div className={`bento-card h-full p-6 ${index === 0 ? 'md:col-span-2 lg:col-span-1' : ''}`}>
              <div 
                className={`w-14 h-14 rounded-2xl ${iconData.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                style={{ color: iconData.color }}
              >
                {iconData.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-white group-hover:text-[#9146FF] transition-colors">
                {service.name}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4 text-sm leading-relaxed line-clamp-2">
                {service.desc || `Get high-quality ${service.name.toLowerCase()} delivered instantly.`}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#9146FF]">{getLowestPrice(plans)}</span>
                <span className="text-zinc-400 group-hover:text-[#9146FF] group-hover:translate-x-1 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}