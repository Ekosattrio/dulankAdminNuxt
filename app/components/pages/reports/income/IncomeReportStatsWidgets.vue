<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'

defineProps<{
  summary: {
    totalIncomesCount: number
    totalIncomeAmount: number
    topIncomeCategory: string
    averageIncomePerCategory: number
  }
}>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Total Transaksi Pendapatan -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
        <FeatherIcon name="file-text" :size="22" />
      </div>
      <div>
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Transaksi Masuk</div>
        <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
          {{ summary.totalIncomesCount.toLocaleString('id-ID') }} Trx
        </div>
      </div>
    </div>

    <!-- Total Pemasukan -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400">
        <FeatherIcon name="dollar-sign" :size="22" />
      </div>
      <div>
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Pemasukan</div>
        <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
          <CurrencyDisplay :value="summary.totalIncomeAmount" align="left" bold custom-class="text-emerald-600 dark:text-emerald-400" />
        </div>
      </div>
    </div>

    <!-- Pendapatan Terbesar -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
        <FeatherIcon name="award" :size="22" />
      </div>
      <div>
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Pendapatan Terbesar</div>
        <div class="text-sm font-bold text-gray-900 dark:text-gray-100 truncate max-w-[160px]" :title="summary.topIncomeCategory">
          {{ summary.topIncomeCategory }}
        </div>
      </div>
    </div>

    <!-- Rata-rata Pendapatan per Kategori -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
        <FeatherIcon name="trending-up" :size="22" />
      </div>
      <div>
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Rata-rata / Kategori</div>
        <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
          <CurrencyDisplay :value="summary.averageIncomePerCategory" align="left" bold />
        </div>
      </div>
    </div>
  </div>
</template>

