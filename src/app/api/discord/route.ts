import { NextResponse } from "next/server";

const DISCORD_API_ENDPOINT = "https://discord.com/api/v10";

async function fetchDiscordData(userId: string) {
  if (!process.env.DISCORD_BOT_TOKEN) {
    throw new Error("Discord bot token is not configured");
  }

  try {
    const headers = {
      Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      "Content-Type": "application/json",
    };

    // Fetch user data
    const userResponse = await fetch(
      `${DISCORD_API_ENDPOINT}/users/${userId}`,
      {
        headers,
      }
    );

    if (!userResponse.ok) {
      throw new Error(
        `Discord API returned ${userResponse.status} for user data`
      );
    }

    const userData = await userResponse.json();

    // Fetch guild member data with presence
    const guildId = process.env.DISCORD_GUILD_ID;
    if (!guildId) {
      throw new Error("Discord guild ID is not configured");
    }

    const memberResponse = await fetch(
      `${DISCORD_API_ENDPOINT}/guilds/${guildId}/members/${userId}?with_presence=true`,
      {
        headers,
        cache: "no-store",
      }
    );

    if (!memberResponse.ok) {
      throw new Error(
        `Discord API returned ${memberResponse.status} for member data`
      );
    }

    const memberData = await memberResponse.json();

    // Attempt to get presence data, fallback to "offline" if unavailable
    const presenceData = memberData.presence || {
      status: "offline",
      activities: [],
    };

    return {
      id: userData.id,
      username: userData.username,
      globalName: userData.global_name,
      avatar: userData.avatar,
      discriminator: userData.discriminator,
      presence: {
        status: presenceData.status || "offline",
        activities: presenceData.activities || [],
      },
      member: {
        nickname: memberData.nick,
        roles: memberData.roles,
        joinedAt: memberData.joined_at,
      },
    };
  } catch (error) {
    console.error("Error fetching Discord data:", error);
    throw error;
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

    // Log the response for debugging
    console.log("Discord API Response:", JSON.stringify(discordData, null, 2));

    return NextResponse.json(discordData, {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
        Pragma: "no-cache",
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
