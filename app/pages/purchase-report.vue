<script setup lang="ts">
import PurchaseReportWorkspace from '~/components/Pages/Reports/PurchaseReportWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Purchase Report - Kacetak System',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-purchase-report">
    <PurchaseReportWorkspace />
  </div>
</template>
