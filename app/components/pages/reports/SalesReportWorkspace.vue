<script setup lang="ts">
import { ref } from 'vue'
import { useSalesReport } from '~/composables/useSalesReports'
import { useTablePrint } from '~/composables/useTablePrint'
import { formatIDR } from '~/utils/currency'
import type { SalesReportItem } from '~~/server/types/reports-sales'

// Components
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import SalesReportStatsWidgets from './sales/SalesReportStatsWidgets.vue'
import SalesReportDetailModal from './sales/SalesReportDetailModal.vue'

const { items, search, category, channel, dateRange, pending, error, refresh, stats } = useSalesReport()
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

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

const columns = [
  { key: 'category', label: 'Product Category', sortable: true },
  { key: 'soldQty', label: 'Sold Qty', sortable: true, align: 'center' as const },
  { key: 'unit', label: 'Unit', sortable: true },
  { key: 'totalSales', label: 'Total Sales', sortable: true, align: 'end' as const },
  { key: 'totalDue', label: 'Total Sales Due', sortable: true, align: 'end' as const },
  { key: 'totalAmount', label: 'Total Sales Amount', sortable: true, align: 'end' as const },
  { key: 'percentage', label: 'Percentage', sortable: true, align: 'end' as const },
  { key: 'action', label: 'Action', align: 'center' as const },
]

const printColumns = [
  { key: 'category', label: 'Product Category' },
  { key: 'soldQty', label: 'Sold Qty', align: 'center' as const },
  { key: 'unit', label: 'Unit' },
  { key: 'totalSales', label: 'Total Sales', align: 'right' as const, format: (v: number) => formatIDR(v) },
  { key: 'totalDue', label: 'Total Sales Due', align: 'right' as const, format: (v: number) => formatIDR(v) },
  { key: 'totalAmount', label: 'Total Sales Amount', align: 'right' as const, format: (v: number) => formatIDR(v) },
  { key: 'percentage', label: 'Percentage', align: 'right' as const, format: (v: number) => `${Number(v).toFixed(2)}%` },
]

function exportCsv() {
  if (items.value.length === 0) {
    showToast('No sales report data to export')
    return
  }

  const headers = ['Category', 'Sold Qty', 'Unit', 'Total Sales', 'Total Due', 'Total Amount', 'Percentage']
  const rows = items.value.map(item => [
    `"${item.category}"`,
    item.soldQty,
    `"${item.unit}"`,
    item.totalSales,
    item.totalDue,
    item.totalAmount,
    `"${Number(item.percentage).toFixed(2)}%"`,
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `sales_report_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
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
      <SalesDataTable
        :columns="columns"
        :items="items"
        v-model:search="search"
        search-placeholder="Search"
      >
        <template #filters>
          <div class="flex flex-wrap items-center gap-2">
            <DateRangePicker
              v-model="dateRange"
              input-class="h-9 w-60 rounded-md border border-gray-200 bg-white px-3 text-xs text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            />
            <select
              v-model="category"
              class="h-9 rounded-md border border-gray-200 bg-white px-3 text-xs text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              <option value="">All Categories</option>
              <option value="Offset Printing">Offset Printing</option>
              <option value="Digital Printing">Digital Printing</option>
              <option value="Large Format">Large Format</option>
              <option value="Packaging & Box">Packaging & Box</option>
              <option value="Merchandise">Merchandise</option>
            </select>
            <select
              v-model="channel"
              class="h-9 rounded-md border border-gray-200 bg-white px-3 text-xs text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              <option value="">All Channels</option>
              <option value="POS">POS</option>
              <option value="Website">Website</option>
              <option value="Quotation">Quotation</option>
              <option value="Sales Staff">Sales Staff</option>
            </select>
          </div>
        </template>

        <template #cell(category)="{ item }">
          <span class="font-medium text-gray-900 dark:text-white">{{ item.category }}</span>
        </template>

        <template #cell(soldQty)="{ item }">
          <span class="font-mono">{{ item.soldQty.toLocaleString('id-ID') }}</span>
        </template>

        <template #cell(totalSales)="{ item }">
          <CurrencyDisplay :value="item.totalSales" />
        </template>

        <template #cell(totalDue)="{ item }">
          <CurrencyDisplay :value="item.totalDue" />
        </template>

        <template #cell(totalAmount)="{ item }">
          <CurrencyDisplay :value="item.totalAmount" />
        </template>

        <template #cell(percentage)="{ item }">
          <span class="font-semibold text-gray-800 dark:text-gray-200">{{ Number(item.percentage).toFixed(2) }}%</span>
        </template>

        <template #cell(action)="{ item }">
          <button
            type="button"
            class="inline-flex size-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-850"
            title="View Details"
            @click="openDetailModal(item)"
          >
            <FeatherIcon name="eye" :size="14" />
          </button>
        </template>
      </SalesDataTable>
    </SalesFeedback>

    <!-- Detail Modal -->
    <SalesReportDetailModal
      :open="isDetailOpen"
      :item="selectedItem"
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
  </div>
</template>
