import { NextRequest, NextResponse } from "next/server";

interface TwitchClipData {
  id: string;
  url: string;
  embed_url: string;
  broadcaster_id: string;
  broadcaster_name: string;
  creator_id: string;
  creator_name: string;
  video_id: string;
  game_id: string;
  language: string;
  title: string;
  view_count: number;
  created_at: string;
  thumbnail_url: string;
  duration: number;
}

interface ClipResponse {
  success: boolean;
  data?: {
    id: string;
    title: string;
    broadcaster: string;
    creator: string;
    thumbnail: string;
    duration: number;
    views: number;
    createdAt: string;
    downloadUrl: string;
  };
  error?: string;
}

function extractClipId(url: string): string | null {
  // Remove query parameters first
  const cleanUrl = url.split('?')[0];
  
  // Handle various Twitch clip URL formats:
  // https://clips.twitch.tv/ClipSlug
  // https://clips.twitch.tv/ClipSlug-WithDashes
  // https://www.twitch.tv/channel/clip/ClipSlug
  // https://www.twitch.tv/channel/clip/ClipSlug-WithDashes
  // https://twitch.tv/channel/clip/ClipSlug
  
  const patterns = [
    /clips\.twitch\.tv\/([a-zA-Z0-9_-]+)/,
    /twitch\.tv\/[^/]+\/clip\/([a-zA-Z0-9_-]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

function getDownloadUrl(thumbnailUrl: string): string {
  // The thumbnail URL looks like:
  // https://clips-media-assets2.twitch.tv/xxxxx-offset-xxxxx-preview-480x272.jpg
  // We need to transform it to get the MP4:
  // https://clips-media-assets2.twitch.tv/xxxxx-offset-xxxxx.mp4
  
  const downloadUrl = thumbnailUrl.split('-preview')[0] + '.mp4';
  return downloadUrl;
}

async function getTwitchAccessToken(): Promise<string | null> {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    return null;
  }
  
  try {
    const response = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
      { method: 'POST' }
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.access_token;
  } catch {
    return null;
  }
}

async function fetchClipFromTwitchAPI(clipId: string): Promise<TwitchClipData | null> {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const accessToken = await getTwitchAccessToken();
  
  if (!clientId || !accessToken) {
    return null;
  }
  
  try {
    const response = await fetch(
      `https://api.twitch.tv/helix/clips?id=${clipId}`,
      {
        headers: {
          'Client-ID': clientId,
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.data?.[0] || null;
  } catch {
    return null;
  }
}

// Fallback: Use a public GQL endpoint (no auth required)
async function fetchClipViaGQL(clipId: string): Promise<TwitchClipData | null> {
  try {
    const response = await fetch('https://gql.twitch.tv/gql', {
      method: 'POST',
      headers: {
        'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        operationName: 'ClipMetadata',
        variables: { slug: clipId },
        extensions: {
          persistedQuery: {
            version: 1,
            sha256Hash: '6e465bb8446e2391644cf079851c0cb1b96928435a240f07ed4b240f0acc6f1b',
          },
        },
      }),
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    const clip = data?.data?.clip;
    
    if (!clip) {
      return null;
    }
    
    return {
      id: clip.slug,
      url: `https://clips.twitch.tv/${clip.slug}`,
      embed_url: clip.embedURL || '',
      broadcaster_id: clip.broadcaster?.id || '',
      broadcaster_name: clip.broadcaster?.displayName || '',
      creator_id: clip.curator?.id || '',
      creator_name: clip.curator?.displayName || '',
      video_id: clip.video?.id || '',
      game_id: clip.game?.id || '',
      language: clip.language || 'en',
      title: clip.title,
      view_count: clip.viewCount,
      created_at: clip.createdAt,
      thumbnail_url: clip.thumbnailURL,
      duration: clip.durationSeconds,
    };
  } catch {
    return null;
  }
}

// Alternative GQL query for video URL
async function fetchClipVideoUrl(clipId: string): Promise<string | null> {
  try {
    const response = await fetch('https://gql.twitch.tv/gql', {
      method: 'POST',
      headers: {
        'Client-ID': 'kimne78kx3ncx6brgo4mv6wki5h1ko',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          operationName: 'VideoAccessToken_Clip',
          variables: { slug: clipId },
          extensions: {
            persistedQuery: {
              version: 1,
              sha256Hash: '36b89d2507fce29e5ca551df756d27c1cfe079e2609642b4390aa4c35796eb11',
            },
          },
        },
      ]),
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    const playbackUrl = data?.[0]?.data?.clip?.videoQualities?.[0]?.sourceURL;
    
    return playbackUrl || null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ClipResponse>> {
  try {
    const body = await request.json();
    const { url } = body;
    
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid Twitch clip URL' },
        { status: 400 }
      );
    }
    
    const clipId = extractClipId(url);
    
    if (!clipId) {
      return NextResponse.json(
        { success: false, error: 'Invalid Twitch clip URL format' },
        { status: 400 }
      );
    }
    
    // Try official API first, then fall back to GQL
    let clipData = await fetchClipFromTwitchAPI(clipId);
    
    if (!clipData) {
      clipData = await fetchClipViaGQL(clipId);
    }
    
    if (!clipData) {
      return NextResponse.json(
        { success: false, error: 'Could not fetch clip data. The clip may not exist or may be private.' },
        { status: 404 }
      );
    }
    
    // Get the download URL
    let downloadUrl = getDownloadUrl(clipData.thumbnail_url);
    
    // Try to get direct video URL as fallback
    const directUrl = await fetchClipVideoUrl(clipId);
    if (directUrl) {
      downloadUrl = directUrl;
    }
    
    return NextResponse.json({
      success: true,
      data: {
        id: clipData.id,
        title: clipData.title,
        broadcaster: clipData.broadcaster_name,
        creator: clipData.creator_name,
        thumbnail: clipData.thumbnail_url,
        duration: clipData.duration,
        views: clipData.view_count,
        createdAt: clipData.created_at,
        downloadUrl,
      },
    });
  } catch (error) {
    console.error('Clip API error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
