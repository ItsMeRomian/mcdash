<script setup lang="ts">
import type { PlayerName } from "~/app.vue";
//@ts-expect-error
import { parse as ansiColorParser } from "ansicolor";
import type { ServerResponse } from "~/server/api/refresh";

let webSocket = undefined as undefined | WebSocket;
const consoleMessages = ref<null | HTMLDivElement>(null);

const state = reactive({
  command: "",
});

defineProps<{
  server: ServerResponse;
}>();

const emit = defineEmits<{
  refresh: [];
  updateLastOnline: [PlayerName, number];
}>();

onMounted(async () => await connect());

const sendCommand = async () => {
  try {
    webSocket?.send(state.command);
  } catch (error) {
    console.error(`error sending command: ${error}`);
    await connect(); // Reconnect
  }
  state.command = "";
  console.log(`Sent command: ${state.command}`);
};

const messages = ref<
  {
    loggerName: string;
    message: string;
    timestampMillis: number;
    level: "INFO" | "WARN";
    spans: { text: string; css: string }[];
  }[]
>([]);

const handleMessage = (messageEvent: MessageEvent<string>) => {
  const data = JSON.parse(messageEvent.data) as {
    loggerName: string;
    message: string;
    timestampMillis: number;
    level: "INFO" | "WARN";
    spans: { text: string; css: string }[];
  };

  // Check if message is a join message and update last online
  if (data.message.includes("joined the game")) {
    emit("updateLastOnline", data.message.split(" ")[0], data.timestampMillis);
  }

  // Parse message colors
  let parsed: { spans: { text: string; css: string }[] };
  try {
    parsed = ansiColorParser(data.message);
  } catch (e) {
    parsed = { spans: [{ text: `${data.message}`, css: "" }] };
  }
  data.spans = parsed.spans;

  // Add message to messages
  messages.value.push(data);

  // Scroll to bottom
  if (consoleMessages.value) {
    consoleMessages.value.scrollTop = consoleMessages.value?.scrollHeight;
  }
};

const connect = async () => {
  try {
    webSocket = new WebSocket(`${useRuntimeConfig().API_WS}/v1/ws/console`);
    webSocket.onmessage = (me) => handleMessage(me);
    webSocket.onerror = (e) => console.error(`error event: ${e}`);
  } catch (error) {
    console.error(`error connecting: ${error}`);
  }
};
</script>

<template>
  <div class="max-h-60 overflow-auto" ref="consoleMessages">
    <p v-for="message of messages" class="my-0.5 border-t-gray-200 border-t">
      <span v-for="span of message.spans" :style="span.css">
        <span v-if="message.loggerName && message.loggerName.includes('.')"
          >[{{
            message.loggerName.includes(".")
              ? message.loggerName.split(".").pop()
              : message.loggerName
          }}]
          <timeago :datetime="new Date(message.timestampMillis)" />
          <br />
        </span>
        {{ span.text }}
      </span>
    </p>
  </div>
  <UForm @submit="sendCommand()" :state="state" v-if="webSocket">
    <UInput v-model="state.command" placeholder="Comannd" />
  </UForm>
  <div v-else>
    <div v-for="i in 5">
      <USkeleton class="h-4 w-full my-1" />
    </div>
    <div class="flex flex-row gap-1">
      <USkeleton class="h-12 w-3/4" />
      <USkeleton class="h-12 w-1/4" />
    </div>
  </div>
</template>
