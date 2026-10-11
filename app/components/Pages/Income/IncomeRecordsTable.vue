<script setup lang="ts">
import type { IncomeRecord } from '#server/types/income'
import { formatMoney } from '~/utils/currency'

const props = defineProps<{
  items: IncomeRecord[]
  search: string
  category: string
  categoryOptions: { label: string; value: string }[]
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:category': [value: string]
  edit: [item: IncomeRecord]
  delete: [item: IncomeRecord]
}>()

const columns = [
  { key: 'no', label: 'No Income', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'name', label: 'Income', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'amount', label: 'Amount (IDR)', sortable: true, align: 'right' as const },
  { key: 'paymentMethod', label: 'Method', sortable: true },
  { key: 'bankAccount', label: 'Bank Account', sortable: true },
  { key: 'actions', label: '', align: 'center' as const },
]
</script>

<template>
  <SalesDataTable :columns="columns" :items="items" :search="search" search-placeholder="Search no, name..." @update:search="emit('update:search', $event)">
    <template #filters>
      <TableFilterSelect :model-value="category" :options="categoryOptions" placeholder="Category" @update:model-value="emit('update:category', $event)" />
    </template>
    <template #cell(no)="{ item }"><span class="font-semibold text-primary">{{ item.no }}</span></template>
    <template #cell(name)="{ item }"><span class="font-medium text-gray-900 dark:text-white">{{ item.name }}</span></template>
    <template #cell(category)="{ item }"><span class="text-gray-600 dark:text-gray-300">{{ item.category }}</span></template>
    <template #cell(amount)="{ item }"><span class="font-medium text-emerald-700 dark:text-emerald-400">{{ formatMoney(item.amount, { prefix: 'Rp ' }) }}</span></template>
    <template #cell(paymentMethod)="{ item }"><span class="text-gray-500 dark:text-gray-400">{{ item.paymentMethod ?? '—' }}</span></template>
    <template #cell(bankAccount)="{ item }"><span class="text-gray-500 dark:text-gray-400">{{ item.bankAccount ?? '—' }}</span></template>
    <template #cell(actions)="{ item }"><div class="flex items-center justify-center gap-1.5"><SalesActionButton action="edit" label="Edit Income" @click="emit('edit', item)" /><SalesActionButton action="delete" label="Delete Income" danger @click="emit('delete', item)" /></div></template>
  </SalesDataTable>
</template>