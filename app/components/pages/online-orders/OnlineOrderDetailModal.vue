<script setup lang="ts">
import type { OnlineOrder } from '#server/types/online-order'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import SalesStatusBadge from '~/components/sales/SalesStatusBadge.vue'
import { formatNumber } from '~/composables/useFormatters'

defineProps<{
  open: boolean
  order: OnlineOrder | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <SalesDialog
    :open="open"
    :title="`Order Detail: ${order?.reference || ''}`"
    size="md"
    @close="emit('close')"
  >
    <div v-if="order" class="space-y-4">
      <div class="flex items-center gap-3 border-b border-gray-100 pb-4 dark:border-gray-800">
        <img
          :src="order.avatar || '/assets/img/customer/customer1.jpg'"
          alt="Customer"
          class="h-12 w-12 rounded-full object-cover border border-gray-200 dark:border-gray-700"
        />
        <div>
          <h4 class="text-base font-bold text-gray-900 dark:text-white">{{ order.customer }}</h4>
          <p class="text-xs text-gray-500 dark:text-gray-400">Order Channel: {{ order.channel || 'Online' }} ({{ order.biller }})</p>
        </div>
      </div>

      <div class="space-y-2 text-sm">
        <div class="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
          <span class="text-gray-500 dark:text-gray-400">Order Date</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ order.date }}</span>
        </div>
        <div class="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
          <span class="text-gray-500 dark:text-gray-400">Fulfillment Status</span>
          <SalesStatusBadge :status="order.status" />
        </div>
        <div class="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
          <span class="text-gray-500 dark:text-gray-400">Payment Status</span>
          <SalesStatusBadge :status="order.paymentStatus" />
        </div>
        <div class="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
          <span class="text-gray-500 dark:text-gray-400">Payment Method</span>
          <span class="font-medium text-gray-900 dark:text-white">{{ order.paymentMethod || 'Midtrans' }}</span>
        </div>
        <div class="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
          <span class="text-gray-500 dark:text-gray-400">Grand Total</span>
          <span class="font-bold tabular-nums text-gray-900 dark:text-white">Rp {{ formatNumber(order.grandTotal) }}</span>
        </div>
        <div class="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
          <span class="text-gray-500 dark:text-gray-400">Amount Paid</span>
          <span class="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">Rp {{ formatNumber(order.paid) }}</span>
        </div>
        <div class="flex justify-between py-1">
          <span class="text-gray-500 dark:text-gray-400">Balance Due</span>
          <span
            class="font-bold tabular-nums"
            :class="order.due > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'"
          >
            Rp {{ formatNumber(order.due) }}
          </span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <button
          type="button"
          class="h-9 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          @click="emit('close')"
        >
          Close
        </button>
      </div>
    </template>
  </SalesDialog>
</template>

