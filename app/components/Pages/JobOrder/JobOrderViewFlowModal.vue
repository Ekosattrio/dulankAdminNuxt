<script setup lang="ts">
import type { JobOrder } from '#server/types/job-order'
import SalesDialog from '~/components/Sales/SalesDialog.vue'

defineProps<{
  open: boolean
  order: JobOrder | null
}>()

defineEmits<{
  close: []
}>()

function getStepBadgeClass(status: string) {
  switch (status) {
    case 'done':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400'
    case 'active':
      return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400'
    case 'pending':
    default:
      return 'bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400'
  }
}
</script>

<template>
  <SalesDialog
    :open="open"
    title="View Flow"
    medium
    @close="$emit('close')"
  >
    <div v-if="order" class="space-y-5 text-xs">
      <!-- Sales Information Section -->
      <div class="rounded-lg border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
        <h6 class="mb-3 text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
          Sales Information
        </h6>
        <div class="grid grid-cols-12 gap-y-2">
          <div class="col-span-5 font-medium text-gray-500 dark:text-gray-400">Sales Date</div>
          <div class="col-span-7 font-semibold text-gray-800 dark:text-gray-200">{{ order.salesDate || '-' }}</div>

          <div class="col-span-5 font-medium text-gray-500 dark:text-gray-400">No Sales</div>
          <div class="col-span-7 font-semibold text-gray-800 dark:text-gray-200">{{ order.salesNo || '-' }}</div>

          <div class="col-span-5 font-medium text-gray-500 dark:text-gray-400">Customer</div>
          <div class="col-span-7 font-semibold text-gray-800 dark:text-gray-200">{{ order.customer }}</div>

          <div class="col-span-5 font-medium text-gray-500 dark:text-gray-400">Shipping</div>
          <div class="col-span-7 font-semibold text-gray-800 dark:text-gray-200">{{ order.shipping || '-' }}</div>

          <div class="col-span-5 font-medium text-gray-500 dark:text-gray-400">Order Summary</div>
          <div class="col-span-7 font-semibold text-gray-800 dark:text-gray-200">{{ order.orderSummary || '-' }}</div>
        </div>
      </div>

      <!-- Work Flow Section -->
      <div class="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h6 class="mb-3 text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
          Work Flow
        </h6>
        <div class="grid grid-cols-12 gap-y-2 mb-4">
          <div class="col-span-5 font-medium text-gray-500 dark:text-gray-400">Product</div>
          <div class="col-span-7 font-semibold text-gray-800 dark:text-gray-200">{{ order.product }}</div>

          <div class="col-span-5 font-medium text-gray-500 dark:text-gray-400">Job Title</div>
          <div class="col-span-7 font-semibold text-gray-800 dark:text-gray-200">{{ order.jobTitle }}</div>
        </div>

        <div v-if="order.steps && order.steps.length > 0" class="border-t border-gray-100 pt-3 dark:border-gray-800">
          <p class="mb-2 font-semibold text-gray-700 dark:text-gray-300">Workflow Steps Progress:</p>
          <div class="space-y-2">
            <div
              v-for="(st, idx) in order.steps"
              :key="idx"
              class="flex items-center justify-between rounded border border-gray-100 p-2 dark:border-gray-800"
            >
              <div class="flex items-center gap-2">
                <span class="flex size-5 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {{ idx + 1 }}
                </span>
                <span class="font-medium text-gray-800 dark:text-gray-200">{{ st.name }}</span>
              </div>
              <span
                class="rounded border px-2 py-0.5 text-[10px] font-semibold capitalize"
                :class="getStepBadgeClass(st.status)"
              >
                {{ st.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="flex justify-end border-t border-gray-200 pt-4 dark:border-gray-700">
        <button
          type="button"
          class="rounded-md bg-[#212b36] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#092c4c] focus:outline-none"
          @click="$emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </SalesDialog>
</template>
