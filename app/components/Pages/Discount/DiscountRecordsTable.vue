<script setup lang="ts">
import type { DiscountItem } from '#server/types/discount'

const props = defineProps<{
  items: DiscountItem[]
  search: string
  status: string
  plan: string
  customer?: string
  planOptions: { label: string; value: string }[]
  customerOptions?: { label: string; value: string }[]
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:status': [value: string]
  'update:plan': [value: string]
  'update:customer': [value: string]
  edit: [item: DiscountItem]
  delete: [item: DiscountItem]
}>()

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'value', label: 'Value', sortable: true },
  { key: 'plan', label: 'Discount Plan', sortable: true },
  { key: 'validity', label: 'Validity', sortable: true },
  { key: 'days', label: 'Days', sortable: true },
  { key: 'products', label: 'Products', sortable: true },
  { key: 'used', label: 'Used', sortable: true, align: 'center' as const },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'actions', label: 'Action', align: 'center' as const },
]

const formatValue = (item: DiscountItem): string =>
  `${item.value} (${item.type === 'Percentage' ? 'Percentage' : 'Flat'})`

const defaultCustomerOptions = [
  { label: 'All Customer', value: 'All Customer' },
  { label: 'Members Only', value: 'Members Only' },
  { label: 'High-Spending Customers', value: 'High-Spending Customers' },
  { label: 'Online Customers', value: 'Online Customers' }
]
</script>

<template>
  <SalesDataTable :columns="columns" :items="items" :search="search" search-placeholder="Search..." @update:search="emit('update:search', $event)">
    <template #filters>
      <TableFilterSelect :model-value="customer || ''" :options="customerOptions || defaultCustomerOptions" placeholder="Customer" @update:model-value="emit('update:customer', $event)" />
      <TableFilterSelect :model-value="status" :options="['Active', 'Inactive']" placeholder="Status" @update:model-value="emit('update:status', $event)" />
    </template>
    <template #cell(name)="{ item }"><span class="font-semibold text-gray-900 dark:text-white">{{ item.name }}</span></template>
    <template #cell(value)="{ item }"><span class="font-medium text-gray-800 dark:text-gray-200">{{ formatValue(item) }}</span></template>
    <template #cell(plan)="{ item }"><span class="text-gray-600 dark:text-gray-300">{{ item.plan || '—' }}</span></template>
    <template #cell(validity)="{ item }"><span class="text-gray-600 dark:text-gray-300">{{ item.validity || '—' }}</span></template>
    <template #cell(days)="{ item }"><span class="text-gray-600 dark:text-gray-300">{{ item.days || '—' }}</span></template>
    <template #cell(products)="{ item }"><span class="text-gray-600 dark:text-gray-300">{{ item.products || '—' }}</span></template>
    <template #cell(used)="{ item }"><span class="text-gray-500 dark:text-gray-400">{{ item.used }}</span></template>
    <template #cell(status)="{ item }"><SalesStatusBadge :status="item.status" /></template>
    <template #cell(actions)="{ item }">
      <div class="flex items-center justify-center gap-1.5">
        <SalesActionButton action="edit" label="Edit Discount" @click="emit('edit', item)" />
        <SalesActionButton action="delete" label="Delete Discount" danger @click="emit('delete', item)" />
      </div>
    </template>
  </SalesDataTable>
</template>