<script setup lang="ts">
import type { PosOrderRecord } from '~/composables/usePosOrders'
import { usePosOrders } from '~/composables/usePosOrders'
import { useTablePrint } from '~/composables/useTablePrint'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import PosOrderRecordsTable from '~/components/pages/pos/PosOrderRecordsTable.vue'
import PosOrderDetailDialog from '~/components/pages/pos/PosOrderDetailDialog.vue'
import PosOrderPaymentDialog from '~/components/pages/pos/PosOrderPaymentDialog.vue'

definePageMeta({
  layout: 'default',
  alias: ['/pos-order.html']
})

useLegacyPage({
  title: 'POS Orders',
  sweetAlert: false
})

const { orders, pending, error, refresh, recordPayment, deleteOrder } = usePosOrders()
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const selectedOrder = ref<PosOrderRecord | null>(null)
const isDetailOpen = ref(false)
const isPaymentOpen = ref(false)
const isDeleteOpen = ref(false)
const orderToDelete = ref<PosOrderRecord | null>(null)
const isBusy = ref(false)
const toastMessage = ref('')

const printColumns = [
  { key: 'saleNo', label: 'Reference' },
  { key: 'customer', label: 'Customer' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status' },
  { key: 'grandTotal', label: 'Grand Total', align: 'right' as const },
  { key: 'paid', label: 'Paid', align: 'right' as const },
  { key: 'due', label: 'Due', align: 'right' as const },
  { key: 'paymentStatus', label: 'Payment Status' }
]

function handleView(order: PosOrderRecord) { selectedOrder.value = order; isDetailOpen.value = true }
function handleCreatePayment(order: PosOrderRecord) { selectedOrder.value = order; isPaymentOpen.value = true }
function handlePrintReceipt(order: PosOrderRecord) { navigateTo(`/sales-receipt?id=${order.saleNo}`) }
function handleDelete(order: PosOrderRecord) { orderToDelete.value = order; isDeleteOpen.value = true }


async function handleConfirmDelete() {
  if (!orderToDelete.value) return
  isBusy.value = true
  try {
    await deleteOrder(orderToDelete.value.id)
    toastMessage.value = `POS order ${orderToDelete.value.saleNo} deleted successfully.`
    isDeleteOpen.value = false
    orderToDelete.value = null
  } catch (err: any) {
    console.error('Failed to delete POS order:', err)
  } finally {
    isBusy.value = false
  }
}

async function handleSavePayment(payload: { saleId: string; amount: number; paymentType: string }) {
  isBusy.value = true
  try {
    await recordPayment(payload.saleId, payload.amount, payload.paymentType)
    toastMessage.value = 'Payment recorded successfully.'
    isPaymentOpen.value = false
    selectedOrder.value = null
  } catch (err: any) {
    console.error('Failed to record payment:', err)
  } finally {
    isBusy.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-pos-order space-y-6">
    <SalesListHeader
      title="POS Orders"
      subtitle="Manage in-store point of sale transactions and receipts"
      add-label="Add Sales"
      :refreshing="pending"
      @add="navigateTo('/add-sales')"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <SalesFeedback
      :pending="pending"
      :error="error ? 'Unable to load POS orders. Please try again.' : ''"
      :message="toastMessage"
      @retry="refresh"
      @dismiss="toastMessage = ''"
    />

    <PosOrderRecordsTable
      v-if="!pending && !error"
      :orders="orders"
      @view="handleView"
      @show-payments="handleView"
      @create-payment="handleCreatePayment"
      @print-receipt="handlePrintReceipt"
      @delete="handleDelete"
    />

    <!-- Sale Detail Modal -->
    <PosOrderDetailDialog
      :open="isDetailOpen"
      :order="selectedOrder"
      @close="isDetailOpen = false"
    />

    <!-- Create Payment Modal -->
    <PosOrderPaymentDialog
      :open="isPaymentOpen"
      :order="selectedOrder"
      :busy="isBusy"
      @close="isPaymentOpen = false"
      @save="handleSavePayment"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteOpen"
      title="Remove POS Order"
      message="Are you sure you want to remove this POS order? This action cannot be undone."
      @cancel="isDeleteOpen = false"
      @confirm="handleConfirmDelete"
    />

    <!-- Print & PDF Modal -->
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="POS Orders"
      :columns="printColumns"
      :items="orders"
      :default-action="defaultPrintAction"
      :show-date-range="false"
      @close="closePrintModal"
    />
  </div>
</template>
