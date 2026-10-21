<script setup lang="ts">
import CustomerDueReportWorkspace from '~/components/Pages/Reports/CustomerDueReportWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Customer Due Report',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-customer-due-report">
    <CustomerDueReportWorkspace />
  </div>
</template>
