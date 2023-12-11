<script lang="ts" setup>
const progressBar = ref(0);
const props = defineProps<{
  isServerOnline: boolean;
}>();
const emit = defineEmits<{
  (event: "refresh"): void;
}>();

onMounted(() => {
  let counter = 0;

  setInterval(() => {
    if (counter === 6) {
      emit("refresh");
      counter = 0;
    }
    progressBar.value = counter * 25;
    counter++;
  }, 250);
});
</script>

<template>
  <hr class="my-4" />
  <h2
    class="text-xl text-center mb-2"
    :class="{
      'text-green-600': isServerOnline,
      'text-red-600': !isServerOnline,
    }"
  >
    {{ isServerOnline ? "Online!" : "Offline!" }}
  </h2>
  <UProgress animation="swing" v-if="isServerOnline" />
</template>

<style scoped></style>
