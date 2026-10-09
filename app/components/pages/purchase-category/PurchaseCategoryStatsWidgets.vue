<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'

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
    <div class="relative overflow-hidden rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Total Categories
          </p>
          <h3 class="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {{ stats.totalCategories }}
          </h3>
        </div>
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-400">
          <FeatherIcon name="grid" size="22" />
        </div>
      </div>
    </div>

    <!-- Active Categories -->
    <div class="relative overflow-hidden rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Active
          </p>
          <h3 class="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {{ stats.activeCategories }}
          </h3>
        </div>
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
          <FeatherIcon name="check-circle" size="22" />
        </div>
      </div>
    </div>

    <!-- Deactive Categories -->
    <div class="relative overflow-hidden rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Deactive
          </p>
          <h3 class="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {{ stats.deactiveCategories }}
          </h3>
        </div>
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
          <FeatherIcon name="slash" size="22" />
        </div>
      </div>
    </div>

    <!-- Total Catalog Items -->
    <div class="relative overflow-hidden rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Catalog Items
          </p>
          <h3 class="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {{ stats.totalItems }}
          </h3>
        </div>
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
          <FeatherIcon name="package" size="22" />
        </div>
      </div>
    </div>
  </div>
</template>
