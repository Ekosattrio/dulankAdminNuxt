<script setup lang="ts">
import type { CalculatorDashboardUser } from '#server/types/calculator-dashboard'

defineProps<{ users: CalculatorDashboardUser[]; search: string; category: string }>()
const emit = defineEmits<{
  'update:search': [value: string]
  'update:category': [value: string]
  'update:currentPageItems': [value: CalculatorDashboardUser[]]
  view: [item: CalculatorDashboardUser]
  edit: [item: CalculatorDashboardUser]
  delete: [item: CalculatorDashboardUser]
}>()

const columns = [
  { key: 'user', label: 'User', sortable: true },
  { key: 'calculate', label: 'Calculate', sortable: true },
  { key: 'request', label: 'Request', sortable: true },
  { key: 'usage', label: 'Usage', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Action', align: 'center' as const },
]
</script>

<template>
  <SalesDataTable
    :items="users"
    :columns="columns"
    :search="search"
    search-placeholder="Search users..."
    @update:search="emit('update:search', $event)"
    @update:current-page-items="emit('update:currentPageItems', $event)"
  >
    <template #filters>
      <TableFilterSelect
        :model-value="category"
        placeholder="Category"
        :options="['Action', 'Another action', 'Something else here', 'Separated link']"
        @update:model-value="emit('update:category', $event)"
      />
    </template>
    <template #cell(user)="{ item }"><span class="font-medium text-gray-900 dark:text-gray-100">{{ item.user }}</span></template>
    <template #cell(calculate)="{ item }"><span class="tabular-nums">{{ item.calculate }}</span></template>
    <template #cell(request)="{ item }"><span class="tabular-nums">{{ item.request }}</span></template>
    <template #cell(usage)="{ item }"><span class="tabular-nums">{{ item.usage }}%</span></template>
    <template #cell(status)="{ item }"><SalesStatusBadge :status="item.status" /></template>
    <template #cell(actions)="{ item }">
      <div class="flex items-center justify-center gap-1.5">
        <SalesActionButton action="view" label="View Stats" @click="emit('view', item)" />
        <SalesActionButton action="edit" label="Edit Record" @click="emit('edit', item)" />
        <SalesActionButton action="delete" label="Delete Record" danger @click="emit('delete', item)" />
      </div>
    </template>
  </SalesDataTable>
</template>
