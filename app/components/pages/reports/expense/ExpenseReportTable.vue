<script setup lang="ts">
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import type { ExpenseReportItem } from '~~/server/types/reports-operational'

const props = defineProps<{
  items: ExpenseReportItem[]
  columns: any[]
  search: string
  dateRange: any
  category: string
  paymentMethod: string
  categoryOptions: string[]
  paymentMethodOptions: string[]
}>()

const emit = defineEmits<{
  (e: 'update:search', val: string): void
  (e: 'update:dateRange', val: any): void
  (e: 'update:category', val: string): void
  (e: 'update:paymentMethod', val: string): void
  (e: 'exportCsv'): void
  (e: 'print'): void
  (e: 'exportPdf'): void
}>()

function sumTotalExpense(list: ExpenseReportItem[]): number {
  return list.reduce((acc, cur) => acc + (Number(cur.totalExpense) || 0), 0)
}

function sumAmount(list: ExpenseReportItem[]): number {
  return list.reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0)
}
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="items"
    :search="search"
    search-placeholder="Search category..."
    @update:search="emit('update:search', $event)"
    @print="emit('print')"
    @export-pdf="emit('exportPdf')"
    @export-excel="emit('exportCsv')"
  >
    <!-- Filters Slot -->
    <template #filters>
      <!-- Date Range Filter -->
      <DateRangePicker
        :model-value="dateRange"
        placeholder="Filter Rentang Tanggal"
        @update:model-value="emit('update:dateRange', $event)"
      />

      <!-- Category Dropdown Filter -->
      <TableFilterSelect
        :model-value="category"
        placeholder="All Categories"
        :options="categoryOptions"
        @update:model-value="emit('update:category', $event)"
      />

      <!-- Payment Method Filter -->
      <TableFilterSelect
        :model-value="paymentMethod"
        placeholder="All Methods"
        :options="paymentMethodOptions"
        @update:model-value="emit('update:paymentMethod', $event)"
      />

      <!-- Export CSV Button -->
      <button
        type="button"
        title="Export CSV"
        class="flex h-9 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750 transition-colors"
        @click="emit('exportCsv')"
      >
        <FeatherIcon name="download" :size="14" />
        <span>CSV</span>
      </button>
    </template>

    <!-- Cell: Category -->
    <template #cell(category)="{ item }">
      <div class="flex items-center gap-2">
        <span class="size-2 rounded-full bg-rose-500"></span>
        <span class="font-semibold text-gray-900 dark:text-gray-100">
          {{ item.category }}
        </span>
        <span v-if="item.paymentMethod" class="text-[11px] text-gray-400 dark:text-gray-500">
          ({{ item.paymentMethod }})
        </span>
      </div>
    </template>

    <!-- Cell: Total Expense -->
    <template #cell(totalExpense)="{ item }">
      <span class="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
        {{ Number(item.totalExpense).toLocaleString('id-ID') }}
      </span>
    </template>

    <!-- Cell: Amount -->
    <template #cell(amount)="{ item }">
      <CurrencyDisplay :value="item.amount" align="right" bold font-mono custom-class="text-rose-600 dark:text-rose-400" />
    </template>

    <!-- Cell: Percentage -->
    <template #cell(percentage)="{ item }">
      <span class="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
        {{ Number(item.percentage).toFixed(2).replace('.', ',') }}%
      </span>
    </template>

    <!-- Table Footer Slot for Totals Matching Legacy -->
    <template #footer="{ items: tableItems }">
      <tr class="border-t-2 border-gray-200 bg-gray-50/80 font-bold text-gray-900 dark:border-gray-700 dark:bg-gray-800/60 dark:text-white">
        <td class="px-4 py-3 text-start">Total</td>
        <td class="px-4 py-3 text-center">
          {{ sumTotalExpense(tableItems).toLocaleString('id-ID') }}
        </td>
        <td class="px-4 py-3 text-end">
          <CurrencyDisplay :value="sumAmount(tableItems)" align="right" bold font-mono custom-class="text-rose-600 dark:text-rose-400" />
        </td>
        <td class="px-4 py-3 text-end">100%</td>
      </tr>
    </template>
  </SalesDataTable>
</template>

