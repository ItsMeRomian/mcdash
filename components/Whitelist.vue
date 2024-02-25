<script setup lang="ts">
import type { ServerResponse } from "~/server/api/refresh";
defineProps<{
  server: ServerResponse | null;
  lastOnline: Record<string, number>;
}>();
const emit = defineEmits<{
  (event: "refresh"): void;
}>();

const state = reactive({
  username: undefined as undefined | string,
});

const updateWhitelist = async (data: {
  username: string;
  action: "add" | "remove";
}) => {
  const res = await useFetch("/api/exec/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      key: useRuntimeConfig().API_KEY,
    },
    body: {
      command: `whitelist ${data.action} ${data.username}`,
    },
  });
  useToast().add({
    title: "Whitelist updated",
    description: (res.data.value as string) || "",
  });
  emit("refresh");
  state.username = "";
};
</script>

<template>
  <div class="max-h-[15rem] overflow-scroll" v-if="server">
    <ul
      v-for="whitelisted of server.whitelistedPlayers.sort((a, b) =>
        a.name.localeCompare(b.name)
      )"
    >
      <li
        class="flex flex-row justify-between hover:bg-slate-600 p-2 text-left"
      >
        <span class="flex flex-row gap-4 items-center">
          <UIcon
            name="material-symbols:circle"
            dynamic
            class=""
            :class="{
              'text-green-500': server.currentOnlinePlayers.find(
                (o) => o.displayName === whitelisted.name
              ),
            }"
          />
          <span class="flex flex-col">
            <span>{{ whitelisted.name }}</span>
            <span class="text-xs text-gray-400">
              Last online:
              <timeago :datetime="lastOnline[whitelisted.name] || 0" />
            </span>
          </span>
        </span>

        <UButton
          @click="
            updateWhitelist({ username: whitelisted.name, action: 'remove' })
          "
          class="max-h-8"
        >
          <UIcon name="i-mdi-trash" dynamic />
        </UButton>
      </li>
    </ul>

    <UForm
      class="mt-2"
      :state="state"
      @submit="
        ({ data }) =>
          updateWhitelist({ username: data.username, action: 'add' })
      "
    >
      <UInput
        v-model="state.username"
        label="Username"
        placeholder="Add username"
      />
    </UForm>
  </div>
  <ul v-else v-for="i in 4" :key="i">
    <li class="flex flex-row justify-between hover:bg-slate-600 p-2 text-left">
      <span class="flex flex-row gap-4 items-center">
        <USkeleton class="h-4 w-4 rounded-full" />
        <span class="flex flex-col gap-1">
          <USkeleton class="h-4 w-40" />
          <USkeleton class="h-4 w-1/2" />
        </span>
      </span>
      <USkeleton class="h-8 w-8" />
    </li>
  </ul>
</template>
