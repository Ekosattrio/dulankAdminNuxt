<script setup lang="ts">
import type { OnlineOrder } from '#server/types/online-order'
import { useOnlineOrders } from '~/composables/useOnlineOrders'
import { useTablePrint } from '~/composables/useTablePrint'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import OnlineOrderRecordsTable from '~/components/pages/online-orders/OnlineOrderRecordsTable.vue'
import OnlineOrderDetailModal from '~/components/pages/online-orders/OnlineOrderDetailModal.vue'
import OnlineOrderPaymentModal from '~/components/pages/online-orders/OnlineOrderPaymentModal.vue'

definePageMeta({
  layout: 'default',
  alias: ['/online-orders.html'],
})
useLegacyPage({ title: 'Online Orders', sweetAlert: false })

const searchQuery = ref('')
const filterStatus = ref('')
const filterPaymentStatus = ref('')

const filterParams = computed(() => ({
  search: searchQuery.value,
  status: filterStatus.value,
  paymentStatus: filterPaymentStatus.value
}))

const { orders, pending, error, refresh, recordPayment, deleteOrder } = useOnlineOrders(filterParams)
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const selectedOrder = ref<OnlineOrder | null>(null)
const isDetailOpen = ref(false)
const isPayOpen = ref(false)
const orderToDelete = ref<OnlineOrder | null>(null)
const isBusy = ref(false)
const feedbackMsg = ref('')

function handleView(order: OnlineOrder) { selectedOrder.value = order; isDetailOpen.value = true }
function handlePay(order: OnlineOrder) { selectedOrder.value = order; isPayOpen.value = true }

async function handlePaymentSubmit(payload: { amount: number; paymentMethod: string }) {
  if (!selectedOrder.value) return
  isBusy.value = true
  try {
    const res = await recordPayment(selectedOrder.value.id, payload.amount, payload.paymentMethod)
    isPayOpen.value = false
    feedbackMsg.value = res.message || 'Payment recorded successfully'
  } catch (err: any) {
    feedbackMsg.value = err?.data?.message || err?.message || 'Failed to record payment'
  } finally {
    isBusy.value = false
  }
}

async function confirmDelete() {
  if (!orderToDelete.value) return
  isBusy.value = true
  try {
    await deleteOrder(orderToDelete.value.id)
    feedbackMsg.value = `Order '${orderToDelete.value.reference}' deleted successfully`
    orderToDelete.value = null
  } catch (err: any) {
    feedbackMsg.value = err?.data?.message || err?.message || 'Failed to delete order'
  } finally {
    isBusy.value = false
  }
}

const printColumns = [
  { key: 'reference', label: 'Reference' },
  { key: 'customerName', label: 'Customer' },
  { key: 'total', label: 'Total', align: 'right' as const },
  { key: 'paid', label: 'Paid', align: 'right' as const },
  { key: 'due', label: 'Due', align: 'right' as const },
  { key: 'paymentStatus', label: 'Payment Status' },
  { key: 'status', label: 'Order Status' }
]
</script>

<template>
  <div class="dulank-page dulank-page-online-orders space-y-4 p-4 md:p-6">
    <SalesListHeader
      title="Online Orders"
      subtitle="Manage webstore orders, payment verification, and order processing"
      :show-add="false"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :error="error ? (error.message || 'Failed to load online orders') : ''"
      :message="feedbackMsg"
      @retry="refresh"
      @dismiss="feedbackMsg = ''"
    />

    <OnlineOrderRecordsTable
      v-if="!pending && !error"
      :orders="orders"
      :search-query="searchQuery"
      :filter-status="filterStatus"
      :filter-payment-status="filterPaymentStatus"
      @update:search-query="searchQuery = $event"
      @update:filter-status="filterStatus = $event"
      @update:filter-payment-status="filterPaymentStatus = $event"
      @view="handleView"
      @pay="handlePay"
      @delete="orderToDelete = $event"
    />

    <OnlineOrderDetailModal :open="isDetailOpen" :order="selectedOrder" @close="isDetailOpen = false" @pay="handlePay" />
    <OnlineOrderPaymentModal :open="isPayOpen" :order="selectedOrder" :busy="isBusy" @close="isPayOpen = false" @submit="handlePaymentSubmit" />
    <SalesConfirmDelete :open="!!orderToDelete" title="Delete Online Order" :message="`Are you sure you want to delete order '${orderToDelete?.reference}'?`" :busy="isBusy" @cancel="orderToDelete = null" @confirm="confirmDelete" />
    <DocumentPrintModal v-if="isPrintModalOpen" :open="isPrintModalOpen" title="Laporan Online Orders" :columns="printColumns" :items="orders" date-field="date" :default-action="defaultPrintAction" @close="closePrintModal" />
  </div>
</template>
