<template>
  <UModal v-model="isConfirmDialogOpen" @close="console.log('closed?')">
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="text-center space-y-2">
          <h2 class="text-2xl">Are you sure?</h2>
          <code
            class="text-sm sm:text-base inline-flex text-left items-center space-x-4 bg-gray-800 text-white rounded-lg p-4 px-6"
          >
            <span class="flex gap-4">
              <span class="shrink-0 text-gray-500"> $ </span>
              <span class="flex-1">
                <span> > {{ nextCommand }} </span>
              </span>
            </span>
          </code>
        </div>
      </template>
      <div class="flex flex-row gap-2 justify-evenly">
        <UButton size="xl" color="green" @click="doCommand()">Exec</UButton>
        <UButton size="xl" color="red" @click="isConfirmDialogOpen = false"
          >No</UButton
        >
      </div>
    </UCard>
  </UModal>
  <div class="flex flex-col gap-2">
    <UButton
      v-for="action of actions"
      :key="action.name"
      class="w-full"
      @click="confirmCommand(action.command)"
      :color="action.color"
    >
      <UIcon :name="action.icon" dynamic />
      {{ action.name }}
    </UButton>
  </div>
</template>
<script setup lang="ts">
const isConfirmDialogOpen = ref(false);
const actions = ref([
  {
    name: "Restart",
    command: "restart",
    color: "orange",
    icon: "mdi:reload",
  },
  {
    name: "Stop",
    command: "stop",
    color: "red",
    icon: "material-symbols:stop",
  },
  {
    name: "Kickall",
    command: "kickall",
    color: "red",
    icon: "material-symbols:close",
  },
  {
    name: "Start",
    command: "start",
    color: "green",
    icon: "mdi:play",
  },
  {
    name: "Save-all",
    command: "save-all",
    color: "green",
    icon: "material-symbols:save",
  },
  {
    name: "Open map",
    command: "http://play.dyna.host/dynmap/",
    color: "blue",
    icon: "mdi:map",
  },
]);
const nextCommand = ref("");

const confirmCommand = async (action: string) => {
  nextCommand.value = action;
  isConfirmDialogOpen.value = true;
};
const doCommand = async () => {
  nextCommand.value.includes("http")
    ? window.open(nextCommand.value, "_blank")
    : await exec(nextCommand.value);
  isConfirmDialogOpen.value = false;
};

const exec = async (command: string) => {
  const res = await useFetch("/api/exec/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      key: useRuntimeConfig().API_KEY,
    },
    body: {
      command,
    },
  });
  useToast().add({
    title: "Command executed",
    description: (res.data.value as string) || "",
  });
};
</script>
