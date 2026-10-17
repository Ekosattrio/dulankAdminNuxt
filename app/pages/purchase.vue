<script setup lang="ts">
import PurchaseWorkspace from '~/components/Pages/Purchase/PurchaseWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Purchase List - Transaksi Pembelian',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-purchase"><PurchaseWorkspace /></div>
</template>
