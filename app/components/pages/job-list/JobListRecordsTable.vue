<script setup lang="ts">
import type { JobListItem } from '#server/types/job-list'
import type { DateRangeValue } from '~/composables/useDateRange'
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'

const props = defineProps<{
  items: JobListItem[]
  searchQuery: string
  filterDateRange?: DateRangeValue | null
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterDateRange': [value: DateRangeValue | null]
  'view-detail': [item: JobListItem]
}>()

const columns = [
  { key: 'no', label: 'No Job Order', sortable: true },
  { key: 'salesDate', label: 'Sales Date', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'product', label: 'Product', sortable: true },
  { key: 'flow', label: 'Flow', sortable: true },
  { key: 'flowType', label: 'Flow Type', sortable: true },
  { key: 'assignee', label: 'Assignee', sortable: true },
  { key: 'dateComplete', label: 'Date Complete', sortable: true },
  { key: 'actions', label: 'Action', sortable: false, align: 'center', class: 'text-center whitespace-nowrap' },
]

function getFlowTypeBadgeClass(type: string) {
  if (type.toLowerCase() === 'in-house') {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400'
  }
  return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400'
}
</script>

<template>
  <div class="job-list-records-table">
    <SalesDataTable
      :columns="columns"
      :items="items"
      :search="searchQuery"
      search-placeholder="Search job orders..."
      @update:search="$emit('update:searchQuery', $event)"
    >
      <template #filters>
        <!-- Date Range Filter -->
        <DateRangePicker
          :model-value="filterDateRange"
          aria-label="Date"
          input-class="w-44 max-w-44"
          align="end"
          placeholder="Date"
          @update:model-value="$emit('update:filterDateRange', $event)"
        />
      </template>

      <template #cell(no)="{ item }">
        <span class="font-medium text-gray-900 dark:text-gray-100">{{ item.no }}</span>
      </template>

      <template #cell(salesDate)="{ item }">
        <span class="text-gray-600 dark:text-gray-400">{{ item.salesDate }}</span>
      </template>

      <template #cell(customer)="{ item }">
        <span class="font-semibold text-gray-900 dark:text-gray-100">{{ item.customer }}</span>
      </template>

      <template #cell(product)="{ item }">
        <span class="text-gray-700 dark:text-gray-300">{{ item.product }}</span>
      </template>

      <template #cell(flow)="{ item }">
        <span class="font-medium text-gray-800 dark:text-gray-200">{{ item.flow }}</span>
      </template>

      <template #cell(flowType)="{ item }">
        <span
          class="inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-semibold"
          :class="getFlowTypeBadgeClass(item.flowType)"
        >
          {{ item.flowType }}
        </span>
      </template>

      <template #cell(assignee)="{ item }">
        <span class="text-gray-700 dark:text-gray-300">{{ item.assignee }}</span>
      </template>

      <template #cell(dateComplete)="{ item }">
        <span class="text-gray-600 dark:text-gray-400">{{ item.dateComplete }}</span>
      </template>

      <template #cell(actions)="{ item }">
        <div class="flex items-center justify-center">
          <SalesActionButton
            icon="eye"
            label="View Detail"
            @click="$emit('view-detail', item)"
          />
        </div>
      </template>
    </SalesDataTable>
  </div>
</template>
