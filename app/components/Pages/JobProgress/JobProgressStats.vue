<script setup lang="ts">
import type { JobProgressStats } from '#server/types/job-progress'
defineProps<{ stats: JobProgressStats }>()
</script>

<template>
  <div class="grid gap-3 sm:grid-cols-3">
    <div v-for="card in [{ label: 'Total Job Progress', value: stats.total, icon: 'activity' }, { label: 'Complete', value: stats.completed, icon: 'check-circle' }, { label: 'Pending', value: stats.pending, icon: 'clock' }]" :key="card.label" class="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <span class="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary"><FeatherIcon :name="card.icon" :size="20" /></span>
      <div><p class="app-supporting-text">{{ card.label }}</p><p class="text-2xl font-bold text-gray-900 dark:text-white">{{ card.value }}</p></div>
    </div>
  </div>
</template>
