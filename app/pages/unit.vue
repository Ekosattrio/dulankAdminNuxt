<script setup lang="ts">
import type { Unit, UnitFormData } from '~/types/unit'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

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

const handleDelete = async (id: string) => {
  if (confirm('Apakah Anda yakin ingin menghapus data satuan unit ini?')) {
    try {
      await deleteUnit(id)
      showToast('Unit deleted successfully')
    } catch (err) {
      console.error('Failed to delete unit:', err)
      alert('Failed to delete unit')
    }
  }
}

const handleSubmit = async (formData: UnitFormData) => {
  try {
    const res = await saveUnit(formData)
    showToast(res?.message || 'Unit saved successfully')
    isModalOpen.value = false
  } catch (err) {
    console.error('Failed to save unit:', err)
    alert('Failed to save unit')
  }
}

const printTable = () => {
  window.print()
}

const exportPdf = () => {
  showToast('Exporting Units to PDF...')
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
  </div>
</template>
