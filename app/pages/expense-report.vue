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
import { useExpenseReports } from '~/composables/useOperationalReports'
import { useTablePrint } from '~/composables/useTablePrint'
import type { DateRangeValue } from '~/composables/useDateRange'
import type { PrintColumn } from '~/utils/documentPrinter'
import { formatIDR } from '~/utils/currency'

useHead({
  title: 'Expense Report - Kacetak System'
})

// Search & Filter State
const searchQuery = ref('')
const categoryFilter = ref('')
const paymentMethodFilter = ref('')
const dateRange = ref<DateRangeValue | null>(null)
const toastMessage = ref('')

const categoryOptions = [
  'Bahan Baku Percetakan',
  'Gaji Karyawan & Operator',
  'Sewa Gedung / Ruko',
  'Utilitas (Listrik & Air)',
  'Pemeliharaan Mesin',
  'Pemasaran & Iklan Digital',
  'Logistik & Pengiriman',
  'Perlengkapan Kantor (ATK)',
  'Biaya Keamanan & Kebersihan',
  'Biaya Tak Terduga'
]

const paymentMethodOptions = [
  'Bank Transfer',
  'Cash',
  'Petty Cash',
  'Auto Debit',
  'Credit Card'
]

// Data Composable
const { items, summary, pending, error, refresh } = useExpenseReports({
  search: searchQuery,
  category: categoryFilter,
  paymentMethod: paymentMethodFilter,
  dateRange: dateRange
})

// Table Columns (Matching legacy: Kategori, Total Expense, Amount, Percentage)
const columns = [
  { key: 'category', label: 'Kategori', sortable: true },
  { key: 'totalExpense', label: 'Total Expense', sortable: true, align: 'center' as const },
  { key: 'amount', label: 'Amount', sortable: true, align: 'end' as const },
  { key: 'percentage', label: 'Percentage', sortable: true, align: 'end' as const }
]

// Print & PDF Setup
const printColumns: PrintColumn[] = [
  { key: 'category', label: 'Kategori Biaya / Pengeluaran', align: 'left' },
  { key: 'totalExpense', label: 'Total Transaksi', align: 'center', format: (val) => Number(val).toLocaleString('id-ID') },
  { key: 'amount', label: 'Jumlah (IDR)', align: 'right', format: (val) => formatIDR(val) },
  { key: 'percentage', label: 'Persentase', align: 'right', format: (val) => `${Number(val).toFixed(2).replace('.', ',')}%` }
]

const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

// Sum helpers for table footer
function sumTotalExpense(list: typeof items.value): number {
  return list.reduce((acc, cur) => acc + (Number(cur.totalExpense) || 0), 0)
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
  const header = ['ID', 'Kategori', 'Total Transaksi', 'Metode Pembayaran', 'Amount (IDR)', 'Percentage (%)']
  const rows = items.value.map((item) => [
    `"${item.id}"`,
    `"${(item.category || '').replace(/"/g, '""')}"`,
    `"${item.totalExpense}"`,
    `"${(item.paymentMethod || '').replace(/"/g, '""')}"`,
    `"${item.amount}"`,
    `"${item.percentage}"`
  ])

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [header.join(','), ...rows.map(r => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `expense_report_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('Laporan pengeluaran berhasil diekspor ke CSV')
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
      title="Expense Report"
      subtitle="View Reports of Expenses"
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
      <!-- Total Transaksi Beban -->
      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
          <FeatherIcon name="file-text" size="22" />
        </div>
        <div>
          <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Transaksi Beban</div>
          <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
            {{ summary.totalExpensesCount.toLocaleString('id-ID') }} Trx
          </div>
        </div>
      </div>

      <!-- Total Pengeluaran -->
      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
          <FeatherIcon name="dollar-sign" size="22" />
        </div>
        <div>
          <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Pengeluaran</div>
          <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
            <CurrencyDisplay :value="summary.totalExpenseAmount" align="left" bold />
          </div>
        </div>
      </div>

      <!-- Beban Terbesar -->
      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
          <FeatherIcon name="pie-chart" size="22" />
        </div>
        <div>
          <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Beban Terbesar</div>
          <div class="text-sm font-bold text-gray-900 dark:text-gray-100 truncate max-w-[160px]" :title="summary.topExpenseCategory">
            {{ summary.topExpenseCategory }}
          </div>
        </div>
      </div>

      <!-- Rata-rata Beban per Kategori -->
      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
          <FeatherIcon name="trending-down" size="22" />
        </div>
        <div>
          <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Rata-rata / Kategori</div>
          <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
            <CurrencyDisplay :value="summary.averageExpensePerCategory" align="left" bold />
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Feedback with Skeleton Loader -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="4"
      :error="error ? 'Gagal memuat data laporan pengeluaran. Silakan coba lagi.' : ''"
      @retry="refresh()"
    />

    <!-- Main Data Table (WITHOUT double card wrapping) -->
    <SalesDataTable
      v-if="!pending && !error"
      :columns="columns"
      :items="items"
      :search="searchQuery"
      search-placeholder="Search category..."
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

        <!-- Payment Method Filter -->
        <TableFilterSelect
          :model-value="paymentMethodFilter"
          placeholder="All Methods"
          :options="paymentMethodOptions"
          @update:model-value="paymentMethodFilter = $event"
        />

        <!-- Export CSV Button -->
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

      <!-- Cell: Category -->
      <template #cell(category)="{ item }">
        <div class="flex items-center gap-2">
          <span class="size-2 rounded-full bg-rose-500"></span>
          <span class="font-semibold text-gray-900 dark:text-gray-100">
            {{ item.category }}
          </span>
          <span v-if="item.paymentMethod" class="text-[11px] text-gray-400 dark:text-gray-500">
            ({{ item.paymentMethod }})
          </span>
        </div>
      </template>

      <!-- Cell: Total Expense -->
      <template #cell(totalExpense)="{ item }">
        <span class="inline-flex items-center rounded-md bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-semibold text-gray-700 dark:text-gray-300">
          {{ Number(item.totalExpense).toLocaleString('id-ID') }}
        </span>
      </template>

      <!-- Cell: Amount -->
      <template #cell(amount)="{ item }">
        <CurrencyDisplay :value="item.amount" align="right" bold font-mono custom-class="text-rose-600 dark:text-rose-400" />
      </template>

      <!-- Cell: Percentage -->
      <template #cell(percentage)="{ item }">
        <span class="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
          {{ Number(item.percentage).toFixed(2).replace('.', ',') }}%
        </span>
      </template>

      <!-- Table Footer Slot for Totals Matching Legacy -->
      <template #footer="{ items: tableItems }">
        <tr class="border-t-2 border-gray-200 bg-gray-50/80 font-bold text-gray-900 dark:border-gray-700 dark:bg-gray-800/60 dark:text-white">
          <td class="px-4 py-3 text-start">Total</td>
          <td class="px-4 py-3 text-center">
            {{ sumTotalExpense(tableItems).toLocaleString('id-ID') }}
          </td>
          <td class="px-4 py-3 text-end">
            <CurrencyDisplay :value="sumAmount(tableItems)" align="right" bold font-mono custom-class="text-rose-600 dark:text-rose-400" />
          </td>
          <td class="px-4 py-3 text-end">100%</td>
        </tr>
      </template>
    </SalesDataTable>

    <!-- Official PT. DULANK SEMESTA CIDA Document Print & PDF Modal -->
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Expense Report"
      subtitle="Laporan Beban & Arus Kas Keluar - PT. DULANK SEMESTA CIDA"
      :columns="printColumns"
      :items="items"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
