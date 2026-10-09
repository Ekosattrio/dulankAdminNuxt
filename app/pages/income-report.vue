<script setup lang="ts">
import IncomeReportWorkspace from '~/components/pages/reports/IncomeReportWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/income-report.html'],
})

useLegacyPage({
  title: 'Income Report - Kacetak System',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-income-report">
    <IncomeReportWorkspace />
  </div>
</template>
