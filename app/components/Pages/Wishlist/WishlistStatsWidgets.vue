<script setup lang="ts">
import type { WishlistStats } from '#server/types/wishlist'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'
import { formatMoney } from '~/utils/currency'

interface Props {
  stats: WishlistStats
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
          alt="Total Wishlist Amount"
          class="w-6 h-6 object-contain"
        />
      </div>
      <div class="ms-5">
        <h6 class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-1">
          Total Wishlist Amount
        </h6>
        <h5 class="text-lg font-bold text-gray-900 dark:text-white">
          <CurrencyDisplay :amount="stats.totalWishlistAmount" />
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
          alt="Total Wishlist Active"
          class="w-6 h-6 object-contain"
        />
      </div>
      <div class="ms-5">
        <h6 class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-1">
          Total Wishlist Active
        </h6>
        <h5 class="text-lg font-bold text-gray-900 dark:text-white">
          {{ formatMoney(stats.totalWishlistActive) }}
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
          alt="Total Wishlist Checkout"
          class="w-6 h-6 object-contain"
        />
      </div>
      <div class="ms-5">
        <h6 class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-1">
          Total Wishlist Checkout
        </h6>
        <h5 class="text-lg font-bold text-gray-900 dark:text-white">
          {{ formatMoney(stats.totalWishlistCheckout) }}
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
          alt="Total Wishlist Delete"
          class="w-6 h-6 object-contain"
        />
      </div>
      <div class="ms-5">
        <h6 class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-1">
          Total Wishlist Delete
        </h6>
        <h5 class="text-lg font-bold text-gray-900 dark:text-white">
          {{ formatMoney(stats.totalWishlistDelete) }}
        </h5>
      </div>
    </div>
  </div>
</template>
