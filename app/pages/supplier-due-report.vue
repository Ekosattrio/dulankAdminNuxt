<script setup lang="ts">
import SupplierDueReportWorkspace from '~/components/pages/reports/SupplierDueReportWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Supplier Due Report',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-supplier-due-report p-4 md:p-6">
    <SupplierDueReportWorkspace />
  </div>
</template>
