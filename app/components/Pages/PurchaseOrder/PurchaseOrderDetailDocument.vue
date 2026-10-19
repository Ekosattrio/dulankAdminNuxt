<script setup lang="ts">
import { formatNumber } from '~/composables/useFormatters'

const route = useRoute()
const { purchaseOrders } = usePurchaseOrders()

const defaultPoData = {
  noPO: 'PO2545852200',
  date: '25/12/2025',
  vendorReff: '',
  noPR: 'PR-2512000001',
  deliveryDate: '25/12/2025',
  paymentTerm: '30 Days after Invoice Receive',
  deliveryAddress: 'Jl. Arif Rahman Hakim Niaga Kel. Nagasari Kec. Karawang Barat Kab. Karawang',
  vendor: {
    name: 'PT Cipta Kreasi',
    address: 'Cyber 2 Tower, Lantai 29, Jalan HR Rasuna Said, XS No. 13, Jakarta Selatan, 12950',
    email: 'ciptakreasi@gmail.com',
    phone: '62819 0685 5554',
  },
  items: [
    { name: 'Tinta Neotex 1Kg Cyan', qty: 2, unit: 'Kg', price: 450000 },
    { name: 'Kertas Art Paper 150gr', qty: 1, unit: 'Ream', price: 600000 },
  ],
}

const activeOrder = computed(() => {
  const queryNo = route.query.no || route.query.id
  if (queryNo && purchaseOrders.value.length > 0) {
    const found = purchaseOrders.value.find((p) => p.noPO === queryNo || p.id === queryNo)
    if (found) {
      return {
        ...defaultPoData,
        noPO: found.noPO,
        date: found.date,
        vendor: {
          ...defaultPoData.vendor,
          name: found.supplier,
        },
      }
    }
  }
  return defaultPoData
})

const subTotal = computed(() =>
  activeOrder.value.items.reduce((acc, item) => acc + item.qty * item.price, 0),
)
const taxAmount = computed(() => Math.round(subTotal.value * 0.11))
const totalAmount = computed(() => subTotal.value + taxAmount.value)

