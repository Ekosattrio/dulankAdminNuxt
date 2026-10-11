<script setup lang="ts">
import { ref } from 'vue'
import { useSalesReport } from '~/composables/useSalesReports'
import { useTablePrint } from '~/composables/useTablePrint'
import { formatIDR } from '~/utils/currency'
import { downloadSalesReportCsv } from '~/utils/salesReport'
import type { SalesReportItem } from '~~/server/types/reports-sales'

// Components
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'
import SalesReportStatsWidgets from './Sales/SalesReportStatsWidgets.vue'
import SalesReportDetailModal from './Sales/SalesReportDetailModal.vue'
import SalesReportRecordsTable from './Sales/SalesReportRecordsTable.vue'

const { items, search, dateRange, pending, error, refresh, stats } = useSalesReport()
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()
const detailPrint = useTablePrint()

const selectedItem = ref<SalesReportItem | null>(null)
const isDetailOpen = ref(false)

function openDetailModal(item: SalesReportItem) {
  selectedItem.value = item
  isDetailOpen.value = true
}

function closeDetailModal() {
  isDetailOpen.value = false
  selectedItem.value = null
}

const toastMessage = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null
function showToast(msg: string) {
  toastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastMessage.value = '' }, 3500)
}

const printColumns = [
  { key: 'category', label: 'Product Category' },
  { key: 'soldQty', label: 'Sold Qty', align: 'center' as const },
  { key: 'unit', label: 'Unit' },
  { key: 'totalSales', label: 'Total Sales', align: 'right' as const, format: (v: number) => formatIDR(v) },
  { key: 'totalDue', label: 'Total Sales Due', align: 'right' as const, format: (v: number) => formatIDR(v) },
  { key: 'totalAmount', label: 'Total Sales Amount', align: 'right' as const, format: (v: number) => formatIDR(v) },
  { key: 'percentage', label: 'Percentage', align: 'right' as const, format: (v: number) => `${Number(v).toFixed(2)}%` },
]
const detailPrintColumns = [
  { key: 'product', label: 'Product' },
  { key: 'soldQty', label: 'Sold Qty', align: 'center' as const },
  { key: 'unit', label: 'Unit' },
  { key: 'totalRevenue', label: 'Total Revenue', align: 'right' as const, format: (v: number) => formatIDR(v) },
  { key: 'percentage', label: 'Percentage', align: 'right' as const, format: (v: number) => `${Number(v).toFixed(2)}%` },
]

function exportCsv() {
  if (items.value.length === 0) {
    showToast('No sales report data to export')
    return
  }

  downloadSalesReportCsv(items.value)
  showToast('Sales report exported to CSV successfully')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <SalesListHeader
      title="Sales Report"
      subtitle="Manage Your Sales Report"
      :refreshing="pending"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    >
      <template #actions><button type="button" class="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium" @click="exportCsv"><FeatherIcon name="download" :size="14" />Export CSV</button></template>
    </SalesListHeader>

    <!-- 8 KPI Summary Cards (Decomposed) -->
    <SalesReportStatsWidgets :stats="stats" />

    <!-- Feedback & Table -->
    <SalesFeedback
      :pending="pending"
      :error="error?.message || ''"
      :message="toastMessage"
      skeleton="table"
      :skeleton-rows="6"
      :skeleton-cols="8"
      @retry="refresh"
      @dismiss="toastMessage = ''"
    >
      <SalesReportRecordsTable v-model:search="search" v-model:date-range="dateRange" :items="items" @view="openDetailModal" />
    </SalesFeedback>

    <!-- Detail Modal -->
    <SalesReportDetailModal
      :open="isDetailOpen"
      :item="selectedItem"
      :date-range="dateRange"
      @print="detailPrint.openPrintModal('print')"
      @pdf="detailPrint.openPrintModal('pdf')"
      @submit="closeDetailModal"
      @close="closeDetailModal"
    />

    <!-- Print Modal -->
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Sales Report"
      subtitle="Laporan Penjualan Berdasarkan Kategori Produk"
      :columns="printColumns"
      :items="items"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
    <DocumentPrintModal
      :open="detailPrint.isPrintModalOpen.value"
      :title="selectedItem ? `Detail Report Product - ${selectedItem.category}` : 'Detail Report Product'"
      :subtitle="dateRange?.label || 'All Periods'"
      :columns="detailPrintColumns"
      :items="selectedItem?.details || []"
      :default-action="detailPrint.defaultPrintAction.value"
      @close="detailPrint.closePrintModal"
    />
  </div>
</template>
