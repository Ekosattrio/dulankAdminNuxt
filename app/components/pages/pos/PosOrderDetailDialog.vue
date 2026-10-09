<script setup lang="ts">
import type { PosOrderRecord } from '~/composables/usePosOrders'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
import SalesStatusBadge from '~/components/sales/SalesStatusBadge.vue'

const props = defineProps<{
  open: boolean
  order: PosOrderRecord | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <SalesDialog
    :open="open"
    :title="`POS Order: ${order?.saleNo || ''}`"
    size="md"
    @close="emit('close')"
  >
    <div v-if="order" class="space-y-4 text-sm">
      <div class="rounded-lg border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <span class="block text-xs font-medium text-gray-500 dark:text-gray-400">Customer</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ order.customer }}</span>
          </div>
          <div>
            <span class="block text-xs font-medium text-gray-500 dark:text-gray-400">Order Date</span>
            <span class="font-medium text-gray-800 dark:text-gray-200">{{ order.date }}</span>
          </div>
          <div>
            <span class="block text-xs font-medium text-gray-500 dark:text-gray-400">Payment Method</span>
            <span class="font-medium text-gray-800 dark:text-gray-200">{{ order.method }}</span>
          </div>
          <div>
            <span class="block text-xs font-medium text-gray-500 dark:text-gray-400">Status</span>
            <div class="mt-0.5">
              <SalesStatusBadge :status="order.paymentStatus" />
            </div>
          </div>
        </div>
      </div>

      <!-- Financial Totals -->
      <div class="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white p-3 dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
        <div class="flex items-center justify-between py-2">
          <span class="text-gray-600 dark:text-gray-400">Grand Total</span>
          <CurrencyDisplay :value="order.grandTotal" class="font-bold text-gray-900 dark:text-white" />
        </div>
        <div class="flex items-center justify-between py-2">
          <span class="text-gray-600 dark:text-gray-400">Paid Amount</span>
          <CurrencyDisplay :value="order.paid" class="font-semibold text-emerald-600 dark:text-emerald-400" />
        </div>
        <div class="flex items-center justify-between py-2">
          <span class="text-gray-600 dark:text-gray-400">Balance Due</span>
          <CurrencyDisplay :value="order.due" class="font-bold text-rose-600 dark:text-rose-400" />
        </div>
      </div>

      <!-- Payments History List -->
      <div v-if="order.payments && order.payments.length > 0" class="space-y-2">
        <h5 class="text-xs font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300">Payment Records</h5>
        <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
          <table class="w-full text-xs">
            <thead class="bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              <tr>
                <th class="p-2 text-start">Date</th>
                <th class="p-2 text-start">Type</th>
                <th class="p-2 text-end">Amount</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="(p, i) in order.payments" :key="i">
                <td class="p-2">{{ p.paymentDate || order.date }}</td>
                <td class="p-2 font-medium">{{ p.paymentType || order.method }}</td>
                <td class="p-2 text-end font-semibold">
                  <CurrencyDisplay :value="p.amount" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <button
          type="button"
          class="inline-flex h-9 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          @click="emit('close')"
        >
          Close
        </button>
      </div>
    </template>
  </SalesDialog>
</template>

