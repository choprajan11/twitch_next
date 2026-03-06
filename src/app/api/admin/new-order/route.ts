import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type Plan = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

function generateOid(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const rand = Array.from({ length: 4 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  return `GT-${Date.now()}-${rand}`;
}

function parseTwitchLink(input: string, serviceType?: string | null): string {
  const cleaned = input.replace(/\s/g, "");
  if (!cleaned) throw new Error("Please provide a valid input");

  if (serviceType === "clip_views") {
    const clipMatch = cleaned.match(
      /(?:https?:\/\/)?(?:www\.)?(?:twitch\.tv\/)?([a-zA-Z0-9_-]+)\/clip\/([a-zA-Z0-9_-]+)/
    );
    if (clipMatch) return clipMatch[2].split("?")[0];
    const clipsMatch = cleaned.match(
      /(?:https?:\/\/)?(?:clips\.twitch\.tv\/)([a-zA-Z0-9_-]+)/
    );
    if (clipsMatch) return clipsMatch[1].split("?")[0];
    throw new Error("Please enter a valid clip link");
  }

  if (serviceType === "video_views") {
    const videoMatch = cleaned.match(
      /(?:https?:\/\/)?(?:www\.|m\.)?(?:twitch\.tv\/)?(?:videos\/)?([0-9]+)/
    );
    if (videoMatch) return videoMatch[1];
    throw new Error("Please enter a valid video link");
  }

  const userMatch = cleaned.match(
    /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:twitch\.tv\/)?@?([a-zA-Z0-9_]+)/
  );
  return userMatch ? userMatch[1] : cleaned;
}

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();
    const { serviceId, planId, link, email, customQuantity } = body;

    if (!serviceId || !link || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailClean = email.toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailClean)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });
    if (!service) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    let quantity = customQuantity ? Number(customQuantity) : 0;
    let planName = "Admin Custom";

    if (planId && service.plans) {
      const plans = service.plans as unknown as Plan[];
      const selectedPlan = plans.find((p) => p.id === planId);
      if (selectedPlan) {
        quantity = selectedPlan.quantity;
        planName = selectedPlan.name;
      }
    }

    if (!quantity || quantity <= 0) {
      return NextResponse.json(
        { error: "Quantity must be greater than 0" },
        { status: 400 }
      );
    }

    let parsedLink: string;
    try {
      parsedLink = parseTwitchLink(link, service.type);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { email: emailClean },
      create: { email: emailClean },
      update: {},
    });

    const oid = generateOid();

    await prisma.order.create({
      data: {
        oid,
        userId: user.id,
        serviceId: service.id,
        apiId: service.apiId,
        status: "pending",
        link: parsedLink,
        price: 0,
        quantity,
        gateway: "admin",
        data: {
          mode: "admin",
          service: service.name,
          plan: planName,
        },
      },
    });

    return NextResponse.json({ success: true, oid });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Admin new-order error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
