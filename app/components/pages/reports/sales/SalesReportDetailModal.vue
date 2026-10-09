<script setup lang="ts">
import SalesDialog from '~/components/sales/SalesDialog.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
import type { SalesReportItem } from '~~/server/types/reports-sales'

defineProps<{
  open: boolean
  item: SalesReportItem | null
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <SalesDialog
    :open="open"
    :title="item ? `Category Breakdown: ${item.category}` : 'Category Breakdown'"
    size="md"
    @close="emit('close')"
  >
    <div v-if="item" class="space-y-4">
      <div class="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-3 text-xs dark:bg-gray-800">
        <div>
          <span class="text-gray-500 dark:text-gray-400">Total Sales:</span>
          <span class="ms-2 font-bold text-gray-900 dark:text-white">
            <CurrencyDisplay :value="item.totalSales" align="left" />
          </span>
        </div>
        <div>
          <span class="text-gray-500 dark:text-gray-400">Total Due:</span>
          <span class="ms-2 font-bold text-amber-600 dark:text-amber-400">
            <CurrencyDisplay :value="item.totalDue" align="left" />
          </span>
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

      <div class="flex justify-end pt-2">
        <button
          type="button"
          class="inline-flex min-h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
          @click="emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </SalesDialog>
</template>

