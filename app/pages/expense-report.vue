<script setup lang="ts">
import ExpenseReportWorkspace from '~/components/pages/reports/ExpenseReportWorkspace.vue'

definePageMeta({
  layout: 'default',
  alias: ['/expense-report.html'],
})

useLegacyPage({
  title: 'Expense Report - Kacetak System',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-expense-report">
    <ExpenseReportWorkspace />
  </div>
</template>
