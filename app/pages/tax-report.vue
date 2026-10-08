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
import SalesStatusBadge from '~/components/sales/SalesStatusBadge.vue'
import { useTaxReports } from '~/composables/useFinancialReports'
import { useTablePrint } from '~/composables/useTablePrint'
import type { DateRangeValue } from '~/composables/useDateRange'
import type { PrintColumn } from '~/utils/documentPrinter'
import { formatIDR } from '~/utils/currency'

useHead({
  title: 'Tax Report (PPN & Fiskal) - Kacetak System'
})

// Search & Filter States
const searchQuery = ref('')
const yearFilter = ref('')
const statusFilter = ref('')
const dateRange = ref<DateRangeValue | null>(null)
const toastMessage = ref('')

const yearOptions = [
  { label: 'All Years', value: '' },
  { label: '2025', value: '2025' },
  { label: '2024', value: '2024' }
]

const statusOptions = [
  { label: 'All Status', value: '' },
  { label: 'Issued', value: 'Issued' },
  { label: 'Reported', value: 'Reported' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Paid', value: 'Paid' }
]

// Data Composable
const { items, summary, pending, error, refresh } = useTaxReports({
  search: searchQuery,
  year: yearFilter,
  status: statusFilter,
  dateRange: dateRange
})

// Table Columns (Matching legacy tax-report.html)
const columns = [
  { key: 'month', label: 'Month', sortable: true },
  { key: 'year', label: 'Year', sortable: true, align: 'center' as const },
  { key: 'outputTax', label: 'Output Tax (IDR)', sortable: true, align: 'end' as const },
  { key: 'inputTax', label: 'Input Tax (IDR)', sortable: true, align: 'end' as const },
  { key: 'carryOverTax', label: 'Input Tax (Carry Over)', sortable: true, align: 'end' as const },
  { key: 'netTax', label: 'VAT is under or (over) paid', sortable: true, align: 'end' as const },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const }
]

