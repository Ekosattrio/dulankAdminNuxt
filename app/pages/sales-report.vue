<script setup lang="ts">
import SalesReportWorkspace from '~/components/Pages/Reports/SalesReportWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Sales Report - Kacetak System',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-sales-report p-4 md:p-6">
    <SalesReportWorkspace />
  </div>
</template>
