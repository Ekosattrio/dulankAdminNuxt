<script setup lang="ts">
import type { MyIncentiveStats } from '#server/types/my-incentive'
import { formatMoney } from '~/utils/currency'

interface Props {
  stats: MyIncentiveStats
}

defineProps<Props>()
</script>

<template>
  <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <!-- Total Count Incentive -->
    <div
      class="app-stat-card"
    >
      <div
        class="w-12 h-12 rounded-full bg-[rgba(249,110,111,0.12)] flex items-center justify-center shrink-0"
      >
        <img
          src="/assets/img/icons/dash1.svg"
          alt="Total Count Incentive"
          class="w-6 h-6 object-contain"
        />
      </div>
      <div class="min-w-0 flex-1">
        <h6 class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-1">
          Total Count Incentive
        </h6>
        <h5 class="text-2xl font-bold break-words text-gray-900 dark:text-white">
          {{ formatMoney(stats.totalCount) }}
        </h5>
      </div>
    </div>

    <!-- Amount Incentive -->
    <div
      class="app-stat-card"
    >
      <div
        class="w-12 h-12 rounded-full bg-[rgba(40,199,111,0.12)] flex items-center justify-center shrink-0"
      >
        <img
          src="/assets/img/icons/dash2.svg"
          alt="Amount Incentive"
          class="w-6 h-6 object-contain"
        />
      </div>
      <div class="min-w-0 flex-1">
        <h6 class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-1">
          Amount Incentive
        </h6>
        <h5 class="text-2xl font-bold break-words text-gray-900 dark:text-white">
          Rp {{ formatMoney(stats.totalAmount) }}
        </h5>
      </div>
    </div>
  </div>
</template>
