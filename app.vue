<script setup lang="ts">
export interface ServerResponse {
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
  }[];
  currentOnlinePlayers: {
    displayName: string;
    location: any[];
  }[];
}

const online = ref(false);
const serverData = ref<ServerResponse | null>(null);

const doRefresh = async () => {
  try {
    const { data: newserverData } = await useFetch<ServerResponse>(
      "http://192.168.1.100:4567/v1/server",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          key: "s3p3rS3cur3!",
        },
      }
    );
    const { data: onlinePlayersData } = await useFetch<
      { displayName: string; location: any[] }[]
    >("http://192.168.1.100:4567/v1/players", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        key: "s3p3rS3cur3!",
      },
    });
    if (newserverData && onlinePlayersData.value) {
      online.value = true;
      serverData.value = newserverData.value;
      if (serverData.value)
        serverData.value.currentOnlinePlayers = onlinePlayersData.value.map(
          (player) => {
            return {
              displayName: player.displayName.split("§r")[0],
              location: player.location,
            };
          }
        );
    } else {
      online.value = false;
      throw new Error("No data");
    }
  } catch (error) {
    online.value = false;
    return null;
  }
};
</script>

<template>
  <div class="flex flex-row">
    <Menu />
    <div class="grid grid-cols-4 justify-center gap-4 p-4">
      <Block title="Server Stats">
        <ServerStats
          v-if="serverData"
          :server="serverData"
          @refresh="doRefresh()"
        />
        <Refresher
          v-slot:footer
          @refresh="() => doRefresh()"
          :is-server-online="online"
        />
      </Block>
      <Block title="Whitelist">
        <Whitelist
          v-if="serverData"
          :server="serverData"
          @refresh="doRefresh()"
        />
      </Block>
      <Block title="Actions" class="col-span-2">
        <Actions
          v-if="serverData"
          :server="serverData"
          @refresh="doRefresh()"
        />
      </Block>
      <Block title="Console" class="col-span-4">
        <Console
          v-if="serverData"
          :server="serverData"
          @refresh="doRefresh()"
        />
      </Block>
    </div>
  </div>
</template>
