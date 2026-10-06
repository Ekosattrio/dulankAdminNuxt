<script setup lang="ts">
import PagesSalesTable from '~/components/pages/sales/SalesRecordsTable.vue'
import PagesSalesEditor from '~/components/pages/sales/SalesEditor.vue'
import SalesHistoryDialog from '~/components/pages/sales/SalesHistoryDialog.vue'
import SalesDetailsDialog from '~/components/pages/sales/SalesDetailsDialog.vue'
import SalesPaymentsDialog from '~/components/pages/sales/SalesPaymentsDialog.vue'
import type { Sale } from '#server/types/sale'

useLegacyPage({ title: 'Sales', sweetAlert: false })
const historyKind = ref<'deleted' | 'cancelled' | null>(null)
const selectedSale = ref<Sale | null>(null)
const paymentSale = ref<Sale | null>(null)
const {
  pending,
  error,
  refresh,
  searchQuery,
  filterStatus,
  filterChannel,
  filterTransactionCode,
  filteredList,
  isModalOpen,
  isEdit,
  editData,
  deleting,
  busy,
  actionError,
  toastMessage,
  handleAdd,
  handleEdit,
  handleDelete,
  handleSubmit,
  confirmDelete,
  printTable,
} = useSalesPage()

import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import { useTablePrint } from '~/composables/useTablePrint'

const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const salesPrintColumns = [
  { key: 'saleNo', label: 'No Sales' },
  { key: 'customer', label: 'Customer' },
  { key: 'date', label: 'Date' },
  { key: 'subTotal', label: 'Sub Total', align: 'right' as const },
  { key: 'deliveryFee', label: 'Delivery Fee', align: 'right' as const },
  { key: 'discount', label: 'Discount', align: 'right' as const },
  { key: 'tax', label: 'Tax', align: 'right' as const },
  { key: 'total', label: 'Total (IDR)', align: 'right' as const },
  { key: 'delivery', label: 'Delivery' },
  { key: 'channel', label: 'Channel' },
  { key: 'status', label: 'Status', align: 'center' as const }
]
</script>

<template>
  <div class="dulank-page dulank-page-sales">
    <SalesListHeader
      title="Sales"
      subtitle="Manage Yours sales"
      add-label="Add Sales"
      :refreshing="pending"
      @add="handleAdd"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="13"
      :skeleton-rows="6"
      :error="error ? 'Unable to load sales. Please try again.' : ''"
      :message="toastMessage"
      @retry="refresh()"
      @dismiss="toastMessage = ''"
    />
    <div class="mb-4 flex flex-wrap justify-end gap-2">
      <button type="button" :class="salesSecondaryButton" @click="historyKind = 'deleted'">
        <FeatherIcon name="trash-2" :size="14" />Delete Sales History</button
      ><button type="button" :class="salesSecondaryButton" @click="historyKind = 'cancelled'">
        <FeatherIcon name="clock" :size="14" />Cancel Transaction History
      </button>
    </div>
    <PagesSalesTable
      v-if="!pending && !error"
      :sales="filteredList"
      :search-query="searchQuery"
      :filter-status="filterStatus"
      :filter-channel="filterChannel"
      :filter-transaction-code="filterTransactionCode"
      @update:search-query="searchQuery = $event"
      @update:filter-status="filterStatus = $event"
      @update:filter-channel="filterChannel = $event"
      @update:filter-transaction-code="filterTransactionCode = $event"
      @add-sale="handleAdd"
      @edit-sale="handleEdit"
      @delete-sale="handleDelete"
      @view-sale="selectedSale = $event"
      @show-payments="paymentSale = $event"
      @export-pdf="printTable"
      @print-table="printTable"
      @refresh="refresh"
    />
    <PagesSalesEditor
      :is-open="isModalOpen"
      :is-edit="isEdit"
      :edit-data="editData"
      :busy="busy"
      :error="actionError"
      @close="!busy && (isModalOpen = false)"
      @submit="handleSubmit"
    />
    <SalesConfirmDelete
      :open="!!deleting"
      :busy="busy"
      :error="actionError"
      @close="deleting = null"
      @confirm="confirmDelete"
    />
    <SalesHistoryDialog :kind="historyKind" @close="historyKind = null" />
    <SalesDetailsDialog :record="selectedSale" @close="selectedSale = null" />
    <SalesPaymentsDialog :record="paymentSale" @close="paymentSale = null" @saved="refresh()" />

    <!-- Standardized Print & Export PDF Modal -->
    <DocumentPrintModal
      v-if="isPrintModalOpen"
      :open="isPrintModalOpen"
      title="Laporan Data Penjualan (Sales List)"
      :columns="salesPrintColumns"
      :items="filteredList"
      date-field="date"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
