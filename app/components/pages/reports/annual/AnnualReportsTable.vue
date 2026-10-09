<script setup lang="ts">
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
import type { DateRangeValue } from '~/composables/useDateRange'
import type { AnnualReportItem } from '~~/server/types/reports-financial'

defineProps<{
  items: AnnualReportItem[]
  columns: any[]
  search: string
  dateRange: DateRangeValue | null
  month: string
  year: string
  monthOptions: { label: string; value: string }[]
  yearOptions: { label: string; value: string }[]
}>()

const emit = defineEmits<{
  (e: 'update:search', val: string): void
  (e: 'update:dateRange', val: DateRangeValue | null): void
  (e: 'update:month', val: string): void
  (e: 'update:year', val: string): void
  (e: 'print'): void
  (e: 'exportPdf'): void
  (e: 'exportExcel'): void
}>()
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="items"
    :search="search"
    search-placeholder="Search month or year..."
    @update:search="emit('update:search', $event)"
    @print="emit('print')"
    @export-pdf="emit('exportPdf')"
    @export-excel="emit('exportExcel')"
  >
    <!-- Filters Slot -->
    <template #filters>
      <DateRangePicker
        :model-value="dateRange"
        placeholder="Filter Rentang Tanggal"
        @update:model-value="emit('update:dateRange', $event)"
      />

      <TableFilterSelect
        :model-value="month"
        placeholder="All Month"
        :options="monthOptions"
        @update:model-value="emit('update:month', $event)"
      />

      <TableFilterSelect
        :model-value="year"
        placeholder="All Years"
        :options="yearOptions"
        @update:model-value="emit('update:year', $event)"
      />
    </template>

    <!-- Cell Overrides -->
    <template #cell(month)="{ item }">
      <div class="font-medium text-gray-900 dark:text-white">
        {{ item.month }}
      </div>
    </template>

    <template #cell(year)="{ item }">
      <span class="inline-flex rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
        {{ item.year }}
      </span>
    </template>

    <template #cell(totalRevenue)="{ item }">
      <CurrencyDisplay :value="item.totalRevenue" custom-class="text-gray-900 dark:text-gray-100 font-semibold" />
    </template>

    <template #cell(cogs)="{ item }">
      <CurrencyDisplay :value="item.cogs" custom-class="text-gray-600 dark:text-gray-300" />
    </template>

    <template #cell(grossProfit)="{ item }">
      <CurrencyDisplay :value="item.grossProfit" custom-class="text-blue-600 dark:text-blue-400 font-semibold" />
    </template>

    <template #cell(operatingExpenses)="{ item }">
      <CurrencyDisplay :value="item.operatingExpenses" custom-class="text-amber-600 dark:text-amber-400" />
    </template>

    <template #cell(netProfit)="{ item }">
      <CurrencyDisplay :value="item.netProfit" custom-class="text-emerald-600 dark:text-emerald-400 font-bold" />
    </template>

    <template #cell(netMarginPercent)="{ item }">
      <span class="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
        {{ Number(item.netMarginPercent || 0).toFixed(2).replace('.', ',') }}%
      </span>
    </template>

    <!-- Table Footer Slot -->
    <template #footer="{ items: filteredList }">
      <tr class="bg-gray-50/90 dark:bg-gray-800/90 font-bold border-t-2 border-gray-300 dark:border-gray-700">
        <td colspan="2" class="px-4 py-3 text-start font-bold uppercase tracking-wider text-gray-900 dark:text-white">
          TOTAL ({{ filteredList.length }} Bulan)
        </td>
        <td class="px-4 py-3 text-end font-bold text-gray-900 dark:text-white">
          <CurrencyDisplay :value="filteredList.reduce((acc: number, c: any) => acc + (Number(c.totalRevenue) || 0), 0)" />
        </td>
        <td class="px-4 py-3 text-end font-bold text-gray-600 dark:text-gray-300">
          <CurrencyDisplay :value="filteredList.reduce((acc: number, c: any) => acc + (Number(c.cogs) || 0), 0)" />
        </td>
        <td class="px-4 py-3 text-end font-bold text-blue-600 dark:text-blue-400">
          <CurrencyDisplay :value="filteredList.reduce((acc: number, c: any) => acc + (Number(c.grossProfit) || 0), 0)" />
        </td>
        <td class="px-4 py-3 text-end font-bold text-amber-600 dark:text-amber-400">
          <CurrencyDisplay :value="filteredList.reduce((acc: number, c: any) => acc + (Number(c.operatingExpenses) || 0), 0)" />
        </td>
        <td class="px-4 py-3 text-end font-bold text-emerald-600 dark:text-emerald-400">
          <CurrencyDisplay :value="filteredList.reduce((acc: number, c: any) => acc + (Number(c.netProfit) || 0), 0)" />
        </td>
        <td class="px-4 py-3 text-end font-bold text-emerald-700 dark:text-emerald-300">
          {{
            filteredList.reduce((acc: number, c: any) => acc + (Number(c.totalRevenue) || 0), 0) > 0
              ? (
                  (filteredList.reduce((acc: number, c: any) => acc + (Number(c.netProfit) || 0), 0) /
                    filteredList.reduce((acc: number, c: any) => acc + (Number(c.totalRevenue) || 0), 0)) *
                  100
                ).toFixed(2).replace('.', ',') + '%'
              : '0%'
          }}
        </td>
      </tr>
    </template>
  </SalesDataTable>
</template>

