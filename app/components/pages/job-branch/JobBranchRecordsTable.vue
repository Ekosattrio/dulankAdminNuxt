<script setup lang="ts">
import type { JobBranchItem } from '#server/types/job-branch'
import type { DateRangeValue } from '~/composables/useDateRange'
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'

const props = defineProps<{
  items: JobBranchItem[]
  searchQuery: string
  filterBranch?: string
  filterPriority?: string
  filterDateRange?: DateRangeValue | null
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterBranch': [value: string]
  'update:filterPriority': [value: string]
  'update:filterDateRange': [value: DateRangeValue | null]
  'open-settings': [item: JobBranchItem]
}>()

const branchOptions = ['Dulank Karawang', 'Dulank Jakarta', 'Dulank Cirebon']
const priorityOptions = ['High', 'Urgent', 'Reguler']

const columns = [
  { key: 'no', label: 'No', sortable: true },
  { key: 'branch', label: 'Branch', sortable: true },
  { key: 'customer', label: 'Customers', sortable: true },
  { key: 'product', label: 'Product', sortable: true },
  { key: 'flowName', label: 'Flow Name', sortable: true },
  { key: 'priority', label: 'Priority', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Action', sortable: false, align: 'center', class: 'text-center whitespace-nowrap' },
]

function getPriorityBadgeClass(priority: string) {
  switch (priority.toLowerCase()) {
    case 'urgent':
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
    case 'high':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
    case 'reguler':
    default:
      return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800'
  }
}

function getStatusBadgeClass(status: string) {
  switch (status.toLowerCase()) {
    case 'on process':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
    case 'waiting':
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
  }
}
</script>

<template>
  <div class="job-branch-records-table">
    <SalesDataTable
      :columns="columns"
      :items="items"
      :search="searchQuery"
      search-placeholder="Search..."
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

        <!-- Branch Filter -->
        <TableFilterSelect
          :model-value="filterBranch || ''"
          :options="branchOptions"
          placeholder="Branch"
          aria-label="Branch"
          @update:model-value="$emit('update:filterBranch', $event)"
        />

        <!-- Priority Filter -->
        <TableFilterSelect
          :model-value="filterPriority || ''"
          :options="priorityOptions"
          placeholder="Priority"
          aria-label="Priority"
          @update:model-value="$emit('update:filterPriority', $event)"
        />
      </template>

      <template #cell(no)="{ item }">
        <span class="font-medium text-gray-900 dark:text-gray-100">{{ item.no }}</span>
      </template>

      <template #cell(branch)="{ item }">
        <span class="text-gray-700 dark:text-gray-300">{{ item.branch }}</span>
      </template>

      <template #cell(customer)="{ item }">
        <span class="font-semibold text-gray-900 dark:text-gray-100">{{ item.customer }}</span>
      </template>

      <template #cell(product)="{ item }">
        <span class="text-gray-700 dark:text-gray-300">{{ item.product }}</span>
      </template>

      <template #cell(flowName)="{ item }">
        <span class="font-medium text-gray-800 dark:text-gray-200">{{ item.flowName }}</span>
      </template>

      <template #cell(priority)="{ item }">
        <span
          class="inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-semibold"
          :class="getPriorityBadgeClass(item.priority)"
        >
          {{ item.priority }}
        </span>
      </template>

      <template #cell(status)="{ item }">
        <span
          class="inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-semibold"
          :class="getStatusBadgeClass(item.status)"
        >
          {{ item.status }}
        </span>
      </template>

      <template #cell(actions)="{ item }">
        <div class="flex items-center justify-center">
          <SalesActionButton
            icon="settings"
            label="Settings"
            @click="$emit('open-settings', item)"
          />
        </div>
      </template>
    </SalesDataTable>
  </div>
</template>
