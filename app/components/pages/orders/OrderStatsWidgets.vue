<script setup lang="ts">
import type { OrderStats } from '#server/types/order'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

defineProps<{
  stats: OrderStats | null
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <!-- Total Orders -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-[#ff9f43] dark:bg-orange-950/30">
        <FeatherIcon name="shopping-bag" :size="22" />
      </div>
      <div>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Orders</p>
        <h4 class="text-lg font-bold text-gray-900 dark:text-gray-100">
          {{ stats ? stats.totalOrders.toLocaleString('id-ID') : '307,144' }}
        </h4>
      </div>
    </div>

    <!-- Total Customers -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">
        <FeatherIcon name="users" :size="22" />
      </div>
      <div>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Customers</p>
        <h4 class="text-lg font-bold text-gray-900 dark:text-gray-100">
          {{ stats ? stats.totalCustomers.toLocaleString('id-ID') : '4,385' }}
        </h4>
      </div>
    </div>

    <!-- Total Complete -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
        <FeatherIcon name="check-circle" :size="22" />
      </div>
      <div>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Complete</p>
        <h4 class="text-lg font-bold text-gray-900 dark:text-gray-100">
          {{ stats ? stats.totalComplete.toLocaleString('id-ID') : '3,000' }}
        </h4>
      </div>
    </div>

    <!-- Total Cancel -->
    <div class="flex items-center gap-4 rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400">
        <FeatherIcon name="x-circle" :size="22" />
      </div>
      <div>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Cancel</p>
        <h4 class="text-lg font-bold text-gray-900 dark:text-gray-100">
          {{ stats ? stats.totalCancel.toLocaleString('id-ID') : '1,385' }}
        </h4>
      </div>
    </div>
  </div>
</template>
