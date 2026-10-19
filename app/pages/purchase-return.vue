<script setup lang="ts">
import PurchaseReturnWorkspace from '~/components/Pages/PurchaseReturn/PurchaseReturnWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Purchase Return List - Pengembalian Pembelian',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-purchase-return">
    <PurchaseReturnWorkspace />
  </div>
</template>
