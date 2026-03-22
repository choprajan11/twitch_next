import { NextRequest, NextResponse } from "next/server";

const TWITCH_GQL_URL = "https://gql.twitch.tv/gql";
const TWITCH_CLIENT_ID = process.env.TWITCH_GQL_CLIENT_ID!;

type LinkType = "clip" | "video";

interface LinkResult {
  found: boolean;
  type: LinkType;
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  views?: number;
  duration?: number;
  createdAt?: string;
}

function detectAndExtract(input: string): { type: LinkType; id: string } | null {
  const cleaned = input.replace(/\s/g, "").split("?")[0];

  const clipPatterns = [
    /clips\.twitch\.tv\/([a-zA-Z0-9_-]+)/,
    /twitch\.tv\/[^/]+\/clip\/([a-zA-Z0-9_-]+)/,
  ];
  for (const pattern of clipPatterns) {
    const match = cleaned.match(pattern);
    if (match?.[1]) return { type: "clip", id: match[1] };
  }

  const videoPatterns = [
    /twitch\.tv\/videos\/([0-9]+)/,
    /^(?:videos\/)?([0-9]{7,})$/,
  ];
  for (const pattern of videoPatterns) {
    const match = cleaned.match(pattern);
    if (match?.[1]) return { type: "video", id: match[1] };
  }

  return null;
}

async function fetchClipMetadata(slug: string): Promise<LinkResult | null> {
  const res = await fetch(TWITCH_GQL_URL, {
    method: "POST",
    headers: {
      "Client-ID": TWITCH_CLIENT_ID,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query {
        clip(slug: "${slug.replace(/[^a-zA-Z0-9_-]/g, "")}") {
          title
          viewCount
          durationSeconds
          createdAt
          thumbnailURL
          broadcaster { displayName }
        }
      }`,
    }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  const clip = data?.data?.clip;
  if (!clip) return null;

  return {
    found: true,
    type: "clip",
    id: slug,
    title: clip.title || "Twitch Clip",
    thumbnail: clip.thumbnailURL || "",
    channel: clip.broadcaster?.displayName || "",
    views: clip.viewCount,
    duration: clip.durationSeconds,
    createdAt: clip.createdAt,
  };
}

async function fetchVideoMetadata(videoId: string): Promise<LinkResult | null> {
  const sanitizedId = videoId.replace(/[^0-9]/g, "");

  const res = await fetch(TWITCH_GQL_URL, {
    method: "POST",
    headers: {
      "Client-ID": TWITCH_CLIENT_ID,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `query {
        video(id: "${sanitizedId}") {
          title
          viewCount
          lengthSeconds
          createdAt
          previewThumbnailURL(width: 320, height: 180)
          owner { displayName }
        }
      }`,
    }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  const video = data?.data?.video;
  if (!video) return null;

  let thumbnail = video.previewThumbnailURL || "";
  thumbnail = thumbnail
    .replace("%{width}", "320")
    .replace("%{height}", "180")
    .replace("{width}", "320")
    .replace("{height}", "180");

  return {
    found: true,
    type: "video",
    id: sanitizedId,
    title: video.title || "Twitch Video",
    thumbnail,
    channel: video.owner?.displayName || "",
    views: video.viewCount,
    duration: video.lengthSeconds,
    createdAt: video.createdAt,
  };
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url")?.trim();

  if (!url || url.length < 3 || url.length > 500) {
    return NextResponse.json(
      { error: "Invalid URL", found: false },
      { status: 400 }
    );
  }

  const extracted = detectAndExtract(url);
  if (!extracted) {
    return NextResponse.json(
      { error: "Could not detect a valid Twitch clip or video link", found: false },
      { status: 400 }
    );
  }

  try {
    const result =
      extracted.type === "clip"
        ? await fetchClipMetadata(extracted.id)
        : await fetchVideoMetadata(extracted.id);

    if (!result) {
      return NextResponse.json(
        { error: `${extracted.type === "clip" ? "Clip" : "Video"} not found`, found: false },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch data from Twitch", found: false },
      { status: 502 }
    );
  }
}
