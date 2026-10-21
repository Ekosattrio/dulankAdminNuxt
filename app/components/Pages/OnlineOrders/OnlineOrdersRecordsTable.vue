<script setup lang="ts">
import type { OnlineOrderItem } from '#server/types/online-order'
import { formatNumber } from '~/composables/useFormatters'

const props = defineProps<{
  orders: OnlineOrderItem[]
  searchQuery: string
  filterStatus: string
  filterPayment: string
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterStatus': [value: string]
  'update:filterPayment': [value: string]
  view: [order: OnlineOrderItem]
  pay: [order: OnlineOrderItem]
  delete: [order: OnlineOrderItem]
}>()

const columns = [
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'reference', label: 'Reference', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'grandTotal', label: 'Grand Total', sortable: true, align: 'right' as const },
  { key: 'paid', label: 'Paid', sortable: true, align: 'right' as const },
  { key: 'due', label: 'Due', sortable: true, align: 'right' as const },
  { key: 'paymentStatus', label: 'Payment Status', sortable: true, align: 'center' as const },
  { key: 'biller', label: 'Biller', sortable: true },
  { key: 'actions', label: 'Action', align: 'center' as const },
]
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="orders"
    :search="searchQuery"
    search-placeholder="Search reference, customer..."
    @update:search="emit('update:searchQuery', $event)"
  >
    <template #filters>
      <TableFilterSelect
        :model-value="filterStatus"
        :options="['Complete', 'Pending']"
        placeholder="Status"
        @update:model-value="emit('update:filterStatus', $event)"
      />
      <TableFilterSelect
        :model-value="filterPayment"
        :options="['Paid', 'Unpaid']"
        placeholder="Payment Status"
        @update:model-value="emit('update:filterPayment', $event)"
      />
    </template>

    <template #cell(customer)="{ item }">
      <div class="flex items-center gap-2.5">
        <img
          :src="item.avatar"
          :alt="item.customer"
          class="size-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
        />
        <span class="font-semibold text-gray-900 dark:text-white">{{ item.customer }}</span>
      </div>
    </template>

    <template #cell(reference)="{ item }">
      <button
        type="button"
        class="font-semibold text-primary hover:underline dark:text-primary-400"
        @click="emit('view', item)"
      >
        {{ item.reference }}
      </button>
    </template>

    <template #cell(date)="{ item }">
      <span class="text-gray-600 dark:text-gray-300">{{ item.date }}</span>
    </template>

    <template #cell(status)="{ item }">
      <SalesStatusBadge :status="item.status" />
    </template>

    <template #cell(grandTotal)="{ item }">
      <span class="font-bold tabular-nums text-gray-900 dark:text-white">
        Rp {{ formatNumber(item.grandTotal) }}
      </span>
    </template>

    <template #cell(paid)="{ item }">
      <span class="font-medium tabular-nums text-emerald-600 dark:text-emerald-400">
        Rp {{ formatNumber(item.paid) }}
      </span>
    </template>

    <template #cell(due)="{ item }">
      <span
        class="font-medium tabular-nums"
        :class="item.due > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-400'"
      >
        Rp {{ formatNumber(item.due) }}
      </span>
    </template>

    <template #cell(paymentStatus)="{ item }">
      <SalesStatusBadge :status="item.paymentStatus" />
    </template>

    <template #cell(biller)="{ item }">
      <span class="text-gray-600 dark:text-gray-300 text-xs">{{ item.biller }}</span>
    </template>

    <template #cell(actions)="{ item }">
      <div class="flex items-center justify-center gap-1.5">
        <SalesActionButton action="view" label="View Details" @click="emit('view', item)" />
        <button
          v-if="item.due > 0"
          type="button"
          title="Create Payment"
          aria-label="Create Payment"
          class="inline-flex size-7 items-center justify-center rounded text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
          @click="emit('pay', item)"
        >
          <FeatherIcon name="dollar-sign" :size="14" />
        </button>
        <SalesActionButton action="delete" label="Delete Order" danger @click="emit('delete', item)" />
      </div>
    </template>
  </SalesDataTable>
</template>

