<script setup lang="ts">
import type { CartStats } from '#server/types/cart'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
import { formatMoney } from '~/utils/currency'

interface Props {
  stats: CartStats
}

defineProps<Props>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
    <div
      class="bg-white dark:bg-gray-800 rounded-md p-5 border border-gray-200 dark:border-gray-700 shadow-xs flex items-center"
    >
      <div
        class="w-12 h-12 rounded-full bg-[rgba(249,110,111,0.12)] flex items-center justify-center shrink-0"
      >
        <img
          src="/assets/img/icons/dash1.svg"
          alt="Total Cart Amount"
          class="w-6 h-6 object-contain"
        />
      </div>
      <div class="ms-5">
        <h6 class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-1">
          Total Cart Amount
        </h6>
        <h5 class="text-lg font-bold text-gray-900 dark:text-white">
          <CurrencyDisplay :amount="stats.totalCartAmount" />
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
          alt="Total Cart Active"
          class="w-6 h-6 object-contain"
        />
      </div>
      <div class="ms-5">
        <h6 class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-1">
          Total Cart Active
        </h6>
        <h5 class="text-lg font-bold text-gray-900 dark:text-white">
          {{ formatMoney(stats.totalCartActive) }}
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
          alt="Total Cart Checkout"
          class="w-6 h-6 object-contain"
        />
      </div>
      <div class="ms-5">
        <h6 class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-1">
          Total Cart Checkout
        </h6>
        <h5 class="text-lg font-bold text-gray-900 dark:text-white">
          {{ formatMoney(stats.totalCartCheckout) }}
        </h5>
      </div>
    </div>

    <div
      class="bg-white dark:bg-gray-800 rounded-md p-5 border border-gray-200 dark:border-gray-700 shadow-xs flex items-center"
    >
      <div
        class="w-12 h-12 rounded-full bg-[rgba(115,103,240,0.12)] flex items-center justify-center shrink-0"
      >
        <img
          src="/assets/img/icons/dash4.svg"
          alt="Total Cart Delete"
          class="w-6 h-6 object-contain"
        />
      </div>
      <div class="ms-5">
        <h6 class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-1">
          Total Cart Delete
        </h6>
        <h5 class="text-lg font-bold text-gray-900 dark:text-white">
          {{ formatMoney(stats.totalCartDelete) }}
        </h5>
      </div>
    </div>
  </div>
</template>
