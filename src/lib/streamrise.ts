import { decrypt } from "./encryption";
import { getMessagesForCategories, parseCustomMessages } from "./chatMessages";

export const STREAMRISE_API_URL = "https://streamrise.ru/api";

// StreamRise service type mapping
// Note: Followers use the external API (PureSMM), not StreamRise.
// Lightweight Twitch view-based products are routed through StreamRise.
export const STREAMRISE_SERVICES: Record<string, string> = {
  viewers: "twitchViewersPeriod&interval=500&period=0&periodAmount=1",
  clip_views: "twitchViewsClip&interval=500",
  video_views: "twitchViewsVideo&interval=500",
  profile_views: "twitchViewsProfile&interval=500",
  story_views: "twitchStories&interval=500",
  chat_bots: "twitchChatBotsViewers&interval=1000&messageInterval=45000&period=0&periodAmount=1&randomMessages=false&repeatMessages=true",
};

function getStreamRiseToken(): string {
  const token = process.env.STREAMRISE_TOKEN;
  if (!token) {
    throw new Error("STREAMRISE_TOKEN environment variable is required");
  }
  
  // Support both encrypted (contains ":") and plain tokens
  if (token.includes(":")) {
    try {
      return decrypt(token);
    } catch {
      // If decryption fails, use as-is
      return token;
    }
  }
  
  // Plain token (not encrypted)
  return token;
}

interface StreamRiseResponse {
  success: boolean;
  orderId?: string;
  error?: string;
  data?: any;
}

async function streamriseFetch(endpoint: string, options?: RequestInit): Promise<any> {
  const token = getStreamRiseToken();
  const url = `${STREAMRISE_API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9",
      Referer: "https://streamrise.ru/panel/en/",
      Origin: "https://streamrise.ru",
      Cookie: `key=${token}`,
      ...options?.headers,
    },
  });

  return response.json();
}

export async function uploadChatMessages(channel: string, messages: string[]): Promise<boolean> {
  const token = getStreamRiseToken();

  try {
    const response = await fetch(
      `${STREAMRISE_API_URL}/uploadTextJson/${token}?channel=${encodeURIComponent(channel)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Referer: "https://streamrise.ru/panel/en/",
          Origin: "https://streamrise.ru",
        },
        body: JSON.stringify(messages),
      }
    );

    const text = await response.text();
    return text.includes("ok");
  } catch (error) {
    console.error("Failed to upload chat messages:", error);
    return false;
  }
}

export interface StreamRiseOrderOptions {
  comments?: string;
  frequency?: "weekly" | "monthly";
  boosts?: {
    claimPoints?: boolean;
    joinRaids?: boolean;
  };
}

const FREQUENCY_TO_PERIOD: Record<string, number> = {
  weekly: 2,
  monthly: 3,
};

