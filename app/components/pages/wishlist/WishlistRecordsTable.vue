<script setup lang="ts">
import type { WishlistItem } from '#server/types/wishlist'
import type { DateRangeValue } from '~/composables/useDateRange'
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'

const props = defineProps<{
  wishlists: WishlistItem[]
  searchQuery: string
  filterCategory?: string
  filterStatus?: string
  filterDateRange?: DateRangeValue | null
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterCategory': [value: string]
  'update:filterStatus': [value: string]
  'update:filterDateRange': [value: DateRangeValue | null]
}>()

const categoryOptions = ['Brochure', 'Flyer', 'Banner', 'Stationery']
const statusOptions = ['Active', 'Checkout', 'Delete']

const columns = [
  { key: 'productName', label: 'Product', sortable: true },
  { key: 'userEmail', label: 'User', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'price', label: 'Price', sortable: true, align: 'end' as const },
  { key: 'qty', label: 'Qty', sortable: true, align: 'center' as const },
  { key: 'totalPrice', label: 'Total Price', sortable: true, align: 'end' as const },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
]

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'Active':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
    case 'Checkout':
      return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800'
    case 'Delete':
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300'
  }
}
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="wishlists"
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
        :model-value="filterCategory || ''"
        :options="categoryOptions"
        placeholder="Category"
        aria-label="Category"
        @update:model-value="$emit('update:filterCategory', $event)"
      />

      <TableFilterSelect
        :model-value="filterStatus || ''"
        :options="statusOptions"
        placeholder="Status"
        aria-label="Status"
        @update:model-value="$emit('update:filterStatus', $event)"
      />
    </template>

    <template #cell(productName)="{ item }">
      <div class="flex items-center gap-3">
        <img
          :src="item.productImage || '/assets/img/products/stock-img-01.png'"
          :alt="item.productName"
          class="w-10 h-10 rounded object-cover border border-gray-200 dark:border-gray-700 shrink-0"
        />
        <span class="font-medium text-gray-900 dark:text-gray-100 hover:text-amber-600 transition-colors">
          {{ item.productName }}
        </span>
      </div>
    </template>

    <template #cell(userEmail)="{ item }">
      <span class="text-gray-700 dark:text-gray-300">
        {{ item.userEmail }}
      </span>
    </template>

    <template #cell(category)="{ item }">
      <span class="text-gray-600 dark:text-gray-400">
        {{ item.category }}
      </span>
    </template>

    <template #cell(price)="{ item }">
      <CurrencyDisplay :amount="item.price" align="right" />
    </template>

    <template #cell(qty)="{ item }">
      <span class="font-medium text-gray-800 dark:text-gray-200 text-center block">
        {{ item.qty }}
      </span>
    </template>

    <template #cell(totalPrice)="{ item }">
      <CurrencyDisplay :amount="item.totalPrice" align="right" />
    </template>

    <template #cell(date)="{ item }">
      <span class="text-gray-600 dark:text-gray-400">
        {{ item.date }}
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
  </SalesDataTable>
</template>
