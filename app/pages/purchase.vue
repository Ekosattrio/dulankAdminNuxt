<script setup lang="ts">
import type { Purchase, PurchaseFormData } from '#server/types/purchase'
import { usePurchases } from '~/composables/usePurchases'
import { useSuppliers } from '~/composables/useSuppliers'
import { usePurchaseItems } from '~/composables/usePurchaseItems'
import { useTablePrint } from '~/composables/useTablePrint'
import { formatNumber } from '~/composables/useFormatters'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'
import PurchaseStatsWidgets from '~/components/Pages/Purchase/PurchaseStatsWidgets.vue'
import PurchaseRecordsTable from '~/components/Pages/Purchase/PurchaseRecordsTable.vue'
import PurchaseDetailModal from '~/components/Pages/Purchase/PurchaseDetailModal.vue'
import PurchaseFormModal from '~/components/Pages/Purchase/PurchaseFormModal.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Purchase List - Transaksi Pembelian',
  sweetAlert: false
})

// Filter states
const searchQuery = ref('')
const filterStatus = ref('')
const filterPaymentStatus = ref('')

const filterParams = computed(() => ({
  search: searchQuery.value,
  status: filterStatus.value,
  paymentStatus: filterPaymentStatus.value,
}))

const { purchases, pending, error, refresh, savePurchase, deletePurchase } = usePurchases(filterParams)
const { suppliers } = useSuppliers()
const { items: catalogItems } = usePurchaseItems()

const supplierOptions = computed(() => {
  if (suppliers.value && suppliers.value.length > 0) {
    return suppliers.value.map(s => s.name)
  }
  return ['PT Kertas Jaya', 'CV Kimia Prima', 'Global Inkindo', 'PT Sinar Grafika']
})

// KPI stats calculation
const stats = computed(() => {
  const all = purchases.value
  const totalPurchases = all.length
  const totalAmount = all.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
  const totalPaid = all.reduce((sum, p) => sum + (Number(p.paid) || 0), 0)
  const totalDue = all.reduce((sum, p) => sum + (Number(p.due) || 0), 0)

  return {
    totalPurchases,
    totalAmount,
    totalPaid,
    totalDue,
  }
})

// Modal states
const isFormModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const isEditMode = ref(false)
const activePurchaseForEdit = ref<Purchase | null>(null)
const activePurchaseForDetail = ref<Purchase | null>(null)
const purchaseToDelete = ref<Purchase | null>(null)
const isBusy = ref(false)

// Toast feedback
const toastMessage = ref('')

function showToast(msg: string) {
  toastMessage.value = msg
}

// Handlers
function handleAdd() {
  isEditMode.value = false
  activePurchaseForEdit.value = null
  isFormModalOpen.value = true
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
  try {
    const res = await savePurchase(formData)
    isFormModalOpen.value = false
    showToast(res.message || (isEditMode.value ? 'Purchase updated successfully' : 'Purchase created successfully'))
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to save purchase')
  } finally {
    isBusy.value = false
  }
}

async function confirmDelete() {
  if (!purchaseToDelete.value) return
  isBusy.value = true
  try {
    await deletePurchase(purchaseToDelete.value.id)
    showToast(`Purchase '${purchaseToDelete.value.noPurchase}' deleted successfully`)
    purchaseToDelete.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to delete purchase')
  } finally {
    isBusy.value = false
  }
}

// Print & Export
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const printColumns = [
  { key: 'noPurchase', label: 'No Purchase' },
  { key: 'date', label: 'Date' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'product', label: 'Product' },
  { key: 'status', label: 'Status', align: 'center' as const },
  { key: 'amountFormatted', label: 'Amount (IDR)', align: 'right' as const },
  { key: 'paidFormatted', label: 'Paid (IDR)', align: 'right' as const },
  { key: 'dueFormatted', label: 'Due (IDR)', align: 'right' as const },
  { key: 'paymentStatus', label: 'Payment', align: 'center' as const },
]

const printablePurchases = computed(() =>
  purchases.value.map(p => ({
    ...p,
    amountFormatted: `Rp ${formatNumber(p.amount)}`,
    paidFormatted: `Rp ${formatNumber(p.paid)}`,
    dueFormatted: `Rp ${formatNumber(p.due)}`,
  }))
)

function handleExportExcel() {
  const header = ['No Purchase', 'Date', 'Supplier', 'Product', 'Status', 'Amount', 'Paid', 'Due', 'Payment Status', 'Notes']
  const rows = purchases.value.map(p => [
    `"${p.noPurchase}"`,
    `"${p.date}"`,
    `"${p.supplier}"`,
    `"${(p.product || '').replace(/"/g, '""')}"`,
    `"${p.status}"`,
    `"${p.amount}"`,
    `"${p.paid}"`,
    `"${p.due}"`,
    `"${p.paymentStatus}"`,
    `"${(p.notes || '').replace(/"/g, '""')}"`,
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map(r => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `purchases_export_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('Purchases data exported to CSV successfully')
}
</script>

<template>
  <div class="space-y-4 p-4 md:p-6">
    <!-- Header -->
    <SalesListHeader
      title="Purchase List"
      subtitle="Manage your purchases and supplier bills"
      add-label="Add New Purchase"
      @add="handleAdd"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @export-pdf="openPrintModal('pdf')"
      @export-excel="handleExportExcel"
    />

    <!-- KPI Stats Widgets -->
    <PurchaseStatsWidgets :stats="stats" />

    <!-- Feedback Toast -->
    <SalesFeedback
      v-if="toastMessage"
      :message="toastMessage"
      @dismiss="toastMessage = ''"
    />

    <!-- Skeleton & Error Feedback -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="10"
      :skeleton-rows="6"
      :error="error ? (error.message || 'Failed to load purchases. Please try again.') : ''"
      @retry="refresh"
    />

    <!-- Records Table -->
    <PurchaseRecordsTable
      v-if="!pending && !error"
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

    <!-- Purchase Detail Modal -->
    <PurchaseDetailModal
      :open="isDetailModalOpen"
      :purchase="activePurchaseForDetail"
      @close="isDetailModalOpen = false"
      @edit="handleEdit"
    />

    <!-- Add / Edit Modal -->
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

    <!-- Delete Confirmation Modal -->
    <SalesConfirmDelete
      :open="!!purchaseToDelete"
      title="Delete Purchase"
      :message="`Are you sure you want to delete purchase '${purchaseToDelete?.noPurchase}' from supplier ${purchaseToDelete?.supplier}? This action cannot be undone.`"
      :busy="isBusy"
      @close="purchaseToDelete = null"
      @confirm="confirmDelete"
    />

    <!-- Table Print / PDF Preview Modal -->
    <DocumentPrintModal
      v-if="isPrintModalOpen"
      :open="isPrintModalOpen"
      title="Laporan Transaksi Pembelian (Purchase List)"
      :columns="printColumns"
      :items="printablePurchases"
      date-field="date"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
