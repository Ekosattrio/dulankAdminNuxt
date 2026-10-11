<script setup lang="ts">
import type { DiscountItem } from '#server/types/discount'
import { formatMoney } from '~/utils/currency'

const props = defineProps<{
  items: DiscountItem[]
  search: string
  status: string
  plan: string
  planOptions: { label: string; value: string }[]
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:status': [value: string]
  'update:plan': [value: string]
  edit: [item: DiscountItem]
  delete: [item: DiscountItem]
}>()

const columns = [
  { key: 'name', label: 'Discount Name', sortable: true },
  { key: 'plan', label: 'Discount Plan', sortable: true },
  { key: 'value', label: 'Value', sortable: true },
  { key: 'validFrom', label: 'Valid From', sortable: true },
  { key: 'validTill', label: 'Valid Till', sortable: true },
  { key: 'used', label: 'Used', sortable: true, align: 'center' as const },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'actions', label: '', align: 'center' as const },
]

const displayValue = (item: DiscountItem): string =>
  item.type === 'Percentage' ? `${item.value}%` : formatMoney(item.value, { prefix: 'Rp ' })
</script>

<template>
  <SalesDataTable :columns="columns" :items="items" :search="search" search-placeholder="Search discount name..." @update:search="emit('update:search', $event)">
    <template #filters>
      <TableFilterSelect :model-value="plan" :options="planOptions" placeholder="Discount Plan" @update:model-value="emit('update:plan', $event)" />
      <TableFilterSelect :model-value="status" :options="['Active', 'Inactive']" placeholder="Status" @update:model-value="emit('update:status', $event)" />
    </template>
    <template #cell(name)="{ item }"><span class="font-semibold text-gray-900 dark:text-white">{{ item.name }}</span></template>
    <template #cell(plan)="{ item }"><span class="text-gray-600 dark:text-gray-300">{{ item.plan || '—' }}</span></template>
    <template #cell(value)="{ item }"><span class="font-medium text-gray-800 dark:text-gray-200">{{ displayValue(item) }}</span></template>
    <template #cell(validFrom)="{ item }"><span class="text-gray-500 dark:text-gray-400">{{ item.validFrom || '—' }}</span></template>
    <template #cell(validTill)="{ item }"><span class="text-gray-500 dark:text-gray-400">{{ item.validTill || '—' }}</span></template>
    <template #cell(used)="{ item }"><span class="text-gray-500 dark:text-gray-400">{{ item.used }}</span></template>
    <template #cell(status)="{ item }"><SalesStatusBadge :status="item.status" /></template>
    <template #cell(actions)="{ item }"><div class="flex items-center justify-center gap-1.5"><SalesActionButton action="edit" label="Edit Discount" @click="emit('edit', item)" /><SalesActionButton action="delete" label="Delete Discount" danger @click="emit('delete', item)" /></div></template>
  </SalesDataTable>
</template>