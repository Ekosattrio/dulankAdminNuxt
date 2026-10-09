<script setup lang="ts">
import type { Variant, VariantFormData } from '#server/types/variant'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import VariantTable from '~/components/variant/VariantTable.vue'
import VariantModal from '~/components/variant/VariantModal.vue'
import { useTablePrint } from '~/composables/useTablePrint'

const { variants, pending, refresh, saveVariant, deleteVariant } = useVariants()

const searchQuery = ref('')
const filterStatus = ref('')

const isModalOpen = ref(false)
const isEdit = ref(false)
const editData = ref<Variant | null>(null)
const toastMessage = ref('')
const actionError = ref('')

const isDeleteConfirmOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)

const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const print = useTablePrint()
const printColumns = [
  { key: 'name', label: 'Variant' },
  { key: 'values', label: 'Values' },
  { key: 'itemUsed', label: 'Item Used' },
  { key: 'createdOn', label: 'Created On' },
  { key: 'status', label: 'Status' },
]

const openAddModal = () => {
  isEdit.value = false
  editData.value = null
  isModalOpen.value = true
}

const handleEdit = (v: Variant) => {
  isEdit.value = true
  editData.value = v
  isModalOpen.value = true
}

const handleDelete = (id: string) => {
  deleteTargetId.value = id
  isDeleteConfirmOpen.value = true
}

const confirmDelete = async () => {
  if (!deleteTargetId.value) return
  isDeleting.value = true
  try {
    await deleteVariant(deleteTargetId.value)
    showToast('Variant deleted successfully')
    isDeleteConfirmOpen.value = false
    deleteTargetId.value = null
  } catch (err: any) {
    console.error('Failed to delete variant:', err)
    actionError.value = err?.message || 'Failed to delete variant'
  } finally {
    isDeleting.value = false
  }
}

const handleSubmit = async (formData: VariantFormData) => {
  try {
    const res = await saveVariant(formData)
    showToast(res?.message || 'Variant saved successfully')
    isModalOpen.value = false
  } catch (err: any) {
    console.error('Failed to save variant:', err)
    showToast(err?.message || 'Failed to save variant')
  }
}

const printTable = () => {
  print.openPrintModal({
    title: 'Product Variants',
    subtitle: 'Daftar varian dan atribut produk percetakan',
    columns: printColumns,
    rows: variants.value,
    action: 'print',
  })
}

const exportPdf = () => {
  print.openPrintModal({
    title: 'Product Variants',
    subtitle: 'Daftar varian dan atribut produk percetakan',
    columns: printColumns,
    rows: variants.value,
    action: 'pdf',
  })
}
</script>

<template>
  <div class="space-y-4">
    <!-- Standard Header -->
    <SalesListHeader
      title="Variants"
      subtitle="Kelola varian dan atribut produk percetakan"
      add-label="Add Variant"
      :refreshing="pending"
      @add="openAddModal"
      @refresh="refresh"
      @print="printTable"
      @pdf="exportPdf"
    />

    <!-- Feedback / Skeleton -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="6"
      :skeleton-rows="6"
      :message="toastMessage"
      :error="actionError"
      @dismiss="toastMessage = ''; actionError = ''"
    />

    <!-- Data Table -->
    <VariantTable
      v-if="!pending"
      :variants="variants"
      :search-query="searchQuery"
      :filter-status="filterStatus"
      @update:search-query="searchQuery = $event"
      @update:filter-status="filterStatus = $event"
      @edit-variant="handleEdit"
      @delete-variant="handleDelete"
    />

    <!-- Add/Edit Modal -->
    <VariantModal
      :is-open="isModalOpen"
      :is-edit="isEdit"
      :edit-data="editData"
      @close="isModalOpen = false"
      @submit="handleSubmit"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteConfirmOpen"
      title="Delete Variant"
      message="Are you sure you want to delete this variant? This action cannot be undone."
      :busy="isDeleting"
      @close="isDeleteConfirmOpen = false"
      @confirm="confirmDelete"
    />

    <!-- Document Print/PDF Modal -->
    <DocumentPrintModal
      :open="print.isPrintModalOpen.value"
      :title="print.printTitle.value"
      :subtitle="print.printSubtitle.value"
      :columns="print.printColumns.value"
      :rows="print.printRows.value"
      :default-action="print.defaultPrintAction.value"
      :show-date-range="false"
      @close="print.closePrintModal"
    />
  </div>
</template>
