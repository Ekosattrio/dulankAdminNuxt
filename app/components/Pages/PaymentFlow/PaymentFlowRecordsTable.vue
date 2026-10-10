<script setup lang="ts">
import DateRangePicker from '~/components/Common/DateRangePicker.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import type { DateRangeValue } from '~/composables/useDateRange'
import type { PaymentFlowKind, PaymentFlowRecord } from '#server/types/payment-flow'

const props = defineProps<{
  kind: PaymentFlowKind
  records: PaymentFlowRecord[]
  searchQuery: string
  filterDateRange: DateRangeValue | null
  filterSource: string
  filterStatus: string
}>()
const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterDateRange': [value: DateRangeValue | null]
  'update:filterSource': [value: string]
  'update:filterStatus': [value: string]
  view: [record: PaymentFlowRecord]
  payment: [record: PaymentFlowRecord]
  edit: [record: PaymentFlowRecord]
  delete: [record: PaymentFlowRecord]
}>()

const { formatNumber } = useFormatters()
const sourceOptions = computed(() =>
  props.kind === 'inflow'
    ? ['Sales', 'Purchase Return', 'Income']
    : ['Payroll', 'Cash Advance', 'Purchase', 'Expense', 'Sales Return'],
)
const columns = computed(() =>
  props.kind === 'inflow'
    ? [
        { key: 'date', label: 'Date', sortable: true },
        { key: 'refNo', label: 'Ref No', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'source', label: 'Source', sortable: true },
        { key: 'amount', label: 'Amount', sortable: true, align: 'end' as const },
        { key: 'dueDate', label: 'Due Date', sortable: true },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'method', label: 'Payment Method', sortable: true },
        { key: 'note', label: 'Note', sortable: true },
        { key: 'actions', label: 'Action', align: 'end' as const },
      ]
    : [
        { key: 'date', label: 'Date', sortable: true },
        { key: 'refNo', label: 'Ref No', sortable: true },
        { key: 'name', label: 'Name', sortable: true },
        { key: 'source', label: 'Source', sortable: true },
        { key: 'amount', label: 'Amount (IDR)', sortable: true, align: 'end' as const },
        { key: 'status', label: 'Status', sortable: true },
        { key: 'method', label: 'Payment Method', sortable: true },
        { key: 'note', label: 'Note', sortable: true },
        { key: 'paymentDate', label: 'Date', sortable: true },
        { key: 'actions', label: 'Action', align: 'end' as const },
      ],
)
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="records"
    :search="searchQuery"
    search-placeholder="Search ref no, name..."
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
        :model-value="filterSource"
        :options="sourceOptions"
        placeholder="All Sources"
        aria-label="Source"
        @update:model-value="$emit('update:filterSource', $event)"
      />
      <TableFilterSelect
        :model-value="filterStatus"
        :options="['Paid', 'Partial', 'Unpaid']"
        placeholder="All Statuses"
        aria-label="Status"
        @update:model-value="$emit('update:filterStatus', $event)"
      />
    </template>
    <template #cell(refNo)="{ item }">
      <span class="font-semibold text-primary">{{ item.refNo }}</span>
    </template>
    <template #cell(name)="{ item }">
      <span class="font-medium text-gray-900 dark:text-gray-100">{{ item.name }}</span>
    </template>
    <template #cell(source)="{ item }">
      <span
        class="inline-flex rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >{{ item.source }}</span
      >
    </template>
    <template #cell(amount)="{ item }">
      <span class="font-semibold">{{ formatNumber(item.amount) }}</span>
    </template>
    <template #cell(status)="{ item }"><SalesStatusBadge :status="item.status" /></template>
    <template #cell(method)="{ item }">{{ item.method || '-' }}</template>
    <template #cell(note)="{ item }">
      <span class="block max-w-52 truncate text-gray-500 dark:text-gray-400">{{ item.note || '-' }}</span>
    </template>
    <template #cell(actions)="{ item }">
      <div class="flex justify-end gap-2">
        <SalesActionButton icon="eye" label="View" @click="emit('view', item)" />
        <SalesActionButton icon="dollar-sign" label="Payment" @click="emit('payment', item)" />
        <SalesActionButton icon="edit" label="Edit" @click="emit('edit', item)" />
        <SalesActionButton icon="trash-2" label="Delete" @click="emit('delete', item)" />
      </div>
    </template>
  </SalesDataTable>
</template>
