<script setup lang="ts">
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'

defineProps<{
  stats: {
    totalInvoices: number
    totalGrossRevenue: number
    totalNetSales: number
    avgCollectionRate: number
  }
}>()
</script>

<template>
  <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <!-- Total Invoices -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
        <FeatherIcon name="file-text" :size="22" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Invoices</p>
        <h3 class="truncate text-lg font-bold text-gray-900 dark:text-white">
          {{ stats.totalInvoices.toLocaleString('id-ID') }}
        </h3>
      </div>
    </div>

    <!-- Total Gross Revenue -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
        <FeatherIcon name="trending-up" :size="22" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Gross Revenue</p>
        <h3 class="truncate text-lg font-bold text-emerald-600 dark:text-emerald-400">
          <CurrencyDisplay :value="stats.totalGrossRevenue" :bold="true" align="left" />
        </h3>
      </div>
    </div>

    <!-- Total Net Sales -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
        <FeatherIcon name="dollar-sign" :size="22" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Net Sales</p>
        <h3 class="truncate text-lg font-bold text-gray-900 dark:text-white">
          <CurrencyDisplay :value="stats.totalNetSales" :bold="true" align="left" />
        </h3>
      </div>
    </div>

    <!-- Avg Collection Rate -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400">
        <FeatherIcon name="check-circle" :size="22" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Avg Collection Rate</p>
        <h3 class="truncate text-lg font-bold text-teal-600 dark:text-teal-400">
          {{ stats.avgCollectionRate }}%
        </h3>
      </div>
    </div>
  </div>
</template>

