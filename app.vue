<script setup lang="ts">
import type { ServerResponse } from "./server/api/refresh";

export type PlayerName = string;

const online = computed(() => Boolean(serverData.value));
const serverData = ref<ServerResponse | null>(null);
const lastOnline = ref<Record<string, number>>({});

const updateLastOnline = (playerName: PlayerName, timestampMillis: number) => {
  console.log("Updating last online for", playerName.split("11m")[1]);

  if (playerName.split("11m")[1] && serverData.value)
    lastOnline.value[playerName.split("11m")[1]] = timestampMillis;
};

const doRefresh = async () => {
  const fresh = await $fetch("/api/refresh");
  if (fresh.error) {
    useToast().add({
      title: "Server is offline!",
      description: fresh.error,
      color: "red",
      timeout: 0,
      id: "server-offline",
    });
    serverData.value = null;
    return;
  }
  try {
    useToast().remove("server-offline");
  } catch (error) {}
  serverData.value = fresh;
};
</script>

<template>
  <div class="flex flex-row w-full">
    <div class="grid grid-cols-1 justify-center gap-4 p-4 w-full">
      <div
        class="text-center space-y-2 fixed w-full -m-4 bg-gradient-to-b from-gray-800 pt-2"
      >
        <h2 class="font-display text-4xl font-bold tracking-tight text-white">
          DynaFools
        </h2>
        <h3 class="">Moderator Tools</h3>
      </div>
      <Block title="Server Stats" class="md:col-span-4 z-20 h-fit mt-24">
        <ServerStats :server="serverData" @refresh="doRefresh()" />
        <Refresher
          v-slot:footer
          @refresh="() => doRefresh()"
          :is-server-online="online"
        />
      </Block>
      <Block title="Whitelist" class="md:col-span-4 z-20">
        <Whitelist
          :server="serverData"
          @refresh="doRefresh()"
          :last-online="lastOnline"
        />
      </Block>
      <Block title="Actions" class="col-span-1 md:col-span-4 h-fit z-20">
        <Actions v-if="serverData" />
        <div v-else class="flex flex-col gap-4" v-for="i in 3">
          <USkeleton class="h-12 w-full my-1" />
        </div>
      </Block>
      <Block title="Console" class="col-span-1 md:col-span-12 z-20">
        <Console
          v-if="serverData"
          :server="serverData"
          @refresh="doRefresh()"
          @update-last-online="
            (playerName, timestampMillis) =>
              updateLastOnline(playerName, timestampMillis)
          "
        />
      </Block>
    </div>
  </div>
  <UNotifications />
</template>
