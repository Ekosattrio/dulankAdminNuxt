<script setup lang="ts">
import { computed } from 'vue'
import { formatNumber } from '~/composables/useFormatters'

export interface PODetailData {
  noPO: string
  date: string
  vendorReff?: string
  noPR?: string
  deliveryDate?: string
  paymentTerm?: string
  deliveryAddress?: string
  vendor: {
    name: string
    address: string
    email: string
    phone: string
  }
  items: Array<{
    name: string
    qty: number
    unit: string
    price: number
  }>
}

const props = defineProps<{
  poData: PODetailData
}>()

const subTotal = computed(() => {
  return props.poData.items.reduce((acc, item) => acc + item.qty * item.price, 0)
})

const taxAmount = computed(() => Math.round(subTotal.value * 0.11))
const totalAmount = computed(() => subTotal.value + taxAmount.value)

function printPO() {
  window.print()
}

defineExpose({ printPO })
</script>

<template>
  <div class="mb-4 rounded-xl border border-gray-200/80 bg-white shadow-xs dark:border-gray-800 dark:bg-gray-900">
    <div class="action-button flex justify-end p-4">
      <ul class="flex items-center gap-3">
        <li>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            title="Download PDF"
            @click="printPO"
          >
            <img src="/assets/img/icons/pdf.svg" alt="PDF" class="h-4 w-4" />
          </button>
        </li>
        <li>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            title="Print"
            @click="printPO"
          >
            <i class="feather-printer h-4 w-4"></i>
          </button>
        </li>
      </ul>
    </div>

    <div class="p-6 md:p-8" id="detail">
      <!-- Company Header -->
      <div class="mb-6 flex flex-col gap-6 md:flex-row md:items-start">
        <div class="flex h-24 w-48 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
          <img src="/assets/img/kacetak.jpeg" alt="Logo" class="max-h-full max-w-full object-contain" />
        </div>
        <div class="grow">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">PT. DULANK SEMESTA CIDA</h3>
          <p class="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            Jl. Arif Rahman Hakim Niaga Kel. Nagasari<br />
            Kec. Karawang Barat Kab. Karawang<br />
            email: ptdulanksemestacida@gmail.com | website: www.percetakan-dulank.com | WhatsApp: 0877 8813 1400
          </p>
        </div>
      </div>

      <h1 class="mb-6 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Purchase Order</h1>

      <!-- To and PO info -->
      <div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        <div class="md:col-span-7">
          <div class="flex gap-4">
            <span class="w-12 shrink-0 text-xs font-bold text-gray-700 dark:text-gray-300">To:</span>
            <div class="space-y-1 text-xs">
              <p class="font-bold text-gray-900 dark:text-white">{{ poData.vendor.name }}</p>
              <p class="text-gray-500 dark:text-gray-400">{{ poData.vendor.address }}</p>
              <p class="text-gray-500 dark:text-gray-400">{{ poData.vendor.email }} | {{ poData.vendor.phone }}</p>
            </div>
          </div>
        </div>
        <div class="space-y-1.5 text-xs md:col-span-5">
          <div class="flex justify-between border-b border-gray-100 py-1 dark:border-gray-800">
            <span class="font-medium text-gray-500 dark:text-gray-400">PO Number:</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ poData.noPO }}</span>
          </div>
          <div class="flex justify-between border-b border-gray-100 py-1 dark:border-gray-800">
            <span class="font-medium text-gray-500 dark:text-gray-400">PO Date:</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ poData.date }}</span>
          </div>
          <div class="flex justify-between border-b border-gray-100 py-1 dark:border-gray-800">
            <span class="font-medium text-gray-500 dark:text-gray-400">Vendor Reff:</span>
            <span class="font-semibold text-gray-900 dark:text-white">{{ poData.vendorReff || '-' }}</span>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table class="w-full text-left text-sm text-gray-700 dark:text-gray-200">
          <thead class="bg-gray-50 text-xs font-semibold uppercase text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <tr>
              <th class="px-4 py-3">Item Description</th>
              <th class="px-4 py-3 text-center">Qty</th>
              <th class="px-4 py-3 text-center">Unit</th>
              <th class="px-4 py-3 text-right">Unit Price (IDR)</th>
              <th class="px-4 py-3 text-right">Amount (IDR)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="(item, idx) in poData.items" :key="idx" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
              <td class="px-4 py-3 font-medium">{{ item.name }}</td>
              <td class="px-4 py-3 text-center">{{ item.qty }}</td>
              <td class="px-4 py-3 text-center">{{ item.unit }}</td>
              <td class="px-4 py-3 text-right tabular-nums">Rp {{ formatNumber(item.price) }}</td>
              <td class="px-4 py-3 text-right font-semibold tabular-nums">Rp {{ formatNumber(item.qty * item.price) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Totals -->
      <div class="mt-6 flex flex-col justify-end md:flex-row">
        <div class="w-full space-y-2 text-sm md:w-80">
          <div class="flex justify-between text-gray-600 dark:text-gray-300">
            <span>Subtotal</span>
            <span class="font-medium tabular-nums">Rp {{ formatNumber(subTotal) }}</span>
          </div>
          <div class="flex justify-between text-gray-600 dark:text-gray-300">
            <span>Tax (PPN 11%)</span>
            <span class="font-medium tabular-nums">Rp {{ formatNumber(taxAmount) }}</span>
          </div>
          <div class="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900 dark:border-gray-700 dark:text-white">
            <span>Total (IDR)</span>
            <span class="text-primary tabular-nums">Rp {{ formatNumber(totalAmount) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  .action-button {
    display: none !important;
  }
  #detail {
    padding: 0 !important;
    margin: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
  }
}
</style>