// Print & PDF Setup
const printColumns: PrintColumn[] = [
  { key: 'month', label: 'Masa Pajak (Bulan)', align: 'left' },
  { key: 'year', label: 'Tahun', align: 'center' },
  { key: 'outputTax', label: 'Pajak Keluaran (PPN)', align: 'right', format: (val) => formatIDR(val) },
  { key: 'inputTax', label: 'Pajak Masukan (PPN)', align: 'right', format: (val) => formatIDR(val) },
  { key: 'carryOverTax', label: 'Kompensasi Bulan Lalu', align: 'right', format: (val) => formatIDR(val) },
  {
    key: 'netTax',
    label: 'Kurang / (Lebih) Bayar',
    align: 'right',
    format: (val) => {
      const num = Number(val) || 0
      return `${num < 0 ? `(${formatIDR(Math.abs(num))})` : formatIDR(num)}`
    }
  },
  { key: 'status', label: 'Status SPT', align: 'center' }
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
  const header = ['ID', 'Bulan', 'Tahun', 'Pajak Keluaran (IDR)', 'Pajak Masukan (IDR)', 'Kompensasi (IDR)', 'PPN Kurang/(Lebih) Bayar', 'Status']
  const rows = items.value.map((item) => [
    `"${item.id}"`,
    `"${item.month}"`,
    `"${item.year}"`,
    `"${item.outputTax}"`,
    `"${item.inputTax}"`,
    `"${item.carryOverTax}"`,
    `"${item.netTax}"`,
    `"${item.status}"`
  ])

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [header.join(','), ...rows.map(r => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `tax_report_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('Laporan pajak SPT Masa PPN berhasil diekspor ke CSV')
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
      title="Tax Report"
      subtitle="Manage your monthly VAT / PPN and fiscal tax statements"
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
      <!-- Total Pajak Keluaran (Output Tax) -->
      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
          <FeatherIcon name="file-text" size="22" />
        </div>
        <div>
          <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Pajak Keluaran (PPN)</div>
          <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
            <CurrencyDisplay :value="summary.totalOutputTax" align="left" bold />
          </div>
          <div class="text-[11px] text-gray-400">Faktur Pajak Penjualan</div>
        </div>
      </div>

      <!-- Total Pajak Masukan (Input Tax) -->
      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
          <FeatherIcon name="arrow-down-left" size="22" />
        </div>
        <div>
          <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Pajak Masukan (PPN)</div>
          <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
            <CurrencyDisplay :value="summary.totalInputTax" align="left" bold />
          </div>
          <div class="text-[11px] text-gray-400">Faktur Pembelian Bahan Baku</div>
        </div>
      </div>

      <!-- Total Kompensasi (Carry Over) -->
      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400">
          <FeatherIcon name="refresh-cw" size="22" />
        </div>
        <div>
          <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">Total Kompensasi</div>
          <div class="text-lg font-bold text-gray-900 dark:text-gray-100">
            <CurrencyDisplay :value="summary.totalCarryOver" align="left" bold />
          </div>
          <div class="text-[11px] text-gray-400">Kompensasi Lebih Bayar</div>
        </div>
      </div>

      <!-- Total PPN Net Kurang / Lebih Bayar -->
      <div class="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div
          class="flex h-12 w-12 items-center justify-center rounded-lg"
          :class="summary.totalNetTax >= 0
            ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
            : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'"
        >
          <FeatherIcon :name="summary.totalNetTax >= 0 ? 'alert-circle' : 'check-circle'" size="22" />
        </div>
        <div>
          <div class="text-xs font-semibold text-gray-500 dark:text-gray-400">
            {{ summary.totalNetTax >= 0 ? 'Total Kurang Bayar (Net)' : 'Total Lebih Bayar (Net)' }}
          </div>
          <div
            class="text-lg font-bold"
            :class="summary.totalNetTax >= 0
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-emerald-600 dark:text-emerald-400'"
          >
            <CurrencyDisplay :value="Math.abs(summary.totalNetTax)" align="left" bold />
          </div>
          <div class="text-[11px] text-gray-400">
            {{ summary.underpaidMonthsCount }} bln Kurang / {{ summary.overpaidMonthsCount }} bln Lebih
          </div>
        </div>
      </div>
    </div>

    <!-- Loading Feedback with Skeleton Loader -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="7"
      :error="error ? 'Gagal memuat data laporan pajak. Silakan coba lagi.' : ''"
      @retry="refresh()"
    />

    <!-- Main Data Table (WITHOUT double card wrapping) -->
    <SalesDataTable
      v-if="!pending && !error"
      :columns="columns"
      :items="items"
      :search="searchQuery"
      search-placeholder="Search month or notes..."
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

        <!-- Year Dropdown Filter -->
        <TableFilterSelect
          :model-value="yearFilter"
          placeholder="All Years"
          :options="yearOptions"
          @update:model-value="yearFilter = $event"
        />

        <!-- Status Dropdown Filter -->
        <TableFilterSelect
          :model-value="statusFilter"
          placeholder="All Status"
          :options="statusOptions"
          @update:model-value="statusFilter = $event"
        />
      </template>

      <!-- Cell Overrides -->
      <template #cell(month)="{ item }">
        <div class="font-medium text-gray-900 dark:text-white">
          {{ item.month }}
        </div>
        <div v-if="item.notes" class="text-[11px] text-gray-400 truncate max-w-[220px]" :title="item.notes">
          {{ item.notes }}
        </div>
      </template>

      <template #cell(year)="{ item }">
        <span class="inline-flex rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {{ item.year }}
        </span>
      </template>

      <template #cell(outputTax)="{ item }">
        <CurrencyDisplay :value="item.outputTax" />
      </template>

      <template #cell(inputTax)="{ item }">
        <CurrencyDisplay :value="item.inputTax" />
      </template>

      <template #cell(carryOverTax)="{ item }">
        <CurrencyDisplay :value="item.carryOverTax" />
      </template>

      <template #cell(netTax)="{ item }">
        <div class="flex items-center justify-end gap-1.5">
          <span
            class="text-xs font-bold"
            :class="item.netTax < 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'"
          >
            {{ item.netTax < 0 ? '-' : '' }}<CurrencyDisplay :value="Math.abs(item.netTax)" />
          </span>
          <span
            class="rounded px-1.5 py-0.5 text-[10px] font-semibold"
            :class="item.netTax < 0
              ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'"
          >
            {{ item.netTax < 0 ? 'LB' : 'KB' }}
          </span>
        </div>
      </template>

      <template #cell(status)="{ item }">
        <SalesStatusBadge :status="item.status || 'Issued'" />
      </template>

      <!-- Table Footer Slot -->
      <template #footer="{ items: filteredList }">
        <tr>
          <td colspan="2" class="px-4 py-3 text-start font-bold uppercase tracking-wider text-gray-900 dark:text-white">
            TOTAL ({{ filteredList.length }} Bulan)
          </td>
          <td class="px-4 py-3 text-end font-bold text-indigo-600 dark:text-indigo-400">
            <CurrencyDisplay :value="filteredList.reduce((acc: number, c: any) => acc + (Number(c.outputTax) || 0), 0)" />
          </td>
          <td class="px-4 py-3 text-end font-bold text-amber-600 dark:text-amber-400">
            <CurrencyDisplay :value="filteredList.reduce((acc: number, c: any) => acc + (Number(c.inputTax) || 0), 0)" />
          </td>
          <td class="px-4 py-3 text-end font-bold text-sky-600 dark:text-sky-400">
            <CurrencyDisplay :value="filteredList.reduce((acc: number, c: any) => acc + (Number(c.carryOverTax) || 0), 0)" />
          </td>
          <td class="px-4 py-3 text-end font-bold">
            <span
              :class="filteredList.reduce((acc: number, c: any) => acc + (Number(c.netTax) || 0), 0) < 0
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-emerald-600 dark:text-emerald-400'"
            >
              <CurrencyDisplay :value="filteredList.reduce((acc: number, c: any) => acc + (Number(c.netTax) || 0), 0)" />
            </span>
          </td>
          <td></td>
        </tr>
      </template>
    </SalesDataTable>

    <!-- Document Print / PDF Modal -->
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Laporan Pajak Masa (PPN) PT. DULANK SEMESTA CIDA"
      subtitle="Rekapitulasi Faktur Pajak Keluaran, Pajak Masukan & Kompensasi Masa Pajak"
      :columns="printColumns"
      :items="items"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
