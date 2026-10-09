<script setup lang="ts">
import type { SubscriptionStats } from '#server/types/subscription'

defineProps<{
  stats: SubscriptionStats
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
    <!-- Card 1: Total Transactions -->
    <div class="flex items-center justify-between rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#F96E6F]/15 text-[#F96E6F]">
          <img src="/assets/img/icons/dash1.svg" alt="Transactions" class="h-6 w-6" />
        </div>
        <div>
          <h5 class="text-lg font-bold text-gray-900 dark:text-white">{{ stats.totalTransactions.toLocaleString() }}</h5>
          <h6 class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Transactions</h6>
        </div>
      </div>
    </div>

    <!-- Card 2: Total Subscribers -->
    <div class="flex items-center justify-between rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#28C76F]/15 text-[#28C76F]">
          <img src="/assets/img/icons/dash2.svg" alt="Subscribers" class="h-6 w-6" />
        </div>
        <div>
          <h5 class="text-lg font-bold text-gray-900 dark:text-white">{{ stats.totalSubscribers.toLocaleString() }}</h5>
          <h6 class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Subscribers</h6>
        </div>
      </div>
    </div>

    <!-- Card 3: Active Subscribers -->
    <div class="flex items-center justify-between rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#00CFE8]/15 text-[#00CFE8]">
          <img src="/assets/img/icons/dash3.svg" alt="Active" class="h-6 w-6" />
        </div>
        <div>
          <h5 class="text-lg font-bold text-gray-900 dark:text-white">{{ stats.activeSubscribers.toLocaleString() }}</h5>
          <h6 class="text-xs font-medium text-gray-500 dark:text-gray-400">Active Subscribers</h6>
        </div>
      </div>
    </div>

    <!-- Card 4: Expired Subscribers -->
    <div class="flex items-center justify-between rounded-xl border border-gray-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center gap-4">
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-[#FF9F43]/15 text-[#FF9F43]">
          <img src="/assets/img/icons/dash4.svg" alt="Expired" class="h-6 w-6" />
        </div>
        <div>
          <h5 class="text-lg font-bold text-gray-900 dark:text-white">{{ stats.expiredSubscribers.toLocaleString() }}</h5>
          <h6 class="text-xs font-medium text-gray-500 dark:text-gray-400">Expired Subscribers</h6>
        </div>
      </div>
    </div>
  </div>
</template>

