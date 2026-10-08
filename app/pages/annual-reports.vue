<script setup lang="ts">
import { ref, computed } from 'vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import { useAnnualReports } from '~/composables/useFinancialReports'
import { useTablePrint } from '~/composables/useTablePrint'
import type { DateRangeValue } from '~/composables/useDateRange'
import type { PrintColumn } from '~/utils/documentPrinter'
import { formatIDR } from '~/utils/currency'

useHead({
  title: 'Annual Report (Laporan Rekapitulasi Tahunan) - Kacetak System'
})

// Search & Filter States
const searchQuery = ref('')
const monthFilter = ref('')
const yearFilter = ref('')
const dateRange = ref<DateRangeValue | null>(null)
const toastMessage = ref('')

const monthOptions = [
  { label: 'All Month', value: '' },
  { label: 'January', value: 'January' },
  { label: 'February', value: 'February' },
  { label: 'March', value: 'March' },
  { label: 'April', value: 'April' },
  { label: 'May', value: 'May' },
  { label: 'June', value: 'June' },
  { label: 'July', value: 'July' },
  { label: 'August', value: 'August' },
  { label: 'September', value: 'September' },
  { label: 'October', value: 'October' },
  { label: 'November', value: 'November' },
  { label: 'December', value: 'December' }
]

const yearOptions = [
  { label: 'All Years', value: '' },
  { label: '2025', value: '2025' },
  { label: '2024', value: '2024' }
]

// Data Composable
const { items, summary, pending, error, refresh } = useAnnualReports({
  search: searchQuery,
  month: monthFilter,
  year: yearFilter,
  dateRange: dateRange
})

// Table Columns (Matching legacy annual-reports.html)
const columns = [
  { key: 'month', label: 'Month', sortable: true },
  { key: 'year', label: 'Year', sortable: true, align: 'center' as const },
  { key: 'totalRevenue', label: 'Total Revenue', sortable: true, align: 'end' as const },
  { key: 'cogs', label: 'Cost of Goods Sold (COGS)', sortable: true, align: 'end' as const },
  { key: 'grossProfit', label: 'Gross Profit', sortable: true, align: 'end' as const },
  { key: 'operatingExpenses', label: 'Operating Expenses', sortable: true, align: 'end' as const },
  { key: 'netProfit', label: 'Net Profit', sortable: true, align: 'end' as const },
  { key: 'netMarginPercent', label: 'Net Margin (%)', sortable: true, align: 'end' as const }
]

// Print & PDF Setup
const printColumns: PrintColumn[] = [
  { key: 'month', label: 'Bulan', align: 'left' },
  { key: 'year', label: 'Tahun', align: 'center' },
  { key: 'totalRevenue', label: 'Total Pendapatan', align: 'right', format: (val) => formatIDR(val) },
  { key: 'cogs', label: 'HPP (COGS)', align: 'right', format: (val) => formatIDR(val) },
  { key: 'grossProfit', label: 'Laba Kotor', align: 'right', format: (val) => formatIDR(val) },
  { key: 'operatingExpenses', label: 'Beban Operasional', align: 'right', format: (val) => formatIDR(val) },
  { key: 'netProfit', label: 'Laba Bersih', align: 'right', format: (val) => formatIDR(val) },
  { key: 'netMarginPercent', label: 'Margin (%)', align: 'right', format: (val) => `${Number(val || 0).toFixed(2).replace('.', ',')}%` }
]

const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

