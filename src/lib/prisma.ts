import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function buildDatasourceUrl() {
  let url = process.env.DATABASE_URL ?? "";
  const separator = url.includes("?") ? "&" : "?";
  const params: string[] = [];
  if (!url.includes("connection_limit")) params.push("connection_limit=10");
  if (!url.includes("pool_timeout")) params.push("pool_timeout=30");
  if (!url.includes("pgbouncer")) params.push("pgbouncer=true");
  if (params.length) url += separator + params.join("&");
  return url;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasourceUrl: buildDatasourceUrl(),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
