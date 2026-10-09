<script setup lang="ts">
import type { PurchaseReturn, PurchaseReturnFormData } from '#server/types/purchase-return'
import { usePurchaseReturns } from '~/composables/usePurchaseReturns'
import { useSuppliers } from '~/composables/useSuppliers'
import { useTablePrint } from '~/composables/useTablePrint'
import { purchaseReturnPrintColumns } from '~/utils/purchaseUi'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import PurchaseReturnStatsWidgets from '~/components/pages/purchase-return/PurchaseReturnStatsWidgets.vue'
import PurchaseReturnRecordsTable from '~/components/pages/purchase-return/PurchaseReturnRecordsTable.vue'
import PurchaseReturnDetailModal from '~/components/pages/purchase-return/PurchaseReturnDetailModal.vue'
import PurchaseReturnFormModal from '~/components/pages/purchase-return/PurchaseReturnFormModal.vue'

definePageMeta({
  layout: 'default',
  alias: ['/purchase-return.html']
})
useLegacyPage({ title: 'Purchase Return List - Pengembalian Pembelian', sweetAlert: false })

const searchQuery = ref('')
const filterStatus = ref('')
const filterParams = computed(() => ({ search: searchQuery.value, status: filterStatus.value }))

const { purchaseReturns, pending, error, refresh, savePurchaseReturn, deletePurchaseReturn } = usePurchaseReturns(filterParams)
const { suppliers } = useSuppliers()

const supplierOptions = computed(() => suppliers.value?.length ? suppliers.value.map(s => s.name) : ['PT Kertas Jaya', 'CV Kimia Prima', 'Global Inkindo', 'PT Sinar Grafika', 'Indo Material'])

const isFormModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const isEditMode = ref(false)
const selectedReturn = ref<PurchaseReturn | null>(null)
const deletingReturn = ref<PurchaseReturn | null>(null)
const formBusy = ref(false)
const deleteBusy = ref(false)

const { isPrintModalOpen, openPrintModal, closePrintModal } = useTablePrint()

function handleOpenAdd() { selectedReturn.value = null; isEditMode.value = false; isFormModalOpen.value = true }
function handleView(item: PurchaseReturn) { selectedReturn.value = item; isDetailModalOpen.value = true }
function handleEdit(item: PurchaseReturn) { selectedReturn.value = item; isEditMode.value = true; isFormModalOpen.value = true }

async function handleSaveReturn(data: PurchaseReturnFormData) {
  formBusy.value = true
  try {
    await savePurchaseReturn(data)
    isFormModalOpen.value = false
    selectedReturn.value = null
  } finally {
    formBusy.value = false
  }
}

async function handleConfirmDelete() {
  if (!deletingReturn.value) return
  deleteBusy.value = true
  try {
    await deletePurchaseReturn(deletingReturn.value.id)
    deletingReturn.value = null
  } finally {
    deleteBusy.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-purchase-return space-y-4 p-4 md:p-6">
    <SalesListHeader
      title="Purchase Return"
      subtitle="Manage your purchase returns and debit notes"
      add-label="Add Purchase Return"
      @add="handleOpenAdd"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <PurchaseReturnStatsWidgets :returns="purchaseReturns" />

    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :error="error ? (error.message || 'Failed to load purchase returns') : ''"
      @retry="refresh"
    />

    <PurchaseReturnRecordsTable
      v-if="!pending && !error"
      :returns="purchaseReturns"
      :search-query="searchQuery"
      :filter-status="filterStatus"
      @update:search-query="searchQuery = $event"
      @update:filter-status="filterStatus = $event"
      @view="handleView"
      @edit="handleEdit"
      @delete="deletingReturn = $event"
    />

    <PurchaseReturnDetailModal :open="isDetailModalOpen" :purchase-return="selectedReturn" @close="isDetailModalOpen = false" @edit="handleEdit" />
    <PurchaseReturnFormModal :open="isFormModalOpen" :is-edit="isEditMode" :initial-data="selectedReturn" :supplier-options="supplierOptions" :busy="formBusy" @close="isFormModalOpen = false" @submit="handleSaveReturn" />
    <SalesConfirmDelete :open="!!deletingReturn" title="Hapus Return Pembelian" :message="`Apakah Anda yakin ingin menghapus data return '${deletingReturn?.reference}'?`" :busy="deleteBusy" @cancel="deletingReturn = null" @confirm="handleConfirmDelete" />
    <DocumentPrintModal v-if="isPrintModalOpen" :open="isPrintModalOpen" title="Laporan Pengembalian Pembelian" :columns="purchaseReturnPrintColumns" :items="purchaseReturns" date-field="date" @close="closePrintModal" />
  </div>
</template>
