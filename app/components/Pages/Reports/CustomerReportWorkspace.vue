<script setup lang="ts">
import type { CustomerReportItem } from '~~/server/types/reports-stakeholders'
import { useCustomerReport } from '~/composables/useStakeholderReports'
import { useTablePrint } from '~/composables/useTablePrint'
import { formatIDR } from '~/utils/currency'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import DateRangePicker from '~/components/Common/DateRangePicker.vue'
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import CustomerReportStatsWidgets from './Customer/CustomerReportStatsWidgets.vue'
import CustomerReportDetailModal from './Customer/CustomerReportDetailModal.vue'

const { items, search, status, paymentMethod, dateRange, pending, error, refresh, stats } = useCustomerReport()

const columns = [
  { key: 'customerName', label: 'Customer Name', sortable: true },
  { key: 'totalOrder', label: 'Total Order', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'amount', label: 'Amount', sortable: true, align: 'end' as const, class: 'text-end' },
  { key: 'avgLeadTime', label: 'Avg. Lead Time', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'paymentMethod', label: 'Payment Method', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center' },
]

const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const printColumns = [
  { key: 'customerName', label: 'Customer Name' },
  { key: 'totalOrder', label: 'Total Order', align: 'center' as const },
  { key: 'amount', label: 'Amount (IDR)', align: 'right' as const, format: (val: number) => formatIDR(val) },
  { key: 'avgLeadTime', label: 'Avg. Lead Time', align: 'center' as const },
  { key: 'paymentMethod', label: 'Payment Method', align: 'center' as const },
  { key: 'status', label: 'Status', align: 'center' as const },
]

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

const isDetailModalOpen = ref(false)
const selectedCustomer = ref<CustomerReportItem | null>(null)

function viewCustomer(item: CustomerReportItem) {
  selectedCustomer.value = item
  isDetailModalOpen.value = true
}

const totalFilteredOrders = computed(() => items.value.reduce((sum, i) => sum + (i.totalOrder || 0), 0))
const totalFilteredAmount = computed(() => items.value.reduce((sum, i) => sum + (i.amount || 0), 0))
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader
      title="Customer Report"
      subtitle="Manage customer order and performance reports"
      :refreshing="pending"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <CustomerReportStatsWidgets :stats="stats" />

    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="7"
      :error="error ? 'Gagal memuat laporan pelanggan. Silakan coba lagi.' : ''"
      @retry="refresh()"
    />

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
      <template #filters>
        <div class="w-auto">
          <DateRangePicker
            :model-value="dateRange"
            placeholder="Rentang Tanggal"
            input-class="h-9 text-sm"
            @update:model-value="dateRange = $event"
          />
        </div>

        <TableFilterSelect
          :model-value="paymentMethod"
          placeholder="Semua Metode Bayar"
          :options="['Transfer', 'Credit Card', 'Cash']"
          @update:model-value="paymentMethod = $event"
        />

        <TableFilterSelect
          :model-value="status"
          placeholder="Semua Status"
          :options="['Received', 'Overdue', 'Unpaid']"
          @update:model-value="status = $event"
        />

        <button
          type="button"
          title="Export CSV"
          class="flex h-9 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          @click="handleExportCsv"
        >
          <FeatherIcon name="download" size="14" />
          <span>CSV</span>
        </button>
      </template>

      <template #cell(amount)="{ item }">
        <span class="font-mono font-medium text-emerald-600 dark:text-emerald-400">
          {{ formatIDR(item.amount) }}
        </span>
      </template>

      <template #cell(avgLeadTime)="{ item }">
        <span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {{ item.avgLeadTime }}
        </span>
      </template>

      <template #cell(paymentMethod)="{ item }">
        <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
          {{ item.paymentMethod || 'Transfer' }}
        </span>
      </template>

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

      <template #footer-row>
        <tr class="border-t-2 border-gray-200 bg-gray-50/80 font-bold dark:border-gray-700 dark:bg-gray-800/80">
          <td class="px-4 py-3 text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300">Total Terfilter</td>
          <td class="px-4 py-3 text-center text-xs font-mono font-bold text-gray-900 dark:text-white">
            {{ totalFilteredOrders }} Order
          </td>
          <td class="px-4 py-3 text-end font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {{ formatIDR(totalFilteredAmount) }}
          </td>
          <td class="px-4 py-3 text-center text-xs text-gray-500">Avg. 3.4 Days</td>
          <td colspan="3"></td>
        </tr>
      </template>
    </SalesDataTable>

    <CustomerReportDetailModal
      :open="isDetailModalOpen"
      :customer="selectedCustomer"
      @close="isDetailModalOpen = false"
    />

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
