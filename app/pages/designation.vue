<script setup lang="ts">
import type { Designation, DesignationFormData } from '~/types/designation'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Designation - Jabatan Karyawan',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

const { designations, pending, refresh, saveDesignation, deleteDesignation } = useDesignations()

const searchQuery = ref('')
const selectedStatus = ref('')

const isModalOpen = ref(false)
const editData = ref<Designation | null>(null)

const filteredDesignations = computed(() => {
  return designations.value.filter((d) => {
    const matchQuery =
      !searchQuery.value ||
      d.name?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = !selectedStatus.value || d.status === selectedStatus.value
    return matchQuery && matchStatus
  })
})

const openAddModal = () => {
  editData.value = null
  isModalOpen.value = true
}

const handleEdit = (d: Designation) => {
  editData.value = d
  isModalOpen.value = true
}

const handleDelete = async (id: string) => {
  if (confirm('Apakah Anda yakin ingin menghapus jabatan ini?')) {
    try {
      await deleteDesignation(id)
    } catch (error) {
      console.error('Failed to delete designation:', error)
    }
  }
}

const handleSave = async (payload: DesignationFormData) => {
  try {
    await saveDesignation(payload)
    isModalOpen.value = false
  } catch (error) {
    console.error('Failed to save designation:', error)
  }
}
</script>

<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div class="page-title">
          <h4 class="fw-bold mb-1">Designation / Jabatan</h4>
          <h6 class="text-muted mb-0">Kelola daftar posisi, jabatan, dan tanggung jawab kerja</h6>
        </div>
        <div class="d-flex align-items-center gap-2">
          <ul class="table-top-head d-flex align-items-center list-unstyled gap-2 mb-0">
            <li>
              <button type="button" class="btn btn-outline-secondary btn-sm" title="Refresh" @click="refresh">
                <FeatherIcon name="rotate-cw" size="16" />
              </button>
            </li>
          </ul>
          <button type="button" class="btn btn-primary d-flex align-items-center gap-2" @click="openAddModal">
            <FeatherIcon name="plus-circle" size="18" />
            <span>Add Designation</span>
          </button>
        </div>
      </div>

      <div class="card border-0 shadow-sm rounded-3">
        <div class="card-body p-4">
          <div class="row g-3 justify-content-between align-items-center mb-4">
            <div class="col-md-4">
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0">
                  <FeatherIcon name="search" size="14" />
                </span>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="form-control border-start-0 ps-0"
                  placeholder="Cari nama jabatan..."
                />
              </div>
            </div>
            <div class="col-md-4 d-flex justify-content-md-end gap-2">
              <select v-model="selectedStatus" class="form-select form-select-sm" style="width: auto">
                <option value="">Semua Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div v-if="pending" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <PagesDesignationTable
            v-else
            :designations="filteredDesignations"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>
      </div>
    </div>

    <PagesDesignationModal
      :is-open="isModalOpen"
      :edit-data="editData"
      @close="isModalOpen = false"
      @save="handleSave"
    />
  </div>
</template>
