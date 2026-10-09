<script setup lang="ts">
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
import type { InvoiceReportItem } from '~~/server/types/reports-sales'

defineProps<{
  items: InvoiceReportItem[]
  columns: any[]
  search: string
  dateRange: any
  month: string
  year: string
  monthOptions: string[]
  yearOptions: string[]
}>()

const emit = defineEmits<{
  (e: 'update:search', val: string): void
  (e: 'update:dateRange', val: any): void
  (e: 'update:month', val: string): void
  (e: 'update:year', val: string): void
}>()
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="items"
    :search="search"
    search-placeholder="Search month or year..."
    @update:search="emit('update:search', $event)"
  >
    <!-- Filter slot -->
    <template #filters>
      <DateRangePicker
        :model-value="dateRange"
        placeholder="Date"
        @update:model-value="emit('update:dateRange', $event)"
      />
      <TableFilterSelect
        :model-value="month"
        :options="monthOptions"
        placeholder="All Months"
        aria-label="Filter by Month"
        @update:model-value="emit('update:month', $event)"
      />
      <TableFilterSelect
        :model-value="year"
        :options="yearOptions"
        placeholder="All Years"
        aria-label="Filter by Year"
        @update:model-value="emit('update:year', $event)"
      />
    </template>

    <!-- Cell overrides -->
    <template #cell(month)="{ item }">
      <span class="font-semibold text-gray-900 dark:text-white">{{ item.month }}</span>
    </template>

    <template #cell(year)="{ item }">
      <span class="font-medium text-gray-600 dark:text-gray-300">{{ item.year }}</span>
    </template>

    <template #cell(totalInvoice)="{ item }">
      <span class="font-medium text-gray-900 dark:text-white">
        {{ Number(item.totalInvoice).toLocaleString('id-ID') }}
      </span>
    </template>

    <template #cell(netSales)="{ item }">
      <CurrencyDisplay :value="item.netSales" />
    </template>

    <template #cell(deliveryFee)="{ item }">
      <CurrencyDisplay :value="item.deliveryFee" />
    </template>

    <template #cell(totalTax)="{ item }">
      <CurrencyDisplay :value="item.totalTax" />
    </template>

    <template #cell(totalDiscount)="{ item }">
      <CurrencyDisplay :value="item.totalDiscount" custom-class="text-rose-600 dark:text-rose-400" />
    </template>

    <template #cell(grossRevenue)="{ item }">
      <CurrencyDisplay :value="item.grossRevenue" :bold="true" custom-class="text-emerald-600 dark:text-emerald-400" />
    </template>

    <template #cell(collectionRate)="{ item }">
      <span
        :class="[
          'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
          item.collectionRate >= 90
            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
            : item.collectionRate >= 80
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
        ]"
      >
        {{ item.collectionRate }}%
      </span>
    </template>

    <!-- Footer Total -->
    <template #footer="{ items: filteredList }">
      <tr class="font-bold text-gray-900 dark:text-white">
        <td colspan="2" class="px-4 py-3">Total</td>
        <td class="px-4 py-3 text-center">
          {{ filteredList.reduce((acc, i) => acc + (i.totalInvoice || 0), 0).toLocaleString('id-ID') }}
        </td>
        <td class="px-4 py-3 text-end">
          <CurrencyDisplay :value="filteredList.reduce((acc, i) => acc + (i.netSales || 0), 0)" :bold="true" />
        </td>
        <td class="px-4 py-3 text-end">
          <CurrencyDisplay :value="filteredList.reduce((acc, i) => acc + (i.deliveryFee || 0), 0)" :bold="true" />
        </td>
        <td class="px-4 py-3 text-end">
          <CurrencyDisplay :value="filteredList.reduce((acc, i) => acc + (i.totalTax || 0), 0)" :bold="true" />
        </td>
        <td class="px-4 py-3 text-end text-rose-600 dark:text-rose-400">
          <CurrencyDisplay :value="filteredList.reduce((acc, i) => acc + (i.totalDiscount || 0), 0)" :bold="true" />
        </td>
        <td class="px-4 py-3 text-end text-emerald-600 dark:text-emerald-400">
          <CurrencyDisplay :value="filteredList.reduce((acc, i) => acc + (i.grossRevenue || 0), 0)" :bold="true" />
        </td>
        <td class="px-4 py-3 text-end">
          {{ filteredList.length > 0 ? Math.round(filteredList.reduce((acc, i) => acc + (i.collectionRate || 0), 0) / filteredList.length) : 0 }}%
        </td>
      </tr>
    </template>
  </SalesDataTable>
</template>

