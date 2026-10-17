<script setup lang="ts">
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import { formatNumber } from '~/composables/useFormatters'

defineProps<{
  stats: {
    totalItems: number
    totalCategories: number
    avgPrice: number
    highestPrice: number
  }
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <!-- Total Items -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary-900/30 dark:text-primary-400">
        <FeatherIcon name="package" :size="22" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Items</p>
        <h3 class="mt-1 text-xl font-bold text-gray-900 dark:text-white">{{ stats.totalItems }}</h3>
      </div>
    </div>

    <!-- Total Categories -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
        <FeatherIcon name="grid" :size="22" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Categories</p>
        <h3 class="mt-1 text-xl font-bold text-gray-900 dark:text-white">{{ stats.totalCategories }}</h3>
      </div>
    </div>

    <!-- Avg Price -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
        <FeatherIcon name="dollar-sign" :size="22" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Avg Price</p>
        <h3 class="mt-1 text-xl font-bold text-gray-900 dark:text-white">Rp {{ formatNumber(stats.avgPrice) }}</h3>
      </div>
    </div>

    <!-- Highest Price Item -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
        <FeatherIcon name="tag" :size="22" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Highest Price</p>
        <h3 class="mt-1 text-xl font-bold text-gray-900 dark:text-white">Rp {{ formatNumber(stats.highestPrice) }}</h3>
      </div>
    </div>
  </div>
</template>
