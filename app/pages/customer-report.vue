<script setup lang="ts">
import CustomerReportWorkspace from '~/components/Pages/Reports/CustomerReportWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Customer Report',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-customer-report">
    <CustomerReportWorkspace />
  </div>
</template>
