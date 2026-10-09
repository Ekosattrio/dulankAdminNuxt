<script setup lang="ts">
import CustomerDueReportWorkspace from '~/components/pages/reports/CustomerDueReportWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Customer Due Report',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-customer-due-report p-4 md:p-6">
    <CustomerDueReportWorkspace />
  </div>
</template>
