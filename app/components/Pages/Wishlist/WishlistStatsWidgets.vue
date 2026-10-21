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
  <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <div
      class="app-stat-card"
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
      <div class="min-w-0 flex-1">
        <h6 class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-1">
          Total Wishlist Amount
        </h6>
        <h5 class="text-2xl font-bold break-words text-gray-900 dark:text-white">
          <CurrencyDisplay :amount="stats.totalWishlistAmount" />
        </h5>
      </div>
    </div>

    <div
      class="app-stat-card"
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
      <div class="min-w-0 flex-1">
        <h6 class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-1">
          Total Wishlist Active
        </h6>
        <h5 class="text-2xl font-bold break-words text-gray-900 dark:text-white">
          {{ formatMoney(stats.totalWishlistActive) }}
        </h5>
      </div>
    </div>

    <div
      class="app-stat-card"
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
      <div class="min-w-0 flex-1">
        <h6 class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-1">
          Total Wishlist Checkout
        </h6>
        <h5 class="text-2xl font-bold break-words text-gray-900 dark:text-white">
          {{ formatMoney(stats.totalWishlistCheckout) }}
        </h5>
      </div>
    </div>

    <div
      class="app-stat-card"
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
      <div class="min-w-0 flex-1">
        <h6 class="text-sm font-normal text-gray-500 dark:text-gray-400 mb-1">
          Total Wishlist Delete
        </h6>
        <h5 class="text-2xl font-bold break-words text-gray-900 dark:text-white">
          {{ formatMoney(stats.totalWishlistDelete) }}
        </h5>
      </div>
    </div>
  </div>
</template>
