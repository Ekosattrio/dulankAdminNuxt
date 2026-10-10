<script setup lang="ts">
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import { formatIDR } from '~/utils/currency'

defineProps<{
  stats: {
    totalSuppliers: number
    totalAmount: number
    totalPaid: number
    totalDue: number
  }
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <!-- Card 1: Total Mitra -->
    <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
        <FeatherIcon name="users" :size="22" />
      </div>
      <div>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Mitra Pemasok</p>
        <h4 class="mt-1 font-mono text-xl font-bold text-gray-900 dark:text-gray-100">
          {{ stats.totalSuppliers }} <span class="text-xs font-normal text-gray-500">Mitra</span>
        </h4>
      </div>
    </div>

    <!-- Card 2: Total Pembelian -->
    <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
        <FeatherIcon name="shopping-bag" :size="22" />
      </div>
      <div>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Pembelian</p>
        <h4 class="mt-1 font-mono text-xl font-bold text-gray-900 dark:text-gray-100">
          {{ formatIDR(stats.totalAmount) }}
        </h4>
      </div>
    </div>

    <!-- Card 3: Total Terbayar -->
    <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
        <FeatherIcon name="check-circle" :size="22" />
      </div>
      <div>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Terbayar</p>
        <h4 class="mt-1 font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400">
          {{ formatIDR(stats.totalPaid) }}
        </h4>
      </div>
    </div>

    <!-- Card 4: Total Hutang Jatuh Tempo -->
    <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
        <FeatherIcon name="alert-circle" :size="22" />
      </div>
      <div>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Hutang / Sisa Tagihan</p>
        <h4 class="mt-1 font-mono text-xl font-bold text-rose-600 dark:text-rose-400">
          {{ formatIDR(stats.totalDue) }}
        </h4>
      </div>
    </div>
  </div>
</template>

