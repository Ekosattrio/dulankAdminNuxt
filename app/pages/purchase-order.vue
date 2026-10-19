<script setup lang="ts">
import PurchaseOrderWorkspace from '~/components/Pages/PurchaseOrder/PurchaseOrderWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Purchase Order List - Pesanan Pembelian',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-purchase-order">
    <PurchaseOrderWorkspace />
  </div>
</template>
