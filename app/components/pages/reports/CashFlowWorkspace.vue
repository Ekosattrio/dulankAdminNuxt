<script setup lang="ts">
import type { DateRangeValue } from '~/composables/useDateRange'
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import CashFlowStatementTable from '~/components/pages/finance/CashFlowStatementTable.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import { useCashFlowStatement } from '~/composables/useFinanceStatements'
import { useTablePrint } from '~/composables/useTablePrint'
const dateRange = ref<DateRangeValue | null>(null)
const { statement, pending, error, refresh } = useCashFlowStatement(dateRange)
const print = useTablePrint()
const rows = computed(() => statement.value ? [
  { description: 'Cash Received from Customers', amount: statement.value.receivedFromCustomers },
  { description: 'Other Operating Income', amount: statement.value.otherOperatingIncome },
  { description: 'Cash Paid for Materials', amount: -statement.value.paidForMaterials },
  { description: 'Cash Paid for Operating Expenses', amount: -statement.value.paidForOpex },
  { description: 'Cash Paid for Wages/Salaries', amount: -statement.value.paidForWages },
  { description: 'Net Cash Provided by Operating Activities', amount: statement.value.netOperatingCash },
  { description: 'Net Cash from Financing & Investing Activities', amount: statement.value.netFinancingCash },
  { description: 'Cash at Beginning of Period', amount: statement.value.beginningCash },
  { description: 'Cash at End of Period', amount: statement.value.endingCash },
] : [])
const columns = [{ key: 'description', label: 'Description' }, { key: 'amount', label: 'Amount (IDR)', align: 'right' as const }]
</script>
<template>
  <div class="space-y-6">
    <SalesListHeader title="Cash Flow" subtitle="Statement of Cash Flows" :refreshing="pending" @refresh="refresh" @print="print.openPrintModal('print')" @pdf="print.openPrintModal('pdf')" />
    <div class="flex justify-end"><DateRangePicker v-model="dateRange" align="end" placeholder="All Periods" /></div>
    <SalesFeedback :pending="pending" :error="error ? 'Unable to load cash flow statement.' : ''" skeleton="table" :skeleton-cols="2" @retry="refresh" />
    <CashFlowStatementTable v-if="statement && !pending && !error" :statement="statement" />
    <DocumentPrintModal :open="print.isPrintModalOpen.value" title="Cash Flow Statement" :columns="columns" :items="rows" :initial-date-range="dateRange" :default-action="print.defaultPrintAction.value" :show-date-range="false" @close="print.closePrintModal" />
  </div>
</template>

