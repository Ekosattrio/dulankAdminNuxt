<script setup lang="ts">
import type { Order } from '#server/types/order'
import type { DateRangeValue } from '~/composables/useDateRange'
import DateRangePicker from '~/components/Common/DateRangePicker.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'

const props = defineProps<{
  orders: Order[]
  searchQuery: string
  filterShipping?: string
  filterStatus?: string
  filterDateRange?: DateRangeValue | null
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterShipping': [value: string]
  'update:filterStatus': [value: string]
  'update:filterDateRange': [value: DateRangeValue | null]
  'update-status': [order: Order]
}>()

const router = useRouter()

const shippingOptions = ['Pickup', 'Courier', 'Express']
const statusOptions = ['Complete', 'Waiting', 'Processing', 'Cancel']

const columns = [
  { key: 'no', label: 'No', sortable: true },
  { key: 'customer', label: 'Customers', sortable: true },
  { key: 'orderDate', label: 'Order Date', sortable: true },
  { key: 'status', label: 'Order Status', sortable: true },
  { key: 'statusBy', label: 'Order Status By', sortable: true },
  { key: 'salesChannel', label: 'Sales Channel', sortable: true },
  { key: 'shipping', label: 'Shipping', sortable: true },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'Complete':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
    case 'Processing':
      return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800'
    case 'Cancel':
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
    case 'Waiting':
    default:
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
  }
}
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="orders"
    :search="searchQuery"
    search-placeholder="Search..."
    @update:search="$emit('update:searchQuery', $event)"
  >
    <template #filters>
      <!-- Date Range Picker -->
      <DateRangePicker
        :model-value="filterDateRange"
        aria-label="Date"
        input-class="w-44 max-w-44"
        align="end"
        placeholder="Date"
        @update:model-value="$emit('update:filterDateRange', $event)"
      />

      <!-- Shipping Method Filter -->
      <TableFilterSelect
        :model-value="filterShipping || ''"
        :options="shippingOptions"
        placeholder="Shipping Methode"
        aria-label="Shipping Methode"
        @update:model-value="$emit('update:filterShipping', $event)"
      />

      <!-- Status Filter -->
      <TableFilterSelect
        :model-value="filterStatus || ''"
        :options="statusOptions"
        placeholder="Status"
        aria-label="Status"
        @update:model-value="$emit('update:filterStatus', $event)"
      />
    </template>

    <template #cell(no)="{ item }">
      <span class="font-medium text-gray-900 dark:text-gray-100">{{ item.no }}</span>
    </template>

    <template #cell(customer)="{ item }">
      <span class="font-semibold text-gray-900 dark:text-gray-100">{{ item.customer }}</span>
    </template>

    <template #cell(orderDate)="{ item }">
      <span class="text-gray-600 dark:text-gray-400">{{ item.orderDate }}</span>
    </template>

    <template #cell(status)="{ item }">
      <span
        class="inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold"
        :class="getStatusBadgeClass(item.status)"
      >
        {{ item.status }}
      </span>
    </template>

    <template #cell(statusBy)="{ item }">
      <span class="text-gray-700 dark:text-gray-300">{{ item.statusBy }}</span>
    </template>

    <template #cell(salesChannel)="{ item }">
      <span class="text-gray-700 dark:text-gray-300">{{ item.salesChannel }}</span>
    </template>

    <template #cell(shipping)="{ item }">
      <span class="text-gray-700 dark:text-gray-300">{{ item.shipping }}</span>
    </template>

    <template #cell(actions)="{ item }">
      <div class="flex items-center justify-center gap-1.5 whitespace-nowrap">
        <!-- Detail button -->
        <button
          type="button"
          class="rounded bg-[#00cfe8] px-2 py-1 text-[11px] font-semibold text-white shadow-sm transition hover:opacity-90"
          @click="router.push(`/job-order`)"
        >
          Detail
        </button>

        <!-- Status button -->
        <button
          type="button"
          class="rounded bg-[#28c76f] px-2 py-1 text-[11px] font-semibold text-white shadow-sm transition hover:opacity-90"
          @click="$emit('update-status', item)"
        >
          Status
        </button>

        <!-- Add Job Order button -->
        <button
          type="button"
          class="rounded bg-[#82868b] px-2 py-1 text-[11px] font-semibold text-white shadow-sm transition hover:opacity-90"
          @click="router.push(`/job-order`)"
        >
          Add Job Order
        </button>

        <!-- Edit Job Order button -->
        <button
          type="button"
          class="rounded bg-[#ff9f43] px-2 py-1 text-[11px] font-semibold text-white shadow-sm transition hover:opacity-90"
          @click="router.push(`/job-order`)"
        >
          Edit Job Order
        </button>
      </div>
    </template>
  </SalesDataTable>
</template>
