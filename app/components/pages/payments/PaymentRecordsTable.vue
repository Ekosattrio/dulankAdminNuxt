<script setup lang="ts">
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
import type { DateRangeValue } from '~/composables/useDateRange'
import type { PaymentRecord } from '#server/types/payment'

defineProps<{
  payments: PaymentRecord[]
  searchQuery: string
  filterDateRange: DateRangeValue | null
  filterType: string
  filterMethod: string
}>()

defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterDateRange': [value: DateRangeValue | null]
  'update:filterType': [value: string]
  'update:filterMethod': [value: string]
}>()

const { formatNumber } = useFormatters()
const columns = [
  { key: 'date', label: 'Date Payment', sortable: true },
  { key: 'refNo', label: 'Ref No', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'type', label: 'Type', sortable: true },
  { key: 'method', label: 'Payment Method', sortable: true },
  { key: 'amount', label: 'Amount (IDR)', sortable: true, align: 'end' as const },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'created', label: 'Create', sortable: true },
]
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="payments"
    :search="searchQuery"
    search-placeholder="Search ref no, name..."
    @update:search="$emit('update:searchQuery', $event)"
  >
    <template #filters>
      <DateRangePicker
        :model-value="filterDateRange"
        aria-label="Date Payment"
        input-class="w-48 max-w-48"
        align="end"
        placeholder="Date Payment"
        @update:model-value="$emit('update:filterDateRange', $event)"
      />
      <TableFilterSelect
        :model-value="filterType"
        :options="['Payment-In', 'Payment-Out']"
        placeholder="Filter Type"
        aria-label="Filter Type"
        @update:model-value="$emit('update:filterType', $event)"
      />
      <TableFilterSelect
        :model-value="filterMethod"
        :options="['Cash', 'Transfer']"
        placeholder="Payment Methode"
        aria-label="Payment Methode"
        @update:model-value="$emit('update:filterMethod', $event)"
      />
    </template>
    <template #cell(refNo)="{ item }">
      <span class="font-semibold text-primary">{{ item.refNo }}</span>
    </template>
    <template #cell(name)="{ item }">
      <span class="font-medium text-gray-900 dark:text-gray-100">{{ item.name }}</span>
    </template>
    <template #cell(type)="{ item }">
      <span
        class="inline-flex rounded px-2 py-0.5 text-[11px] font-semibold"
        :class="
          item.type === 'Payment-In'
            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
            : 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300'
        "
      >
        {{ item.type }}
      </span>
    </template>
    <template #cell(method)="{ item }">
      <span
        class="inline-flex rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-semibold text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
      >
        {{ item.method }}
      </span>
    </template>
    <template #cell(amount)="{ item }">
      <CurrencyDisplay :value="item.amount" prefix="" align="right" class="w-full font-semibold" />
    </template>
    <template #cell(status)="{ item }"><SalesStatusBadge :status="item.status" /></template>
    <template #cell(created)="{ item }">
      <span class="text-gray-500 dark:text-gray-400">{{ item.created }}</span>
    </template>
  </SalesDataTable>
</template>
