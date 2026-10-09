<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
import { formatIDR } from '~/utils/currency'

defineProps<{
  summary: {
    totalRevenue: number
    totalCogs: number
    totalGrossProfit: number
    totalOperatingExpenses: number
    totalNetProfit: number
    averageNetMarginPercent: number | string
    highestMonth: string
  }
  itemsLength: number
}>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Total Revenue -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
        <FeatherIcon name="trending-up" :size="22" />
      </div>
      <div>
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Pendapatan Tahunan</div>
        <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
          <CurrencyDisplay :value="summary.totalRevenue" align="left" bold />
        </div>
        <div class="text-[11px] text-gray-400">Akumulasi {{ itemsLength }} Bulan</div>
      </div>
    </div>

    <!-- Total COGS -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
        <FeatherIcon name="shopping-bag" :size="22" />
      </div>
      <div>
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Total HPP (COGS)</div>
        <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
          <CurrencyDisplay :value="summary.totalCogs" align="left" bold />
        </div>
        <div class="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
          Laba Kotor: {{ formatIDR(summary.totalGrossProfit) }}
        </div>
      </div>
    </div>

    <!-- Total Net Profit -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
        <FeatherIcon name="dollar-sign" :size="22" />
      </div>
      <div>
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Laba Bersih Tahunan</div>
        <div class="text-lg font-bold text-indigo-600 dark:text-indigo-400">
          <CurrencyDisplay :value="summary.totalNetProfit" align="left" bold />
        </div>
        <div class="text-[11px] text-gray-400">Beban OpEx: {{ formatIDR(summary.totalOperatingExpenses) }}</div>
      </div>
    </div>

    <!-- Average Net Profit Margin -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
        <FeatherIcon name="pie-chart" :size="22" />
      </div>
      <div>
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Rata-rata Margin Keuntungan</div>
        <div class="text-lg font-bold text-purple-600 dark:text-purple-400">
          {{ summary.averageNetMarginPercent }}%
        </div>
        <div class="text-[11px] text-gray-400 truncate max-w-[170px]" :title="`Puncak: ${summary.highestMonth}`">
          Tertinggi: {{ summary.highestMonth }}
        </div>
      </div>
    </div>
  </div>
</template>

