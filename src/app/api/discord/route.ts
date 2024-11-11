import { NextResponse } from "next/server";
import { WebSocket } from "ws";

const DISCORD_API_ENDPOINT = "https://discord.com/api/v10";
const DISCORD_GATEWAY_URL = "wss://gateway.discord.gg/?v=10&encoding=json";

let ws: WebSocket | null = null;
const presenceCache = new Map<string, any>();

// Initialize WebSocket connection
function initializeWebSocket(token: string) {
  if (ws) return;

  ws = new WebSocket(DISCORD_GATEWAY_URL);

  ws.on("open", () => {
    // Identify with Discord Gateway
    if (ws) {
      ws.send(
        JSON.stringify({
          op: 2, // Identify opcode
          d: {
            token: token,
            intents: 32767, // All intents
            properties: {
              os: "linux",
              browser: "chrome",
              device: "chrome",
            },
            presence: {
              activities: [],
              status: "online",
              since: 0,
              afk: false,
            },
          },
        })
      );
    }
  });

  ws.on("message", (data: string) => {
    try {
      const payload = JSON.parse(data);
      if (payload.t === "PRESENCE_UPDATE") {
        const userId = payload.d.user.id;
        presenceCache.set(userId, payload.d);
      }
    } catch (error) {
      console.error("WebSocket message error:", error);
    }
  });

  ws.on("close", () => {
    ws = null;
    setTimeout(() => initializeWebSocket(token), 5000); // Reconnect after 5 seconds
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
    ws?.close();
  });
}

async function fetchDiscordData(userId: string) {
  if (!process.env.DISCORD_BOT_TOKEN) {
    throw new Error("Discord bot token is not configured");
  }

  // Initialize WebSocket if not already connected
  initializeWebSocket(process.env.DISCORD_BOT_TOKEN);

  try {
    // Fetch user data
    const userResponse = await fetch(
      `${DISCORD_API_ENDPOINT}/users/${userId}`,
      {
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!userResponse.ok) {
      throw new Error(
        `Discord API returned ${userResponse.status} for user data`
      );
    }

    const userData = await userResponse.json();

    // Get presence data from cache or fetch it
    let presenceData = presenceCache.get(userId) || {
      status: "offline",
      activities: [],
    };

    // If not in cache, try to fetch from gateway
    if (!presenceData && process.env.DISCORD_GUILD_ID) {
      const presenceResponse = await fetch(
        `${DISCORD_API_ENDPOINT}/guilds/${process.env.DISCORD_GUILD_ID}/presences/${userId}`,
        {
          headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (presenceResponse.ok) {
        presenceData = await presenceResponse.json();
        presenceCache.set(userId, presenceData);
      }
    }

    return {
      id: userData.id,
      username: userData.username,
      globalName: userData.global_name,
      avatar: userData.avatar,
      discriminator: userData.discriminator,
      presence: {
        status: presenceData.status || "offline",
        activities: presenceData.activities || [],
        clientStatus: presenceData.client_status || {},
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
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Discord API route error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch Discord data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
