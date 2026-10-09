<script setup lang="ts">
import type { MoneyTransferView } from '#server/types/money-transfer'
import type { DateRangeValue } from '~/composables/useDateRange'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'

defineProps<{ items: MoneyTransferView[]; search: string; dateRange: DateRangeValue | null }>()
const emit = defineEmits<{
  'update:search': [value: string]
  'update:dateRange': [value: DateRangeValue | null]
  'update:currentPageItems': [value: MoneyTransferView[]]
  view: [item: MoneyTransferView]
  edit: [item: MoneyTransferView]
  delete: [item: MoneyTransferView]
}>()
const columns = [
  { key: 'date', label: 'Date', sortable: true }, { key: 'no', label: 'No Transfer', sortable: true },
  { key: 'fromAccount', label: 'From Account', sortable: true }, { key: 'toAccount', label: 'To Account', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true, align: 'end' as const },
  { key: 'description', label: 'Description' }, { key: 'createdBy', label: 'Created By', sortable: true },
  { key: 'actions', label: 'Action', align: 'center' as const },
]
</script>

<template>
  <SalesDataTable :items="items" :columns="columns" :search="search" search-placeholder="Search transfer..." @update:search="emit('update:search', $event)" @update:current-page-items="emit('update:currentPageItems', $event)">
    <template #filters><DateRangePicker :model-value="dateRange" align="end" @update:model-value="emit('update:dateRange', $event)" /></template>
    <template #cell-no="{ item }"><span class="font-mono font-semibold text-primary">{{ item.no }}</span></template>
    <template #cell-amount="{ item }"><CurrencyDisplay :value="item.amount" bold /></template>
    <template #cell-description="{ item }"><span class="block max-w-64 whitespace-normal">{{ item.description || '-' }}</span></template>
    <template #cell-actions="{ item }">
      <div class="inline-flex items-center justify-center gap-1.5">
        <SalesActionButton action="view" label="View Transfer" @click="emit('view', item)" />
        <SalesActionButton action="edit" label="Edit Transfer" @click="emit('edit', item)" />
        <SalesActionButton action="delete" label="Delete Transfer" @click="emit('delete', item)" />
      </div>
    </template>
    <template #footer="{ items: rows }"><tr><td colspan="4" class="px-4 py-3">Total Transferred Amount</td><td class="px-4 py-3 text-end"><CurrencyDisplay :value="rows.reduce((sum: number, row: MoneyTransferView) => sum + row.amount, 0)" bold /></td><td colspan="3" /></tr></template>
  </SalesDataTable>
</template>

