<script setup lang="ts">
import { ref, computed } from 'vue'
import { useSalesReport } from '~/composables/useSalesReports'
import { useTablePrint } from '~/composables/useTablePrint'
import { formatIDR } from '~/utils/currency'
import type { SalesReportItem } from '~~/server/types/reports-sales'

// Components
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

useHead({
  title: 'Sales Report - Kacetak System',
})

const { items, search, category, channel, dateRange, pending, error, refresh, stats } = useSalesReport()
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

// Detail Modal
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
  { key: 'category', label: 'Product Category', sortable: true },
  { key: 'soldQty', label: 'Sold Qty', sortable: true, align: 'center' as const },
  { key: 'unit', label: 'Unit', sortable: true },
  { key: 'totalSales', label: 'Total Sales', sortable: true, align: 'end' as const },
  { key: 'totalDue', label: 'Total Sales Due', sortable: true, align: 'end' as const },
  { key: 'totalAmount', label: 'Total Sales Amount', sortable: true, align: 'end' as const },
  { key: 'percentage', label: 'Percentage', sortable: true, align: 'end' as const },
  { key: 'action', label: 'Action', align: 'center' as const },
]

// Print columns
const printColumns = [
  { key: 'category', label: 'Product Category' },
  { key: 'soldQty', label: 'Sold Qty', align: 'center' as const },
  { key: 'unit', label: 'Unit' },
  { key: 'totalSales', label: 'Total Sales', align: 'right' as const, format: (v: number) => formatIDR(v) },
  { key: 'totalDue', label: 'Total Sales Due', align: 'right' as const, format: (v: number) => formatIDR(v) },
  { key: 'totalAmount', label: 'Total Sales Amount', align: 'right' as const, format: (v: number) => formatIDR(v) },
  { key: 'percentage', label: 'Percentage', align: 'right' as const, format: (v: number) => `${Number(v).toFixed(2)}%` },
]

// Category options
const categoryOptions = computed(() => {
  const set = new Set(items.value.map(i => i.category))
  return Array.from(set)
})

// Channel options
const channelOptions = ['POS', 'Website', 'Quotation', 'Sales Staff']

