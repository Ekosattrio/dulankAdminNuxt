<script setup lang="ts">
import type { Order, OrderStatus } from '#server/types/order'
import type { DateRangeValue } from '~/composables/useDateRange'
import { useOrders } from '~/composables/useOrders'
import { salesErrorMessage, printSalesRows } from '~/utils/salesDocuments'
import OrdersRecordsTable from '~/components/pages/orders/OrdersRecordsTable.vue'
import OrderStatsWidgets from '~/components/pages/orders/OrderStatsWidgets.vue'
import OrderStatusModal from '~/components/pages/orders/OrderStatusModal.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'

definePageMeta({
  layout: 'default',
  alias: ['/orders.html'],
})

useLegacyPage({ title: 'Orders List', sweetAlert: false })

const searchQuery = ref('')
const filterShipping = ref('')
const filterStatus = ref('')
const filterDateRange = ref<DateRangeValue | null>(null)

const activeOrderForStatus = ref<Order | null>(null)
const isStatusModalOpen = ref(false)
const busy = ref(false)
const actionError = ref('')

const filterParams = computed(() => ({
  search: searchQuery.value,
  shipping: filterShipping.value,
  status: filterStatus.value,
  startDate: filterDateRange.value?.start || '',
  endDate: filterDateRange.value?.end || '',
}))

const { orders, stats, pending, error, refresh, updateStatus } = useOrders(filterParams)

function openStatusModal(order: Order) {
  activeOrderForStatus.value = order
  isStatusModalOpen.value = true
}

async function handleStatusSubmit(newStatus: OrderStatus) {
  if (!activeOrderForStatus.value) return
  busy.value = true
  actionError.value = ''
  try {
    await updateStatus(activeOrderForStatus.value.id, newStatus)
    isStatusModalOpen.value = false
    activeOrderForStatus.value = null
  } catch (err) {
    actionError.value = salesErrorMessage(err)
  } finally {
    busy.value = false
  }
}

import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import { useTablePrint } from '~/composables/useTablePrint'

const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const orderPrintColumns = [
  { key: 'no', label: 'No' },
  { key: 'customer', label: 'Customers' },
  { key: 'orderDate', label: 'Order Date' },
  { key: 'status', label: 'Order Status', align: 'center' as const },
  { key: 'statusBy', label: 'Order Status By' },
  { key: 'salesChannel', label: 'Sales Channel' },
  { key: 'shipping', label: 'Shipping' }
]
</script>

<template>
  <div class="dulank-page dulank-page-orders space-y-6">
    <SalesListHeader
      title="Orders List"
      subtitle="Manage your Orders"
      :refreshing="pending"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <!-- KPI Widgets -->
    <OrderStatsWidgets :stats="stats" />

    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="8"
      :skeleton-rows="6"
      :error="error ? 'Unable to load orders. Please try again.' : ''"
      @retry="refresh()"
    />

    <OrdersRecordsTable
      v-if="!pending && !error"
      :orders="orders"
      :search-query="searchQuery"
      :filter-shipping="filterShipping"
      :filter-status="filterStatus"
      :filter-date-range="filterDateRange"
      @update:search-query="searchQuery = $event"
      @update:filter-shipping="filterShipping = $event"
      @update:filter-status="filterStatus = $event"
      @update:filter-date-range="filterDateRange = $event"
      @update-status="openStatusModal"
    />

    <!-- Update Order Status Modal -->
    <OrderStatusModal
      :open="isStatusModalOpen"
      :order="activeOrderForStatus"
      :busy="busy"
      @close="isStatusModalOpen = false; activeOrderForStatus = null"
      @submit="handleStatusSubmit"
    />

    <!-- Standardized Print & Export PDF Modal -->
    <DocumentPrintModal
      v-if="isPrintModalOpen"
      :open="isPrintModalOpen"
      title="Laporan Daftar Pesanan (Orders List)"
      :columns="orderPrintColumns"
      :items="orders"
      date-field="orderDate"
      :initial-date-range="filterDateRange"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
