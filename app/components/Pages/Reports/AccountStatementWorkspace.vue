<script setup lang="ts">
import type { BankStatementRow } from '#server/types/finance-report'
import type { DateRangeValue } from '~/composables/useDateRange'
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'
import AccountStatementRecordsTable from '~/components/Pages/Finance/AccountStatementRecordsTable.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import { useAccountStatements } from '~/composables/useFinanceStatements'
import { useTablePrint } from '~/composables/useTablePrint'

const { accounts, pending: accountPending, error: accountError, refresh: refreshAccounts } = useBankAccounts()
const accountId = ref('')
const dateRange = ref<DateRangeValue | null>(null)
const search = ref('')
const currentPageItems = ref<BankStatementRow[]>([])
const statement = useAccountStatements(accountId, dateRange)
const print = useTablePrint()
watch(accounts, (value) => { if (!accountId.value && value[0]) accountId.value = value[0].id }, { immediate: true })
const filteredItems = computed(() => {
  const query = search.value.trim().toLowerCase()
  return statement.items.value.filter((item) => !query || [item.category, item.description, item.referenceId].some((value) => value.toLowerCase().includes(query)))
})
const pending = computed(() => accountPending.value || statement.pending.value)
const error = computed(() => accountError.value || statement.error.value)
const printColumns = [
  { key: 'date', label: 'Date' }, { key: 'category', label: 'Category' }, { key: 'description', label: 'Description' },
  { key: 'amount', label: 'Amount (IDR)', align: 'right' as const }, { key: 'transactionType', label: 'Transaction Type', align: 'center' as const },
  { key: 'runningBalance', label: 'Running Balance (IDR)', align: 'right' as const },
]
const refresh = () => Promise.all([refreshAccounts(), statement.refresh()])
</script>
<template>
  <div class="space-y-6">
    <SalesListHeader title="Account Statement" subtitle="Financial transaction statement from the bank ledger" :refreshing="pending" @refresh="refresh" @print="print.openPrintModal('print')" @pdf="print.openPrintModal('pdf')" />
    <SalesFeedback :pending="pending" :error="error ? 'Unable to load account statement.' : ''" skeleton="table" :skeleton-cols="6" @retry="refresh" />
    <AccountStatementRecordsTable v-if="!pending && !error" :items="filteredItems" :accounts="accounts" :search="search" :account-id="accountId" :date-range="dateRange" @update:search="search = $event" @update:account-id="accountId = $event" @update:date-range="dateRange = $event" @update:current-page-items="currentPageItems = $event" />
    <DocumentPrintModal :open="print.isPrintModalOpen.value" title="Account Statement" :columns="printColumns" :items="filteredItems" :current-page-items="currentPageItems" :initial-date-range="dateRange" :default-action="print.defaultPrintAction.value" date-field="occurredAt" @close="print.closePrintModal" />
  </div>
</template>
