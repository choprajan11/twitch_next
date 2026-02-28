import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isDisposableEmail, rateLimit } from "@/lib/security";

const FREE_QUANTITY = 10;

function generateOid(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const rand = Array.from({ length: 4 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  return `GT-${Date.now()}-${rand}`;
}

export async function POST(req: NextRequest) {
  try {
    const { username, email } = await req.json();

    if (!username || !email) {
      return NextResponse.json({ error: "Username and email are required" }, { status: 400 });
    }

    const cleanUsername = username.trim().replace(/^@/, "").toLowerCase();
    if (!/^[a-z0-9_]{3,25}$/.test(cleanUsername)) {
      return NextResponse.json({ error: "Please enter a valid Twitch username" }, { status: 400 });
    }

    const emailClean = email.toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailClean)) {
      return NextResponse.json({ error: "Please provide a valid email address" }, { status: 400 });
    }

    if (isDisposableEmail(emailClean)) {
      return NextResponse.json(
        { error: "Disposable email addresses are not allowed. Please use a real email." },
        { status: 400 }
      );
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const { allowed } = rateLimit(`free-trial:${ip}`, 3, 3600_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const followersService = await prisma.service.findFirst({
      where: {
        status: true,
        OR: [
          { slug: { contains: "follower" } },
          { type: "followers" },
        ],
      },
    });

    if (!followersService) {
      return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 });
    }

    const banned = await prisma.banList.findUnique({
      where: { username: cleanUsername },
    });
    if (banned) {
      return NextResponse.json(
        { error: "This account is restricted. Please contact support." },
        { status: 403 }
      );
    }

    const user = await prisma.user.upsert({
      where: { email: emailClean },
      create: { email: emailClean },
      update: {},
    });

    const existingOrder = await prisma.order.findFirst({
      where: {
        gateway: "promo",
        serviceId: followersService.id,
        OR: [
          { link: cleanUsername },
          { userId: user.id },
        ],
        status: { notIn: ["cancelled", "failed"] },
      },
    });

    if (existingOrder) {
      return NextResponse.json(
        { error: "You have already claimed your free followers. Only one free trial per channel." },
        { status: 409 }
      );
    }

    const oid = generateOid();

    await prisma.order.create({
      data: {
        oid,
        userId: user.id,
        serviceId: followersService.id,
        apiId: followersService.apiId,
        status: "pending",
        link: cleanUsername,
        quantity: FREE_QUANTITY,
        price: 0,
        gateway: "promo",
        data: {
          mode: "web",
          service: followersService.name,
          api_service_id: followersService.apiServiceId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Your free followers are on the way!",
      oid,
    });
  } catch (error) {
    console.error("Free trial error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
