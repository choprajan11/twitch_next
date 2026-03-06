"use server";

import { prisma } from "@/lib/prisma";
import { verifyApi, connectApi } from "@/lib/providers";
import { encrypt, decrypt } from "@/lib/encryption";

export async function getProviders() {
  try {
    const apis = await prisma.api.findMany({
      where: { status: true },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { services: true, orders: true } } },
    });

    return apis.map((api) => ({
      id: api.id,
      name: api.name,
      url: api.url,
      balance: (api.data as any)?.balance ?? null,
      currency: (api.data as any)?.currency ?? "USD",
      servicesCount: api._count.services,
      ordersCount: api._count.orders,
      createdAt: api.createdAt,
    }));
  } catch (error) {
    console.error("Failed to fetch providers:", error);
    return [];
  }
}

export async function addProvider(url: string, key: string) {
  try {
    const trimmedUrl = url.replace(/\s/g, "").trim();

    const exists = await prisma.api.findFirst({
      where: { url: trimmedUrl, status: true },
    });
    if (exists) {
      return { success: false, error: "API provider already exists" };
    }

    const verification = await verifyApi(trimmedUrl, key);
    if (!verification.success) {
      return { success: false, error: "Invalid API credentials" };
    }

    const hostName = new URL(trimmedUrl).hostname.split(".")[0];

    // Encrypt the API key before storing
    const encryptedKey = encrypt(key);

    await prisma.api.create({
      data: {
        name: hostName,
        url: trimmedUrl,
        key: encryptedKey,
        status: true,
        data: {
          balance: verification.balance ?? 0,
          currency: "USD",
          key: "key",
          service: "service",
          services: "services",
        },
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Failed to add provider:", error);
    return { success: false, error: error.message || "Failed to add provider" };
  }
}

export async function deleteProvider(id: string) {
  try {
    await prisma.service.updateMany({
      where: { apiId: id },
      data: { status: false },
    });

    await prisma.api.update({
      where: { id },
      data: { status: false },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to delete provider:", error);
    return { success: false, error: "Failed to delete provider" };
  }
}

export async function checkBalance(id: string) {
  try {
    const api = await prisma.api.findUnique({ where: { id } });
    if (!api) return { success: false, error: "Provider not found" };

    const apiData = (api.data as any) || {};
    const keyParam = apiData.key || "key";

    // Decrypt the API key before using
    const apiKey = decrypt(api.key);

    const response = await connectApi(api.url, {
      [keyParam]: apiKey,
      action: "balance",
    });

    if (response.success && response.data?.balance !== undefined) {
      const balance = parseFloat(response.data.balance);
      await prisma.api.update({
        where: { id },
        data: {
          data: { ...apiData, balance },
        },
      });
      return {
        success: true,
        balance,
        currency: response.data.currency || apiData.currency || "USD",
      };
    }

    return {
      success: false,
      error: response.data?.error || "Failed to check balance",
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateProvider(
  id: string,
  key: string,
  commission?: number
) {
  try {
    const api = await prisma.api.findUnique({ where: { id } });
    if (!api) return { success: false, error: "Provider not found" };

    const apiData = (api.data as any) || {};
    if (commission !== undefined) apiData.commission = commission;

    // Encrypt the new API key before storing
    const encryptedKey = encrypt(key);

    await prisma.api.update({
      where: { id },
      data: { key: encryptedKey, data: apiData },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to update provider:", error);
    return { success: false, error: "Failed to update provider" };
  }
}
