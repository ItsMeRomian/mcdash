<script setup lang="ts">
import type { ServerResponse } from "~/server/api/refresh";

defineProps<{
  server: ServerResponse | null;
}>();
</script>

<template>
  <div>
    <ul v-if="server">
      <li>Online: {{ server.onlinePlayers }} / {{ server.maxPlayers }}</li>
      <li>Version: {{ server.version }}</li>
      <li>
        Uptime: {{ Math.floor(server.health.uptime / 3600) }}:{{
          Math.floor((server.health.uptime % 3600) / 60)
        }}:{{ Math.floor((server.health.uptime % 3600) % 60) }}
      </li>
      <li>
        Memory:
        {{
          (
            ((server.health.totalMemory as number) / server.health.maxMemory) *
            100
          ).toFixed(2)
        }}%
      </li>
      <li>TPS: {{ server.tps }}</li>
    </ul>
    <div class="flex flex-col gap-2" v-else>
      <USkeleton class="h-4 w-full" />
      <USkeleton class="h-4 w-3/4" />
      <USkeleton class="h-4 w-1/2" />
      <USkeleton class="h-4 w-[250px]" />
    </div>
  </div>
</template>
