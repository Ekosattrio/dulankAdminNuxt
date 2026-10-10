<script setup lang="ts">
import type { JobListItem } from '#server/types/job-list'
import SalesDialog from '~/components/Sales/SalesDialog.vue'

defineProps<{
  open: boolean
  item: JobListItem | null
}>()

defineEmits<{
  close: []
}>()
</script>

<template>
  <SalesDialog
    :open="open"
    title="Detail Job List"
    medium
    @close="$emit('close')"
  >
    <div v-if="item" class="space-y-5 text-xs">
      <!-- Order Information -->
      <div class="rounded-lg border border-gray-100 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
        <h6 class="mb-3 text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
          Order Information
        </h6>
        <div class="grid grid-cols-12 gap-y-2">
          <div class="col-span-4 font-medium text-gray-500 dark:text-gray-400">No. Job Order</div>
          <div class="col-span-8 font-semibold text-gray-800 dark:text-gray-200">{{ item.no }}</div>

          <div class="col-span-4 font-medium text-gray-500 dark:text-gray-400">Sales Date</div>
          <div class="col-span-8 font-semibold text-gray-800 dark:text-gray-200">{{ item.salesDate }}</div>

          <div class="col-span-4 font-medium text-gray-500 dark:text-gray-400">Customer</div>
          <div class="col-span-8 font-semibold text-gray-800 dark:text-gray-200">{{ item.customer }}</div>

          <div class="col-span-4 font-medium text-gray-500 dark:text-gray-400">Order Summary</div>
          <div class="col-span-8 font-semibold text-gray-800 dark:text-gray-200">{{ item.orderSummary || '-' }}</div>

          <div class="col-span-4 font-medium text-gray-500 dark:text-gray-400">Product</div>
          <div class="col-span-8 font-semibold text-gray-800 dark:text-gray-200">{{ item.product }}</div>

          <div class="col-span-4 font-medium text-gray-500 dark:text-gray-400">Job Title</div>
          <div class="col-span-8 font-semibold text-gray-800 dark:text-gray-200">{{ item.jobTitle || '-' }}</div>

          <div class="col-span-4 font-medium text-gray-500 dark:text-gray-400">Description</div>
          <div class="col-span-8 leading-relaxed text-gray-700 dark:text-gray-300">{{ item.description || '-' }}</div>
        </div>
      </div>

      <!-- Job Completed Information -->
      <div class="rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h6 class="mb-3 text-xs font-bold uppercase tracking-wider text-gray-800 dark:text-gray-200">
          Job Completed Information
        </h6>
        <div class="overflow-x-auto rounded border border-gray-100 dark:border-gray-800">
          <table class="w-full text-left">
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr>
                <td class="w-1/3 bg-gray-50/70 p-2.5 font-medium text-gray-600 dark:bg-gray-800/60 dark:text-gray-400">
                  Flow Detail
                </td>
                <td class="p-2.5 font-bold text-gray-900 dark:text-gray-100">
                  {{ item.flow }}
                </td>
              </tr>
              <tr>
                <td class="bg-gray-50/70 p-2.5 font-medium text-gray-600 dark:bg-gray-800/60 dark:text-gray-400">
                  Assignee
                </td>
                <td class="p-2.5 font-medium text-gray-800 dark:text-gray-200">
                  {{ item.assignee }}
                </td>
              </tr>
              <tr>
                <td class="bg-gray-50/70 p-2.5 font-medium text-gray-600 dark:bg-gray-800/60 dark:text-gray-400">
                  Date Complete
                </td>
                <td class="p-2.5 font-medium text-gray-800 dark:text-gray-200">
                  {{ item.dateComplete }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end border-t border-gray-200 pt-4 dark:border-gray-700">
        <button
          type="button"
          class="min-w-24 rounded-md bg-[#212b36] px-5 py-2 text-xs font-semibold text-white transition hover:bg-[#092c4c] focus:outline-none"
          @click="$emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </SalesDialog>
</template>
