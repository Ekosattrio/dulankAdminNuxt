<script setup lang="ts">
const emit = defineEmits<{
  (e: 'viewDetail', title: string, desc: string): void
}>()
</script>

<template>
  <div class="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-3">
    <div>
      <h6 class="mb-4 text-sm font-bold text-gray-900 dark:text-white">Conversions</h6>

      <!-- Donut Chart -->
      <div class="relative my-4 flex items-center justify-center">
        <svg width="130" height="130" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="48" fill="none" stroke="#E5E7EB" stroke-width="12" class="dark:stroke-gray-800" />
          <circle
            cx="60"
            cy="60"
            r="48"
            fill="none"
            stroke="#22C55E"
            stroke-width="12"
            stroke-dasharray="196.6 301.6"
            stroke-dashoffset="75.4"
            stroke-linecap="round"
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div class="pointer-events-none absolute text-center">
          <span class="text-xl font-bold text-gray-900 dark:text-white">65.2%</span>
          <div class="text-[10px] font-medium leading-tight text-gray-400">Returning Customer</div>
        </div>
      </div>

      <!-- This Week vs Last Week -->
      <div class="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs dark:border-gray-800">
        <div>
          <div class="font-bold text-gray-800 dark:text-gray-200">This Week</div>
          <div class="font-semibold text-emerald-600">23.5k</div>
        </div>
        <div class="text-end">
          <div class="font-bold text-gray-800 dark:text-gray-200">Last Week</div>
          <div class="font-semibold text-gray-500 dark:text-gray-400">41.05k</div>
        </div>
      </div>
    </div>

    <button
      type="button"
      class="mt-4 w-full rounded-lg border border-primary bg-white py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white dark:bg-gray-800"
      @click="emit('viewDetail', 'Conversions Breakdown', 'Customer retention rate is currently 65.2% with 23,500 returning conversions this week versus 41,050 last week.')"
    >
      View Details
    </button>
  </div>
</template>

