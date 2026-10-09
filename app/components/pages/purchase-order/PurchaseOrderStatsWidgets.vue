<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import { formatNumber } from '~/composables/useFormatters'

const props = defineProps<{
  stats?: {
    totalOrders: number
    totalAmount: number
    totalComplete: number
    totalScheduled: number
  }
  orders?: any[]
}>()

const computedStats = computed(() => {
  if (props.stats) return props.stats
  const all = props.orders || []
  return {
    totalOrders: all.length,
    totalAmount: all.reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
    totalComplete: all.filter((p: any) => p.goodsStatus === 'Complete').length,
    totalScheduled: all.filter((p: any) => p.goodsStatus === 'Scheduled' || p.goodsStatus === 'Pending').length,
  }
})
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
    <!-- Total Orders -->
    <div class="rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Purchase Orders</p>
          <h3 class="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{{ computedStats.totalOrders }}</h3>
        </div>
        <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FeatherIcon name="file-text" :size="20" />
        </div>
      </div>
    </div>

    <!-- Total Amount -->
    <div class="rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Order Amount</p>
          <h3 class="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100 font-mono">Rp {{ formatNumber(computedStats.totalAmount) }}</h3>
        </div>
        <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
          <FeatherIcon name="dollar-sign" :size="20" />
        </div>
      </div>
    </div>

    <!-- Total Complete -->
    <div class="rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Goods Complete</p>
          <h3 class="mt-1 text-2xl font-bold text-emerald-600">{{ computedStats.totalComplete }}</h3>
        </div>
        <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
          <FeatherIcon name="check-circle" :size="20" />
        </div>
      </div>
    </div>

    <!-- Scheduled / Pending -->
    <div class="rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Scheduled / Pending</p>
          <h3 class="mt-1 text-2xl font-bold text-amber-500">{{ computedStats.totalScheduled }}</h3>
        </div>
        <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
          <FeatherIcon name="clock" :size="20" />
        </div>
      </div>
    </div>
  </div>
</template>
