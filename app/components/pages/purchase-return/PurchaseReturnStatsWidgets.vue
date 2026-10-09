<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import { formatNumber } from '~/composables/useFormatters'

const props = defineProps<{
  stats?: {
    totalReturns: number
    totalAmount: number
    totalPaid: number
    totalDue: number
  }
  purchaseReturns?: any[]
}>()

const computedStats = computed(() => {
  if (props.stats) return props.stats
  const all = props.purchaseReturns || []
  return {
    totalReturns: all.length,
    totalAmount: all.reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
    totalPaid: all.reduce((sum, p) => sum + (Number(p.paid) || 0), 0),
    totalDue: all.reduce((sum, p) => sum + (Number(p.due) || 0), 0),
  }
})
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
    <!-- Total Returns -->
    <div class="rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Purchase Returns</p>
          <h3 class="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">{{ computedStats.totalReturns }}</h3>
        </div>
        <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FeatherIcon name="refresh-cw" :size="20" />
        </div>
      </div>
    </div>

    <!-- Total Return Amount -->
    <div class="rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Retur (Amount)</p>
          <h3 class="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100 font-mono">Rp {{ formatNumber(computedStats.totalAmount) }}</h3>
        </div>
        <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600">
          <FeatherIcon name="dollar-sign" :size="20" />
        </div>
      </div>
    </div>

    <!-- Total Paid / Refunded -->
    <div class="rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Refund Diterima (Paid)</p>
          <h3 class="mt-1 text-xl font-bold text-emerald-600 font-mono">Rp {{ formatNumber(computedStats.totalPaid) }}</h3>
        </div>
        <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
          <FeatherIcon name="check-circle" :size="20" />
        </div>
      </div>
    </div>

    <!-- Total Due -->
    <div class="rounded-xl border border-gray-200/80 bg-white p-4 shadow-xs dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Sisa Tagihan / Due</p>
          <h3 class="mt-1 text-xl font-bold text-amber-500 font-mono">Rp {{ formatNumber(computedStats.totalDue) }}</h3>
        </div>
        <div class="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
          <FeatherIcon name="alert-circle" :size="20" />
        </div>
      </div>
    </div>
  </div>
</template>
