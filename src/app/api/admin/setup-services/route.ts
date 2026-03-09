import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// Service type mapping based on Growtwitch implementation
// Note: In Growtwitch, Service ID 1 (Followers) uses external API (PureSMM)
// while Service IDs 2,3,4,5 use StreamRise
const STREAMRISE_SERVICES: Record<string, string> = {
  "buy-viewers": "viewers", 
  "buy-clip-views": "clip_views",
  "buy-video-views": "video_views",
  "buy-chatbot": "chat_bots",
};

// Services that use external SMM APIs (like PureSMM)
const EXTERNAL_API_SERVICES = ["buy-followers"];

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results: Array<{ slug: string; type: string | null; provider: string; updated: boolean }> = [];

    // Update StreamRise services (clear apiId, set type)
    for (const [slug, type] of Object.entries(STREAMRISE_SERVICES)) {
      const service = await prisma.service.findUnique({ where: { slug } });
      
      if (service) {
        await prisma.service.update({
          where: { slug },
          data: {
            type,
            // Clear apiId for StreamRise services - they use built-in integration
            apiId: null,
            apiServiceId: null,
          },
        });
        results.push({ slug, type, provider: "StreamRise", updated: true });
      } else {
        results.push({ slug, type, provider: "StreamRise", updated: false });
      }
    }

    // External API services (keep their apiId, set type to null so they use SMM API)
    for (const slug of EXTERNAL_API_SERVICES) {
      const service = await prisma.service.findUnique({ where: { slug } });
      
      if (service) {
        // Don't clear apiId - these use external SMM APIs like PureSMM
        // Just ensure type is null so they don't get routed to StreamRise
        await prisma.service.update({
          where: { slug },
          data: {
            type: null,
          },
        });
        results.push({ slug, type: null, provider: "External API (PureSMM)", updated: true });
      } else {
        results.push({ slug, type: null, provider: "External API (PureSMM)", updated: false });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Services updated - StreamRise for viewers/clips/chatbot, External API for followers",
      results,
    });
  } catch (error) {
    console.error("Setup services error:", error);
    return NextResponse.json(
      { error: "Failed to setup services" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const services = await prisma.service.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        apiId: true,
        apiServiceId: true,
        api: { select: { name: true, url: true } },
      },
    });

    const apis = await prisma.api.findMany({
      select: {
        id: true,
        name: true,
        url: true,
        status: true,
      },
    });

    return NextResponse.json({ services, apis });
  } catch (error) {
    console.error("Setup services GET error:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }
}
