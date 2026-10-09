<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Supplier, SupplierFormData } from '#server/types/supplier'
import { useSuppliers } from '~/composables/useSuppliers'
import { useTablePrint } from '~/composables/useTablePrint'
import SupplierRecordsTable from '~/components/pages/supplier/SupplierRecordsTable.vue'
import SupplierFormModal from '~/components/pages/supplier/SupplierFormModal.vue'
import SupplierAddAddressModal from '~/components/pages/supplier/SupplierAddAddressModal.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

// Filter states
const searchQuery = ref('')
const filterStatus = ref('')

const { suppliers, pending, error, refresh, saveSupplier, deleteSupplier } = useSuppliers()

const filteredSuppliers = computed(() => {
  return suppliers.value.filter((item) => {
    if (filterStatus.value && filterStatus.value !== 'All' && filterStatus.value !== '') {
      if (item.status?.toLowerCase() !== filterStatus.value.toLowerCase()) return false
    }
    return true
  })
})

// Modal states
const isFormModalOpen = ref(false)
const isEditMode = ref(false)
const activeSupplierForEdit = ref<Supplier | null>(null)

const isAddAddressModalOpen = ref(false)
const activeSupplierForAddress = ref<Supplier | null>(null)

const supplierToDelete = ref<Supplier | null>(null)
const isBusy = ref(false)

// Toast notification
const toastMessage = ref('')
let toastTimer: any = null

function showToast(msg: string) {
  toastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

// Handlers
function handleAdd() {
  isEditMode.value = false
  activeSupplierForEdit.value = null
  isFormModalOpen.value = true
}

function handleEdit(supplier: Supplier) {
  isEditMode.value = true
  activeSupplierForEdit.value = supplier
  isFormModalOpen.value = true
}

function handleAddAddress(supplier: Supplier) {
  activeSupplierForAddress.value = supplier
  isAddAddressModalOpen.value = true
}

function handleDeleteRequest(supplier: Supplier) {
  supplierToDelete.value = supplier
}

async function confirmDelete() {
  if (!supplierToDelete.value) return
  isBusy.value = true
  try {
    const res = await deleteSupplier(supplierToDelete.value.id)
    showToast(res?.message || 'Supplier deleted successfully')
    supplierToDelete.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to delete supplier')
  } finally {
    isBusy.value = false
  }
}

async function handleFormSubmit(formData: SupplierFormData) {
  isBusy.value = true
  try {
    const res = await saveSupplier(formData)
    showToast(res?.message || (isEditMode.value ? 'Supplier updated successfully' : 'Supplier created successfully'))
    isFormModalOpen.value = false
    activeSupplierForEdit.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to save supplier')
  } finally {
    isBusy.value = false
  }
}

// Print & PDF
const {
  isPrintModalOpen,
  printTitle,
  printColumns,
  printRows,
  openPrintModal,
} = useTablePrint()

function handlePrint() {
  openPrintModal({
    title: 'Suppliers Report - Pemasok Kertas & Bahan',
    columns: [
      { key: 'supplierId', label: 'ID Supplier' },
      { key: 'name', label: 'Supplier Name' },
      { key: 'email', label: 'Email' },
      { key: 'contact', label: 'Contact' },
      { key: 'picName', label: 'PIC Name' },
      { key: 'status', label: 'Status' },
      { key: 'date', label: 'Date Added' },
    ],
    rows: filteredSuppliers.value.map(s => ({
      supplierId: s.supplierId || s.id,
      name: s.name,
      email: s.email,
      contact: s.contact || '-',
      picName: s.picName || '-',
      status: s.status,
      date: s.date || '-',
    })),
  })
}

function handleExportPdf() {
  handlePrint()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Toast notification -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0"
    >
      <div
        v-if="toastMessage"
        class="fixed right-6 top-20 z-50 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-xl"
        role="alert"
      >
        <FeatherIcon name="check-circle" size="18" />
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>

    <!-- Header bar -->
    <SalesListHeader
      title="Suppliers / Pemasok"
      subtitle="Kelola database distributor bahan kertas, tinta, dan pelat cetak"
      add-label="Add Supplier"
      :refreshing="pending"
      @refresh="refresh()"
      @print="handlePrint"
      @pdf="handleExportPdf"
      @add="handleAdd"
    />

    <!-- Table content with skeleton -->
    <SalesFeedback
      :pending="pending"
      :error="error ? 'Unable to load suppliers data. Please try again.' : ''"
      skeleton="table"
      :skeleton-cols="8"
      :skeleton-rows="6"
      @retry="refresh()"
    />

    <SupplierRecordsTable
      v-if="!pending && !error"
      :suppliers="filteredSuppliers"
      :search-query="searchQuery"
      :filter-status="filterStatus"
      @update:search-query="searchQuery = $event"
      @update:filter-status="filterStatus = $event"
      @add-address="handleAddAddress"
      @edit="handleEdit"
      @delete="handleDeleteRequest"
    />

    <!-- Modals -->
    <SupplierFormModal
      :open="isFormModalOpen"
      :is-edit="isEditMode"
      :supplier-data="activeSupplierForEdit"
      :busy="isBusy"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <SupplierAddAddressModal
      :open="isAddAddressModalOpen"
      :supplier="activeSupplierForAddress"
      @close="isAddAddressModalOpen = false"
      @success="showToast"
    />

    <SalesConfirmDelete
      :open="!!supplierToDelete"
      title="Delete Supplier"
      :message="`Are you sure you want to delete supplier '${supplierToDelete?.name}'? This action cannot be undone.`"
      :busy="isBusy"
      @close="supplierToDelete = null"
      @confirm="confirmDelete"
    />

    <DocumentPrintModal
      :open="isPrintModalOpen"
      :title="printTitle"
      :columns="printColumns"
      :rows="printRows"
      @close="isPrintModalOpen = false"
    />
  </div>
</template>

