import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import NewOrderForm from "./NewOrderForm";

export const metadata = {
  title: "New Order - GrowTwitch",
  description: "Place a new order from your dashboard",
};

export default async function NewOrderPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role === "admin") redirect("/admin");

  const services = await prisma.service.findMany({
    where: { status: true, stock: true },
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
          New Order
        </h1>
        <p className="text-zinc-500 mt-1">
          Select a service and place your order
        </p>
      </div>
      <NewOrderForm
        services={services as any}
        userEmail={user.email}
        walletBalance={user.funds}
      />
    </>
  );
}
