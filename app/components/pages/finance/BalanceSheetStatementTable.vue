<script setup lang="ts">
import type { BalanceSheetStatement } from '#server/types/finance-report'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
defineProps<{ statement: BalanceSheetStatement }>()
</script>
<template>
  <div class="space-y-4">
    <div class="grid gap-4 lg:grid-cols-2">
      <div class="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <table class="w-full text-sm"><thead class="bg-gray-50 dark:bg-gray-800"><tr><th class="px-4 py-3 text-start">Assets</th><th class="px-4 py-3 text-end">Debit (IDR)</th></tr></thead><tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr class="font-semibold"><td colspan="2" class="px-4 py-3">Current Assets</td></tr>
          <tr v-for="row in [{ label: 'Cash and Bank', value: statement.assets.cashAndBank }, { label: 'Accounts Receivable', value: statement.assets.receivables }, { label: 'Inventory', value: statement.assets.inventory }]" :key="row.label"><td class="px-8 py-3">{{ row.label }}</td><td class="px-4 py-3 text-end"><CurrencyDisplay :value="row.value" /></td></tr>
          <tr class="bg-gray-50 font-bold dark:bg-gray-800/60"><td class="px-4 py-3">Total Current Assets</td><td class="px-4 py-3 text-end"><CurrencyDisplay :value="statement.assets.totalCurrentAssets" bold /></td></tr>
          <tr class="font-semibold"><td colspan="2" class="px-4 py-3">Fixed Assets</td></tr>
          <tr><td class="px-8 py-3">Printing Machinery & Equipment</td><td class="px-4 py-3 text-end"><CurrencyDisplay :value="statement.assets.machinery" /></td></tr>
          <tr><td class="px-8 py-3">Accumulated Depreciation</td><td class="px-4 py-3 text-end"><CurrencyDisplay :value="-statement.assets.depreciation" /></td></tr>
          <tr class="bg-primary/5 font-bold"><td class="px-4 py-3">Total Assets</td><td class="px-4 py-3 text-end"><CurrencyDisplay :value="statement.assets.totalAssets" bold /></td></tr>
        </tbody></table>
      </div>
      <div class="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <table class="w-full text-sm"><thead class="bg-gray-50 dark:bg-gray-800"><tr><th class="px-4 py-3 text-start">Liabilities & Equity</th><th class="px-4 py-3 text-end">Credit (IDR)</th></tr></thead><tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr class="font-semibold"><td colspan="2" class="px-4 py-3">Current Liabilities</td></tr>
          <tr><td class="px-8 py-3">Accounts Payable</td><td class="px-4 py-3 text-end"><CurrencyDisplay :value="statement.liabilities.payables" /></td></tr>
          <tr><td class="px-8 py-3">Accrued Expenses</td><td class="px-4 py-3 text-end"><CurrencyDisplay :value="statement.liabilities.accruedExpenses" /></td></tr>
          <tr class="bg-gray-50 font-bold dark:bg-gray-800/60"><td class="px-4 py-3">Total Liabilities</td><td class="px-4 py-3 text-end"><CurrencyDisplay :value="statement.liabilities.totalLiabilities" bold /></td></tr>
          <tr class="font-semibold"><td colspan="2" class="px-4 py-3">Equity</td></tr>
          <tr><td class="px-8 py-3">Owner's Capital</td><td class="px-4 py-3 text-end"><CurrencyDisplay :value="statement.equity.ownerCapital" /></td></tr>
          <tr><td class="px-8 py-3">Retained Earnings / Reconciliation</td><td class="px-4 py-3 text-end"><CurrencyDisplay :value="statement.equity.retainedEarnings" /></td></tr>
          <tr class="bg-gray-50 font-bold dark:bg-gray-800/60"><td class="px-4 py-3">Total Equity</td><td class="px-4 py-3 text-end"><CurrencyDisplay :value="statement.equity.totalEquity" bold /></td></tr>
          <tr class="bg-primary/5 font-bold"><td class="px-4 py-3">Total Liabilities & Equity</td><td class="px-4 py-3 text-end"><CurrencyDisplay :value="statement.totalLiabilitiesAndEquity" bold /></td></tr>
        </tbody></table>
      </div>
    </div>
    <div class="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
      <p class="font-semibold">Data quality notes</p><ul class="mt-2 list-disc space-y-1 ps-5"><li v-for="note in statement.notes" :key="note">{{ note }}</li></ul>
    </div>
  </div>
</template>

