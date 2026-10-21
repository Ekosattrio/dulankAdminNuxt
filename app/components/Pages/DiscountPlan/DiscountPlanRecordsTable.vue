<script setup lang="ts">
import type { DiscountPlanMeta, DiscountPlanView } from '#server/types/discount-plan'

const props = defineProps<{ items: DiscountPlanView[]; meta: DiscountPlanMeta; search: string; customerSegmentId: string; status: string }>()
const emit = defineEmits<{
  'update:search': [value: string]
  'update:customerSegmentId': [value: string]
  'update:status': [value: string]
  edit: [item: DiscountPlanView]
  delete: [item: DiscountPlanView]
}>()
const columns = [
  { key: 'name', label: 'Plane Name', sortable: true },
  { key: 'customers', label: 'Customers', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'actions', label: 'Action', align: 'center' as const },
]
const customerOptions = computed(() => props.meta.filterCustomerSegments.map(item => ({ label: item.filterLabel || item.name, value: item.id })))
</script>

<template>
  <SalesDataTable :columns="columns" :items="items" :search="search" search-placeholder="Search..." @update:search="emit('update:search', $event)">
    <template #filters>
      <TableFilterSelect :model-value="customerSegmentId" :options="customerOptions" placeholder="Customer" @update:model-value="emit('update:customerSegmentId', $event)" />
      <TableFilterSelect :model-value="status" :options="['Active', 'Inactive']" placeholder="Status" @update:model-value="emit('update:status', $event)" />
    </template>
    <template #cell(name)="{ item }"><span class="font-semibold text-gray-900 dark:text-white">{{ item.name }}</span></template>
    <template #cell(customers)="{ item }"><span class="text-gray-900 dark:text-gray-100">{{ item.customers }}</span></template>
    <template #cell(status)="{ item }"><SalesStatusBadge :status="item.status" /></template>
    <template #cell(actions)="{ item }"><div class="flex items-center justify-center gap-1.5"><SalesActionButton action="edit" label="Edit Discount Plan" @click="emit('edit', item)" /><SalesActionButton action="delete" label="Delete Discount Plan" danger @click="emit('delete', item)" /></div></template>
  </SalesDataTable>
</template>
