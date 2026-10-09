<script setup lang="ts">
import { computed } from 'vue'
import { formatNumber } from '~/composables/useFormatters'

export interface PRDetailData {
  noPR: string
  date: string
  noReff?: string
  bank?: string
  supplier: {
    name: string
    address: string
  }
  items: Array<{
    name: string
    qty: number
    unit: string
    price: number
    reason?: string
  }>
}

const props = defineProps<{
  returnData: PRDetailData
}>()

const subTotal = computed(() => {
  return props.returnData.items.reduce((acc, item) => acc + item.qty * item.price, 0)
})

function printReturn() {
  window.print()
}

defineExpose({ printReturn })
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
            @click="printReturn"
          >
            <img src="/assets/img/icons/pdf.svg" alt="PDF" class="h-4 w-4" />
          </button>
        </li>
        <li>
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            title="Print"
            @click="printReturn"
          >
            <i class="feather-printer h-4 w-4"></i>
          </button>
        </li>
      </ul>
    </div>

    <div class="p-6 md:p-8" id="detail">
      <!-- Title -->
      <div class="mb-6 text-center">
        <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">PURCHASE RETURN</h1>
        <p class="text-xs text-gray-500 dark:text-gray-400">Date: {{ returnData.date }}</p>
      </div>

      <!-- Header: logo / company / supplier -->
      <div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start">
        <div class="flex h-24 w-44 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800 md:col-span-3">
          <img src="/assets/img/kacetak.jpeg" alt="Logo" class="max-h-full max-w-full object-contain" />
        </div>

        <div class="md:col-span-4">
          <h3 class="text-base font-bold text-gray-900 dark:text-white">PT. DULANK SEMESTA CIDA</h3>
          <p class="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            Jl. Arif Rahman Hakim Niaga Kel. Nagasari<br />
            Kec. Karawang Barat Kab. Karawang
          </p>
        </div>

        <div class="space-y-1 text-xs md:col-span-5">
          <div class="flex gap-2">
            <span class="w-20 font-bold text-gray-700 dark:text-gray-300">Supplier:</span>
            <span class="font-bold text-gray-900 dark:text-white">{{ returnData.supplier.name }}</span>
          </div>
          <div class="flex gap-2 text-gray-500 dark:text-gray-400">
            <span class="w-20"></span>
            <span>{{ returnData.supplier.address }}</span>
          </div>
          <div class="flex gap-2">
            <span class="w-20 font-bold text-gray-700 dark:text-gray-300">No Reff:</span>
            <span class="font-medium text-gray-900 dark:text-white">{{ returnData.noReff || '-' }}</span>
          </div>
        </div>
      </div>

      <div class="mb-4 text-xs font-semibold">
        <span class="text-gray-500 dark:text-gray-400">No Purchase Return:</span>
        <span class="ms-1 font-bold text-primary">{{ returnData.noPR }}</span>
      </div>

      <!-- Items table -->
      <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table class="w-full text-left text-sm text-gray-700 dark:text-gray-200">
          <thead class="bg-gray-50 text-xs font-semibold uppercase text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            <tr>
              <th class="px-4 py-3">Product Name</th>
              <th class="px-4 py-3 text-center">Qty</th>
              <th class="px-4 py-3 text-center">Unit</th>
              <th class="px-4 py-3 text-right">Price (IDR)</th>
              <th class="px-4 py-3 text-right">Amount (IDR)</th>
              <th class="px-4 py-3">Description of Return</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="(item, idx) in returnData.items" :key="idx" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
              <td class="px-4 py-3 font-semibold">{{ item.name }}</td>
              <td class="px-4 py-3 text-center">{{ item.qty }}</td>
              <td class="px-4 py-3 text-center">{{ item.unit }}</td>
              <td class="px-4 py-3 text-right tabular-nums">{{ formatNumber(item.price) }}</td>
              <td class="px-4 py-3 text-right font-bold tabular-nums">{{ formatNumber(item.qty * item.price) }}</td>
              <td class="px-4 py-3 text-xs text-rose-600 dark:text-rose-400">{{ item.reason || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Bank / Note and Totals -->
      <div class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-12">
        <div class="text-xs md:col-span-7">
          <p class="mb-1 text-gray-700 dark:text-gray-300"><strong>Bank:</strong> {{ returnData.bank || '-' }}</p>
          <p class="mb-4 text-gray-700 dark:text-gray-300"><strong>Note:</strong> Return item due to specifications mismatch</p>
          <div class="mt-8 grid grid-cols-2 gap-8 text-center">
            <div>
              <p class="mb-16 font-semibold text-gray-600 dark:text-gray-400">Supplier</p>
              <p class="border-t border-gray-300 pt-1 text-gray-500 dark:border-gray-700">( Signature & Stamp )</p>
            </div>
            <div>
              <p class="mb-16 font-semibold text-gray-600 dark:text-gray-400">PT. Dulank Semesta Cida</p>
              <p class="border-t border-gray-300 pt-1 font-bold text-gray-900 dark:border-gray-700 dark:text-white">( Sales Staff )</p>
            </div>
          </div>
        </div>

        <div class="flex flex-col justify-start md:col-span-5 md:items-end">
          <div class="w-full space-y-2 text-sm md:w-72">
            <div class="flex justify-between text-gray-600 dark:text-gray-300">
              <span>Sub Total</span>
              <span class="font-medium tabular-nums">{{ formatNumber(subTotal) }}</span>
            </div>
            <div class="flex justify-between text-gray-600 dark:text-gray-300">
              <span>Tax</span>
              <span class="font-medium tabular-nums">0</span>
            </div>
            <div class="flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900 dark:border-gray-700 dark:text-white">
              <span>Total (IDR)</span>
              <span class="text-primary tabular-nums">Rp {{ formatNumber(subTotal) }}</span>
            </div>
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

