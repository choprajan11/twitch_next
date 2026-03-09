import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const severity = searchParams.get("severity");
  const type = searchParams.get("type");
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 200);
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);

  const where: Record<string, unknown> = {};
  if (severity) where.severity = severity;
  if (type) where.type = type;

  try {
    const [events, total] = await Promise.all([
      prisma.securityEvent.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.securityEvent.count({ where }),
    ]);

    const criticalCount = await prisma.securityEvent.count({
      where: {
        severity: "critical",
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    });

    return NextResponse.json({
      events,
      total,
      pages: Math.ceil(total / limit),
      criticalLast24h: criticalCount,
    });
  } catch (error) {
    console.error("Failed to fetch security events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
