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
    <div class="relative overflow-hidden rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Total Items
          </p>
          <h3 class="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {{ stats.totalItems }}
          </h3>
        </div>
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-400">
          <FeatherIcon name="package" size="22" />
        </div>
      </div>
    </div>

    <!-- Total Categories -->
    <div class="relative overflow-hidden rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Categories
          </p>
          <h3 class="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {{ stats.totalCategories }}
          </h3>
        </div>
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
          <FeatherIcon name="grid" size="22" />
        </div>
      </div>
    </div>

    <!-- Avg Price -->
    <div class="relative overflow-hidden rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Avg Price
          </p>
          <h3 class="mt-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Rp {{ formatNumber(stats.avgPrice) }}
          </h3>
        </div>
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
          <FeatherIcon name="dollar-sign" size="22" />
        </div>
      </div>
    </div>

    <!-- Highest Price Item -->
    <div class="relative overflow-hidden rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Highest Price
          </p>
          <h3 class="mt-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Rp {{ formatNumber(stats.highestPrice) }}
          </h3>
        </div>
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
          <FeatherIcon name="tag" size="22" />
        </div>
      </div>
    </div>
  </div>
</template>
