<script setup lang="ts">
import type { CustomerType } from '#server/types/customer-type'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'

defineProps<{
  customerTypes: CustomerType[]
  searchQuery: string
  filterStatus?: string
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterStatus': [value: string]
  'edit': [item: CustomerType]
  'delete': [item: CustomerType]
}>()

const statusOptions = ['Active', 'Inactive']

const columns = [
  { key: 'name', label: 'Customer Type', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="customerTypes"
    :search="searchQuery"
    search-placeholder="Search Customer Type..."
    @update:search="emit('update:searchQuery', $event)"
  >
    <template #filters>
      <TableFilterSelect
        :model-value="filterStatus"
        label="Status"
        :options="statusOptions"
        @update:model-value="emit('update:filterStatus', $event)"
      />
    </template>

    <template #cell(name)="{ item }">
      <span class="font-semibold text-gray-900 dark:text-gray-100">
        {{ item.name }}
      </span>
    </template>

    <template #cell(status)="{ item }">
      <span
        :class="[
          'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold',
          item.status === 'Active'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
            : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
        ]"
      >
        {{ item.status }}
      </span>
    </template>

    <template #cell(actions)="{ item }">
      <div class="flex items-center justify-center gap-1.5">
        <SalesActionButton
          action="edit"
          label="Edit Customer Type"
          @click="emit('edit', item)"
        />
        <SalesActionButton
          action="delete"
          label="Delete Customer Type"
          @click="emit('delete', item)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>
