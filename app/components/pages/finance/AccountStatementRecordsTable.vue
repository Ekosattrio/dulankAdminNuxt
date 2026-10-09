<script setup lang="ts">
import type { BankAccountView } from '#server/types/bank-account'
import type { BankStatementRow } from '#server/types/finance-report'
import type { DateRangeValue } from '~/composables/useDateRange'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesStatusBadge from '~/components/sales/SalesStatusBadge.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
defineProps<{ items: BankStatementRow[]; accounts: BankAccountView[]; search: string; accountId: string; dateRange: DateRangeValue | null }>()
const emit = defineEmits<{ 'update:search': [value: string]; 'update:accountId': [value: string]; 'update:dateRange': [value: DateRangeValue | null]; 'update:currentPageItems': [value: BankStatementRow[]] }>()
const columns = [
  { key: 'date', label: 'Date', sortable: true }, { key: 'category', label: 'Category', sortable: true },
  { key: 'description', label: 'Description' }, { key: 'amount', label: 'Amount (IDR)', sortable: true, align: 'end' as const },
  { key: 'transactionType', label: 'Transaction Type', sortable: true, align: 'center' as const },
  { key: 'runningBalance', label: 'Running Balance (IDR)', sortable: true, align: 'end' as const },
]
</script>
<template>
  <SalesDataTable :items="items" :columns="columns" :search="search" search-placeholder="Search transaction..." @update:search="emit('update:search', $event)" @update:current-page-items="emit('update:currentPageItems', $event)">
    <template #filters>
      <TableFilterSelect :model-value="accountId" :options="accounts.map((account) => ({ label: `${account.bankName} - ${account.accountNo}`, value: account.id }))" placeholder="Select Account" @update:model-value="emit('update:accountId', $event)" />
      <DateRangePicker :model-value="dateRange" align="end" @update:model-value="emit('update:dateRange', $event)" />
    </template>
    <template #cell-description="{ item }"><span class="block max-w-96 whitespace-normal">{{ item.description }}</span></template>
    <template #cell-amount="{ item }"><CurrencyDisplay :value="item.amount" bold /></template>
    <template #cell-transactionType="{ item }"><SalesStatusBadge :status="item.transactionType === 'Credit' ? 'Received' : 'Cancelled'" /></template>
    <template #cell-runningBalance="{ item }"><CurrencyDisplay :value="item.runningBalance" bold /></template>
  </SalesDataTable>
</template>

