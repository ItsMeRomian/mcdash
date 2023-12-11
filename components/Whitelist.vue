<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import type { ServerResponse } from "~/app.vue";
defineProps<{
  server: ServerResponse;
}>();
const emit = defineEmits<{
  (event: "refresh"): void;
}>();

const state = reactive({
  username: undefined as undefined | string,
});

const addUserToWhitelist = async (data: { username: string }) => {
  console.log(data);
  const res = await fetch("http://192.168.1.100:4567/v1/server/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      key: "s3p3rS3cur3!",
    },
    body: new URLSearchParams({
      command: `whitelist add ${data.username}`,
    }),
  });
  emit("refresh");
  console.log(res);
};

const removeUserFromWhitelist = async (data: { username: string }) => {
  console.log(data);
  const res = await fetch("http://192.168.1.100:4567/v1/server/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      key: "s3p3rS3cur3!",
    },
    body: new URLSearchParams({
      command: `whitelist remove ${data.username}`,
    }),
  });
  emit("refresh");
  state.username = "";
  console.log(res);
};
</script>

<template>
  <div>
    <ul
      v-for="whitelisted of server.whitelistedPlayers.sort((a, b) =>
        a.name.localeCompare(b.name)
      )"
    >
      <li
        class="flex flex-row justify-between hover:bg-slate-600 p-2 text-left"
      >
        <span>
          <UIcon
            name="material-symbols:circle"
            dynamic
            :class="{
              'text-green-500': server.currentOnlinePlayers.find(
                (o) => o.displayName === whitelisted.name
              ),
            }"
          />
          <span class="ml-4">{{ whitelisted.name }}</span>
        </span>

        <UButton
          @click="removeUserFromWhitelist({ username: whitelisted.name })"
        >
          <UIcon name="i-mdi-trash" dynamic />
        </UButton>
      </li>
    </ul>

    <UForm
      class="mt-2"
      :state="state"
      @submit="({ data }) => addUserToWhitelist(data)"
    >
      <UInput
        v-model="state.username"
        label="Username"
        placeholder="Add username"
      />
    </UForm>
  </div>
</template>
