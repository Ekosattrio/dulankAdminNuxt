<script setup lang="ts">
import { ref } from 'vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import AnnualReportsStatsWidgets from '~/components/pages/reports/annual/AnnualReportsStatsWidgets.vue'
import AnnualReportsTable from '~/components/pages/reports/annual/AnnualReportsTable.vue'
import { useAnnualReports } from '~/composables/useFinancialReports'
import { useTablePrint } from '~/composables/useTablePrint'
import type { DateRangeValue } from '~/composables/useDateRange'
import type { PrintColumn } from '~/utils/documentPrinter'
import { formatIDR } from '~/utils/currency'

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
      <FeatherIcon name="check-circle" :size="16" />
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

    <!-- 4 KPI Summary Cards (Leaf Component) -->
    <AnnualReportsStatsWidgets :summary="summary" :items-length="items.length" />

    <!-- Loading Feedback with Skeleton Loader -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="8"
      :error="error ? 'Gagal memuat rekapitulasi laporan tahunan. Silakan coba lagi.' : ''"
      @retry="refresh()"
    />

    <!-- Main Data Table (Leaf Component) -->
    <AnnualReportsTable
      v-if="!pending && !error"
      :columns="columns"
      :items="items"
      :search="searchQuery"
      :date-range="dateRange"
      :month="monthFilter"
      :year="yearFilter"
      :month-options="monthOptions"
      :year-options="yearOptions"
      @update:search="searchQuery = $event"
      @update:date-range="dateRange = $event"
      @update:month="monthFilter = $event"
      @update:year="yearFilter = $event"
      @print="openPrintModal('print')"
      @export-pdf="openPrintModal('pdf')"
      @export-excel="handleExportCsv"
    />

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
