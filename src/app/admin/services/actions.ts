"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { connectApi } from "@/lib/providers";
import { decrypt } from "@/lib/encryption";
import { isStreamRiseService } from "@/lib/streamrise";

type Plan = {
  price?: number;
  cost?: number;
  quantity?: number;
  duration?: number;
};

function getServicePlanMetrics(plansValue: unknown) {
  const plans = Array.isArray(plansValue) ? (plansValue as Plan[]) : [];
  const validPrices = plans.filter((plan) => typeof plan.price === "number");
  const costedPlans = validPrices.filter(
    (plan) => typeof plan.cost === "number" && Number.isFinite(plan.cost) && (plan.cost ?? 0) > 0
  );

  const startPrice = validPrices.length
    ? Math.min(...validPrices.map((plan) => plan.price as number))
    : null;

  const avgProfit = costedPlans.length
    ? costedPlans.reduce((sum, plan) => sum + ((plan.price as number) - (plan.cost as number)), 0) / costedPlans.length
    : null;

  const avgMarkup = costedPlans.length
    ? costedPlans.reduce(
        (sum, plan) => sum + ((((plan.price as number) - (plan.cost as number)) / (plan.cost as number)) * 100),
        0
      ) / costedPlans.length
    : null;

  return {
    planCount: plans.length,
    startPrice,
    avgProfit,
    avgMarkup,
    costedPlanCount: costedPlans.length,
  };
}

export async function getAllServices() {
  await requireAdmin();
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { name: true } },
        _count: { select: { orders: true } },
      },
    });

    return services.map((service) => {
      const metrics = getServicePlanMetrics(service.plans);

      return {
        id: service.id,
        name: service.name,
        slug: service.slug,
        category: service.category.name,
        active: service.status,
        plans: metrics.planCount,
        sales: service._count.orders,
        apiId: service.apiId,
        apiServiceId: service.apiServiceId,
        type: service.type,
        startPrice: metrics.startPrice,
        avgProfit: metrics.avgProfit,
        avgMarkup: metrics.avgMarkup,
        costedPlanCount: metrics.costedPlanCount,
      };
    });
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}

export async function toggleServiceStatus(serviceId: string) {
  await requireAdmin();
  try {
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) return { success: false, error: "Service not found" };

    await prisma.service.update({
      where: { id: serviceId },
      data: { status: !service.status },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to toggle service status:", error);
    return { success: false, error: "Failed to update service" };
  }
}

export async function createService(data: {
  name: string;
  category: string;
  active: boolean;
}) {
  await requireAdmin();
  try {
    let category = await prisma.category.findFirst({
      where: { name: data.category },
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: data.category },
      });
    }

    const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    const service = await prisma.service.create({
      data: {
        name: data.name,
        slug,
        categoryId: category.id,
        status: data.active,
      },
    });

    return { success: true, service };
  } catch (error) {
    console.error("Failed to create service:", error);
    return { success: false, error: "Failed to create service" };
  }
}

