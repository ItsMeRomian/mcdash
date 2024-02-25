export interface ServerResponse {
  error?: boolean;
  tps: string;
  onlinePlayers: number;
  maxPlayers: number;
  version: string;
  health: {
    uptime: number;
    totalMemory: number;
    maxMemory: number;
  };
  whitelistedPlayers: {
    name: string;
    lastOnline: number;
  }[];
  currentOnlinePlayers: {
    displayName: string;
    lastOnline: number;
    location: any[];
  }[];
}

export default defineEventHandler(async (event) => {
  try {
    const serverFetch = await fetch(`${useRuntimeConfig().API_URL}/v1/server`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        key: `${useRuntimeConfig().API_KEY}`,
      },
    });
    const serverData = (await serverFetch.json()) as ServerResponse;

    const playerFetch = await fetch(
      `${useRuntimeConfig().API_URL}/v1/players`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          key: useRuntimeConfig().API_KEY,
        },
      }
    );
    const onlinePlayersData = (await playerFetch.json()) as {
      displayName: string;
      location: any[];
    }[];

    if (serverData && onlinePlayersData) {
      serverData.currentOnlinePlayers = onlinePlayersData.map((player) => {
        return {
          displayName: player.displayName.split("§r")[0],
          location: player.location,
          lastOnline: 0, //lastOnline.value[player.displayName.split("§r")[0]],
        };
      });
      return serverData;
    } else {
      throw new Error("No data");
    }
  } catch (error: any) {
    console.log(error);
    return {
      error: true,
      errormessage: error.message,
    };
  }
});
