import { NextRequest, NextResponse } from "next/server";

const TWITCH_GQL_URL = "https://gql.twitch.tv/gql";
const TWITCH_CLIENT_ID = process.env.TWITCH_GQL_CLIENT_ID!;

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get("username")?.trim();

  if (!username || !/^[a-zA-Z0-9_]{3,25}$/.test(username)) {
    return NextResponse.json({ error: "Invalid username" }, { status: 400 });
  }

  try {
    const res = await fetch(TWITCH_GQL_URL, {
      method: "POST",
      headers: {
        "Client-ID": TWITCH_CLIENT_ID,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query { user(login: "${username}") { displayName profileImageURL(width: 300) } }`,
      }),
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch" }, { status: 502 });
    }

    const data = await res.json();
    const user = data?.data?.user;

    if (!user) {
      return NextResponse.json({ error: "User not found", found: false }, { status: 404 });
    }

    return NextResponse.json({
      found: true,
      displayName: user.displayName,
      avatar: user.profileImageURL,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch avatar" }, { status: 500 });
  }
}
