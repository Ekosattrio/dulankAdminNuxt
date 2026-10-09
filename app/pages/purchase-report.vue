<script setup lang="ts">
import PurchaseReportWorkspace from '~/components/pages/reports/PurchaseReportWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Purchase Report - Kacetak System',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-purchase-report p-4 md:p-6">
    <PurchaseReportWorkspace />
  </div>
</template>
