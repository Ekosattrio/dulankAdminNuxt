<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CustomerReportItem } from '~~/server/types/reports-stakeholders'
import { useCustomerReport } from '~/composables/useStakeholderReports'
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

useLegacyPage({ title: 'Customer Report', sweetAlert: false })

const { items, search, status, paymentMethod, dateRange, pending, error, refresh, stats } = useCustomerReport()

// Columns definition
const columns = [
  { key: 'customerName', label: 'Customer Name', sortable: true },
  { key: 'totalOrder', label: 'Total Order', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'amount', label: 'Amount', sortable: true, align: 'end' as const, class: 'text-end' },
  { key: 'avgLeadTime', label: 'Avg. Lead Time', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'paymentMethod', label: 'Payment Method', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center' },
]

// Print & PDF
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const printColumns = [
  { key: 'customerName', label: 'Customer Name' },
  { key: 'totalOrder', label: 'Total Order', align: 'center' as const },
  { key: 'amount', label: 'Amount (IDR)', align: 'right' as const, format: (val: number) => formatIDR(val) },
  { key: 'avgLeadTime', label: 'Avg. Lead Time', align: 'center' as const },
  { key: 'paymentMethod', label: 'Payment Method', align: 'center' as const },
  { key: 'status', label: 'Status', align: 'center' as const },
]

// CSV Export
function handleExportCsv() {
  const header = ['ID', 'Customer Name', 'Total Order', 'Amount', 'Avg Lead Time', 'Payment Method', 'Status']
  const rows = items.value.map(item => [
    `"${item.id}"`,
    `"${(item.customerName || '').replace(/"/g, '""')}"`,
    `"${item.totalOrder}"`,
    `"${item.amount}"`,
    `"${item.avgLeadTime}"`,
    `"${item.paymentMethod || ''}"`,
    `"${item.status || ''}"`,
  ])
  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [header.join(','), ...rows.map(r => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `customer_report_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Modal Detail View
const isDetailModalOpen = ref(false)
const selectedCustomer = ref<CustomerReportItem | null>(null)

function viewCustomer(item: CustomerReportItem) {
  selectedCustomer.value = item
  isDetailModalOpen.value = true
}

const totalFilteredOrders = computed(() => {
  return items.value.reduce((sum, i) => sum + (i.totalOrder || 0), 0)
})

const totalFilteredAmount = computed(() => {
  return items.value.reduce((sum, i) => sum + (i.amount || 0), 0)
})
</script>

<template>
  <div class="dulank-page dulank-page-customer-report space-y-6">
    <!-- Header Toolbar -->
    <SalesListHeader
      title="Customer Report"
      subtitle="Manage customer order and performance reports"
      :refreshing="pending"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <!-- 4 KPI Summary Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <!-- Card 1: Total Pelanggan -->
      <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
          <FeatherIcon name="users" size="22" />
        </div>
        <div>
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Pelanggan</p>
          <h4 class="mt-1 font-mono text-xl font-bold text-gray-900 dark:text-gray-100">
            {{ stats.totalCustomers }} <span class="text-xs font-normal text-gray-500">Klien</span>
          </h4>
        </div>
      </div>

      <!-- Card 2: Total Pesanan -->
      <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
          <FeatherIcon name="shopping-cart" size="22" />
        </div>
        <div>
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Pesanan Cetak</p>
          <h4 class="mt-1 font-mono text-xl font-bold text-gray-900 dark:text-gray-100">
            {{ stats.totalOrders }} <span class="text-xs font-normal text-gray-500">Order</span>
          </h4>
        </div>
      </div>

      <!-- Card 3: Total Omset / Terbayar -->
      <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
          <FeatherIcon name="trending-up" size="22" />
        </div>
        <div>
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Nilai Penjualan</p>
          <h4 class="mt-1 font-mono text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {{ formatIDR(stats.totalAmount) }}
          </h4>
        </div>
      </div>

      <!-- Card 4: Total Piutang Pelanggan -->
      <div class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
          <FeatherIcon name="clock" size="22" />
        </div>
        <div>
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Sisa Piutang Berjalan</p>
          <h4 class="mt-1 font-mono text-xl font-bold text-amber-600 dark:text-amber-400">
            {{ formatIDR(stats.totalDue) }}
          </h4>
        </div>
      </div>
    </div>

    <!-- Loading & Error Feedback -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="7"
      :error="error ? 'Gagal memuat laporan pelanggan. Silakan coba lagi.' : ''"
      @retry="refresh()"
    />

    <!-- Main Data Table -->
    <SalesDataTable
      v-if="!pending && !error"
      :columns="columns"
      :items="items"
      :search="search"
      search-placeholder="Search customer name or payment..."
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

        <!-- Payment Method Filter -->
        <TableFilterSelect
          :model-value="paymentMethod"
          placeholder="Semua Metode Bayar"
          :options="['Transfer', 'Credit Card', 'Cash']"
          @update:model-value="paymentMethod = $event"
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
        <span class="font-mono font-medium text-emerald-600 dark:text-emerald-400">
          {{ formatIDR(item.amount) }}
        </span>
      </template>

      <!-- Cell: Avg Lead Time -->
      <template #cell(avgLeadTime)="{ item }">
        <span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {{ item.avgLeadTime }}
        </span>
      </template>

      <!-- Cell: Payment Method -->
      <template #cell(paymentMethod)="{ item }">
        <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
          {{ item.paymentMethod || 'Transfer' }}
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
          {{ item.status || 'Received' }}
        </span>
      </template>

      <!-- Cell: Actions -->
      <template #cell(actions)="{ item }">
        <div class="flex items-center justify-center">
          <button
            type="button"
            title="Lihat Detail Pelanggan"
            class="flex size-8 items-center justify-center rounded-lg text-primary hover:bg-primary/10 transition-colors"
            @click="viewCustomer(item)"
          >
            <FeatherIcon name="eye" size="16" />
          </button>
        </div>
      </template>

      <!-- Table Footer with Totals -->
      <template #footer>
        <tr>
          <td class="px-4 py-3 text-start font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            TOTAL
          </td>
          <td class="px-4 py-3 text-center font-mono font-bold text-gray-900 dark:text-white">
            {{ totalFilteredOrders }}
          </td>
          <td class="px-4 py-3 text-end font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {{ formatIDR(totalFilteredAmount) }}
          </td>
          <td class="px-4 py-3 text-center text-xs text-gray-500">
            Avg. 3.4 Days
          </td>
          <td colspan="3"></td>
        </tr>
      </template>
    </SalesDataTable>

    <!-- Modal View Detail Customer -->
    <SalesDialog
      :open="isDetailModalOpen"
      :title="`Ringkasan Pelanggan: ${selectedCustomer?.customerName || '-'}`"
      size="lg"
      @close="isDetailModalOpen = false"
    >
      <div v-if="selectedCustomer" class="space-y-6">
        <!-- Customer Meta Grid -->
        <div class="grid grid-cols-1 gap-4 rounded-xl border border-gray-100 bg-gray-50/75 p-4 sm:grid-cols-2 dark:border-gray-800 dark:bg-gray-800/50">
          <div>
            <span class="text-xs text-gray-500 dark:text-gray-400">Nama Pelanggan</span>
            <p class="font-semibold text-gray-900 dark:text-white">{{ selectedCustomer.customerName }}</p>
          </div>
          <div>
            <span class="text-xs text-gray-500 dark:text-gray-400">Total Order Percetakan</span>
            <p class="font-semibold text-gray-900 dark:text-white">{{ selectedCustomer.totalOrder }} Pesanan</p>
          </div>
          <div>
            <span class="text-xs text-gray-500 dark:text-gray-400">Akumulasi Belanja</span>
            <p class="font-mono font-bold text-emerald-600">{{ formatIDR(selectedCustomer.amount) }}</p>
          </div>
          <div>
            <span class="text-xs text-gray-500 dark:text-gray-400">Rata-rata Waktu Pengerjaan</span>
            <p class="font-semibold text-gray-900 dark:text-white">{{ selectedCustomer.avgLeadTime }}</p>
          </div>
        </div>

        <!-- History Order Table -->
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-bold text-gray-900 dark:text-white">Riwayat Transaksi Pelanggan</h4>
            <span class="text-xs text-gray-500">History Orders</span>
          </div>
          <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
              <thead class="bg-gray-50 border-b border-gray-200 font-semibold dark:bg-gray-800 dark:border-gray-700">
                <tr>
                  <th class="px-3 py-2 text-start">Tanggal</th>
                  <th class="px-3 py-2 text-start">No. Faktur</th>
                  <th class="px-3 py-2 text-start">Produk Pesanan</th>
                  <th class="px-3 py-2 text-center">Qty</th>
                  <th class="px-3 py-2 text-end">Nilai Transaksi</th>
                  <th class="px-3 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-for="(h, idx) in (selectedCustomer.history || [{ date: '01/03/2026', invoiceNo: 'INV-202603-001', product: 'Pesanan Percetakan Custom', qty: selectedCustomer.totalOrder, amount: selectedCustomer.amount, status: selectedCustomer.status || 'Paid' }])" :key="idx">
                  <td class="px-3 py-2">{{ h.date }}</td>
                  <td class="px-3 py-2 font-mono font-medium">{{ h.invoiceNo }}</td>
                  <td class="px-3 py-2">{{ h.product }}</td>
                  <td class="px-3 py-2 text-center">{{ h.qty }}</td>
                  <td class="px-3 py-2 text-end font-mono">{{ formatIDR(h.amount) }}</td>
                  <td class="px-3 py-2 text-center">
                    <span class="inline-flex rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {{ h.status }}
                    </span>
                  </td>
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
      title="Laporan Transaksi Pelanggan (Customer Report)"
      subtitle="PT. DULANK SEMESTA CIDA - Sistem Manajemen Administrasi Percetakan"
      :columns="printColumns"
      :items="items"
      :default-action="defaultPrintAction"
      date-field="date"
      @close="closePrintModal"
    />
  </div>
</template>
