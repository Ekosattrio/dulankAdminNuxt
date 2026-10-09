<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'

defineProps<{
  stats: {
    total: number
    active: number
    deactive: number
  }
}>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <!-- Total Paper Sizes -->
    <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm flex items-center gap-4">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <FeatherIcon name="maximize-2" :size="24" />
      </div>
      <div>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Paper's Size</p>
        <h4 class="text-xl font-bold text-gray-900 dark:text-white">{{ stats.total }}</h4>
      </div>
    </div>

    <!-- Total Active -->
    <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm flex items-center gap-4">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
        <FeatherIcon name="check-circle" :size="24" />
      </div>
      <div>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Active</p>
        <h4 class="text-xl font-bold text-gray-900 dark:text-white">{{ stats.active }}</h4>
      </div>
    </div>

    <!-- Total Deactive -->
    <div class="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm flex items-center gap-4">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
        <FeatherIcon name="x-circle" :size="24" />
      </div>
      <div>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Deactive</p>
        <h4 class="text-xl font-bold text-gray-900 dark:text-white">{{ stats.deactive }}</h4>
      </div>
    </div>
  </div>
</template>

