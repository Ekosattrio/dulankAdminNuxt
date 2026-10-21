<script setup lang="ts">
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'
import type { SalesReportItem } from '~~/server/types/reports-sales'
import { dateRangeToDisplay, type DateRangeValue } from '~/composables/useDateRange'

const props = defineProps<{
  open: boolean
  item: SalesReportItem | null
  dateRange: DateRangeValue | null
}>()

const emit = defineEmits<{
  close: []
  print: []
  pdf: []
  submit: []
}>()
const period = computed(() => dateRangeToDisplay(props.dateRange, 'All Periods'))
</script>

<template>
  <SalesDialog
    :open="open"
    title="Detail Report Product"
    size="md"
    @close="emit('close')"
  >
    <div v-if="item" class="space-y-4">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <dl class="grid min-w-0 grid-cols-[8rem_1fr] gap-x-3 gap-y-2 text-sm">
          <dt>Product Category</dt><dd class="font-bold">: {{ item.category }}</dd>
          <dt>Periode</dt><dd class="font-bold">: {{ period }}</dd>
        </dl>
        <div class="flex items-center gap-2">
          <SalesActionButton action="pdf" label="PDF detail report" @click="emit('pdf')" />
          <SalesActionButton action="print" label="Print detail report" @click="emit('print')" />
        </div>
      </div>

      <div v-if="item.details && item.details.length > 0" class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead class="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-400">
            <tr>
              <th class="px-3 py-2 text-start">Product</th>
              <th class="px-3 py-2 text-center">Sold Qty</th>
              <th class="px-3 py-2 text-start">Unit</th>
              <th class="px-3 py-2 text-end">Total Revenue</th>
              <th class="px-3 py-2 text-end">Percentage</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="(detail, idx) in item.details" :key="idx" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
              <td class="px-3 py-2 font-medium text-gray-900 dark:text-white">{{ detail.product }}</td>
              <td class="px-3 py-2 text-center">{{ detail.soldQty.toLocaleString('id-ID') }}</td>
              <td class="px-3 py-2">{{ detail.unit }}</td>
              <td class="px-3 py-2 text-end">
                <CurrencyDisplay :value="detail.totalRevenue" />
              </td>
              <td class="px-3 py-2 text-end font-semibold">{{ Number(detail.percentage).toFixed(2) }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="text-center text-xs text-gray-500 dark:text-gray-400">
        No sub-product breakdown data for this category.
      </p>

      <div class="flex flex-wrap justify-end gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
        <button type="button" class="min-h-9 rounded-md bg-[#212b36] px-4 text-sm font-semibold text-white" @click="emit('close')">Cancel</button>
        <button type="button" class="min-h-9 rounded-md bg-[#ff9f43] px-4 text-sm font-semibold text-white" @click="emit('submit')">Submit</button>
      </div>
    </div>
  </SalesDialog>
</template>

