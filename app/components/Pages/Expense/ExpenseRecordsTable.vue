<script setup lang="ts">
import type { Expense } from '#server/types/expense'
import { formatMoney } from '~/utils/currency'

const props = defineProps<{
  items: Expense[]
  search: string
  status: string
  category: string
  categoryOptions: { label: string; value: string }[]
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:status': [value: string]
  'update:category': [value: string]
  edit: [item: Expense]
  delete: [item: Expense]
}>()

const columns = [
  { key: 'noExpense', label: 'No Expense', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'name', label: 'Expense', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'amount', label: 'Amount (IDR)', sortable: true, align: 'right' as const },
  { key: 'paid', label: 'Paid (IDR)', sortable: true, align: 'right' as const },
  { key: 'due', label: 'Due (IDR)', sortable: true, align: 'right' as const },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'actions', label: '', align: 'center' as const },
]
</script>

<template>
  <SalesDataTable :columns="columns" :items="items" :search="search" search-placeholder="Search no, name, description..." @update:search="emit('update:search', $event)">
    <template #filters>
      <TableFilterSelect :model-value="category" :options="categoryOptions" placeholder="Category" @update:model-value="emit('update:category', $event)" />
      <TableFilterSelect :model-value="status" :options="['Paid', 'Partial', 'Unpaid', 'Canceled']" placeholder="Status" @update:model-value="emit('update:status', $event)" />
    </template>
    <template #cell(noExpense)="{ item }"><span class="font-semibold text-primary">{{ item.noExpense }}</span></template>
    <template #cell(name)="{ item }"><span class="font-medium text-gray-900 dark:text-white">{{ item.name }}</span></template>
    <template #cell(category)="{ item }"><span class="text-gray-600 dark:text-gray-300">{{ item.category }}</span></template>
    <template #cell(amount)="{ item }"><span class="font-medium text-gray-800 dark:text-gray-200">{{ formatMoney(item.amount, { prefix: 'Rp ' }) }}</span></template>
    <template #cell(paid)="{ item }"><span class="text-gray-600 dark:text-gray-300">{{ formatMoney(item.paid, { prefix: 'Rp ' }) }}</span></template>
    <template #cell(due)="{ item }"><span class="text-gray-600 dark:text-gray-300">{{ formatMoney(item.due, { prefix: 'Rp ' }) }}</span></template>
    <template #cell(status)="{ item }"><SalesStatusBadge :status="item.status" /></template>
    <template #cell(actions)="{ item }"><div class="flex items-center justify-center gap-1.5"><SalesActionButton action="edit" label="Edit Expense" @click="emit('edit', item)" /><SalesActionButton action="delete" label="Delete Expense" danger @click="emit('delete', item)" /></div></template>
  </SalesDataTable>
</template>