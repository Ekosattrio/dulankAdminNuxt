<script setup lang="ts">
import { ref, computed } from 'vue'
import { useInvoiceReport } from '~/composables/useSalesReports'
import { useTablePrint } from '~/composables/useTablePrint'
import { formatIDR } from '~/utils/currency'

// Leaf Components
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import InvoiceReportStatsWidgets from '~/components/pages/reports/invoice/InvoiceReportStatsWidgets.vue'
import InvoiceReportTable from '~/components/pages/reports/invoice/InvoiceReportTable.vue'

const { items, search, month, year, dateRange, pending, error, refresh, stats } = useInvoiceReport()
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

// Toast
const toastMessage = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null
function showToast(msg: string) {
  toastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

// Columns definition for SalesDataTable
const columns = [
  { key: 'month', label: 'Month', sortable: true },
  { key: 'year', label: 'Year', sortable: true, align: 'center' as const },
  { key: 'totalInvoice', label: 'Total Invoice', sortable: true, align: 'center' as const },
  { key: 'netSales', label: 'Net Sales', sortable: true, align: 'end' as const },
  { key: 'deliveryFee', label: 'Delivery Fee', sortable: true, align: 'end' as const },
  { key: 'totalTax', label: 'Total Tax 11%', sortable: true, align: 'end' as const },
  { key: 'totalDiscount', label: 'Total Discount', sortable: true, align: 'end' as const },
  { key: 'grossRevenue', label: 'Gross Revenue', sortable: true, align: 'end' as const },
  { key: 'collectionRate', label: 'Collection Rate', sortable: true, align: 'end' as const },
]

// Print columns
const printColumns = [
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year', align: 'center' as const },
  { key: 'totalInvoice', label: 'Total Invoice', align: 'center' as const },
  { key: 'netSales', label: 'Net Sales', align: 'right' as const, format: (v: number) => formatIDR(v) },
  { key: 'deliveryFee', label: 'Delivery Fee', align: 'right' as const, format: (v: number) => formatIDR(v) },
  { key: 'totalTax', label: 'Total Tax 11%', align: 'right' as const, format: (v: number) => formatIDR(v) },
  { key: 'totalDiscount', label: 'Total Discount', align: 'right' as const, format: (v: number) => formatIDR(v) },
  { key: 'grossRevenue', label: 'Gross Revenue', align: 'right' as const, format: (v: number) => formatIDR(v) },
  { key: 'collectionRate', label: 'Collection Rate', align: 'right' as const, format: (v: number) => `${v}%` },
]

// Month options
const monthOptions = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// Year options
const yearOptions = computed(() => {
  const set = new Set(items.value.map(i => String(i.year)))
  return Array.from(set).sort()
})

// Export CSV
function exportCsv() {
  if (items.value.length === 0) {
    showToast('No invoice report data to export')
    return
  }

  const headers = [
    'Month',
    'Year',
    'Total Invoice',
    'Net Sales',
    'Delivery Fee',
    'Total Tax 11%',
    'Total Discount',
    'Gross Revenue',
    'Collection Rate'
  ]
  const rows = items.value.map(item => [
    `"${item.month}"`,
    item.year,
    item.totalInvoice,
    item.netSales,
    item.deliveryFee,
    item.totalTax,
    item.totalDiscount,
    item.grossRevenue,
    `"${item.collectionRate}%"`,
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `invoice_report_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('Invoice report exported to CSV successfully')
}
</script>

<template>
  <div class="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
    <!-- Header -->
    <SalesListHeader
      title="Invoice Report"
      subtitle="Manage your monthly invoice collection and sales revenue report"
      :refreshing="pending"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    >
      <template #actions>
        <button
          type="button"
          title="Export CSV"
          aria-label="Export CSV"
          class="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          @click="exportCsv"
        >
          <FeatherIcon name="download" :size="14" />
          <span>Export CSV</span>
        </button>
      </template>
    </SalesListHeader>

    <!-- 4 KPI Summary Cards (Leaf Component) -->
    <InvoiceReportStatsWidgets :stats="stats" />

    <!-- Feedback & Skeleton -->
    <SalesFeedback
      :pending="pending"
      :error="error?.message || ''"
      :message="toastMessage"
      skeleton="table"
      :skeleton-rows="6"
      :skeleton-cols="9"
      @retry="refresh"
      @dismiss="toastMessage = ''"
    >
      <!-- SalesDataTable (Leaf Component) -->
      <InvoiceReportTable
        :items="items"
        :columns="columns"
        :search="search"
        :date-range="dateRange"
        :month="month"
        :year="year"
        :month-options="monthOptions"
        :year-options="yearOptions"
        @update:search="search = $event"
        @update:date-range="dateRange = $event"
        @update:month="month = $event"
        @update:year="year = $event"
      />
    </SalesFeedback>

    <!-- Standard Document Print & PDF Modal -->
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Invoice Report"
      subtitle="Laporan Pendapatan dan Penagihan Invoice Bulanan"
      :columns="printColumns"
      :items="items"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
