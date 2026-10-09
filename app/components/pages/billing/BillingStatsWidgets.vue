<script setup lang="ts">
import type { BillingStats } from '#server/types/billing'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

defineProps<{
  stats: BillingStats
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
    <div class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div>
        <p class="text-xs text-gray-500 dark:text-gray-400">Total Transaction</p>
        <h4 class="text-xl font-bold text-gray-900 dark:text-white">{{ stats.totalTransaction }}</h4>
      </div>
      <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary dark:bg-primary/20">
        <FeatherIcon name="file-text" size="22" />
      </div>
    </div>

    <div class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div>
        <p class="text-xs text-gray-500 dark:text-gray-400">Total Success</p>
        <h4 class="text-xl font-bold text-emerald-600 dark:text-emerald-400">{{ stats.totalSuccess }}</h4>
      </div>
      <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
        <FeatherIcon name="check-circle" size="22" />
      </div>
    </div>

    <div class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div>
        <p class="text-xs text-gray-500 dark:text-gray-400">Total Failed</p>
        <h4 class="text-xl font-bold text-rose-600 dark:text-rose-400">{{ stats.totalFailed }}</h4>
      </div>
      <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
        <FeatherIcon name="x-circle" size="22" />
      </div>
    </div>
  </div>
</template>

