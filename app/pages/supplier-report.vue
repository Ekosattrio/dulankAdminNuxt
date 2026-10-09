<script setup lang="ts">
import SupplierReportWorkspace from '~/components/pages/reports/SupplierReportWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/supplier-report.html'],
})

useLegacyPage({ title: 'Supplier Report', sweetAlert: false })
</script>

<template>
  <div class="dulank-page dulank-page-supplier-report">
    <SupplierReportWorkspace />
  </div>
</template>
