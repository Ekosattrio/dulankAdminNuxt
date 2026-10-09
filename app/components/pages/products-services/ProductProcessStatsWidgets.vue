<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'

defineProps<{
  stats: {
    totalProduct: number
    totalProcess: number
    active: number
    deactive: number
  }
}>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900 flex items-center gap-3">
      <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400">
        <FeatherIcon name="box" :size="20" />
      </div>
      <div>
        <p class="text-xs text-gray-500 dark:text-gray-400">Total Products</p>
        <p class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ stats.totalProduct.toLocaleString('id-ID') }}</p>
      </div>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900 flex items-center gap-3">
      <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
        <FeatherIcon name="git-branch" :size="20" />
      </div>
      <div>
        <p class="text-xs text-gray-500 dark:text-gray-400">Total Product Processes</p>
        <p class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ stats.totalProcess.toLocaleString('id-ID') }}</p>
      </div>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900 flex items-center gap-3">
      <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
        <FeatherIcon name="check-circle" :size="20" />
      </div>
      <div>
        <p class="text-xs text-gray-500 dark:text-gray-400">Active</p>
        <p class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ stats.active.toLocaleString('id-ID') }}</p>
      </div>
    </div>

    <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900 flex items-center gap-3">
      <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
        <FeatherIcon name="pause-circle" :size="20" />
      </div>
      <div>
        <p class="text-xs text-gray-500 dark:text-gray-400">Deactive</p>
        <p class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ stats.deactive.toLocaleString('id-ID') }}</p>
      </div>
    </div>
  </div>
</template>

