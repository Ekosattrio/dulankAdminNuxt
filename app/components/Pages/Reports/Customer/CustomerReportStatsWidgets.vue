<script setup lang="ts">
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import { formatIDR } from '~/utils/currency'

defineProps<{
  stats: {
    totalCustomers: number
    totalOrders: number
    totalAmount: number
    totalDue: number
  }
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <!-- Card 1: Total Pelanggan -->
    <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
        <FeatherIcon name="users" size="22" />
      </div>
      <div>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Pelanggan</p>
        <h4 class="mt-1 font-mono text-xl font-bold text-gray-900 dark:text-gray-100">
          {{ stats.totalCustomers }} <span class="text-xs font-normal text-gray-500">Klien</span>
        </h4>
      </div>
    </div>

    <!-- Card 2: Total Pesanan -->
    <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
        <FeatherIcon name="shopping-cart" size="22" />
      </div>
      <div>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Pesanan Cetak</p>
        <h4 class="mt-1 font-mono text-xl font-bold text-gray-900 dark:text-gray-100">
          {{ stats.totalOrders }} <span class="text-xs font-normal text-gray-500">Order</span>
        </h4>
      </div>
    </div>

    <!-- Card 3: Total Nilai Penjualan -->
    <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
        <FeatherIcon name="trending-up" size="22" />
      </div>
      <div>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Nilai Penjualan</p>
        <h4 class="mt-1 font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400">
          {{ formatIDR(stats.totalAmount) }}
        </h4>
      </div>
    </div>

    <!-- Card 4: Sisa Piutang Berjalan -->
    <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
        <FeatherIcon name="clock" size="22" />
      </div>
      <div>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Sisa Piutang Berjalan</p>
        <h4 class="mt-1 font-mono text-xl font-bold text-amber-600 dark:text-amber-400">
          {{ formatIDR(stats.totalDue) }}
        </h4>
      </div>
    </div>
  </div>
</template>

