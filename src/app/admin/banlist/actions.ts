"use server";

import { prisma } from "@/lib/prisma";

export async function getBannedUsers() {
  try {
    return await prisma.banList.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch ban list:", error);
    return [];
  }
}

export async function addBannedUser(username: string) {
  try {
    const cleaned = username.toLowerCase().trim().replace(/\s/g, "");
    if (!cleaned) return { success: false, error: "Username is required" };

    const exists = await prisma.banList.findUnique({
      where: { username: cleaned },
    });
    if (exists) return { success: false, error: "Username already banned" };

    await prisma.banList.create({ data: { username: cleaned } });
    return { success: true };
  } catch (error) {
    console.error("Failed to ban user:", error);
    return { success: false, error: "Failed to add to ban list" };
  }
}

export async function removeBannedUser(id: string) {
  try {
    await prisma.banList.delete({ where: { id } });
    return { success: true };
  } catch (error) {
    console.error("Failed to unban user:", error);
    return { success: false, error: "Failed to remove from ban list" };
  }
}
