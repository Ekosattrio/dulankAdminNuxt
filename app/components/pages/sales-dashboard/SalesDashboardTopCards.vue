<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const emit = defineEmits<{
  (e: 'refreshCard', type: string): void
}>()
</script>

<template>
  <div class="sales-cards mb-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-12">
    <!-- Card 1: Weekly Earning (6 Cols) -->
    <div class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:col-span-2 xl:col-span-6">
      <div>
        <h6 class="mb-2 text-sm font-semibold text-primary sm:text-base">Weekly Earning</h6>
        <h3 class="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">$95,000.45</h3>
        <p class="sales-range flex items-center text-xs text-gray-500 sm:text-sm dark:text-gray-400">
          <span class="inline-flex items-center font-semibold text-emerald-600">
            <FeatherIcon name="chevron-up" size="16" class="me-0.5" />
            48%&nbsp;
          </span>
          increase compare to last week
        </p>
      </div>
      <img
        src="/assets/img/icons/weekly-earning.svg"
        alt="weekly earning"
        class="ms-4 h-auto w-16 flex-shrink-0 object-contain sm:w-20 md:w-24"
      />
    </div>

    <!-- Card 2: No of Total Sales - Primary (3 Cols) -->
    <div class="relative flex flex-col justify-between overflow-hidden rounded-xl bg-primary p-6 text-white shadow-sm transition-transform hover:-translate-y-0.5 xl:col-span-3">
      <div class="mb-4 flex items-start justify-between">
        <img src="/assets/img/icons/total-sales.svg" alt="total sales" class="h-10 w-10 brightness-0 invert" />
        <button
          type="button"
          class="text-white/80 transition duration-300 hover:rotate-180 hover:text-white"
          title="Refresh"
          @click="emit('refreshCard', 'total sales')"
        >
          <FeatherIcon name="rotate-ccw" size="16" />
        </button>
      </div>
      <div>
        <h3 class="mb-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">10,000+</h3>
        <p class="text-xs font-medium text-white/90 sm:text-sm">No of Total Sales</p>
      </div>
    </div>

    <!-- Card 3: No of Total Sales - Secondary (3 Cols) -->
    <div class="relative flex flex-col justify-between overflow-hidden rounded-xl bg-gray-900 p-6 text-white shadow-sm transition-transform hover:-translate-y-0.5 xl:col-span-3">
      <div class="mb-4 flex items-start justify-between">
        <img src="/assets/img/icons/purchased-earnings.svg" alt="purchased earnings" class="h-10 w-10 brightness-0 invert" />
        <button
          type="button"
          class="text-white/80 transition duration-300 hover:rotate-180 hover:text-white"
          title="Refresh"
          @click="emit('refreshCard', 'purchased earnings')"
        >
          <FeatherIcon name="rotate-ccw" size="16" />
        </button>
      </div>
      <div>
        <h3 class="mb-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">800+</h3>
        <p class="text-xs font-medium text-white/90 sm:text-sm">No of Total Sales</p>
      </div>
    </div>
  </div>
</template>

