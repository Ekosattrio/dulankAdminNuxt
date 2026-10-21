<script setup lang="ts">
import SupplierDueReportWorkspace from '~/components/Pages/Reports/SupplierDueReportWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Supplier Due Report',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-supplier-due-report">
    <SupplierDueReportWorkspace />
  </div>
</template>
