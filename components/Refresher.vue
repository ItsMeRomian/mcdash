<script lang="ts" setup>
const progressBar = ref(0);
const props = defineProps<{
  isServerOnline: boolean;
}>();
const emit = defineEmits<{
  (event: "refresh"): void;
}>();

onMounted(() => {
  setInterval(() => {
    emit("refresh");
  }, useRuntimeConfig().public.REFRESH_TIME);
  setInterval(() => {
    progressBar.value = progressBar.value + 20;
    if (progressBar.value > 100) progressBar.value = 0;
  }, 500);
});
</script>

<template>
  <hr class="my-4" />
  <h2
    class="text-xl text-center mb-2"
    :class="{
      'text-green-600': props.isServerOnline,
      'text-red-600': !props.isServerOnline,
    }"
  >
    {{ props.isServerOnline ? "Online!" : "Offline!" }}
  </h2>
  <UProgress
    :value="progressBar"
    :color="props.isServerOnline ? 'green' : 'red'"
  />
</template>

<style scoped></style>
