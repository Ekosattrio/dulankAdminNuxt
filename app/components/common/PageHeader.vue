<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
}>()
</script>

<template>
  <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <div class="page-title">
      <h4 class="text-xl font-bold text-gray-900 dark:text-white">{{ title }}</h4>
      <p v-if="subtitle" class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2">
      <slot name="actions" />
    </div>
  </div>
</template>

