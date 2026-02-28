import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { isDisposableEmail, rateLimit } from "@/lib/security";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
});

const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

type Plan = {
  id: string;
  name: string;
  price: number;
  quantity: number;
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
    const { serviceSlug, planId, link, email, paymentMethod } = body;

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

    const plans = service.plans as Plan[];
    const selectedPlan = plans.find((p) => p.id === planId);
    if (!selectedPlan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
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

    const duplicateOrder = await prisma.order.findFirst({
      where: {
        userId: user.id,
        link: parsedLink,
        serviceId: service.id,
        status: { notIn: ["completed", "cancelled", "failed"] },
      },
    });
    if (duplicateOrder) {
      return NextResponse.json(
        { error: "A similar order is already in process" },
        { status: 409 }
      );
    }

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
        quantity: selectedPlan.quantity,
        gateway,
        data: {
          mode: "web",
          service: service.name,
          plan: selectedPlan.name,
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

      return NextResponse.json({
        url: `/checkout/success?order=${oid}`,
      });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${service.name} - ${selectedPlan.name}`,
              description: `${selectedPlan.quantity} ${service.name} for ${parsedLink}`,
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      client_reference_id: oid,
      customer_email: emailClean,
      metadata: {
        orderId: order.id,
        oid,
        userId: user.id,
      },
      success_url: `${BASE_URL}/checkout/success?oid={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/checkout/failed`,
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
