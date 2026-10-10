<script setup lang="ts">
import { ref } from 'vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import ExpenseReportStatsWidgets from '~/components/Pages/Reports/Expense/ExpenseReportStatsWidgets.vue'
import ExpenseReportTable from '~/components/Pages/Reports/Expense/ExpenseReportTable.vue'
import { useExpenseReports } from '~/composables/useOperationalReports'
import { useTablePrint } from '~/composables/useTablePrint'
import type { DateRangeValue } from '~/composables/useDateRange'
import type { PrintColumn } from '~/utils/documentPrinter'
import { formatIDR } from '~/utils/currency'

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
      <FeatherIcon name="check-circle" :size="16" />
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

    <!-- 4 KPI Summary Cards (Leaf Component) -->
    <ExpenseReportStatsWidgets :summary="summary" />

    <!-- Loading Feedback with Skeleton Loader -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="4"
      :error="error ? 'Gagal memuat data laporan pengeluaran. Silakan coba lagi.' : ''"
      @retry="refresh()"
    />

    <!-- Main Data Table (Leaf Component) -->
    <ExpenseReportTable
      v-if="!pending && !error"
      :columns="columns"
      :items="items"
      :search="searchQuery"
      :date-range="dateRange"
      :category="categoryFilter"
      :payment-method="paymentMethodFilter"
      :category-options="categoryOptions"
      :payment-method-options="paymentMethodOptions"
      @update:search="searchQuery = $event"
      @update:date-range="dateRange = $event"
      @update:category="categoryFilter = $event"
      @update:payment-method="paymentMethodFilter = $event"
      @export-csv="handleExportCsv"
      @print="openPrintModal('print')"
      @export-pdf="openPrintModal('pdf')"
    />

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
