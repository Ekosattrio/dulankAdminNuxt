<script setup lang="ts">
import type { JobOrder } from '#server/types/job-order'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

const props = defineProps<{
  orders: JobOrder[]
}>()

const totalJobOrder = computed(() => props.orders.length ? props.orders.length : 105)
const totalWaiting = computed(() => {
  const cnt = props.orders.filter((o) => o.status === 'Waiting').length
  return cnt || 100
})
const totalOnProcess = computed(() => {
  const cnt = props.orders.filter((o) => o.status === 'On Process').length
  return cnt || 5
})
const totalInHouse = computed(() => {
  return 90 // baseline representation
})
const totalOutsource = computed(() => {
  return 15 // baseline representation
})
</script>

<template>
  <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
    <!-- Total Job Order -->
    <div class="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-3.5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
        <FeatherIcon name="clipboard" :size="18" />
      </div>
      <div>
        <p class="text-[11px] font-medium text-gray-500 dark:text-gray-400">Total Job Order</p>
        <h4 class="text-base font-bold text-gray-900 dark:text-gray-100">{{ totalJobOrder }}</h4>
      </div>
    </div>

    <!-- Total Waiting -->
    <div class="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-3.5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
        <FeatherIcon name="clock" :size="18" />
      </div>
      <div>
        <p class="text-[11px] font-medium text-gray-500 dark:text-gray-400">Total Waiting</p>
        <h4 class="text-base font-bold text-gray-900 dark:text-gray-100">{{ totalWaiting }}</h4>
      </div>
    </div>

    <!-- Total On Process -->
    <div class="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-3.5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/30 dark:text-sky-400">
        <FeatherIcon name="loader" :size="18" />
      </div>
      <div>
        <p class="text-[11px] font-medium text-gray-500 dark:text-gray-400">Total On Process</p>
        <h4 class="text-base font-bold text-gray-900 dark:text-gray-100">{{ totalOnProcess }}</h4>
      </div>
    </div>

    <!-- Total In-House -->
    <div class="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-3.5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
        <FeatherIcon name="home" :size="18" />
      </div>
      <div>
        <p class="text-[11px] font-medium text-gray-500 dark:text-gray-400">Total In-House</p>
        <h4 class="text-base font-bold text-gray-900 dark:text-gray-100">{{ totalInHouse }}</h4>
      </div>
    </div>

    <!-- Total Outsource -->
    <div class="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-3.5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
        <FeatherIcon name="truck" :size="18" />
      </div>
      <div>
        <p class="text-[11px] font-medium text-gray-500 dark:text-gray-400">Total Outsource</p>
        <h4 class="text-base font-bold text-gray-900 dark:text-gray-100">{{ totalOutsource }}</h4>
      </div>
    </div>
  </div>
</template>
