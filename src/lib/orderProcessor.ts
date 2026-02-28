import { prisma } from "./prisma";
import { connectApi } from "./providers";

interface ApiProvider {
  id: string;
  url: string;
  key: string;
  data: any;
}

function normalizeOrderStatus(status: string): string {
  const s = status.toLowerCase().replace(/\s/g, "");
  if (["pending", "processing"].includes(s)) return "processing";
  if (["cancelled", "canceled"].includes(s)) return "cancelled";
  if (
    ["partial", "refunded", "cancelling", "refilling", "completed", "inprogress"].includes(s)
  )
    return s;
  return "processing";
}

async function refundOrder(
  orderId: string,
  userId: string,
  price: number,
  quantity: number,
  remains: number,
  status: string
) {
  const refundQty = status === "partial" && remains > 0 ? remains : quantity;
  const rate = price / quantity;
  const refundAmount = Number((refundQty * rate).toFixed(2));

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { funds: { increment: refundAmount } },
    }),
    prisma.fundLog.create({
      data: {
        userId,
        type: "refund",
        amount: refundAmount,
        oldFunds: user.funds,
        newFunds: user.funds + refundAmount,
        note: `Order refund (${status})`,
      },
    }),
  ]);
}

async function sendSingleOrder(
  order: any,
  apis: Map<string, ApiProvider>
) {
  const service = order.service;
  if (!service) {
    await prisma.order.update({
      where: { id: order.id },
      data: { log: "Service not available" },
    });
    return;
  }

  const api = order.apiId ? apis.get(order.apiId) : null;
  if (!api) {
    await prisma.order.update({
      where: { id: order.id },
      data: { log: "API provider not configured" },
    });
    return;
  }

  try {
    const apiData = api.data || {};
    const keyParam = apiData.key || "key";
    const serviceParam = apiData.service || "service";

    const orderPayload: Record<string, any> = {
      [keyParam]: api.key,
      action: "add",
      [serviceParam]: service.apiServiceId || "",
      link: order.link,
      quantity: order.quantity,
    };

    const response = await connectApi(api.url, orderPayload);

    if (!response.success) {
      await prisma.order.update({
        where: { id: order.id },
        data: { log: response.error || "API request failed" },
      });
      return;
    }

    const data = response.data;

    if (data?.error) {
      const knownErrors: Record<string, string> = {
        wrongChannel: "Invalid Link",
        "id is empty": "Invalid Link",
        wrongId: "Invalid Username",
        alreadyExists: "Duplicate Order",
      };
      const errorMsg = knownErrors[data.error] || data.error;
      const shouldCancel = ["wrongChannel", "wrongId", "id is empty"].includes(
        data.error
      );

      await prisma.order.update({
        where: { id: order.id },
        data: {
          log: errorMsg,
          status: shouldCancel ? "cancelled" : order.status,
        },
      });
      return;
    }

    const apiOrderId = data?.order || data?.orderId;
    if (!apiOrderId) {
      await prisma.order.update({
        where: { id: order.id },
        data: { log: "No order ID returned from API" },
      });
      return;
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        apiOrderId: String(apiOrderId),
        log: null,
        status: "processing",
      },
    });
  } catch (error: any) {
    await prisma.order.update({
      where: { id: order.id },
      data: { log: error.message || "Unknown error" },
    });
  }
}

async function updateSingleOrder(
  order: any,
  apis: Map<string, ApiProvider>
) {
  const api = order.apiId ? apis.get(order.apiId) : null;
  if (!api) {
    await prisma.order.update({
      where: { id: order.id },
      data: { log: "API provider not found" },
    });
    return;
  }

  try {
    const apiData = api.data || {};
    const keyParam = apiData.key || "key";

    const response = await connectApi(api.url, {
      [keyParam]: api.key,
      action: "status",
      order: order.apiOrderId,
    });

    if (!response.success || !response.data) {
      await prisma.order.update({
        where: { id: order.id },
        data: { log: response.error || "No response from API" },
      });
      return;
    }

    const data = response.data;

    if (data.error) {
      await prisma.order.update({
        where: { id: order.id },
        data: { log: data.error },
      });
      return;
    }

    if (!data.status) {
      await prisma.order.update({
        where: { id: order.id },
        data: { log: "Invalid API response - status missing" },
      });
      return;
    }

    const newStatus = normalizeOrderStatus(data.status);

    if (["cancelled", "refunded", "partial"].includes(newStatus)) {
      await refundOrder(
        order.id,
        order.userId,
        order.price,
        order.quantity,
        data.remains ?? order.remains,
        newStatus
      );
    }

    await prisma.order.update({
      where: { id: order.id },
      data: {
        log: null,
        status: newStatus,
        startCount: data.start_count ?? order.startCount,
        remains: data.remains ?? order.remains,
      },
    });
  } catch (error: any) {
    await prisma.order.update({
      where: { id: order.id },
      data: { log: error.message || "Unknown error" },
    });
  }
}

export async function sendPendingOrders(): Promise<number> {
  const orders = await prisma.order.findMany({
    where: {
      status: "pending",
      apiId: { not: null },
      apiOrderId: null,
    },
    include: { service: true },
  });

  if (orders.length === 0) return 0;

  const rawApis = await prisma.api.findMany({ where: { status: true } });
  const apis = new Map<string, ApiProvider>();
  for (const api of rawApis) {
    apis.set(api.id, api as ApiProvider);
  }

  for (const order of orders) {
    await sendSingleOrder(order, apis);
  }

  return orders.length;
}

export async function updateProcessingOrders(): Promise<number> {
  const orders = await prisma.order.findMany({
    where: {
      apiOrderId: { not: null },
      status: { in: ["processing", "cancelling", "refilling"] },
    },
  });

  if (orders.length === 0) return 0;

  const rawApis = await prisma.api.findMany({ where: { status: true } });
  const apis = new Map<string, ApiProvider>();
  for (const api of rawApis) {
    apis.set(api.id, api as ApiProvider);
  }

  for (const order of orders) {
    await updateSingleOrder(order, apis);
  }

  return orders.length;
}

export async function cleanupStalePaymentOrders(): Promise<number> {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const result = await prisma.order.deleteMany({
    where: {
      status: "payment",
      createdAt: { lt: oneMonthAgo },
    },
  });

  return result.count;
}
