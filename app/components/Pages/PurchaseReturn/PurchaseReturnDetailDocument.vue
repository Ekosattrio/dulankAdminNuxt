<script setup lang="ts">
import { formatNumber } from '~/composables/useFormatters'

const route = useRoute()
const { purchaseReturns } = usePurchaseReturns()

const defaultReturnData = {
  noPR: 'PRT00001',
  date: '25/12/2025',
  noReff: 'PR-2512000001',
  bank: 'Bank BCA PT Dulank Semesta Cida - 1091956271',
  supplier: {
    name: 'PT Cipta Kreasi',
    address: 'Cyber 2 Tower, Lantai 29, Jalan HR Rasuna Said, XS No. 13, Jakarta Selatan',
  },
  items: [
    {
      name: 'Tinta Neotex 1Kg Cyan',
      qty: 2,
      unit: 'Kg',
      price: 450000,
      reason: 'Sudah Expired',
    },
    {
      name: 'Kertas Art Paper 150gr',
      qty: 1,
      unit: 'Ream',
      price: 600000,
      reason: 'Salah Ukuran',
    },
  ],
}

const activeReturn = computed(() => {
  const queryNo = route.query.no || route.query.id
  if (queryNo && purchaseReturns.value.length > 0) {
    const found = purchaseReturns.value.find((p) => p.noPR === queryNo || p.id === queryNo)
    if (found) {
      return {
        ...defaultReturnData,
        noPR: found.noPR,
        date: found.date,
        supplier: {
          ...defaultReturnData.supplier,
          name: found.supplier,
        },
      }
    }
  }
  return defaultReturnData
})

const subTotal = computed(() =>
  activeReturn.value.items.reduce((acc, item) => acc + item.qty * item.price, 0),
)

function printReturn() {
  window.print()
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4 print:hidden">
      <div>
        <h4 class="text-xl font-bold text-gray-900 dark:text-white">Purchase Return Details</h4>
        <p class="text-xs text-gray-500">Rincian Nota Pengembalian Barang Pembelian</p>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/purchase-return"
          class="inline-flex h-9 items-center gap-2 rounded border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          <FeatherIcon name="arrow-left" :size="14" />
          <span>Back to Purchase Return List</span>
        </NuxtLink>

        <button
          type="button"
          title="Print"
          class="flex size-9 items-center justify-center rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          @click="printReturn"
        >
          <FeatherIcon name="printer" :size="14" />
        </button>
      </div>
    </div>

    <div class="rounded-lg border border-gray-200 bg-white p-8 shadow-xs dark:border-gray-800 dark:bg-gray-900 print:border-0 print:p-0 print:shadow-none">
      <!-- Title centered -->
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">PURCHASE RETURN</h1>
        <p class="text-xs text-gray-500 mt-1">Date: {{ activeReturn.date }}</p>
      </div>

      <!-- Header: logo / company / supplier -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-6 border-b border-gray-200 dark:border-gray-700">
        <div class="md:col-span-2 flex justify-center md:justify-start">
          <div class="h-20 w-36 rounded border border-gray-200 bg-gray-50 p-2 flex items-center justify-center dark:border-gray-700 dark:bg-gray-800">
            <img src="/assets/img/kacetak.jpeg" alt="Logo" class="max-h-full max-w-full object-contain" />
          </div>
        </div>

        <div class="md:col-span-5">
          <h3 class="text-base font-bold text-gray-900 dark:text-white">PT. DULANK SEMESTA CIDA</h3>
          <p class="text-xs text-gray-500 leading-relaxed dark:text-gray-400 mt-1">
            Jl. Arif Rahman Hakim Niaga Kel. Nagasari<br />
            Kec. Karawang Barat Kab. Karawang
          </p>
        </div>

        <div class="md:col-span-5 space-y-1 text-xs">
          <div class="flex justify-between">
            <span class="font-bold text-gray-700 dark:text-gray-300">Supplier:</span>
            <span class="font-semibold text-gray-900 dark:text-white text-right">{{ activeReturn.supplier.name }}</span>
          </div>
          <div class="text-right text-gray-500 dark:text-gray-400">{{ activeReturn.supplier.address }}</div>
          <div class="flex justify-between pt-1">
            <span class="font-bold text-gray-700 dark:text-gray-300">No Reff:</span>
            <span class="text-gray-800 dark:text-gray-200">{{ activeReturn.noReff }}</span>
          </div>
        </div>
      </div>

      <div class="py-4 text-xs">
        <span class="font-semibold text-gray-700 dark:text-gray-300">No Purchase Return :</span>
        <span class="font-bold text-primary ml-2">{{ activeReturn.noPR }}</span>
      </div>

      <!-- Items table -->
      <div class="overflow-x-auto rounded border border-gray-200 dark:border-gray-700">
        <table class="w-full text-left text-xs">
          <thead class="bg-gray-50 font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <tr>
              <th class="px-3 py-2">Product Name</th>
              <th class="px-3 py-2 text-center w-16">Qty</th>
              <th class="px-3 py-2 text-center w-20">Unit</th>
              <th class="px-3 py-2 text-right w-36">Price (IDR)</th>
              <th class="px-3 py-2 text-right w-36">Amount (IDR)</th>
              <th class="px-3 py-2">Description of return</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
            <tr v-for="(item, idx) in activeReturn.items" :key="idx" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
              <td class="p-2 font-medium text-gray-900 dark:text-white">{{ item.name }}</td>
              <td class="p-2 text-center text-gray-700 dark:text-gray-300">{{ item.qty }}</td>
              <td class="p-2 text-center text-gray-700 dark:text-gray-300">{{ item.unit }}</td>
              <td class="p-2 text-right tabular-nums text-gray-700 dark:text-gray-300">Rp {{ formatNumber(item.price) }}</td>
              <td class="p-2 text-right tabular-nums font-bold text-gray-900 dark:text-white">Rp {{ formatNumber(item.qty * item.price) }}</td>
              <td class="p-2 text-rose-600 dark:text-rose-400 font-medium">{{ item.reason }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Bank / Note and Signatures -->
      <div class="mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
        <div class="md:col-span-7 space-y-4">
          <p class="text-gray-700 dark:text-gray-300">
            <span class="font-bold">Bank:</span> {{ activeReturn.bank }}
          </p>
          <p class="text-gray-500">Note:</p>
          <div class="border-t border-gray-200 dark:border-gray-700 pt-6 grid grid-cols-2 gap-8 text-center">
            <div>
              <p class="font-semibold text-gray-700 dark:text-gray-300 mb-12">Supplier</p>
              <p class="text-gray-400">( .................................. )</p>
            </div>
            <div>
              <p class="font-semibold text-gray-700 dark:text-gray-300 mb-12">PT. Dulank Semesta Cida</p>
              <p class="font-bold text-gray-900 dark:text-white">( Sales Staff )</p>
            </div>
          </div>
        </div>

        <div class="md:col-span-5 flex justify-end">
          <div class="w-full max-w-xs space-y-2 rounded bg-gray-50 p-4 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
            <div class="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Sub Total</span>
              <span class="tabular-nums font-semibold">Rp {{ formatNumber(subTotal) }}</span>
            </div>
            <div class="flex justify-between text-gray-700 dark:text-gray-300">
              <span>Tax</span>
              <span class="tabular-nums">0</span>
            </div>
            <div class="flex justify-between border-t border-gray-200 pt-2 text-sm font-bold text-gray-900 dark:border-gray-700 dark:text-white">
              <span>Total (IDR)</span>
              <span class="text-primary tabular-nums">Rp {{ formatNumber(subTotal) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

