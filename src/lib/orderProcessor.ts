import { prisma } from "./prisma";
import { connectApi } from "./providers";
import { createStreamRiseOrder, getStreamRiseOrderStatus, isStreamRiseService } from "./streamrise";
import { decrypt } from "./encryption";

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

  const orderData = (order.data as Record<string, any>) || {};

  // Check if this is a StreamRise service (based on service type)
  if (isStreamRiseService(service.type)) {
    try {
      const response = await createStreamRiseOrder(
        service.type,
        order.link,
        order.quantity,
        orderData.comments
      );

      if (!response.success) {
        const knownErrors: Record<string, string> = {
          wrongChannel: "Invalid Link",
          wrongId: "Invalid Username",
          alreadyExists: "Duplicate Order",
        };
        const errorMsg = knownErrors[response.error || ""] || response.error || "StreamRise error";
        const shouldCancel = ["wrongChannel", "wrongId"].includes(response.error || "");

        await prisma.order.update({
          where: { id: order.id },
          data: {
            log: errorMsg,
            status: shouldCancel ? "cancelled" : order.status,
          },
        });
        return;
      }

      await prisma.order.update({
        where: { id: order.id },
        data: {
          apiOrderId: response.orderId,
          log: null,
          status: "processing",
        },
      });
      return;
    } catch (error: any) {
      await prisma.order.update({
        where: { id: order.id },
        data: { log: error.message || "StreamRise error" },
      });
      return;
    }
  }

  // Standard SMM API flow
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

    // Decrypt API key if encrypted
    const apiKey = decrypt(api.key);

    const orderPayload: Record<string, any> = {
      [keyParam]: apiKey,
      action: "add",
      [serviceParam]: service.apiServiceId || "",
      link: order.link,
      quantity: order.quantity,
    };

    if (orderData.comments) {
      orderPayload.comments = orderData.comments;
    }

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
  // Check if this is a StreamRise order (by service type)
  const service = order.service;
  if (service && isStreamRiseService(service.type)) {
    try {
      const result = await getStreamRiseOrderStatus(order.apiOrderId);

      if (result.completed) {
        // In StreamRise, if order is NOT in history, it's completed
        await prisma.order.update({
          where: { id: order.id },
          data: {
            log: null,
            status: "completed",
            remains: 0,
          },
        });
      }
      // If still in history, order is still processing - no update needed
    } catch (error: any) {
      await prisma.order.update({
        where: { id: order.id },
        data: { log: error.message || "StreamRise status check error" },
      });
    }
    return;
  }

  // Standard SMM API flow
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

    // Decrypt API key if encrypted
    const apiKey = decrypt(api.key);

    const response = await connectApi(api.url, {
      [keyParam]: apiKey,
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

export async function processOrderImmediately(orderId: string): Promise<boolean> {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { service: true },
    });

    if (!order) {
      console.log(`[processOrder] Order ${orderId} not found`);
      return false;
    }
    if (order.status !== "pending") {
      console.log(`[processOrder] Order ${orderId} status is "${order.status}", skipping`);
      return false;
    }
    if (order.apiOrderId) {
      console.log(`[processOrder] Order ${orderId} already sent (apiOrderId: ${order.apiOrderId})`);
      return false;
    }

    // Check if this is a StreamRise service
    if (order.service && isStreamRiseService(order.service.type)) {
      console.log(`[processOrder] Sending order ${orderId} to StreamRise (${order.service.type})`);
      const apis = new Map<string, ApiProvider>();
      await sendSingleOrder(order, apis);

      const updated = await prisma.order.findUnique({ where: { id: orderId }, select: { status: true, apiOrderId: true, log: true } });
      console.log(`[processOrder] Order ${orderId} after send:`, updated);
      return true;
    }

    // Standard SMM API flow - requires apiId
    if (!order.apiId) {
      console.log(`[processOrder] Order ${orderId} has no apiId and is not a StreamRise service`);
      return false;
    }

    const api = await prisma.api.findUnique({
      where: { id: order.apiId, status: true },
    });

    if (!api) {
      console.log(`[processOrder] API provider ${order.apiId} not found or disabled`);
      return false;
    }

    console.log(`[processOrder] Sending order ${orderId} to API ${api.name} (${api.url})`);
    const apis = new Map<string, ApiProvider>();
    apis.set(api.id, api as ApiProvider);
    await sendSingleOrder(order, apis);

    const updated = await prisma.order.findUnique({ where: { id: orderId }, select: { status: true, apiOrderId: true, log: true } });
    console.log(`[processOrder] Order ${orderId} after send:`, updated);

    return true;
  } catch (error) {
    console.error(`[processOrder] Failed to process order ${orderId}:`, error);
    return false;
  }
}

export async function refreshUserOrderStatuses(userId: string): Promise<number> {
  const orders = await prisma.order.findMany({
    where: {
      userId,
      apiOrderId: { not: null },
      status: { in: ["processing", "cancelling", "refilling", "inprogress"] },
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
    await updateSingleOrder(order, apis);
  }

  return orders.length;
}

export async function sendPendingOrders(): Promise<number> {
  // Get all pending orders that haven't been sent yet
  const orders = await prisma.order.findMany({
    where: {
      status: "pending",
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

  let processed = 0;
  for (const order of orders) {
    // StreamRise services don't need apiId
    if (isStreamRiseService(order.service?.type)) {
      await sendSingleOrder(order, apis);
      processed++;
    } else if (order.apiId) {
      // Standard SMM API requires apiId
      await sendSingleOrder(order, apis);
      processed++;
    }
  }

  return processed;
}

export async function updateProcessingOrders(): Promise<number> {
  const orders = await prisma.order.findMany({
    where: {
      apiOrderId: { not: null },
      status: { in: ["processing", "cancelling", "refilling"] },
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
