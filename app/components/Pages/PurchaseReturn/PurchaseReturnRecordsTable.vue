<script setup lang="ts">
import type { PurchaseReturn } from '#server/types/purchase-return'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import { formatNumber } from '~/composables/useFormatters'

defineProps<{
  returns: PurchaseReturn[]
  searchQuery: string
  filterStatus?: string
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterStatus': [value: string]
  'view': [item: PurchaseReturn]
  'edit': [item: PurchaseReturn]
  'delete': [item: PurchaseReturn]
}>()

const statusOptions = ['Refunded', 'Cancel', 'Ordered', 'Received', 'Pending']

const columns = [
  { key: 'noPR', label: 'No PR', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'created', label: 'Created', sortable: true },
  { key: 'noPurchase', label: 'No Purchase', sortable: true },
  { key: 'supplier', label: 'Supplier', sortable: true },
  { key: 'amount', label: 'Amount (IDR)', sortable: true, align: 'right' as const, class: 'text-right font-medium' },
  { key: 'paid', label: 'Paid (IDR)', sortable: true, align: 'right' as const, class: 'text-right font-medium text-emerald-600' },
  { key: 'due', label: 'Due (IDR)', sortable: true, align: 'right' as const, class: 'text-right font-medium' },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'statusBy', label: 'Status By', sortable: true },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'Refunded':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
    case 'Ordered':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800'
    case 'Pending':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
    case 'Cancel':
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- Toolbar filters -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="relative flex-1 max-w-sm">
        <i data-feather="search" class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"></i>
        <input
          :value="searchQuery"
          type="text"
          placeholder="Search No PR, supplier, purchase..."
          class="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        />
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <TableFilterSelect
          :model-value="filterStatus"
          :options="statusOptions"
          default-label="All Status"
          class="w-36"
          @update:model-value="emit('update:filterStatus', $event)"
        />
      </div>
    </div>

    <!-- Data Table -->
    <SalesDataTable
      :columns="columns"
      :items="returns"
      empty-message="No purchase returns found"
    >
      <template #cell(noPR)="{ item }">
        <span class="font-semibold text-gray-900 dark:text-gray-100">{{ item.noPR }}</span>
      </template>

      <template #cell(supplier)="{ item }">
        <span class="font-medium text-gray-800 dark:text-gray-200">{{ item.supplier }}</span>
      </template>

      <template #cell(amount)="{ item }">
        <span class="font-mono text-gray-900 dark:text-gray-100">
          Rp {{ formatNumber(item.amount) }}
        </span>
      </template>

      <template #cell(paid)="{ item }">
        <span class="font-mono text-emerald-600 dark:text-emerald-400">
          Rp {{ formatNumber(item.paid) }}
        </span>
      </template>

      <template #cell(due)="{ item }">
        <span class="font-mono" :class="item.due > 0 ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-gray-500'">
          Rp {{ formatNumber(item.due) }}
        </span>
      </template>

      <template #cell(status)="{ item }">
        <span
          class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold"
          :class="getStatusBadgeClass(item.status)"
        >
          {{ item.status }}
        </span>
      </template>

      <template #cell(statusBy)="{ item }">
        <span class="text-gray-500 dark:text-gray-400">{{ item.statusBy || '-' }}</span>
      </template>

      <template #cell(actions)="{ item }">
        <div class="flex items-center justify-center gap-1">
          <SalesActionButton icon="eye" label="View Details" @click="emit('view', item)" />
          <SalesActionButton icon="edit" label="Edit Return" @click="emit('edit', item)" />
          <SalesActionButton icon="trash-2" label="Delete Return" @click="emit('delete', item)" />
        </div>
      </template>
    </SalesDataTable>
  </div>
</template>
