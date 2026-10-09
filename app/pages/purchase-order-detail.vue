<script setup lang="ts">
import PurchaseOrderDetailSheet from '~/components/pages/purchase-order/PurchaseOrderDetailSheet.vue'

definePageMeta({
  layout: 'default',
  alias: ['/purchase-order-detail.html']
})
useLegacyPage({ title: 'Purchase Detail', sweetAlert: false })

const poData = ref({
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
})
</script>

<template>
  <div class="dulank-page dulank-page-purchase-order-detail space-y-4 p-4 md:p-6">
    <div class="flex items-center justify-between">
      <div>
        <h4 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Purchase Detail</h4>
        <p class="text-xs text-gray-500 dark:text-gray-400">View and print purchase order details</p>
      </div>
      <div>
        <NuxtLink
          to="/purchase-order"
          class="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          <i class="feather-arrow-left"></i>
          Back to Purchase Order List
        </NuxtLink>
      </div>
    </div>

    <PurchaseOrderDetailSheet :po-data="poData" />
  </div>
</template>
