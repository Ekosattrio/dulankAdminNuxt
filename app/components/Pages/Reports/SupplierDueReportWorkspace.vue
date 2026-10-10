<script setup lang="ts">
import type { SupplierDueReportItem } from '~~/server/types/reports-stakeholders'
import { useSupplierDueReport } from '~/composables/useStakeholderReports'
import { useTablePrint } from '~/composables/useTablePrint'
import { formatIDR } from '~/utils/currency'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import DateRangePicker from '~/components/Common/DateRangePicker.vue'
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import SupplierDueReportStatsWidgets from './Due/SupplierDueReportStatsWidgets.vue'
import SupplierDueReportDetailModal from './Due/SupplierDueReportDetailModal.vue'

const { items, search, status, category, dateRange, pending, error, refresh, stats } = useSupplierDueReport()

const columns = [
  { key: 'supplierName', label: 'Supplier Name', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'purchaseItem', label: 'Purchase Item', sortable: true },
  { key: 'purchasesDue', label: 'Purchases Due', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'amountDue', label: 'Amount Due', sortable: true, align: 'end' as const, class: 'text-end' },
  { key: 'daysDue', label: 'Days Due', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center' },
]

const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const printColumns = [
  { key: 'supplierName', label: 'Supplier Name' },
  { key: 'category', label: 'Category' },
  { key: 'purchaseItem', label: 'Purchase Item' },
  { key: 'purchasesDue', label: 'Purchases Due', align: 'center' as const },
  { key: 'amountDue', label: 'Amount Due (IDR)', align: 'right' as const, format: (val: number) => formatIDR(val) },
  { key: 'daysDue', label: 'Days Due', align: 'center' as const, format: (val: number) => `${val} Days` },
  { key: 'status', label: 'Status', align: 'center' as const },
]

function handleExportCsv() {
  const header = ['ID', 'Supplier Name', 'Category', 'Purchase Item', 'Purchases Due', 'Amount Due', 'Days Due', 'Status']
  const rows = items.value.map(item => [
    `"${item.id}"`,
    `"${(item.supplierName || '').replace(/"/g, '""')}"`,
    `"${(item.category || '').replace(/"/g, '""')}"`,
    `"${(item.purchaseItem || '').replace(/"/g, '""')}"`,
    `"${item.purchasesDue}"`,
    `"${item.amountDue}"`,
    `"${item.daysDue} Days"`,
    `"${item.status}"`,
  ])
  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [header.join(','), ...rows.map(r => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `supplier_due_report_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const isDetailModalOpen = ref(false)
const selectedItem = ref<SupplierDueReportItem | null>(null)

function viewDetail(item: SupplierDueReportItem) {
  selectedItem.value = item
  isDetailModalOpen.value = true
}

const totalFilteredDue = computed(() => items.value.reduce((sum, i) => sum + (i.amountDue || 0), 0))
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader
      title="Supplier Due Report"
      subtitle="Manage supplier accounts payable and due aging"
      :refreshing="pending"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <SupplierDueReportStatsWidgets :stats="stats" />

    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="8"
      :error="error ? 'Gagal memuat laporan hutang supplier. Silakan coba lagi.' : ''"
      @retry="refresh()"
    />

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
          :model-value="category"
          placeholder="Semua Kategori"
          :options="['Raw Material', 'Packaging', 'Sparepart']"
          @update:model-value="category = $event"
        />

        <TableFilterSelect
          :model-value="status"
          placeholder="Semua Status"
          :options="['Overdue', 'Due Soon', 'Critical']"
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

      <template #cell(amountDue)="{ item }">
        <span class="font-mono font-bold text-rose-600 dark:text-rose-400">
          {{ formatIDR(item.amountDue) }}
        </span>
      </template>

      <template #cell(daysDue)="{ item }">
        <span
          class="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold"
          :class="item.daysDue > 30 ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'"
        >
          {{ item.daysDue }} Hari
        </span>
      </template>

      <template #cell(status)="{ item }">
        <span
          class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
          :class="{
            'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300': item.status === 'Critical' || item.status === 'Overdue',
            'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300': item.status === 'Due Soon',
          }"
        >
          {{ item.status }}
        </span>
      </template>

      <template #cell(actions)="{ item }">
        <div class="flex items-center justify-center">
          <button
            type="button"
            title="Lihat Detail Hutang"
            class="flex size-8 items-center justify-center rounded-lg text-primary hover:bg-primary/10 transition-colors"
            @click="viewDetail(item)"
          >
            <FeatherIcon name="eye" size="16" />
          </button>
        </div>
      </template>

      <template #footer-row>
        <tr class="border-t-2 border-gray-200 bg-gray-50/80 font-bold dark:border-gray-700 dark:bg-gray-800/80">
          <td colspan="4" class="px-4 py-3 text-xs uppercase tracking-wider text-gray-700 dark:text-gray-300">Total Hutang Terfilter</td>
          <td class="px-4 py-3 text-end font-mono text-xs font-bold text-rose-600 dark:text-rose-400">
            {{ formatIDR(totalFilteredDue) }}
          </td>
          <td colspan="3"></td>
        </tr>
      </template>
    </SalesDataTable>

    <SupplierDueReportDetailModal
      :open="isDetailModalOpen"
      :supplier="selectedItem"
      @close="isDetailModalOpen = false"
    />

    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Laporan Hutang Jatuh Tempo Pemasok (Supplier Due Report)"
      subtitle="PT. DULANK SEMESTA CIDA - Sistem Manajemen Administrasi Percetakan"
      :columns="printColumns"
      :items="items"
      :default-action="defaultPrintAction"
      date-field="date"
      @close="closePrintModal"
    />
  </div>
</template>
