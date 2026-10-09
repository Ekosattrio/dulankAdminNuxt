<script setup lang="ts">
import type { ReviewItem } from '#server/types/review'
import type { DateRangeValue } from '~/composables/useDateRange'
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const props = defineProps<{
  reviews: ReviewItem[]
  searchQuery: string
  filterRating?: string
  filterDateRange?: DateRangeValue | null
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterRating': [value: string]
  'update:filterDateRange': [value: DateRangeValue | null]
}>()

const ratingOptions = ['1', '2', '3', '4', '5']

const columns = [
  { key: 'userEmail', label: 'User', sortable: true },
  { key: 'productId', label: 'ID Produk', sortable: true },
  { key: 'productName', label: 'Product', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'rating', label: 'Rating (1-5)', sortable: true, align: 'center' as const },
  { key: 'title', label: 'Title', sortable: true },
  { key: 'review', label: 'Review', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
]

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'Publish':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
    case 'Unpublish':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300'
  }
}
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="reviews"
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
        :model-value="filterRating || ''"
        :options="ratingOptions"
        placeholder="Rating"
        aria-label="Rating"
        @update:model-value="$emit('update:filterRating', $event)"
      />
    </template>

    <template #cell(userEmail)="{ item }">
      <span class="font-medium text-gray-900 dark:text-gray-100">
        {{ item.userEmail }}
      </span>
    </template>

    <template #cell(productId)="{ item }">
      <span class="font-mono text-xs text-gray-600 dark:text-gray-400 font-semibold">
        {{ item.productId }}
      </span>
    </template>

    <template #cell(productName)="{ item }">
      <span class="text-gray-900 dark:text-gray-100 font-medium">
        {{ item.productName }}
      </span>
    </template>

    <template #cell(date)="{ item }">
      <span class="text-gray-600 dark:text-gray-400">
        {{ item.date }}
      </span>
    </template>

    <template #cell(rating)="{ item }">
      <div class="flex items-center justify-center gap-1">
        <span class="font-bold text-amber-500 text-xs">{{ item.rating }}</span>
        <FeatherIcon name="star" class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      </div>
    </template>

    <template #cell(title)="{ item }">
      <span class="font-medium text-gray-900 dark:text-gray-100">
        {{ item.title }}
      </span>
    </template>

    <template #cell(review)="{ item }">
      <span class="text-gray-600 dark:text-gray-400 text-xs">
        {{ item.review }}
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
