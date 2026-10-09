<script setup lang="ts">
defineProps<{ items: Array<{ label: string; value: number; icon: string; tone?: string }> }>()
</script>

<template>
  <section class="grid grid-cols-2 gap-3 md:grid-cols-4" aria-label="Summary statistics">
    <div v-for="item in items" :key="item.label" class="flex min-h-24 items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <span :class="['flex size-10 shrink-0 items-center justify-center rounded-md', item.tone || 'bg-primary/10 text-primary']">
        <FeatherIcon :name="item.icon" :size="18" />
      </span>
      <div class="min-w-0">
        <p class="truncate text-xs text-gray-500 dark:text-gray-400">{{ item.label }}</p>
        <p class="mt-1 text-lg font-bold tabular-nums text-gray-900 dark:text-white">{{ item.value.toLocaleString('id-ID') }}</p>
      </div>
    </div>
  </section>
</template>
