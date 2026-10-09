<script setup lang="ts">
import type { BillingItem } from '#server/types/billing'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import BillingStatsWidgets from '~/components/pages/billing/BillingStatsWidgets.vue'
import BillingRecordsTable from '~/components/pages/billing/BillingRecordsTable.vue'
import BillingDetailModal from '~/components/pages/billing/BillingDetailModal.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import { formatIDR } from '~/utils/currency'

definePageMeta({
  layout: 'default',
  alias: ['/billing.html'],
})
useLegacyPage({ title: 'Billing List', sweetAlert: false })

const { billings, stats, pending, error, refresh } = useBillings()

const searchQuery = ref('')
const filterMethod = ref('')
const filterStatus = ref('')

const isDetailModalOpen = ref(false)
const selectedBilling = ref<BillingItem | null>(null)

const print = useTablePrint()
const printColumns = [
  { key: 'billingId', label: 'ID Billing' },
  { key: 'txId', label: 'ID Transaksi' },
  { key: 'userEmail', label: 'ID Pengguna' },
  { key: 'date', label: 'Tanggal Billing' },
  { key: 'subtotal', label: 'Jumlah Tagihan', align: 'right' as const, format: (value: number) => formatIDR(value) },
  { key: 'discount', label: 'Diskon', align: 'right' as const, format: (value: number) => formatIDR(value) },
  { key: 'tax', label: 'Pajak', align: 'right' as const, format: (value: number) => formatIDR(value) },
  { key: 'shipping', label: 'Biaya Kirim', align: 'right' as const, format: (value: number) => formatIDR(value) },
  { key: 'total', label: 'Total Pembayaran', align: 'right' as const, format: (value: number) => formatIDR(value) },
  { key: 'status', label: 'Status' },
  { key: 'method', label: 'Metode' }
]

const handleView = (item: BillingItem) => {
  selectedBilling.value = item
  isDetailModalOpen.value = true
}

const openPrintModal = (action: 'print' | 'pdf', rows?: BillingItem[]) => {
  const targetRows = rows ?? billings.value.filter((item) => {
    const q = searchQuery.value.toLowerCase()
    const matchSearch =
      !q ||
      item.billingId.toLowerCase().includes(q) ||
      item.txId.toLowerCase().includes(q) ||
      item.userEmail.toLowerCase().includes(q)
    const matchMethod = !filterMethod.value || item.method === filterMethod.value
    const matchStatus = !filterStatus.value || item.status === filterStatus.value
    return matchSearch && matchMethod && matchStatus
  })

  print.openPrintModal({
    title: 'Billing Report',
    subtitle: 'Daftar transaksi billing dan invoice',
    columns: printColumns,
    rows: targetRows,
    action
  })
}

const handlePrintSingle = (item: BillingItem) => {
  openPrintModal('print', [item])
}
</script>

<template>
  <div class="dulank-page dulank-page-billing space-y-4 p-4 md:p-6">
    <SalesListHeader
      title="Billing List"
      subtitle="Kelola data transaksi tagihan dan pembayaran invoice"
      :show-add="false"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <BillingStatsWidgets :stats="stats" />

    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :error="error ? (error.message || 'Gagal memuat data billing') : ''"
      @retry="refresh"
    />

    <BillingRecordsTable
      v-if="!pending"
      :billings="billings"
      :search-query="searchQuery"
      :filter-method="filterMethod"
      :filter-status="filterStatus"
      @update:search-query="searchQuery = $event"
      @update:filter-method="filterMethod = $event"
      @update:filter-status="filterStatus = $event"
      @view="handleView"
    />

    <BillingDetailModal
      :open="isDetailModalOpen"
      :billing="selectedBilling"
      @close="isDetailModalOpen = false"
      @print="handlePrintSingle"
    />

    <DocumentPrintModal
      :open="print.isPrintModalOpen.value"
      :title="print.printTitle.value"
      :subtitle="print.printSubtitle.value"
      :columns="print.printColumns.value"
      :rows="print.printRows.value"
      :default-action="print.defaultPrintAction.value"
      date-field="date"
      @close="print.closePrintModal"
    />
  </div>
</template>
