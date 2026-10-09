<script setup lang="ts">
import type { CustomerBalanceRow } from '#server/types/finance-report'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import CustomerBalanceDetailModal from '~/components/pages/finance/CustomerBalanceDetailModal.vue'
import CustomerBalanceRecordsTable from '~/components/pages/finance/CustomerBalanceRecordsTable.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import { useCustomerBalances } from '~/composables/useFinanceStatements'
import { useTablePrint } from '~/composables/useTablePrint'

const { items, pending, error, refresh } = useCustomerBalances()
const search = ref('')
const type = ref('')
const selected = ref<CustomerBalanceRow | null>(null)
const currentPageItems = ref<CustomerBalanceRow[]>([])
const print = useTablePrint()
const types = computed(() => [...new Set(items.value.map((item) => item.type))].sort())
const filteredItems = computed(() => {
  const query = search.value.trim().toLowerCase()
  return items.value.filter((item) => (!type.value || item.type === type.value)
    && (!query || [item.customerId, item.name, item.type].some((value) => value.toLowerCase().includes(query))))
})
const totalBalance = computed(() => items.value.reduce((sum, item) => sum + item.balance, 0))
const printColumns = [
  { key: 'customerId', label: 'Customer ID' }, { key: 'name', label: 'Name' },
  { key: 'type', label: 'Customer Type' }, { key: 'balance', label: 'Balance Amount (IDR)', align: 'right' as const },
]
</script>
<template>
  <div class="space-y-6">
    <SalesListHeader title="Customer Balance Account" subtitle="Manage customer account balances and deposits" :refreshing="pending" @refresh="refresh" @print="print.openPrintModal('print')" @pdf="print.openPrintModal('pdf')" />
    <div v-if="!pending" class="grid gap-4 sm:grid-cols-2">
      <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"><p class="app-supporting-text">Total Balance Amount</p><CurrencyDisplay :value="totalBalance" align="left" bold custom-class="mt-1 text-2xl text-gray-900 dark:text-white" /></div>
      <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"><p class="app-supporting-text">Total Customers</p><p class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{{ items.length }}</p></div>
    </div>
    <SalesFeedback :pending="pending" :error="error ? 'Unable to load customer balances.' : ''" skeleton="table" :skeleton-cols="5" @retry="refresh" />
    <CustomerBalanceRecordsTable v-if="!pending && !error" :items="filteredItems" :search="search" :type="type" :types="types" @update:search="search = $event" @update:type="type = $event" @update:current-page-items="currentPageItems = $event" @view="selected = $event" />
    <CustomerBalanceDetailModal :open="!!selected" :item="selected" @close="selected = null" />
    <DocumentPrintModal :open="print.isPrintModalOpen.value" title="Customer Balance Account Report" :columns="printColumns" :items="filteredItems" :current-page-items="currentPageItems" :default-action="print.defaultPrintAction.value" :show-date-range="false" @close="print.closePrintModal" />
  </div>
</template>
