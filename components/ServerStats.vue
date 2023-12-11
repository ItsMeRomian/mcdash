<script setup lang="ts">
import type { ServerResponse } from "~/app.vue";

defineProps<{
  server: ServerResponse;
}>();
</script>

<template>
  <div>
    <ul>
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
  </div>
</template>
