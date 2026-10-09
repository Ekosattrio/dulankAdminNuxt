<script setup lang="ts">
import type { SupportTicket } from '#server/types/support-ticket'
import type { DateRangeValue } from '~/composables/useDateRange'
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'

const props = defineProps<{
  tickets: SupportTicket[]
  searchQuery: string
  filterPriority?: string
  filterStatus?: string
  filterDateRange?: DateRangeValue | null
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterPriority': [value: string]
  'update:filterStatus': [value: string]
  'update:filterDateRange': [value: DateRangeValue | null]
  'view-detail': [ticket: SupportTicket]
  'delete-ticket': [ticket: SupportTicket]
}>()

const priorityOptions = ['Low', 'High', 'Medium']
const statusOptions = ['Open', 'Closed', 'Pending']

const columns = [
  { key: 'ticketNo', label: 'ID', sortable: true },
  { key: 'requestedBy', label: 'Requested By', sortable: true },
  { key: 'subject', label: 'Subject', sortable: true },
  { key: 'assignee', label: 'Assignee', sortable: true },
  { key: 'priority', label: 'Priority', sortable: true, align: 'center' as const },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'createdDate', label: 'Created Date', sortable: true },
  { key: 'dueDate', label: 'Due Date', sortable: true },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]

function getPriorityBadgeClass(priority: string) {
  switch (priority) {
    case 'High':
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
    case 'Medium':
      return 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800'
    case 'Low':
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
  }
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'Open':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
    case 'Closed':
      return 'bg-gray-700 text-white border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700'
    case 'Pending':
    default:
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
  }
}
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="tickets"
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
        :model-value="filterPriority || ''"
        :options="priorityOptions"
        placeholder="Priority"
        aria-label="Priority"
        @update:model-value="$emit('update:filterPriority', $event)"
      />

      <TableFilterSelect
        :model-value="filterStatus || ''"
        :options="statusOptions"
        placeholder="Status"
        aria-label="Status"
        @update:model-value="$emit('update:filterStatus', $event)"
      />
    </template>

    <!-- Custom column templates -->
    <template #cell(ticketNo)="{ item }">
      <button
        type="button"
        class="font-mono text-xs font-semibold text-primary-600 hover:text-primary-800 hover:underline"
        @click="$emit('view-detail', item)"
      >
        {{ item.ticketNo }}
      </button>
    </template>

    <template #cell(requestedBy)="{ item }">
      <div class="flex items-center gap-2">
        <img
          :src="item.avatar || '/assets/img/users/user-23.jpg'"
          :alt="item.requestedBy"
          class="w-7 h-7 rounded-full object-cover border border-gray-200 dark:border-gray-700"
        />
        <button
          type="button"
          class="font-medium text-gray-900 dark:text-gray-100 hover:text-amber-600 transition-colors text-left"
          @click="$emit('view-detail', item)"
        >
          {{ item.requestedBy }}
        </button>
      </div>
    </template>

    <template #cell(subject)="{ item }">
      <span class="text-gray-800 dark:text-gray-200 line-clamp-1 max-w-xs">
        {{ item.subject }}
      </span>
    </template>

    <template #cell(assignee)="{ item }">
      <span class="text-gray-700 dark:text-gray-300">
        {{ item.assignee }}
      </span>
    </template>

    <template #cell(priority)="{ item }">
      <span
        :class="[
          'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border',
          getPriorityBadgeClass(item.priority)
        ]"
      >
        {{ item.priority }}
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

    <template #cell(createdDate)="{ item }">
      <span class="text-gray-600 dark:text-gray-400">
        {{ item.createdDate }}
      </span>
    </template>

    <template #cell(dueDate)="{ item }">
      <span class="text-gray-600 dark:text-gray-400">
        {{ item.dueDate }}
      </span>
    </template>

    <template #cell(actions)="{ item }">
      <div class="flex items-center justify-center gap-1">
        <SalesActionButton
          action="view"
          label="View Detail"
          @click="$emit('view-detail', item)"
        />
        <SalesActionButton
          action="delete"
          label="Delete Ticket"
          @click="$emit('delete-ticket', item)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>
