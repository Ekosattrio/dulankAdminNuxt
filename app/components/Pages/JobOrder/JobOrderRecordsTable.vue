<script setup lang="ts">
import type { JobOrder } from '#server/types/job-order'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'

const props = defineProps<{
  orders: JobOrder[]
  searchQuery: string
  filterCategory?: string
  flowTitle: string
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterCategory': [value: string]
  'view-flow': [order: JobOrder]
  edit: [order: JobOrder]
  delete: [order: JobOrder]
}>()

const flowTypeOptions = ['Design', 'Pracetak', 'Cetak', 'Finishing']

const columns = [
  { key: 'no', label: 'No', sortable: true },
  { key: 'dueDate', label: 'Due Date', sortable: true },
  { key: 'customer', label: 'Customers', sortable: true },
  { key: 'product', label: 'Product', sortable: true },
  { key: 'jobTitle', label: 'Job Title', sortable: true },
  { key: 'priority', label: 'Priority', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]

function getPriorityBadgeClass(priority: string) {
  switch (priority.toLowerCase()) {
    case 'high':
    case 'urgent':
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
    case 'medium':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
    case 'low':
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
  }
}

function getStatusBadgeClass(status: string) {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'complete':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
    case 'on process':
    case 'processing':
      return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800'
    case 'waiting':
    default:
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
  }
}
</script>

<template>
  <div class="job-order-records-table space-y-3">
    <div class="flex items-center justify-between">
      <h5 class="text-sm font-bold text-gray-900 dark:text-gray-100">
        Job Order : {{ flowTitle }}
      </h5>
    </div>

    <SalesDataTable
        :columns="columns"
        :items="orders"
        :search="searchQuery"
        search-placeholder="Search..."
        @update:search="$emit('update:searchQuery', $event)"
      >
        <template #filters>
          <TableFilterSelect
            :model-value="filterCategory || ''"
            :options="flowTypeOptions"
            placeholder="Flow Type"
            aria-label="Flow Type"
            @update:model-value="$emit('update:filterCategory', $event)"
          />
        </template>

        <template #cell(no)="{ item }">
          <span class="font-medium text-gray-900 dark:text-gray-100">{{ item.no }}</span>
        </template>

        <template #cell(dueDate)="{ item }">
          <span class="text-gray-600 dark:text-gray-400">{{ item.dueDate }}</span>
        </template>

        <template #cell(customer)="{ item }">
          <span class="font-semibold text-gray-900 dark:text-gray-100">{{ item.customer }}</span>
        </template>

        <template #cell(product)="{ item }">
          <span class="text-gray-700 dark:text-gray-300">{{ item.product }}</span>
        </template>

        <template #cell(jobTitle)="{ item }">
          <span class="text-gray-700 dark:text-gray-300">{{ item.jobTitle }}</span>
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
          <div class="flex items-center justify-center gap-1.5 whitespace-nowrap">
            <SalesActionButton
              icon="eye"
              label="View Flow"
              @click="$emit('view-flow', item)"
            />
            <SalesActionButton
              icon="edit"
              label="Edit"
              @click="$emit('edit', item)"
            />
            <SalesActionButton
              icon="trash-2"
              label="Delete"
              @click="$emit('delete', item)"
            />
          </div>
        </template>
      </SalesDataTable>
  </div>
</template>
