<script setup lang="ts">
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import DateRangePicker from '~/components/Common/DateRangePicker.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import type { ProductReportItem } from '~~/server/types/reports-operations'

const props = defineProps<{
  items: ProductReportItem[]
  columns: any[]
  search: string
  dateRange: any
  category: string
  categoryOptions: string[]
}>()

const emit = defineEmits<{
  (e: 'update:search', val: string): void
  (e: 'update:dateRange', val: any): void
  (e: 'update:category', val: string): void
  (e: 'exportCsv'): void
  (e: 'print'): void
  (e: 'exportPdf'): void
}>()

function sumTotalOrder(list: ProductReportItem[]): number {
  return list.reduce((acc, cur) => acc + (Number(cur.totalOrder) || 0), 0)
}

function sumAmount(list: ProductReportItem[]): number {
  return list.reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0)
}
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="items"
    :search="search"
    search-placeholder="Search product..."
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

      <!-- Export CSV Button in filters -->
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

    <!-- Cell: Product -->
    <template #cell(product)="{ item }">
      <div class="flex flex-col">
        <span class="font-semibold text-gray-900 dark:text-gray-100">
          {{ item.product }}
        </span>
        <span v-if="item.sku" class="text-[11px] text-gray-400 font-mono">
          {{ item.sku }}
        </span>
      </div>
    </template>

    <!-- Cell: Category -->
    <template #cell(category)="{ item }">
      <span class="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300">
        {{ item.category }}
      </span>
    </template>

    <!-- Cell: Total Order -->
    <template #cell(totalOrder)="{ item }">
      <span class="font-medium text-gray-800 dark:text-gray-200">
        {{ Number(item.totalOrder).toLocaleString('id-ID') }}
      </span>
    </template>

    <!-- Cell: Unit -->
    <template #cell(unit)="{ item }">
      <span class="text-xs text-gray-600 dark:text-gray-400">
        {{ item.unit }}
      </span>
    </template>

    <!-- Cell: Amount -->
    <template #cell(amount)="{ item }">
      <CurrencyDisplay :value="item.amount" align="right" bold font-mono />
    </template>

    <!-- Cell: Percentage -->
    <template #cell(percentage)="{ item }">
      <span class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
        {{ Number(item.percentage).toFixed(2).replace('.', ',') }}%
      </span>
    </template>

    <!-- Table Footer Slot for Totals Matching Legacy -->
    <template #footer="{ items: tableItems }">
      <tr class="border-t-2 border-gray-200 bg-gray-50/80 font-bold text-gray-900 dark:border-gray-700 dark:bg-gray-800/60 dark:text-white">
        <td colspan="2" class="px-4 py-3 text-start">Total</td>
        <td class="px-4 py-3 text-center">
          {{ sumTotalOrder(tableItems).toLocaleString('id-ID') }}
        </td>
        <td class="px-4 py-3"></td>
        <td class="px-4 py-3 text-end">
          <CurrencyDisplay :value="sumAmount(tableItems)" align="right" bold font-mono />
        </td>
        <td class="px-4 py-3 text-end">100%</td>
      </tr>
    </template>
  </SalesDataTable>
</template>

