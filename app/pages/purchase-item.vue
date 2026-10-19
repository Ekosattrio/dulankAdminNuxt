<script setup lang="ts">
import PurchaseItemWorkspace from '~/components/Pages/PurchaseItem/PurchaseItemWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Purchase Item - Katalog Barang Pembelian',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-purchase-item">
    <PurchaseItemWorkspace />
  </div>
</template>
