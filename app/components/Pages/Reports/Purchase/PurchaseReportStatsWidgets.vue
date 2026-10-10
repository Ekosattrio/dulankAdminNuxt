<script setup lang="ts">
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'

defineProps<{
  stats: {
    totalPurchaseUnit: number
    totalPurchase: number
    totalDue: number
    totalAmount: number
  }
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <!-- Total Purchase Unit -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
        <FeatherIcon name="package" :size="22" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Purchase Unit</p>
        <h3 class="truncate text-lg font-bold text-gray-900 dark:text-white">
          {{ stats.totalPurchaseUnit.toLocaleString('id-ID') }}
        </h3>
      </div>
    </div>

    <!-- Total Purchase -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
        <FeatherIcon name="shopping-cart" :size="22" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Purchase</p>
        <h3 class="truncate text-lg font-bold text-gray-900 dark:text-white">
          <CurrencyDisplay :value="stats.totalPurchase" :bold="true" align="left" />
        </h3>
      </div>
    </div>

    <!-- Total Purchase Due -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
        <FeatherIcon name="credit-card" :size="22" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Purchase Due</p>
        <h3 class="truncate text-lg font-bold text-amber-600 dark:text-amber-400">
          <CurrencyDisplay :value="stats.totalDue" :bold="true" align="left" />
        </h3>
      </div>
    </div>

    <!-- Total Purchase Amount -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
        <FeatherIcon name="dollar-sign" :size="22" />
      </div>
      <div class="min-w-0">
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Purchase Amount</p>
        <h3 class="truncate text-lg font-bold text-emerald-600 dark:text-emerald-400">
          <CurrencyDisplay :value="stats.totalAmount" :bold="true" align="left" />
        </h3>
      </div>
    </div>
  </div>
</template>

