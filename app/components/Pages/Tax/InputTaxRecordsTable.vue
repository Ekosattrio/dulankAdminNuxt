<script setup lang="ts">
import type { InputTaxView } from '#server/types/tax-document'
import type { DateRangeValue } from '~/composables/useDateRange'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'
import DateRangePicker from '~/components/Common/DateRangePicker.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesStatusBadge from '~/components/Sales/SalesStatusBadge.vue'
defineProps<{ items: InputTaxView[]; search: string; credited: string; dateRange: DateRangeValue | null }>()
const emit = defineEmits<{ 'update:search': [value: string]; 'update:credited': [value: string]; 'update:dateRange': [value: DateRangeValue | null]; 'update:currentPageItems': [value: InputTaxView[]]; edit: [item: InputTaxView] }>()
const columns = [
  { key: 'purchaseNo', label: 'No. Purchase', sortable: true }, { key: 'invoiceDate', label: 'Date e-tax Invoice', sortable: true },
  { key: 'fakturNo', label: 'Supplier Faktur No.', sortable: true }, { key: 'supplierName', label: 'Supplier Name', sortable: true },
  { key: 'dpp', label: 'Other Tax Base / DPP', sortable: true, align: 'end' as const }, { key: 'vat', label: 'VAT - Input Tax', sortable: true, align: 'end' as const },
  { key: 'credited', label: 'Credited', align: 'center' as const }, { key: 'actions', label: 'Action', align: 'center' as const },
]
</script>
<template>
  <SalesDataTable :items="items" :columns="columns" :search="search" search-placeholder="Search purchase, faktur, supplier..." @update:search="emit('update:search', $event)" @update:current-page-items="emit('update:currentPageItems', $event)">
    <template #filters><DateRangePicker :model-value="dateRange" @update:model-value="emit('update:dateRange', $event)" /><TableFilterSelect :model-value="credited" :options="['Yes', 'No']" placeholder="All Credited" @update:model-value="emit('update:credited', $event)" /></template>
    <template #cell-purchaseNo="{ item }"><span class="font-mono font-semibold text-primary">{{ item.purchaseNo }}</span></template>
    <template #cell-dpp="{ item }"><CurrencyDisplay :value="item.dpp" /></template><template #cell-vat="{ item }"><CurrencyDisplay :value="item.vat" bold /></template>
    <template #cell-credited="{ item }"><SalesStatusBadge :status="item.credited === 'Yes' ? 'Active' : 'Inactive'" /></template>
    <template #cell-actions="{ item }"><SalesActionButton action="edit" label="Edit Input Tax" @click="emit('edit', item)" /></template>
  </SalesDataTable>
</template>

