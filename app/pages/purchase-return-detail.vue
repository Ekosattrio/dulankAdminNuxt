<script setup lang="ts">
import PurchaseReturnDetailDocument from '~/components/Pages/PurchaseReturn/PurchaseReturnDetailDocument.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Purchase Return Details',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-purchase-return-detail">
    <PurchaseReturnDetailDocument />
  </div>
</template>
