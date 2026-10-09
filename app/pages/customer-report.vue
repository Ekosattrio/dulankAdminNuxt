<script setup lang="ts">
import CustomerReportWorkspace from '~/components/pages/reports/CustomerReportWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Customer Report',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-customer-report p-4 md:p-6">
    <CustomerReportWorkspace />
  </div>
</template>
