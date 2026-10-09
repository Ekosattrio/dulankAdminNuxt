<script setup lang="ts">
import PurchaseReturnDetailSheet from '~/components/pages/purchase-return/PurchaseReturnDetailSheet.vue'

definePageMeta({
  layout: 'default',
  alias: ['/purchase-return-detail.html'],
})
useLegacyPage({ title: 'Purchase Return Details', sweetAlert: false })

const returnData = ref({
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
})
</script>

<template>
  <div class="dulank-page dulank-page-purchase-return-detail space-y-4 p-4 md:p-6">
    <div class="flex items-center justify-between">
      <div>
        <h4 class="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Purchase Return Details</h4>
        <p class="text-xs text-gray-500 dark:text-gray-400">View and print purchase return documents</p>
      </div>
      <div>
        <NuxtLink
          to="/purchase-return"
          class="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
        >
          <i class="feather-arrow-left"></i>
          Back to Purchase Return List
        </NuxtLink>
      </div>
    </div>

    <PurchaseReturnDetailSheet :return-data="returnData" />
  </div>
</template>