export async function updateService(serviceId: string, data: {
  name: string;
  category: string;
  slug?: string;
  apiId?: string | null;
  apiServiceId?: string | null;
  type?: string | null;
}) {
  await requireAdmin();
  try {
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) return { success: false, error: "Service not found" };

    let category = await prisma.category.findFirst({
      where: { name: data.category },
    });

    if (!category) {
      category = await prisma.category.create({
        data: { name: data.category },
      });
    }

    const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    await prisma.service.update({
      where: { id: serviceId },
      data: {
        name: data.name,
        slug,
        categoryId: category.id,
        apiId: data.apiId || null,
        apiServiceId: data.apiServiceId || null,
        type: data.type || null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to update service:", error);
    return { success: false, error: "Failed to update service" };
  }
}

export async function getProviders() {
  await requireAdmin();
  try {
    const apis = await prisma.api.findMany({
      where: { status: true },
      select: { id: true, name: true, url: true },
      orderBy: { createdAt: "desc" },
    });
    
    const providers = apis.map(api => ({
      id: api.id,
      name: api.name,
      url: api.url,
      isStreamRise: false,
    }));
    
    if (process.env.STREAMRISE_TOKEN) {
      providers.unshift({
        id: "streamrise",
        name: "StreamRise",
        url: "https://streamrise.ru",
        isStreamRise: true,
      });
    }
    
    return providers;
  } catch (error) {
    console.error("Failed to fetch providers:", error);
    return [];
  }
}

// Rates cache: apiId -> { serviceId -> rate per 1000 }
type RateMap = Record<string, number>;

async function fetchApiRates(apiId: string): Promise<RateMap> {
  const api = await prisma.api.findUnique({ where: { id: apiId } });
  if (!api) return {};

  const apiData = (api.data as Record<string, unknown>) || {};
  const keyParam = (apiData.key as string) || "key";
  const apiKey = decrypt(api.key);

  const result = await connectApi(api.url, {
    [keyParam]: apiKey,
    action: "services",
  });

  if (!result.success || !Array.isArray(result.data)) return {};

  const rates: RateMap = {};
  for (const svc of result.data) {
    if (svc.service && svc.rate != null) {
      rates[String(svc.service)] = parseFloat(svc.rate);
    }
  }
  return rates;
}

export async function syncProviderCosts(): Promise<{
  success: boolean;
  updated: number;
  skipped: number;
  details: string[];
  error?: string;
}> {
  await requireAdmin();
  const details: string[] = [];
  let updated = 0;
  let skipped = 0;

  try {
    const services = await prisma.service.findMany({
      select: { id: true, name: true, slug: true, type: true, apiId: true, apiServiceId: true, plans: true },
    });

    // Collect unique external API IDs so we only fetch each once
    const externalApiIds = new Set<string>();
    for (const svc of services) {
      if (svc.apiId && svc.apiServiceId && !isStreamRiseService(svc.type)) {
        externalApiIds.add(svc.apiId);
      }
    }

    // Fetch rate maps from each external provider
    const rateMaps: Record<string, RateMap> = {};
    for (const apiId of externalApiIds) {
      try {
        rateMaps[apiId] = await fetchApiRates(apiId);
        const count = Object.keys(rateMaps[apiId]).length;
        details.push(`Fetched ${count} service rates from provider ${apiId}`);
      } catch (err) {
        details.push(`Failed to fetch rates from provider ${apiId}: ${err}`);
        rateMaps[apiId] = {};
      }
    }

    for (const svc of services) {
      const plans = Array.isArray(svc.plans) ? (svc.plans as Array<Plan & { quantity?: number; duration?: number }>) : [];
      if (plans.length === 0) {
        skipped++;
        continue;
      }

      // External SMM API service (e.g. PureSMM)
      if (svc.apiId && svc.apiServiceId && rateMaps[svc.apiId]) {
        const ratePerK = rateMaps[svc.apiId][svc.apiServiceId];
        if (ratePerK == null || ratePerK <= 0) {
          details.push(`${svc.name}: no rate found for service #${svc.apiServiceId}`);
          skipped++;
          continue;
        }

        const updatedPlans = plans.map(plan => {
          const qty = plan.quantity ?? 0;
          if (qty <= 0) return plan;
          const cost = parseFloat(((ratePerK / 1000) * qty).toFixed(2));
          return { ...plan, cost };
        });

        await prisma.service.update({
          where: { id: svc.id },
          data: { plans: updatedPlans as Parameters<typeof prisma.service.update>[0]["data"]["plans"] },
        });

        const sample = updatedPlans[0];
        details.push(`${svc.name}: synced from API rate $${ratePerK}/1K (e.g. ${sample?.quantity ?? 0} units = $${sample?.cost})`);
        updated++;
        continue;
      }

      // StreamRise service — API doesn't expose pricing, skip
      if (isStreamRiseService(svc.type)) {
        details.push(`${svc.name}: StreamRise doesn't expose rates — costs kept as-is`);
        skipped++;
        continue;
      }

      skipped++;
    }

    return { success: true, updated, skipped, details };
  } catch (error: unknown) {
    console.error("Failed to sync provider costs:", error);
    return { success: false, updated, skipped, details, error: String(error) };
  }
}