function showToast(msg: string) {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

// CSV Export
function handleExportCsv() {
  const header = ['ID', 'Bulan', 'Tahun', 'Total Pendapatan (IDR)', 'COGS (IDR)', 'Laba Kotor (IDR)', 'Beban Operasional (IDR)', 'Laba Bersih (IDR)', 'Net Margin (%)']
  const rows = items.value.map((item) => [
    `"${item.id}"`,
    `"${item.month}"`,
    `"${item.year}"`,
    `"${item.totalRevenue}"`,
    `"${item.cogs}"`,
    `"${item.grossProfit}"`,
    `"${item.operatingExpenses}"`,
    `"${item.netProfit}"`,
    `"${item.netMarginPercent}%"`
  ])

  // Total Summary Row
  rows.push([
    '"TOTAL"',
    `"Rekapitulasi"`,
    `""`,
    `"${summary.value.totalRevenue}"`,
    `"${summary.value.totalCogs}"`,
    `"${summary.value.totalGrossProfit}"`,
    `"${summary.value.totalOperatingExpenses}"`,
    `"${summary.value.totalNetProfit}"`,
    `"${summary.value.averageNetMarginPercent}%"`
  ])

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [header.join(','), ...rows.map(r => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `annual_report_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('Laporan tahunan rekapitulasi performa berhasil diekspor ke CSV')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Success Toast Notification -->
    <div
      v-if="toastMessage"
      class="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-xs font-semibold text-white shadow-xl transition-all"
    >
      <FeatherIcon name="check-circle" size="16" />
      <span>{{ toastMessage }}</span>
    </div>

    <!-- Header Toolbar -->
    <SalesListHeader
      title="Annual Report"
      subtitle="Annual comprehensive financial performance, gross & net margins breakdown"
      :refreshing="pending"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    >
      <template #actions>
        <button
          type="button"
          title="Export CSV"
          aria-label="Export CSV"
          class="flex size-9 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 transition-colors"
          @click="handleExportCsv"
        >
          <FeatherIcon name="download" :size="16" />
        </button>
      </template>
    </SalesListHeader>

    <!-- 4 KPI Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Revenue -->
      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
          <FeatherIcon name="trending-up" size="22" />
        </div>
        <div>
          <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Pendapatan Tahunan</div>
          <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
            <CurrencyDisplay :value="summary.totalRevenue" align="left" bold />
          </div>
          <div class="text-[11px] text-gray-400">Akumulasi {{ items.length }} Bulan</div>
        </div>
      </div>

      <!-- Total COGS -->
      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
          <FeatherIcon name="shopping-bag" size="22" />
        </div>
        <div>
          <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Total HPP (COGS)</div>
          <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
            <CurrencyDisplay :value="summary.totalCogs" align="left" bold />
          </div>
          <div class="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
            Laba Kotor: {{ formatIDR(summary.totalGrossProfit) }}
          </div>
        </div>
      </div>

      <!-- Total Net Profit -->
      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
          <FeatherIcon name="dollar-sign" size="22" />
        </div>
        <div>
          <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Laba Bersih Tahunan</div>
          <div class="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            <CurrencyDisplay :value="summary.totalNetProfit" align="left" bold />
          </div>
          <div class="text-[11px] text-gray-400">Beban OpEx: {{ formatIDR(summary.totalOperatingExpenses) }}</div>
        </div>
      </div>

      <!-- Average Net Profit Margin -->
      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
          <FeatherIcon name="pie-chart" size="22" />
        </div>
        <div>
          <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Rata-rata Margin Keuntungan</div>
          <div class="text-lg font-bold text-purple-600 dark:text-purple-400">
            {{ summary.averageNetMarginPercent }}%
          </div>
          <div class="text-[11px] text-gray-400 truncate max-w-[170px]" :title="`Puncak: ${summary.highestMonth}`">
            Tertinggi: {{ summary.highestMonth }}
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Feedback with Skeleton Loader -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="8"
      :error="error ? 'Gagal memuat rekapitulasi laporan tahunan. Silakan coba lagi.' : ''"
      @retry="refresh()"
    />

    <!-- Main Data Table (WITHOUT double card wrapping) -->
    <SalesDataTable
      v-if="!pending && !error"
      :columns="columns"
      :items="items"
      :search="searchQuery"
      search-placeholder="Search month or year..."
      @update:search="searchQuery = $event"
      @print="openPrintModal('print')"
      @export-pdf="openPrintModal('pdf')"
      @export-excel="handleExportCsv"
    >
      <!-- Filters Slot -->
      <template #filters>
        <!-- Date Range Filter -->
        <DateRangePicker
          v-model="dateRange"
          placeholder="Filter Rentang Tanggal"
        />

        <!-- Month Dropdown Filter -->
        <TableFilterSelect
          :model-value="monthFilter"
          placeholder="All Month"
          :options="monthOptions"
          @update:model-value="monthFilter = $event"
        />

        <!-- Year Dropdown Filter -->
        <TableFilterSelect
          :model-value="yearFilter"
          placeholder="All Years"
          :options="yearOptions"
          @update:model-value="yearFilter = $event"
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
        <CurrencyDisplay :value="item.totalRevenue" customClass="text-gray-900 dark:text-gray-100 font-semibold" />
      </template>

      <template #cell(cogs)="{ item }">
        <CurrencyDisplay :value="item.cogs" customClass="text-gray-600 dark:text-gray-300" />
      </template>

      <template #cell(grossProfit)="{ item }">
        <CurrencyDisplay :value="item.grossProfit" customClass="text-blue-600 dark:text-blue-400 font-semibold" />
      </template>

      <template #cell(operatingExpenses)="{ item }">
        <CurrencyDisplay :value="item.operatingExpenses" customClass="text-amber-600 dark:text-amber-400" />
      </template>

      <template #cell(netProfit)="{ item }">
        <CurrencyDisplay :value="item.netProfit" customClass="text-emerald-600 dark:text-emerald-400 font-bold" />
      </template>

      <template #cell(netMarginPercent)="{ item }">
        <span class="inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
          {{ Number(item.netMarginPercent || 0).toFixed(2).replace('.', ',') }}%
        </span>
      </template>

      <!-- Table Footer Slot (Exactly matches legacy tfoot TOTAL) -->
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

    <!-- Document Print / PDF Modal -->
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Laporan Rekapitulasi Finansial Tahunan PT. DULANK SEMESTA CIDA"
      subtitle="Ikhtisar Pendapatan, Biaya HPP, Beban Operasional & Laba Bersih Tahunan"
      :columns="printColumns"
      :items="items"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
