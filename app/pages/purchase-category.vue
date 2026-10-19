<script setup lang="ts">
import PurchaseCategoryWorkspace from '~/components/Pages/PurchaseCategory/PurchaseCategoryWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Purchase Category - Kategori Pembelian',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-purchase-category">
    <PurchaseCategoryWorkspace />
  </div>
</template>
