import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminNewOrderForm from "./NewOrderForm";

export const metadata = {
  title: "Create Order - Admin",
  description: "Create a new order as admin",
};

export default async function AdminNewOrderPage() {
  try {
    await requireAdmin();
  } catch {
    redirect("/login");
  }

  const services = await prisma.service.findMany({
    where: { status: true },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      type: true,
      plans: true,
      category: { select: { name: true } },
    },
  });

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-zinc-900 dark:text-white">
          Create Order
        </h1>
        <p className="text-zinc-500 mt-1">
          Place a free order for any customer
        </p>
      </div>
      <AdminNewOrderForm services={services as any} />
    </>
  );
}
