<script setup lang="ts">
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'

defineProps<{
  summary: {
    totalOrders: number
    totalRevenue: number
    topCategory: string
    averageOrderValue: number
  }
}>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Total Order / Sold Qty -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary-900/30 dark:text-primary-400">
        <FeatherIcon name="package" :size="22" />
      </div>
      <div>
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Produk Dipesan</div>
        <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
          {{ summary.totalOrders.toLocaleString('id-ID') }}
        </div>
      </div>
    </div>

    <!-- Total Revenue -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
        <FeatherIcon name="dollar-sign" :size="22" />
      </div>
      <div>
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Revenue</div>
        <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
          <CurrencyDisplay :value="summary.totalRevenue" align="left" bold />
        </div>
      </div>
    </div>

    <!-- Kategori Terlaris -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
        <FeatherIcon name="trending-up" :size="22" />
      </div>
      <div>
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Kategori Terlaris</div>
        <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
          {{ summary.topCategory }}
        </div>
      </div>
    </div>

    <!-- Rata-rata Penjualan / Item -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
        <FeatherIcon name="bar-chart-2" :size="22" />
      </div>
      <div>
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Rata-rata / Produk</div>
        <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
          <CurrencyDisplay :value="summary.averageOrderValue" align="left" bold />
        </div>
      </div>
    </div>
  </div>
</template>

