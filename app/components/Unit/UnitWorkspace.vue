<script setup lang="ts">
import type { Unit, UnitFormData } from '~/types/unit'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import PagesUnitModal from '~/components/Unit/UnitModal.vue'
import PagesUnitTable from '~/components/Unit/UnitTable.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Units - Satuan Produk',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

const { units, pending, refresh, saveUnit, deleteUnit } = useUnits()

const searchQuery = ref('')
const selectedStatus = ref('')

const isModalOpen = ref(false)
const isEdit = ref(false)
const editData = ref<Unit | null>(null)
const toastMessage = ref('')

const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const filteredUnits = computed(() => {
  return units.value.filter((u) => {
    const matchesSearch =
      !searchQuery.value ||
      u.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      u.shortName?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !selectedStatus.value || u.status === selectedStatus.value
    return matchesSearch && matchesStatus
  })
})

const print = useTablePrint()
const printColumns = [
  { key: 'name', label: 'Unit Name' },
  { key: 'shortName', label: 'Short Name' },
  { key: 'itemUsed', label: 'Item Used', align: 'right' as const },
  { key: 'createdOn', label: 'Created On' },
  { key: 'status', label: 'Status' }
]

const openAddModal = () => {
  isEdit.value = false
  editData.value = null
  isModalOpen.value = true
}

import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'

const isDeleteConfirmOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)

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
    showToast(err?.message || 'Failed to delete unit')
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
    title: 'Product Unit',
    subtitle: 'Daftar satuan produk dan layanan',
    columns: printColumns,
    rows: filteredUnits.value,
    action: 'print'
  })
}

const exportPdf = () => {
  print.openPrintModal({
    title: 'Product Unit',
    subtitle: 'Daftar satuan produk dan layanan',
    columns: printColumns,
    rows: filteredUnits.value,
    action: 'pdf'
  })
}
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader title="Units / Satuan" subtitle="Kelola daftar satuan ukuran produk (pcs, rim, meter, box, dll)" add-label="Add New Unit" :refreshing="pending" @add="openAddModal" @refresh="refresh()" @print="printTable" @pdf="exportPdf" />
    <SalesFeedback :pending="pending" :message="toastMessage" skeleton="table" :skeleton-cols="6" @dismiss="toastMessage = ''" />

    <!-- Table Component -->
    <PagesUnitTable
      v-if="!pending"
      :units="filteredUnits"
      :search-query="searchQuery"
      :filter-status="selectedStatus"
      @update:search-query="searchQuery = $event"
      @update:filter-status="selectedStatus = $event"
      @add-unit="openAddModal"
      @edit-unit="handleEdit"
      @delete-unit="handleDelete"
      @export-pdf="exportPdf"
      @print-table="printTable"
      @refresh="refresh"
    />

    <!-- Modal Component -->
    <PagesUnitModal
      :is-open="isModalOpen"
      :is-edit="isEdit"
      :edit-data="editData"
      @close="isModalOpen = false"
      @submit="handleSubmit"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteConfirmOpen"
      title="Hapus Satuan Unit"
      message="Apakah Anda yakin ingin menghapus data satuan unit ini? Tindakan ini tidak dapat dibatalkan."
      :busy="isDeleting"
      @cancel="isDeleteConfirmOpen = false"
      @confirm="confirmDelete"
    />

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
