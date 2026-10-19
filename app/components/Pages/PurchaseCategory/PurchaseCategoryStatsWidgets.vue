<script setup lang="ts">
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

defineProps<{
  stats: {
    totalCategories: number
    activeCategories: number
    deactiveCategories: number
    totalItems: number
  }
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <!-- Total Categories -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary-900/30 dark:text-primary-400">
        <FeatherIcon name="grid" :size="22" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Categories</p>
        <h3 class="mt-1 text-xl font-bold text-gray-900 dark:text-white">{{ stats.totalCategories }}</h3>
      </div>
    </div>

    <!-- Active Categories -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
        <FeatherIcon name="check-circle" :size="22" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Active</p>
        <h3 class="mt-1 text-xl font-bold text-emerald-600">{{ stats.activeCategories }}</h3>
      </div>
    </div>

    <!-- Deactive Categories -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
        <FeatherIcon name="slash" :size="22" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Deactive</p>
        <h3 class="mt-1 text-xl font-bold text-rose-600 dark:text-rose-400">{{ stats.deactiveCategories }}</h3>
      </div>
    </div>

    <!-- Total Catalog Items -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
        <FeatherIcon name="package" :size="22" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Catalog Items</p>
        <h3 class="mt-1 text-xl font-bold text-gray-900 dark:text-white">{{ stats.totalItems }}</h3>
      </div>
    </div>
  </div>
</template>
