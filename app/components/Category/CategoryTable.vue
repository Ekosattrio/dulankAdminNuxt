<script setup lang="ts">
import type { Category } from '~/types/category'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import SalesStatusBadge from '~/components/Sales/SalesStatusBadge.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'

defineProps<{ categories: Category[]; searchQuery: string; filterStatus: string }>()
const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterStatus': [value: string]
  'add-category': []
  'edit-category': [item: Category]
  'delete-category': [id: string]
}>()
const columns = [
  { key: 'name', label: 'Category Name', sortable: true },
  { key: 'code', label: 'Category Code', sortable: true },
  { key: 'createdBy', label: 'Created By', sortable: true },
  { key: 'createdDate', label: 'Created Date', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'actions', label: 'Action', align: 'center' as const },
]
</script>

<template>
  <SalesDataTable :columns="columns" :items="categories" :search="searchQuery" search-placeholder="Search category name or code..." @update:search="emit('update:searchQuery', $event)">
    <template #filters><TableFilterSelect :model-value="filterStatus" label="Status" :options="['Active', 'Inactive']" @update:model-value="emit('update:filterStatus', $event)" /></template>
    <template #cell(name)="{ item }"><strong class="text-sm text-gray-900 dark:text-white">{{ item.name }}</strong></template>
    <template #cell(code)="{ item }"><span class="font-mono text-sm font-semibold text-primary">{{ item.code }}</span></template>
    <template #cell(createdBy)="{ item }">{{ item.createdBy || 'Admin' }}</template>
    <template #cell(status)="{ item }"><SalesStatusBadge :status="item.status" /></template>
    <template #cell(actions)="{ item }"><div class="flex justify-center gap-1"><SalesActionButton action="edit" label="Edit Category" @click="emit('edit-category', item)" /><SalesActionButton action="delete" danger label="Delete Category" @click="emit('delete-category', item.id)" /></div></template>
  </SalesDataTable>
</template>