export async function createStreamRiseOrder(
  serviceType: string,
  channel: string,
  quantity: number,
  options?: string | StreamRiseOrderOptions
): Promise<StreamRiseResponse> {
  const token = getStreamRiseToken();
  const serviceParam = STREAMRISE_SERVICES[serviceType];

  if (!serviceParam) {
    return { success: false, error: `Unknown service type: ${serviceType}` };
  }

  // Normalize options — legacy callers pass comments as a string
  const opts: StreamRiseOrderOptions =
    typeof options === "string" ? { comments: options } : options || {};

  // For chat bots, upload messages first
  if (serviceType === "chat_bots") {
    let messages: string[] = [];
    
    if (opts.comments) {
      if (opts.comments.startsWith("custom:")) {
        messages = parseCustomMessages(opts.comments.slice(7));
      } else if (opts.comments.startsWith("categories:")) {
        const categories = opts.comments.slice(11);
        messages = getMessagesForCategories(categories);
      } else {
        messages = parseCustomMessages(opts.comments);
      }
    }
    
    if (messages.length === 0) {
      messages = getMessagesForCategories(["random"]);
    }
    
    const uploaded = await uploadChatMessages(channel, messages);
    if (!uploaded) {
      console.warn("Failed to upload chat messages, proceeding anyway");
    }
  }

  try {
    // Build the service URL with subscription & boost params
    let svcUrl = serviceParam;

    // Override period for subscription orders
    if (opts.frequency && FREQUENCY_TO_PERIOD[opts.frequency] != null) {
      const period = FREQUENCY_TO_PERIOD[opts.frequency];
      svcUrl = svcUrl.replace(/period=\d+/, `period=${period}`);
      if (!svcUrl.includes("period=")) {
        svcUrl += `&period=${period}`;
      }
      if (!svcUrl.includes("periodAmount=")) {
        svcUrl += "&periodAmount=1";
      }
    }

    // Subscription orders get natural viewer fluctuation by default
    if (opts.frequency && serviceType === "viewers") {
      svcUrl += "&flexThreads=true&flexChangePercent=10&flexInterval=60000&flexMinimum=70";
    }

    // Boost: channel points
    if (opts.boosts?.claimPoints) {
      svcUrl += "&claimPoints=true";
    }

    // Boost: join raids
    if (opts.boosts?.joinRaids) {
      const raidsAmount = Math.max(1, Math.floor(quantity / 2));
      svcUrl += `&joinRaids=true&raidsAmount=${raidsAmount}`;
    }

    const url = `/newOrder?key=${token}&channel=${encodeURIComponent(channel)}&amount=${quantity}&service=${svcUrl}`;
    const data = await streamriseFetch(url);

    if (data.error) {
      return { success: false, error: data.error };
    }

    if (data.orderId) {
      return { success: true, orderId: String(data.orderId) };
    }

    return { success: true, orderId: String(Date.now()) };
  } catch (error: any) {
    console.error("StreamRise order error:", error);
    return { success: false, error: error.message };
  }
}

export async function getStreamRiseOrderStatus(apiOrderId: string): Promise<{
  found: boolean;
  completed?: boolean;
}> {
  try {
    const data = await streamriseFetch("/getOrdersPage?start=0&end=50");

    if (!data?.history || !Array.isArray(data.history)) {
      return { found: false };
    }

    // Check if order is still in active history
    const found = data.history.some(
      (order: any) => String(order.orderId) === apiOrderId || String(order.id) === apiOrderId
    );

    // In StreamRise, if order is NOT in history, it's completed
    return { found, completed: !found };
  } catch (error) {
    console.error("StreamRise status check error:", error);
    return { found: false };
  }
}

export function isStreamRiseService(serviceType: string | null | undefined): boolean {
  if (!serviceType) return false;
  return Object.keys(STREAMRISE_SERVICES).includes(serviceType);
}

export async function getStreamRiseBalance(): Promise<{ success: boolean; balance?: number; error?: string; notSupported?: boolean }> {
  try {
    const data = await streamriseFetch("/getCustomer");
    
    // getCustomer returns customer/account info including balance
    if (data?.balance !== undefined) {
      return { success: true, balance: parseFloat(data.balance) };
    }
    
    // Check alternate field names
    if (data?.funds !== undefined) {
      return { success: true, balance: parseFloat(data.funds) };
    }
    
    if (data?.credits !== undefined) {
      return { success: true, balance: parseFloat(data.credits) };
    }
    
    if (data?.error) {
      return { success: false, error: data.error };
    }
    
    // Log the response to help debug what fields are available
    console.log("StreamRise getCustomer response:", JSON.stringify(data));
    
    return { 
      success: false, 
      error: "Balance field not found in response" 
    };
  } catch (error: any) {
    console.error("StreamRise balance check error:", error);
    return { success: false, error: error.message };
  }
}

export function isStreamRiseConfigured(): boolean {
  return !!process.env.STREAMRISE_TOKEN;
}
