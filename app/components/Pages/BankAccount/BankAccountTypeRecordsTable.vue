<script setup lang="ts">
import type { BankAccountTypeView } from '#server/types/bank-account'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesStatusBadge from '~/components/Sales/SalesStatusBadge.vue'

defineProps<{ items: BankAccountTypeView[]; search: string; status: string }>()
const emit = defineEmits<{
  'update:search': [value: string]
  'update:status': [value: string]
  'update:currentPageItems': [value: BankAccountTypeView[]]
  edit: [item: BankAccountTypeView]
  delete: [item: BankAccountTypeView]
}>()
const columns = [
  { key: 'name', label: 'Type', sortable: true },
  { key: 'createdDate', label: 'Create Date', sortable: true },
  { key: 'accountCount', label: 'Accounts', sortable: true, align: 'center' as const },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'actions', label: 'Action', align: 'center' as const },
]
</script>

<template>
  <SalesDataTable
    :items="items"
    :columns="columns"
    :search="search"
    search-placeholder="Search account type..."
    @update:search="emit('update:search', $event)"
    @update:current-page-items="emit('update:currentPageItems', $event)"
  >
    <template #filters>
      <TableFilterSelect :model-value="status" :options="['Active', 'Inactive']" placeholder="All Statuses" @update:model-value="emit('update:status', $event)" />
    </template>
    <template #cell-name="{ item }"><span class="font-semibold text-gray-900 dark:text-white">{{ item.name }}</span></template>
    <template #cell-accountCount="{ item }"><span class="tabular-nums">{{ item.accountCount }}</span></template>
    <template #cell-status="{ item }"><SalesStatusBadge :status="item.status" /></template>
    <template #cell-actions="{ item }">
      <div class="inline-flex items-center justify-center gap-1.5">
        <SalesActionButton action="edit" label="Edit Account Type" @click="emit('edit', item)" />
        <SalesActionButton action="delete" label="Delete Account Type" :disabled="item.accountCount > 0" @click="emit('delete', item)" />
      </div>
    </template>
  </SalesDataTable>
</template>

