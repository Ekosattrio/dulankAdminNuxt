<script setup lang="ts">
import ProductReportWorkspace from '~/components/pages/reports/ProductReportWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/product-report.html'],
})

useLegacyPage({
  title: 'Product Report - Kacetak System',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-product-report">
    <ProductReportWorkspace />
  </div>
</template>
