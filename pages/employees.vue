<script setup lang="ts">
import type { EmployeeItem, EmployeeFormData } from '~/types/employee'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Employees - Daftar Karyawan',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

const { employees, pending, refresh, saveEmployee, deleteEmployee } = useEmployees()
const { departments } = useDepartments()

const searchQuery = ref('')
const selectedDepartment = ref('')
const selectedStatus = ref('')

const isModalOpen = ref(false)
const editData = ref<EmployeeItem | null>(null)
const isViewOnly = ref(false)

const departmentList = computed(() => departments.value.map((d) => d.name))

const filteredEmployees = computed(() => {
  return employees.value.filter((emp) => {
    const matchesSearch =
      !searchQuery.value ||
      emp.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      emp.id?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      emp.phone?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesDepartment = !selectedDepartment.value || emp.department === selectedDepartment.value
    const matchesStatus = !selectedStatus.value || emp.status === selectedStatus.value
    return matchesSearch && matchesDepartment && matchesStatus
  })
})

const openAddModal = () => {
  editData.value = null
  isViewOnly.value = false
  isModalOpen.value = true
}

const handleView = (item: EmployeeItem) => {
  editData.value = item
  isViewOnly.value = true
  isModalOpen.value = true
}

const handleEdit = (item: EmployeeItem) => {
  editData.value = item
  isViewOnly.value = false
  isModalOpen.value = true
}

const handleDelete = async (id: string) => {
  if (confirm('Apakah Anda yakin ingin menghapus data karyawan ini?')) {
    try {
      await deleteEmployee(id)
    } catch (error) {
      console.error('Failed to delete employee:', error)
    }
  }
}

const handleSave = async (formData: EmployeeFormData) => {
  try {
    await saveEmployee(formData)
    isModalOpen.value = false
  } catch (error) {
    console.error('Failed to save employee:', error)
  }
}
</script>

<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div class="page-title">
          <h4 class="fw-bold mb-1">Employees / Karyawan</h4>
          <h6 class="text-muted mb-0">Kelola informasi data seluruh staff dan karyawan perusahaan</h6>
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
            <span>Add Employee</span>
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
                  placeholder="Cari nama, ID, no telepon karyawan..."
                />
              </div>
            </div>
            <div class="col-md-6 d-flex justify-content-md-end gap-2 flex-wrap">
              <select v-model="selectedDepartment" class="form-select form-select-sm" style="width: auto">
                <option value="">Semua Departemen</option>
                <option v-for="dept in departmentList" :key="dept" :value="dept">{{ dept }}</option>
              </select>

              <select v-model="selectedStatus" class="form-select form-select-sm" style="width: auto">
                <option value="">Semua Status</option>
                <option value="Active">Active</option>
                <option value="Resign">Resign</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div v-if="pending" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <PagesEmployeeTable
            v-else
            :employees="filteredEmployees"
            @view="handleView"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>
      </div>
    </div>

    <PagesEmployeeModal
      :is-open="isModalOpen"
      :edit-data="editData"
      :view-only="isViewOnly"
      :departments="departmentList"
      @close="isModalOpen = false"
      @save="handleSave"
    />
  </div>
</template>
