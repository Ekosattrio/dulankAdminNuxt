<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
</script>

<template>
  <div class="grid grid-cols-1 gap-5 lg:grid-cols-12">
    <!-- Sales & Purchase Chart Summary Card (8 Cols) -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-8 dark:border-gray-800 dark:bg-gray-900">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
        <h5 class="text-sm font-bold text-gray-900 dark:text-white">Sales & Purchase Overview</h5>
        <div class="flex gap-1">
          <button type="button" class="rounded px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400">
            1D
          </button>
          <button type="button" class="rounded px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400">
            1W
          </button>
          <button type="button" class="rounded px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400">
            1M
          </button>
          <button type="button" class="rounded bg-primary-100 px-2.5 py-1 text-xs font-bold text-primary dark:bg-primary/20">
            1Y
          </button>
        </div>
      </div>

      <!-- Simulated Visual Bar Graphic -->
      <div class="mt-6 flex h-48 items-end justify-between gap-2 px-2">
        <div
          v-for="(m, i) in months"
          :key="i"
          class="flex flex-1 flex-col items-center gap-1.5"
        >
          <div class="flex items-end gap-1 w-full justify-center">
            <div
              class="w-2.5 rounded-t bg-primary transition-all duration-500 hover:opacity-80"
              :style="{ height: `${Math.floor(40 + Math.sin(i + 1) * 35 + i * 5)}px` }"
              title="Sales"
            />
            <div
              class="w-2.5 rounded-t bg-gray-400 transition-all duration-500 hover:opacity-80 dark:bg-gray-600"
              :style="{ height: `${Math.floor(30 + Math.cos(i + 1) * 25 + i * 4)}px` }"
              title="Purchase"
            />
          </div>
          <span class="text-xs text-gray-400">{{ m }}</span>
        </div>
      </div>
    </div>

    <!-- Overall Information Card (4 Cols) -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-4 dark:border-gray-800 dark:bg-gray-900">
      <h5 class="border-b border-gray-100 pb-3 text-sm font-bold text-gray-900 dark:border-gray-800 dark:text-white">
        Overall Information
      </h5>

      <!-- 3 Quick Stats -->
      <div class="grid grid-cols-3 gap-2 py-4 text-center border-b border-gray-100 dark:border-gray-800">
        <div>
          <div class="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary dark:bg-primary/20">
            <FeatherIcon name="users" size="14" />
          </div>
          <span class="text-xs text-gray-400">Suppliers</span>
          <p class="text-sm font-bold text-gray-800 dark:text-white">6.987</p>
        </div>
        <div>
          <div class="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-950">
            <FeatherIcon name="user" size="14" />
          </div>
          <span class="text-xs text-gray-400">Customers</span>
          <p class="text-sm font-bold text-gray-800 dark:text-white">4.896</p>
        </div>
        <div>
          <div class="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950">
            <FeatherIcon name="shopping-cart" size="14" />
          </div>
          <span class="text-xs text-gray-400">Orders</span>
          <p class="text-sm font-bold text-gray-800 dark:text-white">487</p>
        </div>
      </div>

      <div class="pt-4">
        <div class="flex items-center justify-between text-xs mb-2">
          <span class="font-bold text-gray-800 dark:text-white">Customers Overview</span>
          <span class="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            Today
          </span>
        </div>
        <div class="grid grid-cols-2 gap-3 pt-2 text-center">
          <div class="rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800/50">
            <span class="text-base font-bold text-rose-600">5.5K</span>
            <p class="text-xs text-gray-500">First Time (↑ 25%)</p>
          </div>
          <div class="rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800/50">
            <span class="text-base font-bold text-emerald-600">3.5K</span>
            <p class="text-xs text-gray-500">Returning (↑ 21%)</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

