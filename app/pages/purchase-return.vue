<script setup lang="ts">
import type { PurchaseReturn, PurchaseReturnFormData } from '#server/types/purchase-return'
import { usePurchaseReturns } from '~/composables/usePurchaseReturns'
import { useSuppliers } from '~/composables/useSuppliers'
import { useTablePrint } from '~/composables/useTablePrint'
import { formatNumber } from '~/composables/useFormatters'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import PurchaseReturnStatsWidgets from '~/components/pages/purchase-return/PurchaseReturnStatsWidgets.vue'
import PurchaseReturnRecordsTable from '~/components/pages/purchase-return/PurchaseReturnRecordsTable.vue'
import PurchaseReturnDetailModal from '~/components/pages/purchase-return/PurchaseReturnDetailModal.vue'
import PurchaseReturnFormModal from '~/components/pages/purchase-return/PurchaseReturnFormModal.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Purchase Return List - Pengembalian Pembelian',
  sweetAlert: false
})

// Filter states
const searchQuery = ref('')
const filterStatus = ref('')

const filterParams = computed(() => ({
  search: searchQuery.value,
  status: filterStatus.value,
}))

const { purchaseReturns, pending, error, refresh, savePurchaseReturn, deletePurchaseReturn } = usePurchaseReturns(filterParams)
const { suppliers } = useSuppliers()

const supplierOptions = computed(() => {
  if (suppliers.value && suppliers.value.length > 0) {
    return suppliers.value.map(s => s.name)
  }
  return ['PT Kertas Jaya', 'CV Kimia Prima', 'Global Inkindo', 'PT Sinar Grafika', 'Indo Material', 'UD Sukses Makmur']
})

// KPI stats calculation
const stats = computed(() => {
  const all = purchaseReturns.value
  const totalReturns = all.length
  const totalAmount = all.reduce((sum, p) => sum + (Number(p.amount) || 0), 0)
  const totalPaid = all.reduce((sum, p) => sum + (Number(p.paid) || 0), 0)
  const totalDue = all.reduce((sum, p) => sum + (Number(p.due) || 0), 0)

  return {
    totalReturns,
    totalAmount,
    totalPaid,
    totalDue,
  }
})

// Modal states
const isFormModalOpen = ref(false)
const isDetailModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const isEditMode = ref(false)
const selectedReturn = ref<PurchaseReturn | null>(null)
const deletingReturn = ref<PurchaseReturn | null>(null)
const formBusy = ref(false)
const deleteBusy = ref(false)

// Print/PDF Setup
const { isPrintModalOpen, openPrintModal, closePrintModal } = useTablePrint()

const printColumns = [
  { key: 'noPR', label: 'No PR' },
  { key: 'date', label: 'Date' },
  { key: 'created', label: 'Created' },
  { key: 'noPurchase', label: 'No Purchase' },
  { key: 'supplier', label: 'Supplier' },
  { key: 'amount', label: 'Amount (IDR)', align: 'right' as const, format: (val: number) => `Rp ${formatNumber(val)}` },
  { key: 'paid', label: 'Paid (IDR)', align: 'right' as const, format: (val: number) => `Rp ${formatNumber(val)}` },
  { key: 'due', label: 'Due (IDR)', align: 'right' as const, format: (val: number) => `Rp ${formatNumber(val)}` },
  { key: 'status', label: 'Status', align: 'center' as const },
  { key: 'statusBy', label: 'Status By' },
]

function handleOpenAdd() {
  selectedReturn.value = null
  isEditMode.value = false
  isFormModalOpen.value = true
}

function handleView(item: PurchaseReturn) {
  selectedReturn.value = item
  isDetailModalOpen.value = true
}

function handleEdit(item: PurchaseReturn) {
  selectedReturn.value = item
  isEditMode.value = true
  isFormModalOpen.value = true
}

function handleDeleteConfirm(item: PurchaseReturn) {
  deletingReturn.value = item
  isDeleteModalOpen.value = true
}

async function handleSaveReturn(form: PurchaseReturnFormData) {
  formBusy.value = true
  try {
    await savePurchaseReturn(form)
    isFormModalOpen.value = false
  } catch (err: any) {
    alert(err?.message || 'Gagal menyimpan purchase return')
  } finally {
    formBusy.value = false
  }
}

async function handleDeleteExecute() {
  if (!deletingReturn.value) return
  deleteBusy.value = true
  try {
    await deletePurchaseReturn(deletingReturn.value.id)
    isDeleteModalOpen.value = false
    deletingReturn.value = null
  } catch (err: any) {
    alert(err?.message || 'Gagal menghapus purchase return')
  } finally {
    deleteBusy.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-purchase-return space-y-6">
    <!-- Header with Breadcrumb and Action Buttons -->
    <SalesListHeader
      title="Purchase Return List"
      subtitle="Kelola Pengembalian Barang & Refund Pembelian"
      add-label="Add Purchase Return"
      @add="handleOpenAdd"
      @refresh="refresh"
      @print="openPrintModal"
      @pdf="openPrintModal"
    />

    <!-- KPI Widgets -->
    <PurchaseReturnStatsWidgets :stats="stats" />

    <!-- Error State -->
    <div
      v-if="error"
      class="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400"
    >
      <div class="flex items-center gap-2">
        <i data-feather="alert-circle" class="h-4 w-4"></i>
        <span>Gagal memuat data retur pembelian: {{ error.message }}</span>
      </div>
    </div>

    <!-- Data Table & Feedback -->
    <SalesFeedback :pending="pending" skeleton="table" :skeleton-cols="11">
      <PurchaseReturnRecordsTable
        :returns="purchaseReturns"
        :search-query="searchQuery"
        :filter-status="filterStatus"
        @update:search-query="searchQuery = $event"
        @update:filter-status="filterStatus = $event"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDeleteConfirm"
      />
    </SalesFeedback>

    <!-- Modals -->
    <PurchaseReturnFormModal
      :open="isFormModalOpen"
      :is-edit="isEditMode"
      :return-data="selectedReturn"
      :supplier-options="supplierOptions"
      :busy="formBusy"
      @close="isFormModalOpen = false"
      @submit="handleSaveReturn"
    />

    <PurchaseReturnDetailModal
      :open="isDetailModalOpen"
      :return-data="selectedReturn"
      @close="isDetailModalOpen = false"
      @edit="handleEdit"
    />

    <SalesConfirmDelete
      :open="isDeleteModalOpen"
      title="Hapus Purchase Return"
      :message="`Apakah Anda yakin ingin menghapus Retur '${deletingReturn?.noPR}' (${deletingReturn?.supplier})?`"
      :busy="deleteBusy"
      @close="isDeleteModalOpen = false"
      @confirm="handleDeleteExecute"
    />

    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Laporan Purchase Return"
      subtitle="Daftar Pengembalian Barang Pembelian (Retur)"
      :columns="printColumns"
      :items="purchaseReturns"
      @close="closePrintModal"
    />
  </div>
</template>
