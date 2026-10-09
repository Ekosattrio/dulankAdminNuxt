<script setup lang="ts">
import type { Purchase, PurchaseFormData } from '#server/types/purchase'
import { usePurchases } from '~/composables/usePurchases'
import { useSuppliers } from '~/composables/useSuppliers'
import { usePurchaseItems } from '~/composables/usePurchaseItems'
import { useTablePrint } from '~/composables/useTablePrint'
import { purchasePrintColumns } from '~/utils/purchaseUi'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import PurchaseStatsWidgets from '~/components/pages/purchase/PurchaseStatsWidgets.vue'
import PurchaseRecordsTable from '~/components/pages/purchase/PurchaseRecordsTable.vue'
import PurchaseDetailModal from '~/components/pages/purchase/PurchaseDetailModal.vue'
import PurchaseFormModal from '~/components/pages/purchase/PurchaseFormModal.vue'

definePageMeta({
  layout: 'default',
  alias: ['/purchase.html']
})
useLegacyPage({ title: 'Purchase List - Transaksi Pembelian', sweetAlert: false })

const searchQuery = ref('')
const filterStatus = ref('')
const filterPaymentStatus = ref('')

const filterParams = computed(() => ({
  search: searchQuery.value,
  status: filterStatus.value,
  paymentStatus: filterPaymentStatus.value
}))

const { purchases, pending, error, refresh, savePurchase, deletePurchase } = usePurchases(filterParams)
const { suppliers } = useSuppliers()
const { items: catalogItems } = usePurchaseItems()
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const supplierOptions = computed(() => suppliers.value?.length ? suppliers.value.map(s => s.name) : ['PT Kertas Jaya', 'CV Kimia Prima', 'Global Inkindo', 'PT Sinar Grafika'])

const isFormModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const isEditMode = ref(false)
const activePurchaseForEdit = ref<Purchase | null>(null)
const activePurchaseForDetail = ref<Purchase | null>(null)
const purchaseToDelete = ref<Purchase | null>(null)
const isBusy = ref(false)
const feedbackMsg = ref('')

function handleAdd() { isEditMode.value = false; activePurchaseForEdit.value = null; isFormModalOpen.value = true }
function handleView(purchase: Purchase) { activePurchaseForDetail.value = purchase; isDetailModalOpen.value = true }
function handleEdit(purchase: Purchase) { isDetailModalOpen.value = false; isEditMode.value = true; activePurchaseForEdit.value = purchase; isFormModalOpen.value = true }

async function handleFormSubmit(formData: PurchaseFormData) {
  isBusy.value = true
  try {
    const res = await savePurchase(formData)
    isFormModalOpen.value = false
    feedbackMsg.value = res.message || 'Purchase saved successfully'
  } catch (err: any) {
    feedbackMsg.value = err?.data?.message || err?.message || 'Failed to save purchase'
  } finally {
    isBusy.value = false
  }
}

async function confirmDelete() {
  if (!purchaseToDelete.value) return
  isBusy.value = true
  try {
    await deletePurchase(purchaseToDelete.value.id)
    feedbackMsg.value = `Purchase '${purchaseToDelete.value.noPurchase}' deleted successfully`
    purchaseToDelete.value = null
  } catch (err: any) {
    feedbackMsg.value = err?.data?.message || err?.message || 'Failed to delete purchase'
  } finally {
    isBusy.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-purchase space-y-4 p-4 md:p-6">
    <SalesListHeader
      title="Purchase List"
      subtitle="Manage your purchases and supplier bills"
      add-label="Add New Purchase"
      @add="handleAdd"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <PurchaseStatsWidgets :purchases="purchases" />

    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :error="error ? (error.message || 'Failed to load purchases') : ''"
      :message="feedbackMsg"
      @retry="refresh"
      @dismiss="feedbackMsg = ''"
    />

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
      @delete="purchaseToDelete = $event"
    />

    <PurchaseDetailModal :open="isDetailModalOpen" :purchase="activePurchaseForDetail" @close="isDetailModalOpen = false" @edit="handleEdit" />
    <PurchaseFormModal :open="isFormModalOpen" :is-edit="isEditMode" :purchase-data="activePurchaseForEdit" :supplier-options="supplierOptions" :catalog-items="catalogItems" :busy="isBusy" @close="isFormModalOpen = false" @submit="handleFormSubmit" />
    <SalesConfirmDelete :open="!!purchaseToDelete" title="Delete Purchase" :message="`Are you sure you want to delete purchase '${purchaseToDelete?.noPurchase}'? This action cannot be undone.`" :busy="isBusy" @cancel="purchaseToDelete = null" @confirm="confirmDelete" />
    <DocumentPrintModal v-if="isPrintModalOpen" :open="isPrintModalOpen" title="Laporan Transaksi Pembelian" :columns="purchasePrintColumns" :items="purchases" date-field="date" :default-action="defaultPrintAction" @close="closePrintModal" />
  </div>
</template>
