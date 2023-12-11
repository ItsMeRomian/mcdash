<template>
  <div class="flex flex-col gap-2">
    <UButton class="w-full" @click="exec('restart')" color="orange">
      <UIcon name="mdi:reload" dynamic />
      Restart
    </UButton>
    <UButton class="w-full" @click="exec('stop')" color="red">
      <UIcon name="material-symbols:stop" dynamic />
      Stop
    </UButton>
    <UButton class="w-full" @click="exec('kickall')" color="red">
      <UIcon name="material-symbols:close" dynamic />
      Kickall
    </UButton>
    <UButton class="w-full" @click="exec('start')" color="green">
      <UIcon name="mdi:play" dynamic />
      Start
    </UButton>
    <UButton class="w-full" @click="exec('save-all')" color="green">
      <UIcon name="material-symbols:save" dynamic />
      Save-all
    </UButton>
  </div>
</template>
<script setup lang="ts">
const exec = async (cmd: string) => {
  const res = await fetch("http://192.168.1.100:4567/v1/server/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      key: "s3p3rS3cur3!",
    },
    body: new URLSearchParams({
      command: cmd,
    }),
  });
};
</script>
