<script setup lang="ts">
import type { OnlineOrderItem } from '#server/types/online-order'
import { formatNumber } from '~/composables/useFormatters'

const props = defineProps<{
  open: boolean
  order: OnlineOrderItem | null
}>()

const emit = defineEmits<{
  close: []
}>()
</script>

<template>
  <SalesDialog
    :open="open"
    :title="`Order Details: ${order?.reference || ''}`"
    wide
    @close="emit('close')"
  >
    <div v-if="order" class="space-y-6 text-xs">
      <!-- Order Info Header -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
        <div>
          <span class="text-gray-500 dark:text-gray-400 block mb-1">Customer</span>
          <div class="flex items-center gap-2">
            <img :src="order.avatar" :alt="order.customer" class="size-7 rounded-full object-cover" />
            <span class="font-bold text-gray-900 dark:text-white text-sm">{{ order.customer }}</span>
          </div>
        </div>

        <div>
          <span class="text-gray-500 dark:text-gray-400 block mb-1">Order Status</span>
          <div class="flex items-center gap-2">
            <SalesStatusBadge :status="order.status" />
            <SalesStatusBadge :status="order.paymentStatus" />
          </div>
        </div>

        <div>
          <span class="text-gray-500 dark:text-gray-400 block mb-1">Date & Biller</span>
          <span class="font-medium text-gray-800 dark:text-gray-200">{{ order.date }}</span>
          <span class="text-gray-500 block">via {{ order.biller }}</span>
        </div>
      </div>

      <!-- Products Table -->
      <div>
        <h5 class="font-bold text-sm text-gray-900 dark:text-white mb-2">Order Items</h5>
        <div class="overflow-x-auto rounded border border-gray-200 dark:border-gray-700">
          <table class="w-full text-left text-xs">
            <thead class="bg-gray-50 font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <tr>
                <th class="px-3 py-2">Product</th>
                <th class="px-3 py-2 text-center w-16">Qty</th>
                <th class="px-3 py-2 text-right w-28">Price</th>
                <th class="px-3 py-2 text-right w-24">Discount</th>
                <th class="px-3 py-2 text-right w-32">Total Cost</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
              <tr v-for="(item, idx) in order.items || []" :key="idx">
                <td class="p-2.5 font-medium text-gray-900 dark:text-white">{{ item.product }}</td>
                <td class="p-2.5 text-center text-gray-700 dark:text-gray-300">{{ item.qty }}</td>
                <td class="p-2.5 text-right tabular-nums">Rp {{ formatNumber(item.price) }}</td>
                <td class="p-2.5 text-right tabular-nums text-rose-500">Rp {{ formatNumber(item.discount) }}</td>
                <td class="p-2.5 text-right tabular-nums font-bold text-gray-900 dark:text-white">Rp {{ formatNumber(item.totalCost) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Payment History Table -->
      <div v-if="order.payments && order.payments.length > 0">
        <h5 class="font-bold text-sm text-gray-900 dark:text-white mb-2">Payment History</h5>
        <div class="overflow-x-auto rounded border border-gray-200 dark:border-gray-700">
          <table class="w-full text-left text-xs">
            <thead class="bg-gray-50 font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <tr>
                <th class="px-3 py-2">Date</th>
                <th class="px-3 py-2">Reference</th>
                <th class="px-3 py-2 text-right">Amount</th>
                <th class="px-3 py-2">Paid By</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
              <tr v-for="(pay, pidx) in order.payments" :key="pidx">
                <td class="p-2.5 text-gray-600 dark:text-gray-300">{{ pay.date }}</td>
                <td class="p-2.5 font-semibold text-primary">{{ pay.reference }}</td>
                <td class="p-2.5 text-right tabular-nums font-bold text-emerald-600">Rp {{ formatNumber(pay.amount) }}</td>
                <td class="p-2.5 text-gray-700 dark:text-gray-300">{{ pay.paidBy }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Financial Totals -->
      <div class="flex justify-end pt-2">
        <div class="w-full max-w-xs space-y-2 rounded bg-gray-50 p-4 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
          <div class="flex justify-between text-gray-700 dark:text-gray-300">
            <span>Grand Total:</span>
            <span class="font-bold tabular-nums">Rp {{ formatNumber(order.grandTotal) }}</span>
          </div>
          <div class="flex justify-between text-emerald-600 font-semibold">
            <span>Paid:</span>
            <span class="tabular-nums">Rp {{ formatNumber(order.paid) }}</span>
          </div>
          <div class="flex justify-between border-t border-gray-200 pt-2 font-bold dark:border-gray-700" :class="order.due > 0 ? 'text-rose-600' : 'text-gray-500'">
            <span>Due:</span>
            <span class="tabular-nums">Rp {{ formatNumber(order.due) }}</span>
          </div>
        </div>
      </div>
    </div>
  </SalesDialog>
</template>

