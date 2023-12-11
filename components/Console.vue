<script setup lang="ts">
import type { ServerResponse } from "~/app.vue";
import { parse } from "ansicolor";

let webSocket = undefined as undefined | WebSocket;
const consoleMessages = ref(null as null | HTMLDivElement);

const state = reactive({
  command: "",
});

defineProps<{
  server: ServerResponse;
}>();
const emit = defineEmits<{
  (event: "refresh"): void;
}>();

onMounted(() => {
  connect();
});

const sendCommand = () => {
  webSocket?.send(state.command);
  state.command = "";
};

const messages = ref(
  [] as {
    loggerName: string;
    message: string;
    timestampMillis: number;
    level: "INFO" | "WARN";
    spans: { text: string; css: string }[];
  }[] //{ message: string; timestampMillis: number; level: "INFO" | "WARN" }[]
);

const connect = async () => {
  webSocket = new WebSocket("ws://192.168.1.100:4567/v1/ws/console");

  webSocket.onmessage = (messageEvent) => {
    const data = JSON.parse(messageEvent.data) as {
      loggerName: string;
      message: string;
      timestampMillis: number;
      level: "INFO" | "WARN";
      spans: { text: string; css: string }[];
    };
    let parsed: { spans: { text: string; css: string }[] };
    try {
      parsed = parse(data.message);
    } catch (e) {
      parsed = { spans: [{ text: `${data.message}`, css: "" }] };
    }
    data.spans = parsed.spans;

    messages.value.push(data);
    if (consoleMessages.value)
      consoleMessages.value.scrollTop = consoleMessages.value?.scrollHeight;
  };

  webSocket.onopen = (ev) => {
    console.log(ev);
  };

  webSocket.onerror = (ev) => {
    console.error(ev);
  };
};
</script>

<template>
  <div class="max-h-60 overflow-auto" ref="consoleMessages">
    <p v-for="message of messages">
      {{ new Date(message.timestampMillis).toLocaleString() }} -
      <span v-for="span of message.spans" :style="span.css">
        <span>[{{ message.loggerName }}]</span>
        {{ span.text }}
      </span>
    </p>
  </div>
  <UForm @submit="sendCommand()" :state="state">
    <UInput v-model="state.command" placeholder="Comannd" />
  </UForm>
</template>
