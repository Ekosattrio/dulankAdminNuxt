<script setup lang="ts">
import type { ExpenseCategory } from '#server/types/expense-category'

const props = defineProps<{ items: ExpenseCategory[]; search: string; status: string }>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:status': [value: string]
  edit: [item: ExpenseCategory]
  delete: [item: ExpenseCategory]
}>()

const columns = [
  { key: 'categoryName', label: 'Category Name', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'actions', label: '', align: 'center' as const },
]
</script>

<template>
  <SalesDataTable :columns="columns" :items="items" :search="search" search-placeholder="Search category..." @update:search="emit('update:search', $event)">
    <template #filters>
      <TableFilterSelect :model-value="status" :options="['Active', 'Deactive']" placeholder="Status" @update:model-value="emit('update:status', $event)" />
    </template>
    <template #cell(categoryName)="{ item }"><span class="font-semibold text-gray-900 dark:text-white">{{ item.categoryName }}</span></template>
    <template #cell(date)="{ item }"><span class="text-gray-500 dark:text-gray-400">{{ item.date }}</span></template>
    <template #cell(status)="{ item }"><SalesStatusBadge :status="item.status" /></template>
    <template #cell(actions)="{ item }"><div class="flex items-center justify-center gap-1.5"><SalesActionButton action="edit" label="Edit Category" @click="emit('edit', item)" /><SalesActionButton action="delete" label="Delete Category" danger @click="emit('delete', item)" /></div></template>
  </SalesDataTable>
</template>