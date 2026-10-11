<script setup lang="ts">
import type { PurchaseOrder } from '#server/types/purchase-order'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import { formatNumber } from '~/composables/useFormatters'
import EntityIdentity from '~/components/Common/EntityIdentity.vue'
import SalesStatusBadge from '~/components/Sales/SalesStatusBadge.vue'

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

</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="orders"
    :search="searchQuery"
    search-placeholder="Search No PO, supplier, purchase..."
    empty-message="No purchase orders found"
    @update:search="emit('update:searchQuery', $event)"
  >
    <template #filters>
        <TableFilterSelect
          :model-value="filterStatus"
          label="PO Status"
          :options="statusOptions"
          @update:model-value="emit('update:filterStatus', $event)"
        />
        <TableFilterSelect
          :model-value="filterGoodsStatus"
          label="Receiving"
          :options="goodsStatusOptions"
          @update:model-value="emit('update:filterGoodsStatus', $event)"
        />
    </template>
      <template #cell(noPO)="{ item }">
        <span class="font-semibold text-gray-900 dark:text-gray-100">{{ item.noPO }}</span>
      </template>

      <template #cell(supplier)="{ item }">
        <EntityIdentity :name="item.supplier" kind="supplier" />
      </template>

      <template #cell(amount)="{ item }">
        <span class="font-mono text-gray-900 dark:text-gray-100">
          Rp {{ formatNumber(item.amount) }}
        </span>
      </template>

      <template #cell(poStatus)="{ item }">
        <SalesStatusBadge :status="item.poStatus" />
      </template>

      <template #cell(goodsStatus)="{ item }">
        <SalesStatusBadge :status="item.goodsStatus || '-'" />
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
</template>
