<script setup lang="ts">
import TaxReportWorkspace from '~/components/Pages/Reports/TaxReportWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Tax Report (PPN & Fiskal) - Kacetak System',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-tax-report p-4 md:p-6">
    <TaxReportWorkspace />
  </div>
</template>
