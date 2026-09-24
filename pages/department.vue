<script setup lang="ts">
import type { Department, DepartmentFormData } from '~/types/department'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Departments - Departemen Karyawan',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

const { departments, pending, refresh, saveDepartment, deleteDepartment } = useDepartments()

const searchQuery = ref('')
const selectedStatus = ref('')

const isModalOpen = ref(false)
const editData = ref<Department | null>(null)

const filteredDepartments = computed(() => {
  return departments.value.filter((d) => {
    const matchQuery =
      !searchQuery.value ||
      d.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      d.members?.some((m) => m.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchStatus = !selectedStatus.value || d.status === selectedStatus.value
    return matchQuery && matchStatus
  })
})

const openAddModal = () => {
  editData.value = null
  isModalOpen.value = true
}

const handleEdit = (d: Department) => {
  editData.value = d
  isModalOpen.value = true
}

const handleDelete = async (id: string) => {
  if (confirm('Apakah Anda yakin ingin menghapus departemen ini?')) {
    try {
      await deleteDepartment(id)
    } catch (error) {
      console.error('Failed to delete department:', error)
    }
  }
}

const handleSave = async (payload: DepartmentFormData) => {
  try {
    await saveDepartment(payload)
    isModalOpen.value = false
  } catch (error) {
    console.error('Failed to save department:', error)
  }
}
</script>

<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div class="page-title">
          <h4 class="fw-bold mb-1">Departments</h4>
          <h6 class="text-muted mb-0">Kelola divisi dan departemen kerja karyawan</h6>
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
            <span>Add Department</span>
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
                  placeholder="Cari departemen atau anggota..."
                />
              </div>
            </div>
            <div class="col-md-4 d-flex justify-content-md-end gap-2">
              <select v-model="selectedStatus" class="form-select form-select-sm" style="width: auto">
                <option value="">Semua Status</option>
                <option value="Active">Active</option>
                <option value="Disable">Disable</option>
              </select>
            </div>
          </div>

          <div v-if="pending" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <PagesDepartmentTable
            v-else
            :departments="filteredDepartments"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>
      </div>
    </div>

    <PagesDepartmentModal
      :is-open="isModalOpen"
      :edit-data="editData"
      @close="isModalOpen = false"
      @save="handleSave"
    />
  </div>
</template>
