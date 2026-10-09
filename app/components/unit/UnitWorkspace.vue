<script setup lang="ts">
import type { Unit, UnitFormData } from '~/types/unit'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import PagesUnitModal from '~/components/unit/UnitModal.vue'
import PagesUnitTable from '~/components/unit/UnitTable.vue'

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

import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'

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
  <div class="page-wrapper mt-3">
    <div class="content container-fluid">
      <!-- Toast Alert -->
      <div
        v-if="toastMessage"
        class="alert alert-success position-fixed top-0 end-0 m-4 shadow-lg z-3 d-flex align-items-center gap-2"
        role="alert"
      >
        <FeatherIcon name="check-circle" size="18" />
        <div>{{ toastMessage }}</div>
      </div>

      <!-- Page Header -->
      <div class="page-header d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div class="page-title">
          <h4 class="fw-bold mb-1">Units / Satuan</h4>
          <h6 class="text-muted mb-0">Kelola daftar satuan ukuran produk (pcs, rim, meter, box, dll)</h6>
        </div>
        <div class="d-flex align-items-center gap-2">
          <ul class="table-top-head d-flex align-items-center list-unstyled gap-2 mb-0">
            <li>
              <button type="button" class="btn btn-outline-secondary btn-sm" title="Print" @click="printTable">
                <FeatherIcon name="printer" size="16" />
              </button>
            </li>
            <li>
              <button type="button" class="btn btn-outline-secondary btn-sm" title="Refresh" @click="refresh">
                <FeatherIcon name="rotate-cw" size="16" />
              </button>
            </li>
          </ul>
          <button type="button" class="btn btn-primary d-flex align-items-center gap-2" @click="openAddModal">
            <FeatherIcon name="plus-circle" size="18" />
            <span>Add New Unit</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Table Component -->
      <PagesUnitTable
        v-else
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
    </div>

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
