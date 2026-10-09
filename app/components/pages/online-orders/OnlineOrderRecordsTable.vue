<script setup lang="ts">
import type { OnlineOrder } from '#server/types/online-order'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesStatusBadge from '~/components/sales/SalesStatusBadge.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import { formatNumber } from '~/composables/useFormatters'

const props = defineProps<{
  orders: OnlineOrder[]
  searchQuery: string
  filterStatus: string
  filterPaymentStatus: string
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void
  (e: 'update:filterStatus', val: string): void
  (e: 'update:filterPaymentStatus', val: string): void
  (e: 'view', order: OnlineOrder): void
  (e: 'pay', order: OnlineOrder): void
  (e: 'delete', order: OnlineOrder): void
}>()

const columns = [
  { key: 'customer', label: 'Customer' },
  { key: 'reference', label: 'Reference' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status' },
  { key: 'grandTotal', label: 'Grand Total', align: 'right' as const },
  { key: 'paid', label: 'Paid', align: 'right' as const },
  { key: 'due', label: 'Due', align: 'right' as const },
  { key: 'paymentStatus', label: 'Payment Status' },
  { key: 'biller', label: 'Biller' },
  { key: 'actions', label: 'Action', align: 'center' as const, sortable: false },
]

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'Complete', label: 'Complete' },
  { value: 'Pending', label: 'Pending' },
]

const paymentOptions = [
  { value: '', label: 'All Payment' },
  { value: 'Paid', label: 'Paid' },
  { value: 'Unpaid', label: 'Unpaid' },
]
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :rows="orders"
    :search-query="searchQuery"
    search-placeholder="Search reference, customer, biller..."
    @update:search-query="emit('update:searchQuery', $event)"
  >
    <template #filters>
      <TableFilterSelect
        :model-value="filterStatus"
        :options="statusOptions"
        @update:model-value="emit('update:filterStatus', $event)"
      />
      <TableFilterSelect
        :model-value="filterPaymentStatus"
        :options="paymentOptions"
        @update:model-value="emit('update:filterPaymentStatus', $event)"
      />
    </template>

    <template #cell-customer="{ row }">
      <div class="flex items-center gap-2.5">
        <img
          :src="row.avatar || '/assets/img/customer/customer1.jpg'"
          alt="Avatar"
          class="h-8 w-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
        />
        <div>
          <span class="font-semibold text-gray-900 dark:text-white">{{ row.customer }}</span>
          <span v-if="row.channel" class="block text-xs text-gray-400">{{ row.channel }}</span>
        </div>
      </div>
    </template>

    <template #cell-reference="{ row }">
      <span class="font-medium text-primary">{{ row.reference }}</span>
    </template>

    <template #cell-status="{ row }">
      <SalesStatusBadge :status="row.status" />
    </template>

    <template #cell-grandTotal="{ row }">
      <span class="font-bold tabular-nums text-gray-900 dark:text-white">Rp {{ formatNumber(row.grandTotal) }}</span>
    </template>

    <template #cell-paid="{ row }">
      <span class="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">Rp {{ formatNumber(row.paid) }}</span>
    </template>

    <template #cell-due="{ row }">
      <span
        class="font-semibold tabular-nums"
        :class="row.due > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-400'"
      >
        Rp {{ formatNumber(row.due) }}
      </span>
    </template>

    <template #cell-paymentStatus="{ row }">
      <SalesStatusBadge :status="row.paymentStatus" />
    </template>

    <template #cell-biller="{ row }">
      <span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
        {{ row.biller }}
      </span>
    </template>

    <template #cell-actions="{ row }">
      <div class="flex items-center justify-center gap-1.5">
        <SalesActionButton
          action="view"
          label="View Order Detail"
          @click="emit('view', row)"
        />
        <button
          v-if="row.due > 0"
          type="button"
          class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-emerald-600 hover:bg-emerald-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-emerald-950/40"
          title="Create Payment"
          @click="emit('pay', row)"
        >
          <i class="feather-credit-card text-xs"></i>
        </button>
        <NuxtLink
          :to="'/sales-receipt?id=' + row.reference"
          class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-blue-600 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-blue-950/40"
          title="Print Receipt"
        >
          <i class="feather-printer text-xs"></i>
        </NuxtLink>
        <SalesActionButton
          action="delete"
          label="Delete Order"
          @click="emit('delete', row)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>

