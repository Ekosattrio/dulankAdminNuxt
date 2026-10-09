<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'

defineProps<{
  stats: {
    totalSoldUnit: number
    totalSales: number
    totalDue: number
    totalAmount: number
    posSales: number
    websiteSales: number
    quotationSales: number
    staffSales: number
  }
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <!-- Row 1: Total Sold Unit -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-500 dark:bg-orange-950/40 dark:text-orange-400">
        <FeatherIcon name="package" :size="20" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-normal text-gray-500 dark:text-gray-400">Total Sold Unit</p>
        <h3 class="truncate text-lg font-bold text-gray-900 dark:text-white">
          {{ stats.totalSoldUnit.toLocaleString('id-ID') }}
        </h3>
      </div>
    </div>

    <!-- Row 1: Total Sales -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-400">
        <FeatherIcon name="dollar-sign" :size="20" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-normal text-gray-500 dark:text-gray-400">Total Sales</p>
        <h3 class="truncate text-lg font-bold text-gray-900 dark:text-white">
          Rp{{ stats.totalSales.toLocaleString('id-ID') }}
        </h3>
      </div>
    </div>

    <!-- Row 1: Total Sales Due -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-500 dark:bg-cyan-950/40 dark:text-cyan-400">
        <FeatherIcon name="arrow-down" :size="20" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-normal text-gray-500 dark:text-gray-400">Total Sales Due</p>
        <h3 class="truncate text-lg font-bold text-gray-900 dark:text-white">
          Rp{{ stats.totalDue.toLocaleString('id-ID') }}
        </h3>
      </div>
    </div>

    <!-- Row 1: Total Sales Amount -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-500 dark:bg-rose-950/40 dark:text-rose-400">
        <FeatherIcon name="arrow-up" :size="20" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-normal text-gray-500 dark:text-gray-400">Total Sales Amount</p>
        <h3 class="truncate text-lg font-bold text-gray-900 dark:text-white">
          Rp{{ stats.totalAmount.toLocaleString('id-ID') }}
        </h3>
      </div>
    </div>

    <!-- Row 2: Point of Sales -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-500 dark:bg-rose-950/40 dark:text-rose-400">
        <FeatherIcon name="shopping-bag" :size="20" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-normal text-gray-500 dark:text-gray-400">Point of Sales</p>
        <h3 class="truncate text-lg font-bold text-gray-900 dark:text-white">
          Rp{{ stats.posSales.toLocaleString('id-ID') }}
        </h3>
      </div>
    </div>

    <!-- Row 2: Website -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-400">
        <FeatherIcon name="globe" :size="20" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-normal text-gray-500 dark:text-gray-400">Website</p>
        <h3 class="truncate text-lg font-bold text-gray-900 dark:text-white">
          Rp{{ stats.websiteSales.toLocaleString('id-ID') }}
        </h3>
      </div>
    </div>

    <!-- Row 2: Quotation -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-500 dark:bg-cyan-950/40 dark:text-cyan-400">
        <FeatherIcon name="file-text" :size="20" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-normal text-gray-500 dark:text-gray-400">Quotation</p>
        <h3 class="truncate text-lg font-bold text-gray-900 dark:text-white">
          Rp{{ stats.quotationSales.toLocaleString('id-ID') }}
        </h3>
      </div>
    </div>

    <!-- Row 2: Sales Staff -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-500 dark:bg-rose-950/40 dark:text-rose-400">
        <FeatherIcon name="users" :size="20" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-normal text-gray-500 dark:text-gray-400">Sales Staff</p>
        <h3 class="truncate text-lg font-bold text-gray-900 dark:text-white">
          Rp{{ stats.staffSales.toLocaleString('id-ID') }}
        </h3>
      </div>
    </div>
  </div>
</template>

