<script setup lang="ts">
import type { Unit } from '~/types/unit'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import SalesStatusBadge from '~/components/Sales/SalesStatusBadge.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import AppBadge from '~/components/Common/AppBadge.vue'

defineProps<{ units: Unit[]; searchQuery: string; filterStatus: string }>()
const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterStatus': [value: string]
  'add-unit': []
  'edit-unit': [item: Unit]
  'delete-unit': [id: string]
}>()
const columns = [
  { key: 'name', label: 'Unit', sortable: true },
  { key: 'shortName', label: 'Short Name', sortable: true },
  { key: 'itemUsed', label: 'Item Used', sortable: true, align: 'center' as const },
  { key: 'createdOn', label: 'Created On', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'actions', label: 'Action', align: 'center' as const },
]
</script>

<template>
  <SalesDataTable :columns="columns" :items="units" :search="searchQuery" search-placeholder="Search unit name or short name..." @update:search="emit('update:searchQuery', $event)">
    <template #filters><TableFilterSelect :model-value="filterStatus" label="Status" :options="['Active', 'Inactive']" @update:model-value="emit('update:filterStatus', $event)" /></template>
    <template #cell(name)="{ item }"><strong class="text-sm text-gray-900 dark:text-white">{{ item.name }}</strong></template>
    <template #cell(shortName)="{ item }"><span class="font-mono text-sm font-semibold text-primary">{{ item.shortName }}</span></template>
    <template #cell(itemUsed)="{ item }"><AppBadge :label="String(item.itemUsed)" tone="neutral" /></template>
    <template #cell(status)="{ item }"><SalesStatusBadge :status="item.status" /></template>
    <template #cell(actions)="{ item }"><div class="flex justify-center gap-1"><SalesActionButton action="edit" label="Edit Unit" @click="emit('edit-unit', item)" /><SalesActionButton action="delete" danger label="Delete Unit" @click="emit('delete-unit', item.id)" /></div></template>
  </SalesDataTable>
</template>
