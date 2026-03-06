import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { isDisposableEmail, rateLimit } from "@/lib/security";
import { processOrderImmediately } from "@/lib/orderProcessor";
import { processStripeRequest } from "@/lib/stripe";

type Plan = {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  duration?: number;
  popular?: boolean;
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
    const body = await req.json();
    const { serviceSlug, planId, link, email, paymentMethod, comments } = body;

    if (!serviceSlug || !planId || !link || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailClean = email.toLowerCase().trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailClean)) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    if (isDisposableEmail(emailClean)) {
      return NextResponse.json(
        { error: "Disposable email addresses are not allowed" },
        { status: 400 }
      );
    }

    const { allowed } = rateLimit(`checkout:${emailClean}`, 10, 60_000);
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const service = await prisma.service.findUnique({
      where: { slug: serviceSlug, status: true },
    });
    if (!service || !service.plans) {
      return NextResponse.json(
        { error: "Service not found" },
        { status: 404 }
      );
    }

    const plans = service.plans as unknown as Plan[];
    const selectedPlan = plans.find((p) => p.id === planId);
    if (!selectedPlan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const planValue = selectedPlan.quantity ?? selectedPlan.duration;
    if (!planValue) {
      return NextResponse.json(
        { error: "Selected plan is not configured correctly" },
        { status: 400 }
      );
    }

    let parsedLink: string;
    try {
      parsedLink = parseTwitchLink(link, service.type);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }

    const banned = await prisma.banList.findUnique({
      where: { username: parsedLink.toLowerCase() },
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

    const price = Number(selectedPlan.price.toFixed(2));
    const oid = generateOid();
    const gateway =
      paymentMethod === "crypto"
        ? "crypto"
        : paymentMethod === "wallet"
          ? "wallet"
          : "stripe";

    const order = await prisma.order.create({
      data: {
        oid,
        userId: user.id,
        serviceId: service.id,
        apiId: service.apiId,
        status: "payment",
        link: parsedLink,
        price,
        quantity: planValue,
        gateway,
        data: {
          mode: "web",
          service: service.name,
          plan: selectedPlan.name,
          ...(comments ? { comments } : {}),
        },
      },
    });

    if (gateway === "crypto") {
      return NextResponse.json({
        url: "/checkout/failed?reason=crypto_coming_soon",
      });
    }

    if (gateway === "wallet") {
      const session = await getSession();
      if (!session || session.userId !== user.id) {
        return NextResponse.json(
          { error: "Please log in to use wallet payment" },
          { status: 401 }
        );
      }

      const freshUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      if (!freshUser || freshUser.funds < price) {
        return NextResponse.json(
          { error: "Insufficient funds in wallet" },
          { status: 400 }
        );
      }

      await prisma.$transaction([
        prisma.user.update({
          where: { id: user.id },
          data: { funds: { decrement: price } },
        }),
        prisma.order.update({
          where: { id: order.id },
          data: { status: "pending", txnId: `WAL${Date.now()}` },
        }),
        prisma.fundLog.create({
          data: {
            userId: user.id,
            type: "deduct",
            amount: price,
            oldFunds: freshUser.funds,
            newFunds: freshUser.funds - price,
            note: `Order ${oid} - ${service.name}`,
          },
        }),
      ]);

      const processed = await processOrderImmediately(order.id);
      console.log(`Wallet order ${oid} processing result:`, processed);

      return NextResponse.json({
        url: `/checkout/success?order=${oid}`,
        oid,
      });
    }

    const stripeResult = await processStripeRequest({
      orderId: order.id,
      oid,
      email: emailClean,
      amount: price,
      serviceSlug: service.slug,
      quantity: planValue,
    });

    if (!stripeResult) {
      return NextResponse.json(
        { error: "Payment processing failed. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: stripeResult.redirectUrl });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
