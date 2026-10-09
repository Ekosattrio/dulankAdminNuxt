<script setup lang="ts">
import type { Store } from '#server/types/store'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'

defineProps<{
  stores: Store[]
  searchQuery: string
  filterStatus?: string
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterStatus': [value: string]
  'edit': [store: Store]
  'delete': [store: Store]
}>()

const statusOptions = ['Active', 'Inactive']

const columns = [
  { key: 'storeName', label: 'Store Name', sortable: true },
  { key: 'userName', label: 'Manager / User', sortable: true },
  { key: 'address', label: 'Address', sortable: true },
  { key: 'phone', label: 'Phone', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="stores"
    :search="searchQuery"
    search-placeholder="Search Store Name, Manager, Address, Email..."
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

    <template #cell(storeName)="{ item }">
      <div class="font-semibold text-gray-900 dark:text-gray-100">
        {{ item.storeName }}
      </div>
    </template>

    <template #cell(userName)="{ item }">
      <span class="inline-flex items-center gap-1.5 font-medium text-gray-700 dark:text-gray-300">
        <span class="h-2 w-2 rounded-full bg-primary/60" />
        {{ item.userName }}
      </span>
    </template>

    <template #cell(address)="{ item }">
      <span class="text-xs text-gray-600 dark:text-gray-300 line-clamp-1" :title="item.address">
        {{ item.address || '-' }}
      </span>
    </template>

    <template #cell(phone)="{ item }">
      <span class="text-xs text-gray-600 dark:text-gray-300">{{ item.phone || '-' }}</span>
    </template>

    <template #cell(email)="{ item }">
      <span class="text-xs text-gray-600 dark:text-gray-300">{{ item.email || '-' }}</span>
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
          label="Edit Store"
          @click="emit('edit', item)"
        />
        <SalesActionButton
          action="delete"
          label="Delete Store"
          @click="emit('delete', item)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>
