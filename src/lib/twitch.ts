const TWITCH_GQL_URL = "https://gql.twitch.tv/gql";
const TWITCH_CLIENT_ID = process.env.TWITCH_GQL_CLIENT_ID || "kimne78kx3ncx6brgo4mv6wki5h1ko";

export interface TwitchClipData {
  title: string;
  broadcaster: {
    displayName: string;
  };
  thumbnailURL: string;
}

export async function fetchTwitchClipData(
  clipSlug: string
): Promise<TwitchClipData | null> {
  const query = `query GetClip($slug: String!) {
    clip(slug: $slug) {
      title
      broadcaster {
        displayName
      }
      thumbnailURL
    }
  }`;

  try {
    const response = await fetch(TWITCH_GQL_URL, {
      method: "POST",
      headers: {
        "Client-ID": TWITCH_CLIENT_ID,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { slug: clipSlug } }),
    });

    if (!response.ok) {
      throw new Error(`Twitch API Error: ${response.statusText}`);
    }

    const json = (await response.json()) as {
      data?: { clip?: TwitchClipData | null };
    };

    return json.data?.clip ?? null;
  } catch (error) {
    console.error("Failed to fetch Twitch clip data:", error);
    return null;
  }
}
