import { NextResponse } from "next/server";

const DISCORD_API_ENDPOINT = "https://discord.com/api/v10";

async function fetchDiscordData(userId: string) {
  const response = await fetch(`${DISCORD_API_ENDPOINT}/users/${userId}`, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Discord user data");
  }

  const userData = await response.json();

  const presenceResponse = await fetch(
    `${DISCORD_API_ENDPOINT}/users/${userId}/presence`,
    {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
    }
  );

  if (!presenceResponse.ok) {
    throw new Error("Failed to fetch Discord presence data");
  }

  const presenceData = await presenceResponse.json();

  return {
    ...userData,
    presence: presenceData,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json(
      { error: "Missing userId parameter" },
      { status: 400 }
    );
  }

  try {
    const discordData = await fetchDiscordData(userId);
    return NextResponse.json(discordData);
  } catch (error) {
    console.error("Error fetching Discord data:", error);
    return NextResponse.json(
      { error: "Failed to fetch Discord data" },
      { status: 500 }
    );
  }
}
