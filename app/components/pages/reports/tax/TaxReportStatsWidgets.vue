<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'

defineProps<{
  summary: {
    totalOutputTax: number
    totalInputTax: number
    totalCarryOver: number
    totalNetTax: number
    underpaidMonthsCount: number
    overpaidMonthsCount: number
  }
}>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <!-- Total Pajak Keluaran (Output Tax) -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
        <FeatherIcon name="file-text" size="22" />
      </div>
      <div>
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Pajak Keluaran (PPN)</div>
        <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
          <CurrencyDisplay :value="summary.totalOutputTax" align="left" bold />
        </div>
        <div class="text-[11px] text-gray-400">Faktur Pajak Penjualan</div>
      </div>
    </div>

    <!-- Total Pajak Masukan (Input Tax) -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
        <FeatherIcon name="arrow-down-left" size="22" />
      </div>
      <div>
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Pajak Masukan (PPN)</div>
        <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
          <CurrencyDisplay :value="summary.totalInputTax" align="left" bold />
        </div>
        <div class="text-[11px] text-gray-400">Faktur Pembelian Bahan Baku</div>
      </div>
    </div>

    <!-- Total Kompensasi (Carry Over) -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
        <FeatherIcon name="refresh-cw" size="22" />
      </div>
      <div>
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Kompensasi</div>
        <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
          <CurrencyDisplay :value="summary.totalCarryOver" align="left" bold />
        </div>
        <div class="text-[11px] text-gray-400">Kompensasi Lebih Bayar</div>
      </div>
    </div>

    <!-- Total PPN Net Kurang / Lebih Bayar -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div
        class="flex h-12 w-12 items-center justify-center rounded-lg"
        :class="summary.totalNetTax >= 0
          ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
          : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'"
      >
        <FeatherIcon :name="summary.totalNetTax >= 0 ? 'alert-circle' : 'check-circle'" size="22" />
      </div>
      <div>
        <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">
          {{ summary.totalNetTax >= 0 ? 'Total Kurang Bayar (Net)' : 'Total Lebih Bayar (Net)' }}
        </div>
        <div
          class="text-lg font-bold"
          :class="summary.totalNetTax >= 0
            ? 'text-rose-600 dark:text-rose-400'
            : 'text-emerald-600 dark:text-emerald-400'"
        >
          <CurrencyDisplay :value="Math.abs(summary.totalNetTax)" align="left" bold />
        </div>
        <div class="text-[11px] text-gray-400">
          {{ summary.underpaidMonthsCount }} bln Kurang / {{ summary.overpaidMonthsCount }} bln Lebih
        </div>
      </div>
    </div>
  </div>
</template>

