<script setup lang="ts">
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import { formatIDR } from '~/utils/currency'

defineProps<{
  stats: {
    totalSuppliers: number
    totalPurchasesDue: number
    totalAmountDue: number
    avgDaysDue: number
  }
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <!-- Card 1: Total Mitra -->
    <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
        <FeatherIcon name="users" size="22" />
      </div>
      <div>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Mitra Terhutang</p>
        <h4 class="mt-1 font-mono text-xl font-bold text-gray-900 dark:text-gray-100">
          {{ stats.totalSuppliers }} <span class="text-xs font-normal text-gray-500">Mitra</span>
        </h4>
      </div>
    </div>

    <!-- Card 2: Total Pembelian Due -->
    <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
        <FeatherIcon name="shopping-bag" size="22" />
      </div>
      <div>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Pembelian Jatuh Tempo</p>
        <h4 class="mt-1 font-mono text-xl font-bold text-gray-900 dark:text-gray-100">
          {{ stats.totalPurchasesDue }} <span class="text-xs font-normal text-gray-500">PO</span>
        </h4>
      </div>
    </div>

    <!-- Card 3: Total Hutang Jatuh Tempo -->
    <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
        <FeatherIcon name="alert-triangle" size="22" />
      </div>
      <div>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Tagihan Hutang</p>
        <h4 class="mt-1 font-mono text-xl font-bold text-rose-600 dark:text-rose-400">
          {{ formatIDR(stats.totalAmountDue) }}
        </h4>
      </div>
    </div>

    <!-- Card 4: Rata-rata Keterlambatan -->
    <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
        <FeatherIcon name="clock" size="22" />
      </div>
      <div>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Rata-rata Keterlambatan</p>
        <h4 class="mt-1 font-mono text-xl font-bold text-amber-600 dark:text-amber-400">
          {{ stats.avgDaysDue }} <span class="text-xs font-normal text-gray-500">Hari</span>
        </h4>
      </div>
    </div>
  </div>
</template>

