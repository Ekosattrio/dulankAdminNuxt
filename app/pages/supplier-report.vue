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
import SalesDialog from '~/components/sales/SalesDialog.vue'

useLegacyPage({ title: 'Supplier Report', sweetAlert: false })

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
  <div class="dulank-page dulank-page-supplier-report space-y-6">
    <!-- Header Toolbar -->
    <SalesListHeader
      title="Supplier Report"
      subtitle="Manage supplier purchasing transactions and order history"
      :refreshing="pending"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <!-- 4 KPI Summary Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <!-- Card 1: Total Mitra -->
      <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
          <FeatherIcon name="users" size="22" />
        </div>
        <div>
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Mitra Pemasok</p>
          <h4 class="mt-1 font-mono text-xl font-bold text-gray-900 dark:text-gray-100">
            {{ stats.totalSuppliers }} <span class="text-xs font-normal text-gray-500">Mitra</span>
          </h4>
        </div>
      </div>

      <!-- Card 2: Total Transaksi -->
      <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
          <FeatherIcon name="shopping-bag" size="22" />
        </div>
        <div>
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Pembelian</p>
          <h4 class="mt-1 font-mono text-xl font-bold text-gray-900 dark:text-gray-100">
            {{ formatIDR(stats.totalAmount) }}
          </h4>
        </div>
      </div>

      <!-- Card 3: Total Terbayar -->
      <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
          <FeatherIcon name="check-circle" size="22" />
        </div>
        <div>
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Terbayar</p>
          <h4 class="mt-1 font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {{ formatIDR(stats.totalPaid) }}
          </h4>
        </div>
      </div>

      <!-- Card 4: Total Hutang Jatuh Tempo -->
      <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
          <FeatherIcon name="alert-circle" size="22" />
        </div>
        <div>
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Hutang / Sisa Tagihan</p>
          <h4 class="mt-1 font-mono text-xl font-bold text-rose-600 dark:text-rose-400">
            {{ formatIDR(stats.totalDue) }}
          </h4>
        </div>
      </div>
    </div>

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
            input-class="h-9 text-xs"
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
          class="flex h-9 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750"
          @click="handleExportCsv"
        >
          <FeatherIcon name="download" size="14" />
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
            <FeatherIcon name="eye" size="16" />
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

    <!-- Modal View Detail Supplier -->
    <SalesDialog
      :open="isDetailModalOpen"
      :title="`Detail Supplier: ${selectedItem?.supplierName || '-'}`"
      size="lg"
      @close="isDetailModalOpen = false"
    >
      <div v-if="selectedItem" class="space-y-6">
        <!-- Supplier Meta Grid -->
        <div class="grid grid-cols-1 gap-4 rounded-xl border border-gray-100 bg-gray-50/75 p-4 sm:grid-cols-2 dark:border-gray-800 dark:bg-gray-800/50">
          <div>
            <span class="text-xs text-gray-500 dark:text-gray-400">Nama Supplier</span>
            <p class="font-semibold text-gray-900 dark:text-white">{{ selectedItem.supplierName }}</p>
          </div>
          <div>
            <span class="text-xs text-gray-500 dark:text-gray-400">Total Transaksi</span>
            <p class="font-semibold text-gray-900 dark:text-white">{{ selectedItem.totalTransactions || 20 }} Transaksi</p>
          </div>
          <div>
            <span class="text-xs text-gray-500 dark:text-gray-400">Total Pembelian</span>
            <p class="font-mono font-bold text-primary">{{ formatIDR(selectedItem.totalPurchased || selectedItem.amount) }}</p>
          </div>
          <div>
            <span class="text-xs text-gray-500 dark:text-gray-400">Rata-rata Lead Time</span>
            <p class="font-semibold text-gray-900 dark:text-white">{{ selectedItem.avgLeadTime || '6 Days' }}</p>
          </div>
        </div>

        <!-- History Transaction Table -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-bold text-gray-900 dark:text-white">Riwayat Transaksi Pemasok</h4>
            <span class="text-xs text-gray-500">Periode Berjalan</span>
          </div>
          <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
              <thead class="bg-gray-50 border-b border-gray-200 font-semibold dark:bg-gray-800 dark:border-gray-700">
                <tr>
                  <th class="px-3 py-2 text-start">Tanggal</th>
                  <th class="px-3 py-2 text-start">Kategori</th>
                  <th class="px-3 py-2 text-start">Item Pembelian</th>
                  <th class="px-3 py-2 text-center">Qty</th>
                  <th class="px-3 py-2 text-end">Jumlah</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-for="(h, idx) in (selectedItem.history || [{ date: selectedItem.date, category: selectedItem.category, purchaseItem: selectedItem.purchaseItem, qty: selectedItem.qty, amount: selectedItem.amount }])" :key="idx">
                  <td class="px-3 py-2">{{ h.date }}</td>
                  <td class="px-3 py-2">{{ h.category }}</td>
                  <td class="px-3 py-2 font-medium">{{ h.purchaseItem }}</td>
                  <td class="px-3 py-2 text-center">{{ h.qty }}</td>
                  <td class="px-3 py-2 text-end font-mono">{{ formatIDR(h.amount) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <template #footer>
        <button
          type="button"
          class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          @click="isDetailModalOpen = false"
        >
          Tutup
        </button>
      </template>
    </SalesDialog>

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
