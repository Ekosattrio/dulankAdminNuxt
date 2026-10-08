<script setup lang="ts">
import { ref, computed } from 'vue'
import { useInvoiceReport } from '~/composables/useSalesReports'
import { useTablePrint } from '~/composables/useTablePrint'
import { formatIDR } from '~/utils/currency'

// Components
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

useHead({
  title: 'Invoice Report - Kacetak System',
})

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
          class="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          @click="exportCsv"
        >
          <FeatherIcon name="download" :size="14" />
          <span>Export CSV</span>
        </button>
      </template>
    </SalesListHeader>

    <!-- 4 KPI Summary Cards -->
    <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
          <FeatherIcon name="file-text" :size="22" />
        </div>
        <div class="min-w-0">
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Invoices</p>
          <h3 class="truncate text-lg font-bold text-gray-900 dark:text-white">
            {{ stats.totalInvoices.toLocaleString('id-ID') }}
          </h3>
        </div>
      </div>

      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
          <FeatherIcon name="trending-up" :size="22" />
        </div>
        <div class="min-w-0">
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Gross Revenue</p>
          <h3 class="truncate text-lg font-bold text-emerald-600 dark:text-emerald-400">
            <CurrencyDisplay :value="stats.totalGrossRevenue" :bold="true" align="left" />
          </h3>
        </div>
      </div>

      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
          <FeatherIcon name="dollar-sign" :size="22" />
        </div>
        <div class="min-w-0">
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Net Sales</p>
          <h3 class="truncate text-lg font-bold text-gray-900 dark:text-white">
            <CurrencyDisplay :value="stats.totalNetSales" :bold="true" align="left" />
          </h3>
        </div>
      </div>

      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400">
          <FeatherIcon name="check-circle" :size="22" />
        </div>
        <div class="min-w-0">
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Avg Collection Rate</p>
          <h3 class="truncate text-lg font-bold text-teal-600 dark:text-teal-400">
            {{ stats.avgCollectionRate }}%
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
      :skeleton-cols="9"
      @retry="refresh"
      @dismiss="toastMessage = ''"
    >
      <!-- SalesDataTable directly mounted without double cards -->
      <SalesDataTable
        :columns="columns"
        :items="items"
        v-model:search="search"
        search-placeholder="Search month or year..."
      >
        <!-- Filter slot -->
        <template #filters>
          <DateRangePicker v-model="dateRange" placeholder="Date" />
          <TableFilterSelect
            v-model="month"
            :options="monthOptions"
            placeholder="All Months"
            aria-label="Filter by Month"
          />
          <TableFilterSelect
            v-model="year"
            :options="yearOptions"
            placeholder="All Years"
            aria-label="Filter by Year"
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
    </SalesFeedback>

    <!-- Standard Document Print & PDF Modal (Kop Surat PT. DULANK SEMESTA CIDA) -->
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
