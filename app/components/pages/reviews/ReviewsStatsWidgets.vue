<script setup lang="ts">
import type { ReviewStats } from '#server/types/review'
import { formatMoney } from '~/utils/currency'

interface Props {
  stats: ReviewStats
}

defineProps<Props>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
    <div
      class="bg-white dark:bg-gray-800 rounded-md p-5 border border-gray-200 dark:border-gray-700 shadow-xs flex items-center"
    >
      <div
        class="w-12 h-12 rounded-full bg-[rgba(249,110,111,0.12)] flex items-center justify-center shrink-0"
      >
        <img
          src="/assets/img/icons/dash1.svg"
          alt="Total Review"
          class="w-6 h-6 object-contain"
        />
      </div>
      <div class="ms-5">
        <h6 class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-1">
          Total Review
        </h6>
        <h5 class="text-lg font-bold text-gray-900 dark:text-white">
          {{ formatMoney(stats.totalReview) }}
        </h5>
      </div>
    </div>

    <div
      class="bg-white dark:bg-gray-800 rounded-md p-5 border border-gray-200 dark:border-gray-700 shadow-xs flex items-center"
    >
      <div
        class="w-12 h-12 rounded-full bg-[rgba(40,199,111,0.12)] flex items-center justify-center shrink-0"
      >
        <img
          src="/assets/img/icons/dash2.svg"
          alt="Total Product"
          class="w-6 h-6 object-contain"
        />
      </div>
      <div class="ms-5">
        <h6 class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-1">
          Total Product
        </h6>
        <h5 class="text-lg font-bold text-gray-900 dark:text-white">
          {{ formatMoney(stats.totalProduct) }}
        </h5>
      </div>
    </div>

    <div
      class="bg-white dark:bg-gray-800 rounded-md p-5 border border-gray-200 dark:border-gray-700 shadow-xs flex items-center"
    >
      <div
        class="w-12 h-12 rounded-full bg-[rgba(0,207,232,0.12)] flex items-center justify-center shrink-0"
      >
        <img
          src="/assets/img/icons/dash3.svg"
          alt="Total Publish"
          class="w-6 h-6 object-contain"
        />
      </div>
      <div class="ms-5">
        <h6 class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-1">
          Total Publish
        </h6>
        <h5 class="text-lg font-bold text-gray-900 dark:text-white">
          {{ formatMoney(stats.totalPublish) }}
        </h5>
      </div>
    </div>
  </div>
</template>
