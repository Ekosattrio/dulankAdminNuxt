<script setup lang="ts">
import { ref } from 'vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import ProductReportStatsWidgets from '~/components/Pages/Reports/Product/ProductReportStatsWidgets.vue'
import ProductReportTable from '~/components/Pages/Reports/Product/ProductReportTable.vue'
import { useProductReports } from '~/composables/useOperationalReports'
import { useTablePrint } from '~/composables/useTablePrint'
import type { DateRangeValue } from '~/composables/useDateRange'
import type { PrintColumn } from '~/utils/documentPrinter'
import { formatIDR } from '~/utils/currency'

// Search & Filter State
const searchQuery = ref('')
const categoryFilter = ref('')
const dateRange = ref<DateRangeValue | null>(null)
const toastMessage = ref('')

const categoryOptions = [
  'Large Format',
  'Offset',
  'Digital Print',
  'Apparel',
  'Merchandise'
]

// Data Composable
const { items, summary, pending, error, refresh } = useProductReports({
  search: searchQuery,
  category: categoryFilter,
  dateRange: dateRange
})

// Table Columns
const columns = [
  { key: 'product', label: 'Product', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'totalOrder', label: 'Total Order', sortable: true, align: 'center' as const },
  { key: 'unit', label: 'Unit', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true, align: 'end' as const },
  { key: 'percentage', label: 'Percentage', sortable: true, align: 'end' as const }
]

// Print & PDF Setup
const printColumns: PrintColumn[] = [
  { key: 'product', label: 'Product', align: 'left' },
  { key: 'category', label: 'Category', align: 'left' },
  { key: 'totalOrder', label: 'Total Order', align: 'center', format: (val) => Number(val).toLocaleString('id-ID') },
  { key: 'unit', label: 'Unit', align: 'center' },
  { key: 'amount', label: 'Amount', align: 'right', format: (val) => formatIDR(val) },
  { key: 'percentage', label: 'Percentage', align: 'right', format: (val) => `${Number(val).toFixed(2).replace('.', ',')}%` }
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
  const header = ['ID', 'Product', 'Category', 'Total Order', 'Unit', 'Amount (IDR)', 'Percentage (%)']
  const rows = items.value.map((item) => [
    `"${item.id}"`,
    `"${(item.product || '').replace(/"/g, '""')}"`,
    `"${(item.category || '').replace(/"/g, '""')}"`,
    `"${item.totalOrder}"`,
    `"${item.unit}"`,
    `"${item.amount}"`,
    `"${item.percentage}"`
  ])

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [header.join(','), ...rows.map(r => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `product_report_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('Laporan produk berhasil diekspor ke CSV')
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
      title="Product Report"
      subtitle="View Reports of Products"
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
    <ProductReportStatsWidgets :summary="summary" />

    <!-- Loading Feedback with Skeleton Loader -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="6"
      :error="error ? 'Gagal memuat data laporan produk. Silakan coba lagi.' : ''"
      @retry="refresh()"
    />

    <!-- Main Data Table (Leaf Component) -->
    <ProductReportTable
      v-if="!pending && !error"
      :columns="columns"
      :items="items"
      :search="searchQuery"
      :date-range="dateRange"
      :category="categoryFilter"
      :category-options="categoryOptions"
      @update:search="searchQuery = $event"
      @update:date-range="dateRange = $event"
      @update:category="categoryFilter = $event"
      @export-csv="handleExportCsv"
      @print="openPrintModal('print')"
      @export-pdf="openPrintModal('pdf')"
    />

    <!-- Official PT. DULANK SEMESTA CIDA Document Print & PDF Modal -->
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Product Report"
      subtitle="Laporan Kinerja Penjualan Produk - PT. DULANK SEMESTA CIDA"
      :columns="printColumns"
      :items="items"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
