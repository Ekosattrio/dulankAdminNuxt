<script setup lang="ts">
import type { Purchase } from '#server/types/purchase'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import { formatNumber } from '~/composables/useFormatters'

const props = defineProps<{
  open: boolean
  purchase: Purchase | null
}>()

const emit = defineEmits<{
  close: []
  edit: [purchase: Purchase]
}>()

const items = computed(() => {
  if (props.purchase?.items && props.purchase.items.length > 0) {
    return props.purchase.items
  }
  // Fallback for single item
  return [
    {
      name: props.purchase?.product || 'Material Cetak',
      qty: 1,
      unit: 'Pcs',
      price: props.purchase?.amount || 0,
    }
  ]
})

const subTotal = computed(() => {
  return items.value.reduce((sum, item) => sum + (Number(item.qty || 0) * Number(item.price || 0)), 0)
})

const taxAmount = computed(() => {
  return props.purchase?.tax ?? Math.round(subTotal.value * 0.11)
})

const shippingAmount = computed(() => {
  return Number(props.purchase?.shippingCost || 0)
})

const grandTotal = computed(() => {
  return props.purchase?.amount ?? (subTotal.value + taxAmount.value + shippingAmount.value)
})

function handlePrint() {
  window.print()
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="`Purchase Detail: ${purchase?.noPurchase || ''}`"
    wide
    @close="emit('close')"
  >
    <div v-if="purchase" class="space-y-6">
      <!-- Top Actions Bar -->
      <div class="flex items-center justify-between border-b pb-4 dark:border-gray-800">
        <div class="flex items-center gap-2">
          <span
            class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
            :class="purchase.status === 'Received' || purchase.status === 'Complete' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400'"
          >
            {{ purchase.status }}
          </span>
          <span
            class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
            :class="purchase.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400' : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400'"
          >
            Payment: {{ purchase.paymentStatus }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            @click="emit('edit', purchase)"
          >
            <FeatherIcon name="edit-2" size="14" />
            Edit Purchase
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            @click="handlePrint"
          >
            <FeatherIcon name="printer" size="14" />
            Print
          </button>
        </div>
      </div>

      <!-- Supplier & Purchase Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-800/40 p-4 rounded-xl border border-gray-200/70 dark:border-gray-800">
        <div>
          <h4 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Supplier Info
          </h4>
          <p class="text-base font-bold text-gray-900 dark:text-white">
            {{ purchase.supplier }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Supplier resmi bahan percetakan & supply rantai pasok.
          </p>
        </div>

        <div class="space-y-1.5 text-xs md:border-l md:pl-6 dark:border-gray-700">
          <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">No. Purchase:</span>
            <span class="font-mono font-bold text-gray-900 dark:text-white">{{ purchase.noPurchase }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">Tanggal Faktur:</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ purchase.date }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">Created by:</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ purchase.created || 'Staff' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-500 dark:text-gray-400">Payment Status:</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ purchase.paymentStatus }}</span>
          </div>
        </div>
      </div>

      <!-- Order Items Table -->
      <div>
        <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Order Summary
        </h4>
        <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table class="min-w-full divide-y divide-gray-200 text-xs dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-4 py-2.5 text-left font-semibold text-gray-600 dark:text-gray-300">Product Name</th>
                <th class="px-4 py-2.5 text-center font-semibold text-gray-600 dark:text-gray-300">Qty</th>
                <th class="px-4 py-2.5 text-center font-semibold text-gray-600 dark:text-gray-300">Unit</th>
                <th class="px-4 py-2.5 text-right font-semibold text-gray-600 dark:text-gray-300">Price (IDR)</th>
                <th class="px-4 py-2.5 text-right font-semibold text-gray-600 dark:text-gray-300">Amount (IDR)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
              <tr v-for="(item, idx) in items" :key="idx">
                <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">{{ item.name }}</td>
                <td class="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{{ item.qty }}</td>
                <td class="px-4 py-3 text-center text-gray-500 dark:text-gray-400">{{ item.unit }}</td>
                <td class="px-4 py-3 text-right text-gray-700 dark:text-gray-300">Rp {{ formatNumber(item.price) }}</td>
                <td class="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">Rp {{ formatNumber(item.qty * item.price) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Financial Calculation & Notes -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div class="rounded-lg border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
          <h5 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Catatan / Notes:
          </h5>
          <p class="text-xs text-gray-700 dark:text-gray-300">
            {{ purchase.notes || 'Tidak ada catatan khusus.' }}
          </p>
        </div>

        <div class="space-y-2 text-xs">
          <div class="flex justify-between py-1 border-b dark:border-gray-800 text-gray-600 dark:text-gray-400">
            <span>Sub Total:</span>
            <span>Rp {{ formatNumber(subTotal) }}</span>
          </div>
          <div class="flex justify-between py-1 border-b dark:border-gray-800 text-gray-600 dark:text-gray-400">
            <span>Tax (PPN 11%):</span>
            <span>Rp {{ formatNumber(taxAmount) }}</span>
          </div>
          <div class="flex justify-between py-1 border-b dark:border-gray-800 text-gray-600 dark:text-gray-400">
            <span>Shipping / Biaya Kirim:</span>
            <span>Rp {{ formatNumber(shippingAmount) }}</span>
          </div>
          <div class="flex justify-between py-1.5 text-sm font-bold text-gray-900 dark:text-white">
            <span>Total Tagihan:</span>
            <span>Rp {{ formatNumber(grandTotal) }}</span>
          </div>
          <div class="flex justify-between py-1 text-emerald-600 font-medium">
            <span>Sudah Dibayar (Paid):</span>
            <span>Rp {{ formatNumber(purchase.paid) }}</span>
          </div>
          <div class="flex justify-between py-1 font-bold" :class="purchase.due > 0 ? 'text-rose-600' : 'text-gray-500'">
            <span>Sisa Hutang (Due):</span>
            <span>Rp {{ formatNumber(purchase.due) }}</span>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end gap-3 pt-4 border-t dark:border-gray-800">
        <button
          type="button"
          class="rounded-lg bg-gray-200 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300"
          @click="emit('close')"
        >
          Close
        </button>
      </div>
    </div>
  </SalesDialog>
</template>
