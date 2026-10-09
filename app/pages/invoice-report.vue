<script setup lang="ts">
import InvoiceReportWorkspace from '~/components/pages/reports/InvoiceReportWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/invoice-report.html'],
})

useLegacyPage({
  title: 'Invoice Report - Kacetak System',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-invoice-report">
    <InvoiceReportWorkspace />
  </div>
</template>
