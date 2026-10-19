<script setup lang="ts">
import type { PurchaseOrder, PurchaseOrderFormData } from '#server/types/purchase-order'
import { formatNumber } from '~/composables/useFormatters'

// Filter states
const searchQuery = ref('')
const filterStatus = ref('')
const filterGoodsStatus = ref('')
const collapsed = ref(false)

const filterParams = computed(() => ({
  search: searchQuery.value,
  status: filterStatus.value,
  goodsStatus: filterGoodsStatus.value,
}))

const { purchaseOrders, pending, error, refresh, savePurchaseOrder, deletePurchaseOrder } = usePurchaseOrders(filterParams)
const { suppliers } = useSuppliers()

const supplierOptions = computed(() => {
  if (suppliers.value && suppliers.value.length > 0) {
    return suppliers.value.map(s => s.name)
  }
  return ['PT Kertas Jaya', 'CV Kimia Prima', 'Global Inkindo', 'PT Sinar Grafika', 'Indo Material']
})

// KPI stats calculation
const stats = computed(() => {
  const all = purchaseOrders.value
  const totalOrders = all.length
  const totalAmount = all.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
  const totalComplete = all.filter(p => p.goodsStatus === 'Complete').length
  const totalScheduled = all.filter(p => p.goodsStatus === 'Scheduled' || p.goodsStatus === 'Pending').length

  return {
    totalOrders,
    totalAmount,
    totalComplete,
    totalScheduled,
  }
})

// Modal states
const isFormModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isEditMode = ref(false)
const selectedOrder = ref<PurchaseOrder | null>(null)
const deletingOrder = ref<PurchaseOrder | null>(null)
const formBusy = ref(false)
const deleteBusy = ref(false)
const actionError = ref('')

// Print/PDF Setup
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const printColumns = [
  { key: 'noPO', label: 'No PO' },
  { key: 'date', label: 'Date' },
  { key: 'created', label: 'Created' },
  { key: 'noPurchase', label: 'No Purchase' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'amount', label: 'Amount', align: 'right' as const, format: (val: number) => `Rp ${formatNumber(val)}` },
  { key: 'poStatus', label: 'PO Status', align: 'center' as const },
  { key: 'goodsStatus', label: 'Receiving Status', align: 'center' as const },
  { key: 'goodsDate', label: 'Receiving Date' },
  { key: 'goodsBy', label: 'Receiving By' },
]

function handleOpenAdd() {
  selectedOrder.value = null
  isEditMode.value = false
  isFormModalOpen.value = true
}

function handleView(order: PurchaseOrder) {
  selectedOrder.value = order
  isDetailModalOpen.value = true
}

function handleEdit(order: PurchaseOrder) {
  selectedOrder.value = order
  isEditMode.value = true
  isFormModalOpen.value = true
}

function handleDeleteConfirm(order: PurchaseOrder) {
  deletingOrder.value = order
  isDeleteModalOpen.value = true
}

async function handleSaveOrder(form: PurchaseOrderFormData) {
  formBusy.value = true
  actionError.value = ''
  try {
    await savePurchaseOrder(form)
    isFormModalOpen.value = false
  } catch (err: any) {
    actionError.value = err?.message || 'Gagal menyimpan purchase order'
  } finally {
    formBusy.value = false
  }
}

async function handleDeleteExecute() {
  if (!deletingOrder.value) return
  deleteBusy.value = true
  actionError.value = ''
  try {
    await deletePurchaseOrder(deletingOrder.value.id)
    isDeleteModalOpen.value = false
    deletingOrder.value = null
  } catch (err: any) {
    actionError.value = err?.message || 'Gagal menghapus purchase order'
  } finally {
    deleteBusy.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header with Breadcrumb and Action Buttons -->
    <SalesListHeader
      title="Purchase Order List"
      subtitle="Kelola Pesanan Pembelian & Penerimaan Barang (PO)"
      add-label="Add Purchase Order"
      :refreshing="pending"
      @add="handleOpenAdd"
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

    <!-- KPI Widgets -->
    <PurchaseOrderStatsWidgets v-if="!collapsed" :stats="stats" />

    <!-- Error State -->
    <div
      v-if="error"
      class="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400"
    >
      <div class="flex items-center gap-2">
        <FeatherIcon name="alert-circle" :size="16" />
        <span>Gagal memuat data pesanan pembelian: {{ error.message }}</span>
      </div>
    </div>

    <!-- Data Table & Feedback -->
    <SalesFeedback :pending="pending" skeleton="table" :skeleton-cols="11">
      <PurchaseOrderRecordsTable
        v-if="!collapsed"
        :orders="purchaseOrders"
        :search-query="searchQuery"
        :filter-status="filterStatus"
        :filter-goods-status="filterGoodsStatus"
        @update:search-query="searchQuery = $event"
        @update:filter-status="filterStatus = $event"
        @update:filter-goods-status="filterGoodsStatus = $event"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDeleteConfirm"
      />
    </SalesFeedback>

    <!-- Modals -->
    <PurchaseOrderFormModal
      :open="isFormModalOpen"
      :is-edit="isEditMode"
      :order-data="selectedOrder"
      :supplier-options="supplierOptions"
      :busy="formBusy"
      @close="isFormModalOpen = false"
      @submit="handleSaveOrder"
    />

    <PurchaseOrderDetailModal
      :open="isDetailModalOpen"
      :order="selectedOrder"
      @close="isDetailModalOpen = false"
      @edit="handleEdit"
    />

    <SalesConfirmDelete
      :open="isDeleteModalOpen"
      title="Hapus Purchase Order"
      :message="`Apakah Anda yakin ingin menghapus PO '${deletingOrder?.noPO}' (${deletingOrder?.supplier})?`"
      :busy="deleteBusy"
      :error="actionError"
      @close="isDeleteModalOpen = false"
      @confirm="handleDeleteExecute"
    />

    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Laporan Purchase Order"
      subtitle="Daftar Surat Pesanan Pembelian & Status Penerimaan Barang"
      :columns="printColumns"
      :items="purchaseOrders"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>