function printPO() {
  window.print()
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4 print:hidden">
      <div class="page-title">
        <h4 class="text-xl font-bold text-gray-900 dark:text-white">Purchase Detail</h4>
        <p class="text-xs text-gray-500">Rincian Surat Pesanan Pembelian Barang</p>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink
          to="/purchase-order"
          class="inline-flex h-9 items-center gap-2 rounded border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          <FeatherIcon name="arrow-left" :size="14" />
          <span>Back to Purchase Order List</span>
        </NuxtLink>

        <button
          type="button"
          title="Print"
          class="flex size-9 items-center justify-center rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          @click="printPO"
        >
          <FeatherIcon name="printer" :size="14" />
        </button>
      </div>
    </div>

    <div class="rounded-lg border border-gray-200 bg-white p-8 shadow-xs dark:border-gray-800 dark:bg-gray-900 print:border-0 print:p-0 print:shadow-none">
      <!-- Company Header -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start pb-6 border-b border-gray-200 dark:border-gray-700">
        <div class="md:col-span-3 flex justify-center md:justify-start">
          <div class="h-20 w-44 rounded border border-gray-200 bg-gray-50 p-2 flex items-center justify-center dark:border-gray-700 dark:bg-gray-800">
            <img src="/assets/img/kacetak.jpeg" alt="Logo" class="max-h-full max-w-full object-contain" />
          </div>
        </div>
        <div class="md:col-span-9">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">PT. DULANK SEMESTA CIDA</h3>
          <p class="text-xs text-gray-500 leading-relaxed dark:text-gray-400 mt-1">
            Jl. Arif Rahman Hakim Niaga Kel. Nagasari, Kec. Karawang Barat Kab. Karawang<br />
            Email: ptdulanksemestacida@gmail.com | Website: www.percetakan-dulank.com | WhatsApp: 0877 8813 1400
          </p>
        </div>
      </div>

      <div class="py-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Purchase Order</h2>

        <!-- Vendor & PO info -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8 text-xs">
          <div class="md:col-span-7 space-y-1">
            <div class="font-bold text-gray-700 dark:text-gray-300 mb-1">To:</div>
            <p class="font-semibold text-gray-900 dark:text-white text-sm">{{ activeOrder.vendor.name }}</p>
            <p class="text-gray-500 dark:text-gray-400">{{ activeOrder.vendor.address }}</p>
            <p class="text-gray-500 dark:text-gray-400">{{ activeOrder.vendor.email }} | {{ activeOrder.vendor.phone }}</p>
          </div>

          <div class="md:col-span-5 space-y-1.5 bg-gray-50 p-4 rounded dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
            <div class="flex justify-between">
              <span class="font-semibold text-gray-600 dark:text-gray-400">PO Number:</span>
              <span class="font-bold text-primary">{{ activeOrder.noPO }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-semibold text-gray-600 dark:text-gray-400">PO Date:</span>
              <span class="text-gray-800 dark:text-gray-200">{{ activeOrder.date }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-semibold text-gray-600 dark:text-gray-400">Vendor Reff:</span>
              <span class="text-gray-800 dark:text-gray-200">{{ activeOrder.vendorReff || '-' }}</span>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div class="overflow-x-auto rounded border border-gray-200 dark:border-gray-700">
          <table class="w-full text-left text-xs">
            <thead class="bg-gray-50 font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <tr>
                <th class="px-3 py-2 text-center w-12">No.</th>
                <th class="px-3 py-2">Product Name</th>
                <th class="px-3 py-2 text-center w-20">Qty</th>
                <th class="px-3 py-2 text-center w-20">Unit</th>
                <th class="px-3 py-2 text-right w-36">Unit Price</th>
                <th class="px-3 py-2 text-right w-36">Sub Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
              <tr v-for="(item, idx) in activeOrder.items" :key="idx" class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td class="p-2 text-center text-gray-500">{{ idx + 1 }}</td>
                <td class="p-2 font-medium text-gray-900 dark:text-white">{{ item.name }}</td>
                <td class="p-2 text-center text-gray-700 dark:text-gray-300">{{ item.qty }}</td>
                <td class="p-2 text-center text-gray-700 dark:text-gray-300">{{ item.unit }}</td>
                <td class="p-2 text-right tabular-nums text-gray-700 dark:text-gray-300">Rp {{ formatNumber(item.price) }}</td>
                <td class="p-2 text-right tabular-nums font-bold text-gray-900 dark:text-white">Rp {{ formatNumber(item.qty * item.price) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Detail & Calculation -->
        <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div class="space-y-2">
            <h6 class="font-bold text-sm text-gray-900 dark:text-white mb-2">PO Detail</h6>
            <div class="grid grid-cols-12 gap-1">
              <div class="col-span-4 font-semibold text-gray-600 dark:text-gray-400">No. PR</div>
              <div class="col-span-8 text-gray-800 dark:text-gray-200">: {{ activeOrder.noPR }}</div>
              <div class="col-span-4 font-semibold text-gray-600 dark:text-gray-400">Delivery Date</div>
              <div class="col-span-8 text-gray-800 dark:text-gray-200">: {{ activeOrder.deliveryDate }}</div>
              <div class="col-span-4 font-semibold text-gray-600 dark:text-gray-400">Term of Payment</div>
              <div class="col-span-8 text-gray-800 dark:text-gray-200">: {{ activeOrder.paymentTerm }}</div>
              <div class="col-span-4 font-semibold text-gray-600 dark:text-gray-400">Delivery Address</div>
              <div class="col-span-8 text-gray-800 dark:text-gray-200">: {{ activeOrder.deliveryAddress }}</div>
            </div>
          </div>

          <div class="flex justify-end">
            <div class="w-full max-w-xs space-y-2 rounded bg-gray-50 p-4 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
              <div class="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Sub Total:</span>
                <span class="font-semibold tabular-nums">Rp {{ formatNumber(subTotal) }}</span>
              </div>
              <div class="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Tax (PPN 11%):</span>
                <span class="tabular-nums">Rp {{ formatNumber(taxAmount) }}</span>
              </div>
              <div class="flex justify-between border-t border-gray-200 pt-2 text-sm font-bold text-gray-900 dark:border-gray-700 dark:text-white">
                <span>Total (IDR):</span>
                <span class="text-primary tabular-nums">Rp {{ formatNumber(totalAmount) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

