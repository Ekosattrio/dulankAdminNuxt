<script setup lang="ts">
import type { CustomerBalanceRow } from '#server/types/finance-report'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
defineProps<{ items: CustomerBalanceRow[]; search: string; type: string; types: string[] }>()
const emit = defineEmits<{ 'update:search': [value: string]; 'update:type': [value: string]; 'update:currentPageItems': [value: CustomerBalanceRow[]]; view: [item: CustomerBalanceRow] }>()
const columns = [
  { key: 'customerId', label: 'Customer ID', sortable: true }, { key: 'name', label: 'Name', sortable: true },
  { key: 'type', label: 'Customer Type', sortable: true }, { key: 'balance', label: 'Balance Amount (IDR)', sortable: true, align: 'end' as const },
  { key: 'actions', label: 'Action', align: 'center' as const },
]
</script>
<template>
  <SalesDataTable :items="items" :columns="columns" :search="search" search-placeholder="Search customer..." @update:search="emit('update:search', $event)" @update:current-page-items="emit('update:currentPageItems', $event)">
    <template #filters><TableFilterSelect :model-value="type" :options="types" placeholder="All Customer Types" @update:model-value="emit('update:type', $event)" /></template>
    <template #cell-customerId="{ item }"><span class="font-mono font-semibold text-primary">{{ item.customerId }}</span></template>
    <template #cell-balance="{ item }"><CurrencyDisplay :value="item.balance" bold /></template>
    <template #cell-actions="{ item }"><SalesActionButton action="view" label="View Balance Details" @click="emit('view', item)" /></template>
  </SalesDataTable>
</template>

