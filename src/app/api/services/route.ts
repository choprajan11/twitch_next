import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const services = await prisma.service.findMany({
    where: { status: true },
    orderBy: { createdAt: "asc" },
    select: { name: true, slug: true },
  });

  return NextResponse.json(services, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
