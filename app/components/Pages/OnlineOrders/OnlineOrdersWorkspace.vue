<script setup lang="ts">
import type { OnlineOrderItem } from '#server/types/online-order'
import { formatNumber } from '~/composables/useFormatters'

const searchQuery = ref('')
const filterStatus = ref('')
const filterPayment = ref('')
const collapsed = ref(false)

const query = computed(() => ({
  search: searchQuery.value || undefined,
  status: filterStatus.value || undefined,
  paymentStatus: filterPayment.value || undefined,
}))

const { orders, pending, error, refresh, recordPayment, deleteOrder } = useOnlineOrders(query)

const selectedOrderForDetail = ref<OnlineOrderItem | null>(null)
const selectedOrderForPayment = ref<OnlineOrderItem | null>(null)
const orderToDelete = ref<OnlineOrderItem | null>(null)
const busy = ref(false)
const toastMessage = ref('')
const actionError = ref('')

const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()
const printColumns = [
  { key: 'reference', label: 'Reference' },
  { key: 'customer', label: 'Customer' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status' },
  { key: 'grandTotalFormatted', label: 'Grand Total', align: 'right' as const },
  { key: 'paidFormatted', label: 'Paid', align: 'right' as const },
  { key: 'dueFormatted', label: 'Due', align: 'right' as const },
  { key: 'paymentStatus', label: 'Payment Status' },
  { key: 'biller', label: 'Biller' },
]

const printableOrders = computed(() =>
  orders.value.map((o) => ({
    ...o,
    grandTotalFormatted: `Rp ${formatNumber(o.grandTotal)}`,
    paidFormatted: `Rp ${formatNumber(o.paid)}`,
    dueFormatted: `Rp ${formatNumber(o.due)}`,
  })),
)

function handleAddSales() {
  navigateTo('/add-sales')
}

function handleView(order: OnlineOrderItem) {
  selectedOrderForDetail.value = order
}

function handlePay(order: OnlineOrderItem) {
  selectedOrderForPayment.value = order
}

function handleDeleteRequest(order: OnlineOrderItem) {
  orderToDelete.value = order
}

async function handlePaymentSubmit(payload: { amount: number; method: string }) {
  if (!selectedOrderForPayment.value) return
  busy.value = true
  actionError.value = ''
  try {
    const res = await recordPayment(selectedOrderForPayment.value.id, payload.amount, payload.method)
    toastMessage.value = res.message || 'Payment recorded successfully'
    selectedOrderForPayment.value = null
  } catch (err: any) {
    actionError.value = err?.data?.message || err?.message || 'Failed to record payment'
  } finally {
    busy.value = false
  }
}

async function confirmDelete() {
  if (!orderToDelete.value) return
  busy.value = true
  actionError.value = ''
  try {
    const res = await deleteOrder(orderToDelete.value.id)
    toastMessage.value = res.message || 'Order deleted successfully'
    orderToDelete.value = null
  } catch (err: any) {
    actionError.value = err?.data?.message || err?.message || 'Failed to delete order'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader
      title="Online Orders"
      subtitle="Manage ecommerce marketplace & webstore transactions"
      add-label="Add Sales"
      :refreshing="pending"
      @add="handleAddSales"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    >
      <template #actions>
        <button
          type="button"
          title="Collapse"
          aria-label="Collapse"
          class="flex size-9 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
          @click="collapsed = !collapsed"
        >
          <FeatherIcon :name="collapsed ? 'chevron-down' : 'chevron-up'" :size="14" />
        </button>
      </template>
    </SalesListHeader>

    <SalesFeedback :message="toastMessage" :error="actionError" @dismiss="toastMessage = ''" @retry="actionError = ''" />
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="9"
      :error="error ? 'Unable to load online orders. Please try again.' : ''"
      @retry="refresh"
    />

    <OnlineOrdersRecordsTable
      v-if="!collapsed && !pending && !error"
      :orders="orders"
      :search-query="searchQuery"
      :filter-status="filterStatus"
      :filter-payment="filterPayment"
      @update:search-query="searchQuery = $event"
      @update:filter-status="filterStatus = $event"
      @update:filter-payment="filterPayment = $event"
      @view="handleView"
      @pay="handlePay"
      @delete="handleDeleteRequest"
    />

    <OnlineOrderDetailModal
      :open="!!selectedOrderForDetail"
      :order="selectedOrderForDetail"
      @close="selectedOrderForDetail = null"
    />

    <OnlineOrderPaymentModal
      :open="!!selectedOrderForPayment"
      :order="selectedOrderForPayment"
      :busy="busy"
      @close="selectedOrderForPayment = null"
      @submit="handlePaymentSubmit"
    />

    <SalesConfirmDelete
      :open="!!orderToDelete"
      title="Delete Online Order"
      :message="`Are you sure you want to delete order '${orderToDelete?.reference}'? This action cannot be undone.`"
      :busy="busy"
      :error="actionError"
      @close="orderToDelete = null"
      @confirm="confirmDelete"
    />

    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Online Orders Report"
      subtitle="Daftar transaksi pesanan online dan marketplace"
      :columns="printColumns"
      :items="printableOrders"
      :show-date-range="false"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>

