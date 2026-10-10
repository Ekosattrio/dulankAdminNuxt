<script setup lang="ts">
import type { PurchaseOrder } from '#server/types/purchase-order'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import { formatNumber } from '~/composables/useFormatters'

defineProps<{
  orders: PurchaseOrder[]
  searchQuery: string
  filterStatus?: string
  filterGoodsStatus?: string
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterStatus': [value: string]
  'update:filterGoodsStatus': [value: string]
  'view': [order: PurchaseOrder]
  'edit': [order: PurchaseOrder]
  'delete': [order: PurchaseOrder]
}>()

const statusOptions = ['Sent', 'Draft', 'Cancel']
const goodsStatusOptions = ['Complete', 'Scheduled', 'Pending', 'Cancel']

const columns = [
  { key: 'noPO', label: 'No PO', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'created', label: 'Created', sortable: true },
  { key: 'noPurchase', label: 'No Purchase', sortable: true },
  { key: 'supplier', label: 'Supplier', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true, align: 'right' as const, class: 'text-right font-medium' },
  { key: 'poStatus', label: 'PO Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'goodsStatus', label: 'Goods Receiving Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'goodsDate', label: 'Goods Receiving Date', sortable: true },
  { key: 'goodsBy', label: 'Goods Receiving By', sortable: true },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]

function getPoStatusBadgeClass(status: string) {
  switch (status) {
    case 'Sent':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
    case 'Draft':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800'
    case 'Cancel':
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
  }
}

function getGoodsBadgeClass(status: string) {
  switch (status) {
    case 'Complete':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
    case 'Scheduled':
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
          placeholder="Search No PO, supplier, purchase..."
          class="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
        />
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <TableFilterSelect
          :model-value="filterStatus"
          :options="statusOptions"
          default-label="All PO Status"
          class="w-36"
          @update:model-value="emit('update:filterStatus', $event)"
        />
        <TableFilterSelect
          :model-value="filterGoodsStatus"
          :options="goodsStatusOptions"
          default-label="All Receiving"
          class="w-40"
          @update:model-value="emit('update:filterGoodsStatus', $event)"
        />
      </div>
    </div>

    <!-- Data Table -->
    <SalesDataTable
      :columns="columns"
      :items="orders"
      empty-message="No purchase orders found"
    >
      <template #cell(noPO)="{ item }">
        <span class="font-semibold text-gray-900 dark:text-gray-100">{{ item.noPO }}</span>
      </template>

      <template #cell(supplier)="{ item }">
        <span class="font-medium text-gray-800 dark:text-gray-200">{{ item.supplier }}</span>
      </template>

      <template #cell(amount)="{ item }">
        <span class="font-mono text-gray-900 dark:text-gray-100">
          Rp {{ formatNumber(item.amount) }}
        </span>
      </template>

      <template #cell(poStatus)="{ item }">
        <span
          class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold"
          :class="getPoStatusBadgeClass(item.poStatus)"
        >
          {{ item.poStatus }}
        </span>
      </template>

      <template #cell(goodsStatus)="{ item }">
        <span
          class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold"
          :class="getGoodsBadgeClass(item.goodsStatus)"
        >
          {{ item.goodsStatus || '-' }}
        </span>
      </template>

      <template #cell(goodsDate)="{ item }">
        <span class="text-gray-500 dark:text-gray-400">{{ item.goodsDate || '-' }}</span>
      </template>

      <template #cell(goodsBy)="{ item }">
        <span class="text-gray-500 dark:text-gray-400">{{ item.goodsBy || '-' }}</span>
      </template>

      <template #cell(actions)="{ item }">
        <div class="flex items-center justify-center gap-1">
          <SalesActionButton icon="eye" label="View PO Details" @click="emit('view', item)" />
          <SalesActionButton icon="edit" label="Edit PO" @click="emit('edit', item)" />
          <SalesActionButton icon="trash-2" label="Delete PO" @click="emit('delete', item)" />
        </div>
      </template>
    </SalesDataTable>
  </div>
</template>
