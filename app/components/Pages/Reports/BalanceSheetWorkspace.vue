<script setup lang="ts">
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'
import BalanceSheetStatementTable from '~/components/Pages/Finance/BalanceSheetStatementTable.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import { useBalanceSheet } from '~/composables/useFinanceStatements'
import { useTablePrint } from '~/composables/useTablePrint'
const asOfDate = ref(new Date().toISOString().slice(0, 10))
const { statement, pending, error, refresh } = useBalanceSheet(asOfDate)
const print = useTablePrint()
const rows = computed(() => statement.value ? [
  { description: 'Cash and Bank', debit: statement.value.assets.cashAndBank, credit: '' },
  { description: 'Accounts Receivable', debit: statement.value.assets.receivables, credit: '' },
  { description: 'Inventory', debit: statement.value.assets.inventory, credit: '' },
  { description: 'Accounts Payable', debit: '', credit: statement.value.liabilities.payables },
  { description: 'Accrued Expenses', debit: '', credit: statement.value.liabilities.accruedExpenses },
  { description: "Owner's Capital", debit: '', credit: statement.value.equity.ownerCapital },
  { description: 'Retained Earnings / Reconciliation', debit: '', credit: statement.value.equity.retainedEarnings },
] : [])
const columns = [{ key: 'description', label: 'Description' }, { key: 'debit', label: 'Debit (IDR)', align: 'right' as const }, { key: 'credit', label: 'Credit (IDR)', align: 'right' as const }]
</script>
<template>
  <div class="space-y-6">
    <SalesListHeader title="Balance Sheet" subtitle="Statement of Financial Position" :refreshing="pending" @refresh="refresh" @print="print.openPrintModal('print')" @pdf="print.openPrintModal('pdf')" />
    <div class="flex justify-end"><label class="flex items-center gap-2 text-xs font-semibold text-gray-600">As of Date <input v-model="asOfDate" type="date" class="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-900" /></label></div>
    <SalesFeedback :pending="pending" :error="error ? 'Unable to load balance sheet.' : ''" skeleton="table" :skeleton-cols="4" @retry="refresh" />
    <BalanceSheetStatementTable v-if="statement && !pending && !error" :statement="statement" />
    <DocumentPrintModal :open="print.isPrintModalOpen.value" title="Balance Sheet" :subtitle="`As of ${asOfDate}`" :columns="columns" :items="rows" :default-action="print.defaultPrintAction.value" :show-date-range="false" @close="print.closePrintModal" />
  </div>
</template>
