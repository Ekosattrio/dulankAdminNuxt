<script setup lang="ts">
import type { PurchaseReturn } from '#server/types/purchase-return'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import { formatNumber } from '~/composables/useFormatters'
import EntityIdentity from '~/components/Common/EntityIdentity.vue'
import SalesStatusBadge from '~/components/Sales/SalesStatusBadge.vue'

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

</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="returns"
    :search="searchQuery"
    search-placeholder="Search No PR, supplier, purchase..."
    empty-message="No purchase returns found"
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
      <template #cell(noPR)="{ item }">
        <span class="font-semibold text-gray-900 dark:text-gray-100">{{ item.noPR }}</span>
      </template>

      <template #cell(supplier)="{ item }">
        <EntityIdentity :name="item.supplier" kind="supplier" />
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
        <SalesStatusBadge :status="item.status" />
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
</template>
