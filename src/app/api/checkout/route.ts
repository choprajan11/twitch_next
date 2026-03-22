import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { isDisposableEmail, rateLimit } from "@/lib/security";
import { processOrderImmediately } from "@/lib/orderProcessor";
import { processStripeRequest } from "@/lib/stripe";
import { createOxaPayInvoice } from "@/lib/oxapay";
import { logSecurityEvent, detectSuspiciousInput, getClientIp } from "@/lib/security-monitor";

type Plan = {
  id: string;
  name: string;
  price: number;
  quantity?: number;
  duration?: number;
  popular?: boolean;
  frequency?: "weekly" | "monthly";
};

function generateOid(): string {
  const bytes = crypto.randomBytes(4);
  const rand = bytes.toString("hex").slice(0, 6);
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
    const { serviceSlug, planId, link, email, paymentMethod, comments, agreedToTerms, addon, boosts } = body;

    if (!serviceSlug || !planId || !link || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!agreedToTerms) {
      return NextResponse.json(
        { error: "Please agree to the Terms of Service and Refund Policy" },
        { status: 400 }
      );
    }

    const inputsToScan = [serviceSlug, planId, link, email, comments].filter(Boolean);
    if (inputsToScan.some((val) => typeof val === "string" && detectSuspiciousInput(val))) {
      logSecurityEvent({
        type: "suspicious_input",
        severity: "critical",
        ip: getClientIp(req),
        path: "/api/checkout",
        method: "POST",
        details: { serviceSlug, link: link?.substring(0, 50) },
        blocked: true,
      });
      return NextResponse.json(
        { error: "Invalid input detected" },
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

    if (service.type === "followers" || service.slug?.includes("follower")) {
      try {
        const twitchRes = await fetch("https://gql.twitch.tv/gql", {
          method: "POST",
          headers: {
            "Client-ID": process.env.TWITCH_GQL_CLIENT_ID!,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `query { user(login: "${parsedLink.replace(/[^a-zA-Z0-9_]/g, "")}") { id } }`,
          }),
        });
        const twitchData = await twitchRes.json();
        if (!twitchData?.data?.user) {
          return NextResponse.json(
            { error: "Twitch account not found. Please check the username and ensure your account has a verified email and phone number." },
            { status: 400 }
          );
        }
      } catch {
        // Don't block order if Twitch API is temporarily unavailable
      }
    }

    const user = await prisma.user.upsert({
      where: { email: emailClean },
      create: { email: emailClean },
      update: {},
    });

    const activeOrder = await prisma.order.findFirst({
      where: {
        serviceId: service.id,
        link: parsedLink,
        status: { in: ["pending", "processing", "inprogress"] },
      },
    });
    if (activeOrder) {
      return NextResponse.json(
        { error: "There is already an active order for this Twitch account. Please wait until it is completed or cancelled before placing a new one." },
        { status: 409 }
      );
    }

    let finalPrice = Number(selectedPlan.price.toFixed(2));
    let finalQuantity = planValue;
    let addonQuantity: number | false = false;

    if (addon) {
      const svcConfig = service.config as Record<string, unknown> | null;
      const addonCfg = svcConfig?.addon as { quantity?: number; price?: number } | undefined;
      if (addonCfg?.quantity && addonCfg.quantity > 0 && addonCfg?.price && addonCfg.price > 0) {
        finalPrice = Number((finalPrice + addonCfg.price).toFixed(2));
        finalQuantity += addonCfg.quantity;
        addonQuantity = addonCfg.quantity;
      }
    }

    const price = finalPrice;
    const oid = generateOid();
    const gateway =
      paymentMethod === "crypto"
        ? "oxapay"
        : paymentMethod === "wallet"
        ? "wallet"
        : "stripe";

    let discountedPrice = price;
    if (gateway === "oxapay") {
      discountedPrice = Number((price * 0.7).toFixed(2));
    } else if (gateway === "stripe") {
      discountedPrice = Number((price * 0.85).toFixed(2));
    }

    // Sanitize boosts — only allow known boolean keys
    const sanitizedBoosts =
      boosts && typeof boosts === "object"
        ? {
            ...(boosts.claimPoints === true ? { claimPoints: true } : {}),
            ...(boosts.joinRaids === true ? { joinRaids: true } : {}),
          }
        : undefined;

    const order = await prisma.order.create({
      data: {
        oid,
        userId: user.id,
        serviceId: service.id,
        apiId: service.apiId,
        status: "payment",
        link: parsedLink,
        price: discountedPrice,
        quantity: finalQuantity,
        gateway,
        data: {
          mode: "web",
          service: service.name,
          plan: selectedPlan.name,
          ...(addonQuantity ? { addon: addonQuantity } : {}),
          ...(comments ? { comments } : {}),
          ...(selectedPlan.frequency ? { frequency: selectedPlan.frequency } : {}),
          ...(sanitizedBoosts && Object.keys(sanitizedBoosts).length > 0 ? { boosts: sanitizedBoosts } : {}),
        },
      },
    });

    if (gateway === "oxapay") {
      try {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
        const invoice = await createOxaPayInvoice({
          amount: discountedPrice,
          orderId: oid,
          email: emailClean,
          description: `${service.name} - ${selectedPlan.name}`,
          returnUrl: `${appUrl}/checkout/success?session_id=${oid}`,
          callbackUrl: `${appUrl}/api/webhooks/oxapay`,
        });

        return NextResponse.json({ url: invoice.data.payment_url });
      } catch (error) {
        console.error("OxaPay error:", error);
        return NextResponse.json(
          { error: "Failed to initialize crypto payment" },
          { status: 500 }
        );
      }
    }

    if (gateway === "wallet") {
      const session = await getSession();
      if (!session || session.userId !== user.id) {
        return NextResponse.json(
          { error: "Please log in to use wallet payment" },
          { status: 401 }
        );
      }

      const walletResult = await prisma.$transaction(async (tx) => {
        const freshUser = await tx.user.findUnique({
          where: { id: user.id },
        });
        if (!freshUser || freshUser.funds < price) {
          return { success: false as const };
        }

        await tx.user.update({
          where: { id: user.id, funds: { gte: price } },
          data: { funds: { decrement: price } },
        });
        await tx.order.update({
          where: { id: order.id },
          data: { status: "pending", txnId: `WAL-${crypto.randomUUID()}` },
        });
        await tx.fundLog.create({
          data: {
            userId: user.id,
            type: "deduct",
            amount: price,
            oldFunds: freshUser.funds,
            newFunds: freshUser.funds - price,
            note: `Order ${oid} - ${service.name}`,
          },
        });

        return { success: true as const };
      });

      if (!walletResult.success) {
        return NextResponse.json(
          { error: "Insufficient funds in wallet" },
          { status: 400 }
        );
      }

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
      amount: discountedPrice,
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
