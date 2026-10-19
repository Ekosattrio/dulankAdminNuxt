<script setup lang="ts">
import type { Purchase, PurchaseFormData } from '#server/types/purchase'
import { formatNumber } from '~/composables/useFormatters'
import PurchaseStatsWidgets from '~/components/Pages/Purchase/PurchaseStatsWidgets.vue'

const searchQuery = ref('')
const filterStatus = ref('')
const filterPaymentStatus = ref('')
const collapsed = ref(false)

const filterParams = computed(() => ({
  search: searchQuery.value,
  status: filterStatus.value,
  paymentStatus: filterPaymentStatus.value,
}))

const { purchases, pending, error, refresh, savePurchase, deletePurchase } = usePurchases(filterParams)
const { suppliers } = useSuppliers()
const { items: catalogItems } = usePurchaseItems()

const stats = computed(() => {
  const all = purchases.value || []
  return {
    totalPurchases: all.length,
    totalAmount: all.reduce((sum, p) => sum + (Number(p.amount) || 0), 0),
    totalPaid: all.reduce((sum, p) => sum + (Number(p.paid) || 0), 0),
    totalDue: all.reduce((sum, p) => sum + (Number(p.due) || 0), 0),
  }
})

const supplierOptions = computed(() => {
  if (suppliers.value && suppliers.value.length > 0) {
    return suppliers.value.map(s => s.name)
  }
  return ['PT Kertas Jaya', 'CV Kimia Prima', 'Global Inkindo', 'PT Sinar Grafika']
})

const isFormModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const isEditMode = ref(false)
const activePurchaseForEdit = ref<Purchase | null>(null)
const activePurchaseForDetail = ref<Purchase | null>(null)
const purchaseToDelete = ref<Purchase | null>(null)
const isBusy = ref(false)
const toastMessage = ref('')
const actionError = ref('')

const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()
const printColumns = [
  { key: 'noPurchase', label: 'No Purchase' },
  { key: 'date', label: 'Date' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'product', label: 'Product' },
  { key: 'status', label: 'Status' },
  { key: 'amount', label: 'Amount (IDR)', align: 'right' as const },
  { key: 'paid', label: 'Paid (IDR)', align: 'right' as const },
  { key: 'due', label: 'Due (IDR)', align: 'right' as const },
  { key: 'paymentStatus', label: 'Payment' },
]

function handleAdd() {
  navigateTo('/add-purchase')
}

function handleView(purchase: Purchase) {
  activePurchaseForDetail.value = purchase
  isDetailModalOpen.value = true
}

function handleEdit(purchase: Purchase) {
  isDetailModalOpen.value = false
  isEditMode.value = true
  activePurchaseForEdit.value = purchase
  isFormModalOpen.value = true
}

function handleDeleteRequest(purchase: Purchase) {
  purchaseToDelete.value = purchase
}

async function handleFormSubmit(formData: PurchaseFormData) {
  isBusy.value = true
  actionError.value = ''
  try {
    const res = await savePurchase(formData)
    isFormModalOpen.value = false
    toastMessage.value = res.message || (isEditMode.value ? 'Purchase updated successfully' : 'Purchase created successfully')
  } catch (err: any) {
    actionError.value = err?.data?.message || err?.message || 'Failed to save purchase'
  } finally {
    isBusy.value = false
  }
}

async function confirmDelete() {
  if (!purchaseToDelete.value) return
  isBusy.value = true
  actionError.value = ''
  try {
    const res = await deletePurchase(purchaseToDelete.value.id)
    purchaseToDelete.value = null
    toastMessage.value = res.message || 'Purchase deleted successfully'
  } catch (err: any) {
    actionError.value = err?.data?.message || err?.message || 'Failed to delete purchase'
  } finally {
    isBusy.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader
      title="Purchase List"
      subtitle="Manage your purchases"
      add-label="Add New Purchase"
      :refreshing="pending"
      @add="handleAdd"
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

    <!-- KPI Stats Widgets -->
    <PurchaseStatsWidgets v-if="!collapsed" :stats="stats" />

    <SalesFeedback :message="toastMessage" :error="actionError" @dismiss="toastMessage = ''" @retry="actionError = ''" />
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="9"
      :error="error ? 'Unable to load purchases. Please try again.' : ''"
      @retry="refresh"
    />

    <PurchaseRecordsTable
      v-if="!collapsed && !pending && !error"
      :purchases="purchases"
      :search-query="searchQuery"
      :filter-status="filterStatus"
      :filter-payment-status="filterPaymentStatus"
      @update:search-query="searchQuery = $event"
      @update:filter-status="filterStatus = $event"
      @update:filter-payment-status="filterPaymentStatus = $event"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDeleteRequest"
    />

    <PurchaseFormModal
      :open="isFormModalOpen"
      :is-edit="isEditMode"
      :purchase-data="activePurchaseForEdit"
      :supplier-options="supplierOptions"
      :catalog-items="catalogItems"
      :busy="isBusy"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <PurchaseDetailModal
      :open="isDetailModalOpen"
      :purchase="activePurchaseForDetail"
      @close="isDetailModalOpen = false"
      @edit="handleEdit"
      @delete="handleDeleteRequest"
    />

    <SalesConfirmDelete
      :open="!!purchaseToDelete"
      title="Delete Purchase"
      message="Are you sure you want to delete this purchase order? This action cannot be undone."
      :busy="isBusy"
      :error="actionError"
      @close="purchaseToDelete = null"
      @confirm="confirmDelete"
    />

    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Purchase Report"
      subtitle="Daftar transaksi pembelian barang / bahan baku"
      :columns="printColumns"
      :items="purchases"
      :show-date-range="false"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>

