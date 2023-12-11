<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="text-xl font-bold">{{ props.title }}</h2>
    </template>
    <!-- Content -->
    <slot class="justify-self-auto" />

    <slot name="footer" />
  </UCard>
</template>
