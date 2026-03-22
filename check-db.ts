import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const services = await prisma.service.findMany({ select: { slug: true, name: true } });
  console.log(services);
}
main().catch(console.error).finally(() => prisma.$disconnect());
