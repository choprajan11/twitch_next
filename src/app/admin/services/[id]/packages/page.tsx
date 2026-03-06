"use client";

import { useState, useEffect, useTransition } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import Link from "next/link";
import { getServiceWithPlans, updateServicePlans } from "./actions";

interface Plan {
  name: string;
  quantity: number;
  price: number;
  popular?: boolean;
}

interface ServiceData {
  id: string;
  name: string;
  slug: string;
  plans: Plan[];
}

export default function PackagesPage() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;
  
  const [service, setService] = useState<ServiceData | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    loadService();
  }, [serviceId]);

  async function loadService() {
    setIsLoading(true);
    try {
      const data = await getServiceWithPlans(serviceId);
      if (data) {
        setService(data);
        setPlans(data.plans || []);
      }
    } catch (error) {
      console.error("Failed to load service:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const addPlan = () => {
    setPlans([...plans, { name: "", quantity: 100, price: 0, popular: false }]);
  };

  const removePlan = (index: number) => {
    setPlans(plans.filter((_, i) => i !== index));
  };

  const updatePlan = (index: number, field: keyof Plan, value: string | number | boolean) => {
    const updated = [...plans];
    updated[index] = { ...updated[index], [field]: value };
    setPlans(updated);
  };

  const handleSave = async () => {
    startTransition(async () => {
      const result = await updateServicePlans(serviceId, plans);
      if (result.success) {
        router.push("/admin/services");
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded mb-2" />
          <div className="h-4 w-64 bg-zinc-200 dark:bg-zinc-800 rounded" />
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white">Service Not Found</h1>
          <p className="text-zinc-500 mt-1 text-sm">The service you&apos;re looking for doesn&apos;t exist.</p>
        </div>
        <Link href="/admin/services">
          <Button variant="outline" className="font-semibold rounded-xl">
            ← Back to Services
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link href="/admin/services" className="text-sm text-zinc-500 hover:text-[#9146FF] transition-colors">
              Services
            </Link>
            <span className="text-zinc-400">/</span>
            <span className="text-sm text-zinc-900 dark:text-white font-medium">{service.name}</span>
          </div>
          <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Edit Packages</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 text-sm">Configure pricing tiers for {service.name}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/services">
            <Button variant="outline" className="font-semibold border-[rgba(145,70,255,0.15)] rounded-xl">
              Cancel
            </Button>
          </Link>
          <Button 
            style={{ backgroundColor: '#9146FF', color: 'white' }} 
            className="font-bold shadow-lg shadow-[#9146FF]/20 rounded-xl"
            onPress={handleSave}
            isDisabled={isPending}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {plans.map((plan, index) => (
          <div key={index} className="bento-card p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-4 w-full">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Package Name
                </label>
                <input
                  type="text"
                  value={plan.name}
                  onChange={(e) => updatePlan(index, "name", e.target.value)}
                  placeholder="e.g. Starter"
                  className="w-full px-3 py-2 border border-[rgba(145,70,255,0.1)] rounded-lg bg-[var(--card-bg)] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9146FF]/30 text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Quantity
                </label>
                <input
                  type="number"
                  value={plan.quantity}
                  onChange={(e) => updatePlan(index, "quantity", parseInt(e.target.value) || 0)}
                  placeholder="100"
                  className="w-full px-3 py-2 border border-[rgba(145,70,255,0.1)] rounded-lg bg-[var(--card-bg)] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9146FF]/30 text-sm"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={plan.price}
                  onChange={(e) => updatePlan(index, "price", parseFloat(e.target.value) || 0)}
                  placeholder="9.99"
                  className="w-full px-3 py-2 border border-[rgba(145,70,255,0.1)] rounded-lg bg-[var(--card-bg)] text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#9146FF]/30 text-sm"
                />
              </div>
              <div className="flex items-end gap-2">
                <label className="flex items-center gap-2 cursor-pointer py-2">
                  <input
                    type="checkbox"
                    checked={plan.popular || false}
                    onChange={(e) => updatePlan(index, "popular", e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-300 text-[#9146FF] focus:ring-[#9146FF]/30"
                  />
                  <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Popular</span>
                </label>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="text-red-500 bg-red-500/10 font-semibold rounded-lg shrink-0"
              onPress={() => removePlan(index)}
            >
              Remove
            </Button>
          </div>
        ))}

        <button
          onClick={addPlan}
          className="w-full p-4 border-2 border-dashed border-[rgba(145,70,255,0.2)] rounded-2xl text-sm font-semibold text-[#9146FF] hover:border-[#9146FF]/40 hover:bg-[#9146FF]/5 transition-all"
        >
          + Add Package Tier
        </button>
      </div>

      {plans.length === 0 && (
        <div className="bento-card-static p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#9146FF]/10 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#9146FF]">
              <path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
            </svg>
          </div>
          <p className="text-zinc-500 mb-2 text-sm">No packages configured yet</p>
          <p className="text-zinc-400 text-xs">Click &quot;Add Package Tier&quot; to create your first pricing option</p>
        </div>
      )}
    </div>
  );
}
