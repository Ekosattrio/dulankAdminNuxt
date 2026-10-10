<script setup lang="ts">
import type { OutputTaxView } from '#server/types/tax-document'
import type { DateRangeValue } from '~/composables/useDateRange'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'
import DateRangePicker from '~/components/Common/DateRangePicker.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesStatusBadge from '~/components/Sales/SalesStatusBadge.vue'
defineProps<{ items: OutputTaxView[]; search: string; txCode: string; txCodes: string[]; dateRange: DateRangeValue | null }>()
const emit = defineEmits<{ 'update:search': [value: string]; 'update:txCode': [value: string]; 'update:dateRange': [value: DateRangeValue | null]; 'update:currentPageItems': [value: OutputTaxView[]]; edit: [item: OutputTaxView]; delete: [item: OutputTaxView] }>()
const columns = [
  { key: 'salesNo', label: 'No Sales', sortable: true }, { key: 'etaxDate', label: 'E-Tax Date', sortable: true }, { key: 'etaxNumber', label: 'E-tax Invoice Number', sortable: true },
  { key: 'customerName', label: 'Customer Name', sortable: true }, { key: 'dpp', label: 'Other Tax Base / DPP', align: 'end' as const }, { key: 'vat', label: 'VAT - Output Tax', align: 'end' as const },
  { key: 'txCode', label: 'Transaction Code' }, { key: 'total', label: 'Total', align: 'end' as const }, { key: 'status', label: 'Status', align: 'center' as const }, { key: 'actions', label: 'Action', align: 'center' as const },
]
</script>
<template>
  <SalesDataTable :items="items" :columns="columns" :search="search" search-placeholder="Search sales, e-tax, customer..." @update:search="emit('update:search', $event)" @update:current-page-items="emit('update:currentPageItems', $event)">
    <template #filters><DateRangePicker :model-value="dateRange" @update:model-value="emit('update:dateRange', $event)" /><TableFilterSelect :model-value="txCode" :options="txCodes" placeholder="All Transaction Codes" @update:model-value="emit('update:txCode', $event)" /></template>
    <template #cell-salesNo="{ item }"><span class="font-mono font-semibold text-primary">{{ item.salesNo }}</span></template><template #cell-etaxNumber="{ item }"><span class="font-mono">{{ item.etaxNumber }}</span></template>
    <template #cell-dpp="{ item }"><CurrencyDisplay :value="item.dpp" /></template><template #cell-vat="{ item }"><CurrencyDisplay :value="item.vat" /></template><template #cell-total="{ item }"><CurrencyDisplay :value="item.total" bold /></template>
    <template #cell-txCode="{ item }"><span class="block max-w-64 whitespace-normal">{{ item.txCode }}</span></template><template #cell-status="{ item }"><SalesStatusBadge :status="item.status" /></template>
    <template #cell-actions="{ item }"><div class="inline-flex gap-1.5"><SalesActionButton action="edit" label="Edit Output Tax" @click="emit('edit', item)" /><SalesActionButton action="delete" label="Delete Output Tax" @click="emit('delete', item)" /></div></template>
  </SalesDataTable>
</template>

