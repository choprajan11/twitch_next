"use server";

import { prisma } from "@/lib/prisma";

export async function getAllServices() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { name: true } },
        _count: { select: { orders: true } },
      },
    });

    return services.map((service) => ({
      id: service.id,
      name: service.name,
      slug: service.slug,
      category: service.category.name,
      active: service.status,
      plans: Array.isArray(service.plans) ? (service.plans as unknown[]).length : 0,
      sales: service._count.orders,
    }));
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}

export async function toggleServiceStatus(serviceId: string) {
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
  slug: string;
}) {
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
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to update service:", error);
    return { success: false, error: "Failed to update service" };
  }
}
