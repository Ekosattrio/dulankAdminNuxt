<script setup lang="ts">
import type { PurchaseCategory } from '#server/types/purchase-category'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'

defineProps<{
  categories: PurchaseCategory[]
  searchQuery: string
  filterStatus?: string
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterStatus': [value: string]
  'edit': [category: PurchaseCategory]
  'delete': [category: PurchaseCategory]
}>()

const statusOptions = ['Active', 'Deactive']

const columns = [
  { key: 'name', label: 'Category Name', sortable: true },
  { key: 'itemCount', label: 'Total Items', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'created', label: 'Created', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]

function getStatusBadgeClass(status: string) {
  if (status === 'Active') {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
  }
  return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
}
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="categories"
    :search="searchQuery"
    search-placeholder="Search purchase category..."
    @update:search="emit('update:searchQuery', $event)"
  >
    <template #filters>
      <!-- Status Filter -->
      <TableFilterSelect
        :model-value="filterStatus"
        label="Status"
        :options="statusOptions"
        @update:model-value="emit('update:filterStatus', $event)"
      />
    </template>

    <!-- Category Name -->
    <template #cell(name)="{ item }">
      <div class="flex items-center gap-2">
        <span class="font-semibold text-gray-900 dark:text-gray-100">
          {{ item.name }}
        </span>
        <span class="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-mono text-gray-500 dark:bg-gray-800 dark:text-gray-400">
          {{ item.id }}
        </span>
      </div>
    </template>

    <!-- Total Items -->
    <template #cell(itemCount)="{ item }">
      <span class="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary/10 px-2 text-xs font-bold text-primary dark:bg-primary/20 dark:text-primary-300">
        {{ item.itemCount ?? 0 }}
      </span>
    </template>

    <!-- Created -->
    <template #cell(created)="{ item }">
      <span class="text-xs text-gray-500 dark:text-gray-400">
        {{ item.created || '-' }}
      </span>
    </template>

    <!-- Status -->
    <template #cell(status)="{ item }">
      <span
        class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium"
        :class="getStatusBadgeClass(item.status)"
      >
        {{ item.status }}
      </span>
    </template>

    <!-- Actions -->
    <template #cell(actions)="{ item }">
      <div class="flex items-center justify-center gap-1">
        <SalesActionButton
          icon="edit-2"
          label="Edit"
          variant="ghost"
          @click="emit('edit', item)"
        />
        <SalesActionButton
          icon="trash-2"
          label="Delete"
          variant="danger"
          @click="emit('delete', item)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>
