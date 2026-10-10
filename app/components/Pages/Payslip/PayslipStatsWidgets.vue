<script setup lang="ts">
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'

defineProps<{
  stats: {
    totalSlips: number
    paidCount: number
    unpaidCount: number
    totalDisbursed: number
  }
}>()
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
    <!-- Total Slips -->
    <div class="relative overflow-hidden rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Total Payslips
          </p>
          <h3 class="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {{ stats.totalSlips }}
          </h3>
        </div>
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-400">
          <FeatherIcon name="file-text" size="22" />
        </div>
      </div>
    </div>

    <!-- Paid Slips -->
    <div class="relative overflow-hidden rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Paid Slips
          </p>
          <h3 class="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {{ stats.paidCount }}
          </h3>
        </div>
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
          <FeatherIcon name="check-circle" size="22" />
        </div>
      </div>
    </div>

    <!-- Unpaid Slips -->
    <div class="relative overflow-hidden rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Unpaid Slips
          </p>
          <h3 class="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {{ stats.unpaidCount }}
          </h3>
        </div>
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
          <FeatherIcon name="clock" size="22" />
        </div>
      </div>
    </div>

    <!-- Total Disbursed (IDR) -->
    <div class="relative overflow-hidden rounded-xl border border-gray-200/80 bg-white p-5 shadow-xs transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Total Disbursed
          </p>
          <h3 class="mt-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            <CurrencyDisplay :value="stats.totalDisbursed" />
          </h3>
        </div>
        <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
          <FeatherIcon name="dollar-sign" size="22" />
        </div>
      </div>
    </div>
  </div>
</template>
