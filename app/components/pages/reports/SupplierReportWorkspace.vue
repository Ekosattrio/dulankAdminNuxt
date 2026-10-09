<script setup lang="ts">
import { ref, computed } from 'vue'
import type { SupplierReportItem } from '~~/server/types/reports-stakeholders'
import { useSupplierReport } from '~/composables/useStakeholderReports'
import { useTablePrint } from '~/composables/useTablePrint'
import { formatIDR } from '~/utils/currency'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import SupplierReportStatsWidgets from '~/components/pages/reports/supplier/SupplierReportStatsWidgets.vue'
import SupplierReportDetailModal from '~/components/pages/reports/supplier/SupplierReportDetailModal.vue'

const { items, search, status, category, dateRange, pending, error, refresh, stats } = useSupplierReport()

// Columns for data table
const columns = [
  { key: 'date', label: 'Date', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'purchaseItem', label: 'Purchase Item', sortable: true },
  { key: 'supplierName', label: 'Supplier', sortable: true },
  { key: 'qty', label: 'Qty', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'amount', label: 'Amount', sortable: true, align: 'end' as const, class: 'text-end' },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center' },
]

// Print & PDF
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const printColumns = [
  { key: 'date', label: 'Date' },
  { key: 'supplierName', label: 'Supplier Name' },
  { key: 'category', label: 'Category' },
  { key: 'purchaseItem', label: 'Purchase Item' },
  { key: 'qty', label: 'Qty', align: 'center' as const },
  { key: 'amount', label: 'Amount (IDR)', align: 'right' as const, format: (val: number) => formatIDR(val) },
  { key: 'status', label: 'Status', align: 'center' as const },
]

// Export to CSV
function handleExportCsv() {
  const header = ['ID', 'Date', 'Supplier Name', 'Category', 'Purchase Item', 'Qty', 'Amount', 'Status']
  const rows = items.value.map(item => [
    `"${item.id}"`,
    `"${item.date}"`,
    `"${(item.supplierName || '').replace(/"/g, '""')}"`,
    `"${(item.category || '').replace(/"/g, '""')}"`,
    `"${(item.purchaseItem || '').replace(/"/g, '""')}"`,
    `"${item.qty}"`,
    `"${item.amount}"`,
    `"${item.status}"`,
  ])
  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [header.join(','), ...rows.map(r => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `supplier_report_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Modal Detail View
const isDetailModalOpen = ref(false)
const selectedItem = ref<SupplierReportItem | null>(null)

function viewDetail(item: SupplierReportItem) {
  selectedItem.value = item
  isDetailModalOpen.value = true
}

const totalFilteredAmount = computed(() => {
  return items.value.reduce((sum, i) => sum + (i.amount || 0), 0)
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header Toolbar -->
    <SalesListHeader
      title="Supplier Report"
      subtitle="Manage supplier purchasing transactions and order history"
      :refreshing="pending"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <!-- 4 KPI Summary Cards (Leaf Component) -->
    <SupplierReportStatsWidgets :stats="stats" />

    <!-- Loading & Error Feedback -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="8"
      :error="error ? 'Gagal memuat laporan supplier. Silakan coba lagi.' : ''"
      @retry="refresh()"
    />

    <!-- Main Data Table -->
    <SalesDataTable
      v-if="!pending && !error"
      :columns="columns"
      :items="items"
      :search="search"
      search-placeholder="Search supplier, item, or category..."
      @update:search="search = $event"
      @print="openPrintModal('print')"
      @export-pdf="openPrintModal('pdf')"
      @export-excel="handleExportCsv"
    >
      <!-- Filters Slot -->
      <template #filters>
        <!-- Date Range Filter -->
        <div class="w-auto">
          <DateRangePicker
            :model-value="dateRange"
            placeholder="Rentang Tanggal"
            input-class="h-9 text-sm"
            @update:model-value="dateRange = $event"
          />
        </div>

        <!-- Category Filter -->
        <TableFilterSelect
          :model-value="category"
          placeholder="Semua Kategori"
          :options="[
            'Kertas Plano',
            'Tinta & Kimia',
            'Bahan Large Format',
            'Finishing & Jilid',
            'Kertas Digital',
            'Sparepart & Maintenance',
            'Bahan Penunjang',
            'Packaging',
            'Bahan Rigid'
          ]"
          @update:model-value="category = $event"
        />

        <!-- Status Filter -->
        <TableFilterSelect
          :model-value="status"
          placeholder="Semua Status"
          :options="['Received', 'Overdue', 'Unpaid']"
          @update:model-value="status = $event"
        />

        <!-- CSV Export Button -->
        <button
          type="button"
          title="Export CSV"
          class="flex h-9 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750"
          @click="handleExportCsv"
        >
          <FeatherIcon name="download" :size="14" />
          <span>CSV</span>
        </button>
      </template>

      <!-- Cell: Amount -->
      <template #cell(amount)="{ item }">
        <span class="font-mono font-medium text-gray-900 dark:text-gray-100">
          {{ formatIDR(item.amount) }}
        </span>
      </template>

      <!-- Cell: Status -->
      <template #cell(status)="{ item }">
        <span
          class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
          :class="{
            'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300': item.status === 'Received',
            'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300': item.status === 'Overdue',
            'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300': item.status === 'Unpaid',
          }"
        >
          {{ item.status }}
        </span>
      </template>

      <!-- Cell: Actions -->
      <template #cell(actions)="{ item }">
        <div class="flex items-center justify-center">
          <button
            type="button"
            title="Lihat Detail"
            class="flex size-8 items-center justify-center rounded-lg text-primary hover:bg-primary/10 transition-colors"
            @click="viewDetail(item)"
          >
            <FeatherIcon name="eye" :size="16" />
          </button>
        </div>
      </template>

      <!-- Table Footer with Totals -->
      <template #footer>
        <tr>
          <td colspan="5" class="px-4 py-3 text-end font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            TOTAL PEMBELIAN
          </td>
          <td class="px-4 py-3 text-end font-mono font-bold text-primary dark:text-primary-400">
            {{ formatIDR(totalFilteredAmount) }}
          </td>
          <td colspan="2"></td>
        </tr>
      </template>
    </SalesDataTable>

    <!-- Modal View Detail Supplier (Leaf Component) -->
    <SupplierReportDetailModal
      :open="isDetailModalOpen"
      :item="selectedItem"
      @close="isDetailModalOpen = false"
    />

    <!-- Document Print Modal Resmi Kop Surat PT. DULANK SEMESTA CIDA -->
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Laporan Pembelian Pemasok (Supplier Report)"
      subtitle="PT. DULANK SEMESTA CIDA - Sistem Manajemen Administrasi Percetakan"
      :columns="printColumns"
      :items="items"
      :default-action="defaultPrintAction"
      date-field="date"
      @close="closePrintModal"
    />
  </div>
</template>
