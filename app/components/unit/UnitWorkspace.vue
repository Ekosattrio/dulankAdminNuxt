<script setup lang="ts">
import type { Unit, UnitFormData } from '#server/types/unit'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import UnitTable from '~/components/unit/UnitTable.vue'
import UnitModal from '~/components/unit/UnitModal.vue'
import { useTablePrint } from '~/composables/useTablePrint'

const { units, pending, refresh, saveUnit, deleteUnit } = useUnits()

const searchQuery = ref('')
const selectedStatus = ref('')

const isModalOpen = ref(false)
const isEdit = ref(false)
const editData = ref<Unit | null>(null)
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
  { key: 'name', label: 'Unit' },
  { key: 'shortName', label: 'Short Name' },
  { key: 'itemUsed', label: 'Item Used' },
  { key: 'createdOn', label: 'Created On' },
  { key: 'status', label: 'Status' },
]

const openAddModal = () => {
  isEdit.value = false
  editData.value = null
  isModalOpen.value = true
}

const handleEdit = (u: Unit) => {
  isEdit.value = true
  editData.value = u
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
    await deleteUnit(deleteTargetId.value)
    showToast('Unit deleted successfully')
    isDeleteConfirmOpen.value = false
    deleteTargetId.value = null
  } catch (err: any) {
    console.error('Failed to delete unit:', err)
    actionError.value = err?.message || 'Failed to delete unit'
  } finally {
    isDeleting.value = false
  }
}

const handleSubmit = async (formData: UnitFormData) => {
  try {
    const res = await saveUnit(formData)
    showToast(res?.message || 'Unit saved successfully')
    isModalOpen.value = false
  } catch (err: any) {
    console.error('Failed to save unit:', err)
    showToast(err?.message || 'Failed to save unit')
  }
}

const printTable = () => {
  print.openPrintModal({
    title: 'Product Units',
    subtitle: 'Daftar satuan unit produk percetakan',
    columns: printColumns,
    rows: units.value,
    action: 'print',
  })
}

const exportPdf = () => {
  print.openPrintModal({
    title: 'Product Units',
    subtitle: 'Daftar satuan unit produk percetakan',
    columns: printColumns,
    rows: units.value,
    action: 'pdf',
  })
}
</script>

<template>
  <div class="space-y-4">
    <!-- Standard Header -->
    <SalesListHeader
      title="Units"
      subtitle="Kelola dan atur satuan unit produk percetakan"
      add-label="Add Unit"
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
    <UnitTable
      v-if="!pending"
      :units="units"
      :search-query="searchQuery"
      :filter-status="selectedStatus"
      @update:search-query="searchQuery = $event"
      @update:filter-status="selectedStatus = $event"
      @edit-unit="handleEdit"
      @delete-unit="handleDelete"
    />

    <!-- Add/Edit Modal -->
    <UnitModal
      :is-open="isModalOpen"
      :is-edit="isEdit"
      :edit-data="editData"
      @close="isModalOpen = false"
      @submit="handleSubmit"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteConfirmOpen"
      title="Delete Unit"
      message="Are you sure you want to delete this unit? This action cannot be undone."
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
