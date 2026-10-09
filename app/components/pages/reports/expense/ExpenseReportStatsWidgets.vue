<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'

defineProps<{
  summary: {
    totalExpensesCount: number
    totalExpenseAmount: number
    topExpenseCategory: string
    averageExpensePerCategory: number
  }
}>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Total Transaksi Beban -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
        <FeatherIcon name="file-text" :size="22" />
      </div>
      <div>
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Transaksi Beban</div>
        <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
          {{ summary.totalExpensesCount.toLocaleString('id-ID') }} Trx
        </div>
      </div>
    </div>

    <!-- Total Pengeluaran -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
        <FeatherIcon name="dollar-sign" :size="22" />
      </div>
      <div>
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Pengeluaran</div>
        <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
          <CurrencyDisplay :value="summary.totalExpenseAmount" align="left" bold />
        </div>
      </div>
    </div>

    <!-- Beban Terbesar -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
        <FeatherIcon name="pie-chart" :size="22" />
      </div>
      <div>
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Beban Terbesar</div>
        <div class="text-sm font-bold text-gray-900 dark:text-gray-100 truncate max-w-[160px]" :title="summary.topExpenseCategory">
          {{ summary.topExpenseCategory }}
        </div>
      </div>
    </div>

    <!-- Rata-rata Beban per Kategori -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
        <FeatherIcon name="trending-down" :size="22" />
      </div>
      <div>
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Rata-rata / Kategori</div>
        <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
          <CurrencyDisplay :value="summary.averageExpensePerCategory" align="left" bold />
        </div>
      </div>
    </div>
  </div>
</template>

