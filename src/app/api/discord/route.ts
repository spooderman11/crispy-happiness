import { NextResponse } from "next/server";

const DISCORD_API_ENDPOINT = "https://discord.com/api/v10";

async function fetchDiscordData(userId: string) {
  if (!process.env.DISCORD_BOT_TOKEN) {
    throw new Error("Discord bot token is not configured");
  }

  try {
    // First, try to fetch the user data
    const userResponse = await fetch(
      `${DISCORD_API_ENDPOINT}/users/${userId}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 30 }, // Cache for 30 seconds
      }
    );

    if (!userResponse.ok) {
      throw new Error(
        `Discord API returned ${userResponse.status} for user data`
      );
    }

    const userData = await userResponse.json();

    // Then fetch the member data from your guild with presence data
    const guildId = process.env.DISCORD_GUILD_ID;
    if (!guildId) {
      throw new Error("Discord guild ID is not configured");
    }

    const memberResponse = await fetch(
      `${DISCORD_API_ENDPOINT}/guilds/${guildId}/members/${userId}?with_presence=true`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 30 }, // Cache for 30 seconds
      }
    );

    if (!memberResponse.ok) {
      throw new Error(
        `Discord API returned ${memberResponse.status} for member data`
      );
    }

    const memberData = await memberResponse.json();

    // Fetch presence data separately using the gateway endpoint
    const presenceResponse = await fetch(
      `${DISCORD_API_ENDPOINT}/guilds/${guildId}/presences/${userId}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 30 }, // Cache for 30 seconds
      }
    );

    let presenceData = { status: "offline", activities: [] };
    if (presenceResponse.ok) {
      presenceData = await presenceResponse.json();
    }

    // Combine and format the data
    return {
      id: userData.id,
      username: userData.username,
      globalName: userData.global_name,
      avatar: userData.avatar,
      discriminator: userData.discriminator,
      presence: {
        status: presenceData.status || memberData.presence?.status || "offline",
        activities:
          presenceData.activities || memberData.presence?.activities || [],
      },
    };
  } catch (error) {
    console.error("Error fetching Discord data:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch Discord data"
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId parameter" },
        { status: 400 }
      );
    }

    const discordData = await fetchDiscordData(userId);

    return NextResponse.json(discordData, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=15",
      },
    });
  } catch (error) {
    console.error("Discord API route error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch Discord data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }
}