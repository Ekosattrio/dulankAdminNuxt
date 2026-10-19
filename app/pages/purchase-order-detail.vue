<script setup lang="ts">
import PurchaseOrderDetailDocument from '~/components/Pages/PurchaseOrder/PurchaseOrderDetailDocument.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Purchase Order Detail',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-purchase-order-detail">
    <PurchaseOrderDetailDocument />
  </div>
</template>
