<script setup lang="ts">
import type { Supplier } from '#server/types/supplier'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import EntityIdentity from '~/components/Common/EntityIdentity.vue'
import SalesStatusBadge from '~/components/Sales/SalesStatusBadge.vue'

defineProps<{
  suppliers: Supplier[]
  searchQuery: string
  filterStatus?: string
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterStatus': [value: string]
  'add-address': [supplier: Supplier]
  'edit': [supplier: Supplier]
  'delete': [supplier: Supplier]
}>()

const statusOptions = ['Active', 'Inactive']

const columns = [
  { key: 'supplierId', label: 'ID Supplier', sortable: true },
  { key: 'name', label: 'Supplier Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'contact', label: 'Contact', sortable: true },
  { key: 'picName', label: 'PIC Name', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="suppliers"
    :search="searchQuery"
    search-placeholder="Search Supplier Name, Email, Contact..."
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

    <template #cell(supplierId)="{ item }">
      <span class="font-semibold text-primary dark:text-primary-400">
        {{ item.supplierId || item.id }}
      </span>
    </template>

    <template #cell(name)="{ item }">
      <EntityIdentity :name="item.name" :subtitle="item.picName" kind="supplier" />
    </template>

    <template #cell(email)="{ item }">
      <span class="text-gray-600 dark:text-gray-300">{{ item.email || '-' }}</span>
    </template>

    <template #cell(contact)="{ item }">
      <span class="text-gray-600 dark:text-gray-300">{{ item.contact || '-' }}</span>
    </template>

    <template #cell(picName)="{ item }">
      <span class="text-gray-700 dark:text-gray-300">{{ item.picName || '-' }}</span>
    </template>

    <template #cell(status)="{ item }">
      <SalesStatusBadge :status="item.status" />
    </template>

    <template #cell(date)="{ item }">
      <span class="text-gray-500 dark:text-gray-400 text-[11px]">{{ item.date || '-' }}</span>
    </template>

    <template #cell(actions)="{ item }">
      <div class="flex items-center justify-center gap-1.5">
        <button
          type="button"
          class="inline-flex items-center gap-1 rounded border border-primary/30 bg-primary/5 px-2 py-1 text-[11px] font-medium text-primary hover:bg-primary/10 transition-colors"
          title="Add Address"
          @click="emit('add-address', item)"
        >
          <FeatherIcon name="plus" size="12" />
          <span>Address</span>
        </button>
        <SalesActionButton
          icon="edit"
          tooltip="Edit Supplier"
          @click="emit('edit', item)"
        />
        <SalesActionButton
          icon="trash-2"
          tooltip="Delete Supplier"
          danger
          @click="emit('delete', item)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>
