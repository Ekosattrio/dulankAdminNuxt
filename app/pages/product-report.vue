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
import { useProductReports } from '~/composables/useOperationalReports'
import { useTablePrint } from '~/composables/useTablePrint'
import type { DateRangeValue } from '~/composables/useDateRange'
import type { PrintColumn } from '~/utils/documentPrinter'
import { formatIDR } from '~/utils/currency'

useHead({
  title: 'Product Report - Kacetak System'
})

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

// Filtered items sum calculations for table footer
function sumTotalOrder(list: typeof items.value): number {
  return list.reduce((acc, cur) => acc + (Number(cur.totalOrder) || 0), 0)
}

function sumAmount(list: typeof items.value): number {
  return list.reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0)
}

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
      <FeatherIcon name="check-circle" size="16" />
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

    <!-- 4 KPI Summary Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Order / Sold Qty -->
      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary-900/30 dark:text-primary-400">
          <FeatherIcon name="package" size="22" />
        </div>
        <div>
          <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Produk Dipesan</div>
          <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
            {{ summary.totalOrders.toLocaleString('id-ID') }}
          </div>
        </div>
      </div>

      <!-- Total Revenue -->
      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
          <FeatherIcon name="dollar-sign" size="22" />
        </div>
        <div>
          <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Revenue</div>
          <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
            <CurrencyDisplay :value="summary.totalRevenue" align="left" bold />
          </div>
        </div>
      </div>

      <!-- Kategori Terlaris -->
      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
          <FeatherIcon name="trending-up" size="22" />
        </div>
        <div>
          <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Kategori Terlaris</div>
          <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
            {{ summary.topCategory }}
          </div>
        </div>
      </div>

      <!-- Rata-rata Penjualan / Item -->
      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
          <FeatherIcon name="bar-chart-2" size="22" />
        </div>
        <div>
          <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Rata-rata / Produk</div>
          <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
            <CurrencyDisplay :value="summary.averageOrderValue" align="left" bold />
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Feedback with Skeleton Loader -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="6"
      :error="error ? 'Gagal memuat data laporan produk. Silakan coba lagi.' : ''"
      @retry="refresh()"
    />

    <!-- Main Data Table (WITHOUT double card wrapping) -->
    <SalesDataTable
      v-if="!pending && !error"
      :columns="columns"
      :items="items"
      :search="searchQuery"
      search-placeholder="Search product..."
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

        <!-- Category Dropdown Filter -->
        <TableFilterSelect
          :model-value="categoryFilter"
          placeholder="All Categories"
          :options="categoryOptions"
          @update:model-value="categoryFilter = $event"
        />

        <!-- Export CSV Button in filters -->
        <button
          type="button"
          title="Export CSV"
          class="flex h-9 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750 transition-colors"
          @click="handleExportCsv"
        >
          <FeatherIcon name="download" size="14" />
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