// Export CSV
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
  <div class="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
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
          class="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          @click="exportCsv"
        >
          <FeatherIcon name="download" :size="14" />
          <span>Export CSV</span>
        </button>
      </template>
    </SalesListHeader>

    <!-- 8 KPI Summary Cards (2 rows x 4 columns) -->
    <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Row 1: Total Sold Unit -->
      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-500 dark:bg-orange-950/40 dark:text-orange-400">
          <FeatherIcon name="package" :size="20" />
        </div>
        <div class="min-w-0">
          <p class="text-xs font-normal text-gray-500 dark:text-gray-400">Total Sold Unit</p>
          <h3 class="truncate text-lg font-bold text-gray-900 dark:text-white">
            {{ stats.totalSoldUnit.toLocaleString('id-ID') }}
          </h3>
        </div>
      </div>

      <!-- Row 1: Total Sales -->
      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-400">
          <FeatherIcon name="dollar-sign" :size="20" />
        </div>
        <div class="min-w-0">
          <p class="text-xs font-normal text-gray-500 dark:text-gray-400">Total Sales</p>
          <h3 class="truncate text-lg font-bold text-gray-900 dark:text-white">
            Rp{{ stats.totalSales.toLocaleString('id-ID') }}
          </h3>
        </div>
      </div>

      <!-- Row 1: Total Sales Due -->
      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-500 dark:bg-cyan-950/40 dark:text-cyan-400">
          <FeatherIcon name="arrow-down" :size="20" />
        </div>
        <div class="min-w-0">
          <p class="text-xs font-normal text-gray-500 dark:text-gray-400">Total Sales Due</p>
          <h3 class="truncate text-lg font-bold text-gray-900 dark:text-white">
            Rp{{ stats.totalDue.toLocaleString('id-ID') }}
          </h3>
        </div>
      </div>

      <!-- Row 1: Total Sales Amount -->
      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-500 dark:bg-rose-950/40 dark:text-rose-400">
          <FeatherIcon name="arrow-up" :size="20" />
        </div>
        <div class="min-w-0">
          <p class="text-xs font-normal text-gray-500 dark:text-gray-400">Total Sales Amount</p>
          <h3 class="truncate text-lg font-bold text-gray-900 dark:text-white">
            Rp{{ stats.totalAmount.toLocaleString('id-ID') }}
          </h3>
        </div>
      </div>

      <!-- Row 2: Point of Sales -->
      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-500 dark:bg-rose-950/40 dark:text-rose-400">
          <FeatherIcon name="shopping-bag" :size="20" />
        </div>
        <div class="min-w-0">
          <p class="text-xs font-normal text-gray-500 dark:text-gray-400">Point of Sales</p>
          <h3 class="truncate text-lg font-bold text-gray-900 dark:text-white">
            Rp{{ stats.posSales.toLocaleString('id-ID') }}
          </h3>
        </div>
      </div>

      <!-- Row 2: Website -->
      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 dark:bg-emerald-950/40 dark:text-emerald-400">
          <FeatherIcon name="globe" :size="20" />
        </div>
        <div class="min-w-0">
          <p class="text-xs font-normal text-gray-500 dark:text-gray-400">Website</p>
          <h3 class="truncate text-lg font-bold text-gray-900 dark:text-white">
            Rp{{ stats.websiteSales.toLocaleString('id-ID') }}
          </h3>
        </div>
      </div>

      <!-- Row 2: Quotation -->
      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-cyan-500 dark:bg-cyan-950/40 dark:text-cyan-400">
          <FeatherIcon name="file-text" :size="20" />
        </div>
        <div class="min-w-0">
          <p class="text-xs font-normal text-gray-500 dark:text-gray-400">Quotation</p>
          <h3 class="truncate text-lg font-bold text-gray-900 dark:text-white">
            Rp{{ stats.quotationSales.toLocaleString('id-ID') }}
          </h3>
        </div>
      </div>

      <!-- Row 2: Sales Staff -->
      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-500 dark:bg-rose-950/40 dark:text-rose-400">
          <FeatherIcon name="users" :size="20" />
        </div>
        <div class="min-w-0">
          <p class="text-xs font-normal text-gray-500 dark:text-gray-400">Sales Staff</p>
          <h3 class="truncate text-lg font-bold text-gray-900 dark:text-white">
            Rp{{ stats.staffSales.toLocaleString('id-ID') }}
          </h3>
        </div>
      </div>
    </div>

    <!-- Feedback & Skeleton -->
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
      <!-- SalesDataTable directly mounted without double cards -->
      <SalesDataTable
        :columns="columns"
        :items="items"
        v-model:search="search"
        search-placeholder="Search"
      >
        <!-- Filter slot -->
        <template #filters>
          <DateRangePicker v-model="dateRange" placeholder="Date" />
        </template>

        <!-- Cell overrides -->
        <template #cell(soldQty)="{ item }">
          <span class="font-normal text-gray-900 dark:text-white">
            {{ Number(item.soldQty).toLocaleString('id-ID') }}
          </span>
        </template>

        <template #cell(totalSales)="{ item }">
          <span class="font-normal text-gray-900 dark:text-white">
            {{ Number(item.totalSales).toLocaleString('id-ID') }}
          </span>
        </template>

        <template #cell(totalDue)="{ item }">
          <span v-if="!item.totalDue || item.totalDue === 0" class="font-medium text-gray-400">-</span>
          <span v-else class="font-normal text-gray-900 dark:text-white">
            {{ Number(item.totalDue).toLocaleString('id-ID') }}
          </span>
        </template>

        <template #cell(totalAmount)="{ item }">
          <span class="font-normal text-gray-900 dark:text-white">
            {{ Number(item.totalAmount).toLocaleString('id-ID') }}
          </span>
        </template>

        <template #cell(percentage)="{ item }">
          <span class="font-normal text-gray-900 dark:text-white">
            {{ Number(item.percentage).toFixed(2) }}%
          </span>
        </template>

        <template #cell(action)="{ item }">
          <div class="flex items-center justify-center">
            <button
              type="button"
              title="View Detail Report Product"
              aria-label="View Detail Report Product"
              class="inline-flex size-8 items-center justify-center rounded border border-gray-200 text-gray-600 transition-colors hover:border-primary hover:text-primary dark:border-gray-700 dark:text-gray-400 dark:hover:text-primary"
              @click="openDetailModal(item)"
            >
              <FeatherIcon name="eye" :size="14" />
            </button>
          </div>
        </template>

        <!-- Footer Total -->
        <template #footer="{ items: filteredList }">
          <tr class="font-bold text-gray-900 dark:text-white">
            <td class="px-4 py-3">TOTAL</td>
            <td class="px-4 py-3 text-center">
              {{ filteredList.reduce((acc, i) => acc + (i.soldQty || 0), 0).toLocaleString('id-ID') }}
            </td>
            <td class="px-4 py-3 text-gray-500">-</td>
            <td class="px-4 py-3 text-end">
              <CurrencyDisplay :value="filteredList.reduce((acc, i) => acc + (i.totalSales || 0), 0)" :bold="true" />
            </td>
            <td class="px-4 py-3 text-end text-amber-600 dark:text-amber-400">
              <CurrencyDisplay :value="filteredList.reduce((acc, i) => acc + (i.totalDue || 0), 0)" :bold="true" />
            </td>
            <td class="px-4 py-3 text-end text-emerald-600 dark:text-emerald-400">
              <CurrencyDisplay :value="filteredList.reduce((acc, i) => acc + (i.totalAmount || 0), 0)" :bold="true" />
            </td>
            <td class="px-4 py-3 text-end">100%</td>
            <td class="px-4 py-3 text-center">-</td>
          </tr>
        </template>
      </SalesDataTable>
    </SalesFeedback>

    <!-- Detail Breakdown Modal -->
    <SalesDialog
      :open="isDetailOpen"
      title="Detail Report Product"
      @close="closeDetailModal"
    >
      <div v-if="selectedItem" class="space-y-4">
        <div class="grid grid-cols-1 gap-2 rounded-lg bg-gray-50 p-4 text-xs sm:grid-cols-2 dark:bg-gray-800/50">
          <div>
            <span class="text-gray-500 dark:text-gray-400">Product Category:</span>
            <span class="ms-2 font-bold text-gray-900 dark:text-white">{{ selectedItem.category }}</span>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">Unit:</span>
            <span class="ms-2 font-bold text-gray-900 dark:text-white">{{ selectedItem.unit }}</span>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">Total Sales:</span>
            <span class="ms-2 font-bold text-gray-900 dark:text-white">
              <CurrencyDisplay :value="selectedItem.totalSales" align="left" />
            </span>
          </div>
          <div>
            <span class="text-gray-500 dark:text-gray-400">Total Due:</span>
            <span class="ms-2 font-bold text-amber-600 dark:text-amber-400">
              <CurrencyDisplay :value="selectedItem.totalDue" align="left" />
            </span>
          </div>
        </div>

        <div v-if="selectedItem.details && selectedItem.details.length > 0" class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
            <thead class="border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-600 dark:border-gray-700 dark:bg-gray-800/60 dark:text-gray-400">
              <tr>
                <th class="px-3 py-2 text-start">Product</th>
                <th class="px-3 py-2 text-center">Sold Qty</th>
                <th class="px-3 py-2 text-start">Unit</th>
                <th class="px-3 py-2 text-end">Total Revenue</th>
                <th class="px-3 py-2 text-end">Percentage</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="(detail, idx) in selectedItem.details" :key="idx" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
                <td class="px-3 py-2 font-medium text-gray-900 dark:text-white">{{ detail.product }}</td>
                <td class="px-3 py-2 text-center">{{ detail.soldQty.toLocaleString('id-ID') }}</td>
                <td class="px-3 py-2">{{ detail.unit }}</td>
                <td class="px-3 py-2 text-end">
                  <CurrencyDisplay :value="detail.totalRevenue" />
                </td>
                <td class="px-3 py-2 text-end font-semibold">{{ Number(detail.percentage).toFixed(2) }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="text-center text-xs text-gray-500 dark:text-gray-400">
          No sub-product breakdown data for this category.
        </p>

        <div class="flex justify-end pt-2">
          <button
            type="button"
            class="inline-flex min-h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
            @click="closeDetailModal"
          >
            Close
          </button>
        </div>
      </div>
    </SalesDialog>

    <!-- Standard Document Print & PDF Modal (Kop Surat PT. DULANK SEMESTA CIDA) -->
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
