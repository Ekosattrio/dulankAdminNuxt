<script setup lang="ts">
import type { CheckoutItem } from '#server/types/checkout'
import type { DateRangeValue } from '~/composables/useDateRange'
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'

const props = defineProps<{
  checkouts: CheckoutItem[]
  searchQuery: string
  filterMethod?: string
  filterStatus?: string
  filterDateRange?: DateRangeValue | null
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterMethod': [value: string]
  'update:filterStatus': [value: string]
  'update:filterDateRange': [value: DateRangeValue | null]
}>()

const methodOptions = ['Kartu Kredit', 'Transfer Bank', 'E-Wallet', 'Virtual Account']
const statusOptions = ['Berhasil', 'Gagal']

const columns = [
  { key: 'userEmail', label: 'User', sortable: true },
  { key: 'dateCheckout', label: 'Date Checkout', sortable: true },
  { key: 'payment', label: 'Payment', sortable: true, align: 'end' as const },
  { key: 'method', label: 'Metode', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'voucher', label: 'Voucher', sortable: true, align: 'center' as const },
  { key: 'deliveryFee', label: 'Delivery fee', sortable: true, align: 'end' as const },
  { key: 'detailProduct', label: 'Detail Product', sortable: true },
]

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'Berhasil':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
    case 'Gagal':
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300'
  }
}
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="checkouts"
    :search="searchQuery"
    search-placeholder="Search..."
    @update:search="$emit('update:searchQuery', $event)"
  >
    <template #filters>
      <DateRangePicker
        :model-value="filterDateRange"
        aria-label="Date"
        input-class="w-44 max-w-44"
        align="end"
        placeholder="Date"
        @update:model-value="$emit('update:filterDateRange', $event)"
      />

      <TableFilterSelect
        :model-value="filterMethod || ''"
        :options="methodOptions"
        placeholder="Metode"
        aria-label="Metode"
        @update:model-value="$emit('update:filterMethod', $event)"
      />

      <TableFilterSelect
        :model-value="filterStatus || ''"
        :options="statusOptions"
        placeholder="Status"
        aria-label="Status"
        @update:model-value="$emit('update:filterStatus', $event)"
      />
    </template>

    <template #cell(userEmail)="{ item }">
      <span class="font-medium text-gray-900 dark:text-gray-100">
        {{ item.userEmail }}
      </span>
    </template>

    <template #cell(dateCheckout)="{ item }">
      <span class="text-gray-600 dark:text-gray-400">
        {{ item.dateCheckout }}
      </span>
    </template>

    <template #cell(payment)="{ item }">
      <CurrencyDisplay :amount="item.payment" align="right" />
    </template>

    <template #cell(method)="{ item }">
      <span class="text-gray-700 dark:text-gray-300">
        {{ item.method }}
      </span>
    </template>

    <template #cell(status)="{ item }">
      <span
        :class="[
          'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
          getStatusBadgeClass(item.status)
        ]"
      >
        {{ item.status }}
      </span>
    </template>

    <template #cell(voucher)="{ item }">
      <span
        v-if="item.voucher && item.voucher !== '-'"
        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"
      >
        {{ item.voucher }}
      </span>
      <span v-else class="text-gray-400">-</span>
    </template>

    <template #cell(deliveryFee)="{ item }">
      <CurrencyDisplay :amount="item.deliveryFee" align="right" />
    </template>

    <template #cell(detailProduct)="{ item }">
      <span class="text-gray-600 dark:text-gray-400 text-xs">
        {{ item.detailProduct }}
      </span>
    </template>
  </SalesDataTable>
</template>
