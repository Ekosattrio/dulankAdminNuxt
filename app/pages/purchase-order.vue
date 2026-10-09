<script setup lang="ts">
import type { PurchaseOrder, PurchaseOrderFormData } from '#server/types/purchase-order'
import { usePurchaseOrders } from '~/composables/usePurchaseOrders'
import { useSuppliers } from '~/composables/useSuppliers'
import { useTablePrint } from '~/composables/useTablePrint'
import { purchaseOrderPrintColumns } from '~/utils/purchaseUi'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import PurchaseOrderStatsWidgets from '~/components/pages/purchase-order/PurchaseOrderStatsWidgets.vue'
import PurchaseOrderRecordsTable from '~/components/pages/purchase-order/PurchaseOrderRecordsTable.vue'
import PurchaseOrderDetailModal from '~/components/pages/purchase-order/PurchaseOrderDetailModal.vue'
import PurchaseOrderFormModal from '~/components/pages/purchase-order/PurchaseOrderFormModal.vue'

definePageMeta({
  layout: 'default',
  alias: ['/purchase-order.html']
})
useLegacyPage({ title: 'Purchase Order List', sweetAlert: false })

const searchQuery = ref('')
const filterStatus = ref('')
const filterGoodsStatus = ref('')

const filterParams = computed(() => ({
  search: searchQuery.value,
  status: filterStatus.value,
  goodsStatus: filterGoodsStatus.value
}))

const { purchaseOrders, pending, error, refresh, savePurchaseOrder, deletePurchaseOrder } = usePurchaseOrders(filterParams)
const { suppliers } = useSuppliers()
const { isPrintModalOpen, openPrintModal, closePrintModal } = useTablePrint()

const supplierOptions = computed(() => suppliers.value?.length ? suppliers.value.map(s => s.name) : ['PT Kertas Jaya', 'CV Kimia Prima', 'Global Inkindo', 'PT Sinar Grafika'])

const isFormModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const isEditMode = ref(false)
const selectedOrder = ref<PurchaseOrder | null>(null)
const deletingOrder = ref<PurchaseOrder | null>(null)
const formBusy = ref(false)
const deleteBusy = ref(false)
const feedbackMessage = ref('')

function handleOpenAdd() { isEditMode.value = false; selectedOrder.value = null; isFormModalOpen.value = true }
function handleView(order: PurchaseOrder) { selectedOrder.value = order; isDetailModalOpen.value = true }
function handleEdit(order: PurchaseOrder) { isDetailModalOpen.value = false; isEditMode.value = true; selectedOrder.value = order; isFormModalOpen.value = true }

async function handleFormSubmit(payload: PurchaseOrderFormData) {
  formBusy.value = true
  try {
    const res = await savePurchaseOrder(payload)
    isFormModalOpen.value = false
    feedbackMessage.value = res.message || 'Purchase order saved successfully'
  } catch (err: any) {
    feedbackMessage.value = err?.data?.message || err?.message || 'Failed to save purchase order'
  } finally {
    formBusy.value = false
  }
}

async function handleConfirmDelete() {
  if (!deletingOrder.value) return
  deleteBusy.value = true
  try {
    await deletePurchaseOrder(deletingOrder.value.id)
    feedbackMessage.value = `Purchase order '${deletingOrder.value.poNumber}' deleted successfully`
    deletingOrder.value = null
  } catch (err: any) {
    feedbackMessage.value = err?.data?.message || err?.message || 'Failed to delete purchase order'
  } finally {
    deleteBusy.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-purchase-order space-y-4 p-4 md:p-6">
    <SalesListHeader
      title="Purchase Order"
      subtitle="Manage your Purchase Orders"
      add-label="Add Purchase Order"
      @add="handleOpenAdd"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <PurchaseOrderStatsWidgets :orders="purchaseOrders" />

    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :error="error ? (error.message || 'Failed to load purchase orders') : ''"
      :message="feedbackMessage"
      @retry="refresh"
      @dismiss="feedbackMessage = ''"
    />

    <PurchaseOrderRecordsTable
      v-if="!pending && !error"
      :orders="purchaseOrders"
      :search-query="searchQuery"
      :filter-status="filterStatus"
      :filter-goods-status="filterGoodsStatus"
      @update:search-query="searchQuery = $event"
      @update:filter-status="filterStatus = $event"
      @update:filter-goods-status="filterGoodsStatus = $event"
      @view="handleView"
      @edit="handleEdit"
      @delete="deletingOrder = $event"
    />

    <PurchaseOrderDetailModal :open="isDetailModalOpen" :order="selectedOrder" @close="isDetailModalOpen = false" @edit="handleEdit" />
    <PurchaseOrderFormModal :open="isFormModalOpen" :is-edit="isEditMode" :order-data="selectedOrder" :supplier-options="supplierOptions" :busy="formBusy" @close="isFormModalOpen = false" @submit="handleFormSubmit" />
    <SalesConfirmDelete :open="!!deletingOrder" title="Delete Purchase Order" :message="`Are you sure you want to delete purchase order '${deletingOrder?.poNumber}'?`" :busy="deleteBusy" @cancel="deletingOrder = null" @confirm="handleConfirmDelete" />
    <DocumentPrintModal v-if="isPrintModalOpen" :open="isPrintModalOpen" title="Laporan Purchase Orders" :columns="purchaseOrderPrintColumns" :items="purchaseOrders" date-field="date" @close="closePrintModal" />
  </div>
</template>
