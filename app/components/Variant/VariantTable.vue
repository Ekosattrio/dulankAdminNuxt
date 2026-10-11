<script setup lang="ts">
import type { Variant } from '~/types/variant'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import SalesStatusBadge from '~/components/Sales/SalesStatusBadge.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import AppBadge from '~/components/Common/AppBadge.vue'

defineProps<{ variants: Variant[]; searchQuery: string; filterStatus: string }>()
const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterStatus': [value: string]
  'add-variant': []
  'edit-variant': [item: Variant]
  'delete-variant': [id: string]
}>()
const columns = [
  { key: 'name', label: 'Variant / Attribute', sortable: true },
  { key: 'values', label: 'Values' },
  { key: 'itemUsed', label: 'Item Used', sortable: true, align: 'center' as const },
  { key: 'createdOn', label: 'Created On', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'actions', label: 'Action', align: 'center' as const },
]
</script>

<template>
  <SalesDataTable :columns="columns" :items="variants" :search="searchQuery" search-placeholder="Search variant name or values..." @update:search="emit('update:searchQuery', $event)">
    <template #filters><TableFilterSelect :model-value="filterStatus" label="Status" :options="['Active', 'Inactive']" @update:model-value="emit('update:filterStatus', $event)" /></template>
    <template #cell(name)="{ item }"><strong class="text-sm text-gray-900 dark:text-white">{{ item.name }}</strong></template>
    <template #cell(values)="{ item }"><div class="flex max-w-72 flex-wrap gap-1"><AppBadge v-for="value in item.values.split(',')" :key="value" :label="value.trim()" tone="neutral" /></div></template>
    <template #cell(itemUsed)="{ item }"><AppBadge :label="String(item.itemUsed)" tone="neutral" /></template>
    <template #cell(status)="{ item }"><SalesStatusBadge :status="item.status" /></template>
    <template #cell(actions)="{ item }"><div class="flex justify-center gap-1"><SalesActionButton action="edit" label="Edit Variant" @click="emit('edit-variant', item)" /><SalesActionButton action="delete" danger label="Delete Variant" @click="emit('delete-variant', item.id)" /></div></template>
  </SalesDataTable>
</template>
