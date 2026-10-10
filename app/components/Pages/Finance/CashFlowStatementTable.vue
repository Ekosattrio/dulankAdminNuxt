<script setup lang="ts">
import type { CashFlowStatement } from '#server/types/finance-report'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'
defineProps<{ statement: CashFlowStatement }>()
</script>
<template>
  <div class="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <table class="w-full text-sm text-gray-700 dark:text-gray-300">
      <thead class="border-b border-gray-200 bg-gray-50 font-semibold dark:border-gray-700 dark:bg-gray-800"><tr><th class="px-4 py-3 text-start">Description</th><th class="px-4 py-3 text-end">Amount (IDR)</th></tr></thead>
      <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
        <tr class="bg-gray-50 font-semibold dark:bg-gray-800/60"><td colspan="2" class="px-4 py-3">Cash Flows from Operating Activities</td></tr>
        <tr v-for="row in [{ label: 'Cash Received from Customers', value: statement.receivedFromCustomers }, { label: 'Other Operating Income', value: statement.otherOperatingIncome }, { label: 'Cash Paid for Materials', value: -statement.paidForMaterials }, { label: 'Cash Paid for Operating Expenses', value: -statement.paidForOpex }, { label: 'Cash Paid for Wages/Salaries', value: -statement.paidForWages }]" :key="row.label"><td class="px-8 py-3">{{ row.label }}</td><td class="px-4 py-3 text-end"><CurrencyDisplay :value="row.value" :custom-class="row.value < 0 ? 'text-red-600' : 'text-emerald-600'" /></td></tr>
        <tr class="font-bold"><td class="px-4 py-3">Net Cash Provided by Operating Activities</td><td class="px-4 py-3 text-end"><CurrencyDisplay :value="statement.netOperatingCash" bold /></td></tr>
        <tr class="bg-gray-50 font-semibold dark:bg-gray-800/60"><td colspan="2" class="px-4 py-3">Cash Flows from Financing & Investing Activities</td></tr>
        <tr><td class="px-8 py-3">Other Financing Activities</td><td class="px-4 py-3 text-end"><CurrencyDisplay :value="statement.financingInflows" /></td></tr>
        <tr><td class="px-8 py-3">Capital Expenditure / Employee Advances</td><td class="px-4 py-3 text-end"><CurrencyDisplay :value="-statement.capitalExpenditure" custom-class="text-red-600" /></td></tr>
        <tr class="font-bold"><td class="px-4 py-3">Net Cash from Financing & Investing Activities</td><td class="px-4 py-3 text-end"><CurrencyDisplay :value="statement.netFinancingCash" bold /></td></tr>
        <tr class="bg-primary/5 font-bold"><td class="px-4 py-3">Net Increase in Cash</td><td class="px-4 py-3 text-end"><CurrencyDisplay :value="statement.netCashIncrease" bold /></td></tr>
        <tr><td class="px-4 py-3">Cash at Beginning of Period</td><td class="px-4 py-3 text-end"><CurrencyDisplay :value="statement.beginningCash" /></td></tr>
        <tr class="bg-emerald-50 font-bold dark:bg-emerald-950/30"><td class="px-4 py-3">Cash at End of Period</td><td class="px-4 py-3 text-end"><CurrencyDisplay :value="statement.endingCash" bold custom-class="text-emerald-700 dark:text-emerald-300" /></td></tr>
      </tbody>
    </table>
  </div>
</template>

