"use server";

import { prisma } from "@/lib/prisma";

export async function getAdminStats() {
  try {
    const [
      totalRevenue,
      ordersToday,
      pendingRefills,
      newCustomersThisMonth,
    ] = await Promise.all([
      prisma.order.aggregate({
        _sum: { price: true },
        where: { status: { not: "payment" } },
      }),
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.order.count({
        where: { status: "refill" },
      }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(1)),
          },
        },
      }),
    ]);

    return {
      totalRevenue: totalRevenue._sum.price || 0,
      ordersToday,
      pendingRefills,
      newCustomers: newCustomersThisMonth,
    };
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    return {
      totalRevenue: 0,
      ordersToday: 0,
      pendingRefills: 0,
      newCustomers: 0,
    };
  }
}

export async function getRecentOrders(limit = 10) {
  try {
    const orders = await prisma.order.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        service: { select: { name: true } },
        user: { select: { email: true } },
      },
    });

    return orders.map((order) => ({
      id: order.oid || order.id,
      service: order.service.name,
      target: order.link || "N/A",
      status: order.status,
      amount: order.price,
      customer: order.user.email,
      date: order.createdAt,
      gateway: order.gateway,
    }));
  } catch (error) {
    console.error("Failed to fetch recent orders:", error);
    return [];
  }
}

export async function getAllOrders(page = 1, limit = 20) {
  try {
    const skip = (page - 1) * limit;
    
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          service: { select: { name: true } },
          user: { select: { email: true, name: true } },
        },
      }),
      prisma.order.count(),
    ]);

    return {
      orders: orders.map((order) => ({
        id: order.oid || order.id,
        service: order.service.name,
        target: order.link || "N/A",
        status: order.status,
        amount: order.price,
        customer: order.user.email,
        customerName: order.user.name,
        date: order.createdAt,
        gateway: order.gateway,
        quantity: order.quantity,
      })),
      total,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return { orders: [], total: 0, pages: 0 };
  }
}

export async function getAllUsers(page = 1, limit = 20) {
  try {
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { orders: true } },
        },
      }),
      prisma.user.count(),
    ]);

    return {
      users: users.map((user) => ({
        id: user.id,
        name: user.name || "Unknown",
        email: user.email,
        funds: user.funds,
        status: user.status ? "active" : "banned",
        role: user.role,
        ordersCount: user._count.orders,
        createdAt: user.createdAt,
      })),
      total,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return { users: [], total: 0, pages: 0 };
  }
}

export async function toggleUserStatus(userId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { success: false, error: "User not found" };

    await prisma.user.update({
      where: { id: userId },
      data: { status: !user.status },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to toggle user status:", error);
    return { success: false, error: "Failed to update user" };
  }
}

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
      plans: Array.isArray(service.plans) ? service.plans.length : 0,
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

export async function getCustomers(page = 1, limit = 20) {
  try {
    const skip = (page - 1) * limit;
    
    const [customers, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        where: { role: "user" },
        orderBy: { createdAt: "desc" },
        include: {
          orders: {
            select: { price: true },
            where: { status: { not: "payment" } },
          },
          _count: { select: { orders: true } },
        },
      }),
      prisma.user.count({ where: { role: "user" } }),
    ]);

    return {
      customers: customers.map((customer) => ({
        id: customer.id,
        name: customer.name || "Unknown",
        email: customer.email,
        ltv: customer.orders.reduce((sum, order) => sum + order.price, 0),
        ordersCount: customer._count.orders,
        status: customer.status ? "Active" : "Banned",
        createdAt: customer.createdAt,
      })),
      total,
      pages: Math.ceil(total / limit),
    };
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    return { customers: [], total: 0, pages: 0 };
  }
}

export async function getRefillRequests() {
  try {
    const refills = await prisma.order.findMany({
      where: { status: "refill" },
      orderBy: { updatedAt: "desc" },
      include: {
        user: { select: { email: true } },
        service: { select: { name: true } },
      },
    });

    return refills.map((order) => ({
      id: order.id,
      orderId: order.oid || order.id,
      customer: order.user.email,
      target: order.link || "N/A",
      service: order.service.name,
      requestedAt: order.updatedAt,
      status: "Pending Review",
    }));
  } catch (error) {
    console.error("Failed to fetch refills:", error);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, newStatus: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, error: "Failed to update order" };
  }
}
