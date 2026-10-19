<script setup lang="ts">
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import { formatNumber } from '~/composables/useFormatters'

defineProps<{
  stats: {
    totalReturns: number
    totalAmount: number
    totalPaid: number
    totalDue: number
  }
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <!-- Total Returns -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary-900/30 dark:text-primary-400">
        <FeatherIcon name="refresh-cw" :size="22" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Purchase Returns</p>
        <h3 class="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">{{ stats.totalReturns }}</h3>
      </div>
    </div>

    <!-- Total Return Amount -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
        <FeatherIcon name="dollar-sign" :size="22" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Retur (Amount)</p>
        <h3 class="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100 font-mono">Rp {{ formatNumber(stats.totalAmount) }}</h3>
      </div>
    </div>

    <!-- Total Paid / Refunded -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
        <FeatherIcon name="check-circle" :size="22" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Refund Diterima (Paid)</p>
        <h3 class="mt-1 text-xl font-bold text-emerald-600 font-mono">Rp {{ formatNumber(stats.totalPaid) }}</h3>
      </div>
    </div>

    <!-- Total Due -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 dark:bg-amber-950/40 dark:text-amber-400">
        <FeatherIcon name="alert-circle" :size="22" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Sisa Tagihan / Due</p>
        <h3 class="mt-1 text-xl font-bold text-amber-500 font-mono">Rp {{ formatNumber(stats.totalDue) }}</h3>
      </div>
    </div>
  </div>
</template>
