"use server";

import { prisma } from "@/lib/prisma";

interface Plan {
  name: string;
  quantity: number;
  price: number;
  popular?: boolean;
}

export async function getServiceWithPlans(serviceId: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: {
        id: true,
        name: true,
        slug: true,
        plans: true,
      },
    });

    if (!service) return null;

    return {
      id: service.id,
      name: service.name,
      slug: service.slug,
      plans: (service.plans as Plan[]) || [],
    };
  } catch (error) {
    console.error("Failed to fetch service:", error);
    return null;
  }
}

export async function updateServicePlans(serviceId: string, plans: Plan[]) {
  try {
    await prisma.service.update({
      where: { id: serviceId },
      data: {
        plans: plans as unknown as Parameters<typeof prisma.service.update>[0]["data"]["plans"],
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to update service plans:", error);
    return { success: false, error: "Failed to update plans" };
  }
}
