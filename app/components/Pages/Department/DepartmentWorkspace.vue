<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Department, DepartmentFormData } from '#server/types/department'
import { useDepartments } from '~/composables/useDepartments'
import { useEmployees } from '~/composables/useEmployees'
import { useTablePrint } from '~/composables/useTablePrint'
import DepartmentStatsWidgets from '~/components/Pages/Department/DepartmentStatsWidgets.vue'
import DepartmentRecordsTable from '~/components/Pages/Department/DepartmentRecordsTable.vue'
import DepartmentFormModal from '~/components/Pages/Department/DepartmentFormModal.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'

// Filter states
const searchQuery = ref('')
const filterStatus = ref('')

const { departments, pending, error, refresh, saveDepartment, deleteDepartment } = useDepartments()
const { employees } = useEmployees()

// Available employee names for quick pick
const availableMembers = computed(() => {
  return employees.value.map(e => e.name)
})

// Client-side filtering for 0ms smooth search without skeleton flicker
const filteredDepartments = computed(() => {
  return departments.value.filter((d) => {
    if (filterStatus.value && d.status.toLowerCase() !== filterStatus.value.toLowerCase()) {
      return false
    }
    return true
  })
})

// KPI Stats calculation
const stats = computed(() => {
  const all = departments.value
  const totalDepartments = all.length
  const totalEmployees = all.reduce((sum, d) => sum + (d.totalMembers ?? (d.members?.length || 0)), 0)
  const activeDepartments = all.filter(d => d.status === 'Active').length
  const inactiveDepartments = all.filter(d => d.status === 'Disable').length

  return {
    totalDepartments,
    totalEmployees,
    activeDepartments,
    inactiveDepartments,
  }
})

// Modal states
const isFormModalOpen = ref(false)
const isEditMode = ref(false)
const activeDepartmentForEdit = ref<Department | null>(null)
const departmentToDelete = ref<Department | null>(null)
const isBusy = ref(false)

// Toast feedback
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
  activeDepartmentForEdit.value = null
  isFormModalOpen.value = true
}

function handleEdit(dept: Department) {
  isEditMode.value = true
  activeDepartmentForEdit.value = dept
  isFormModalOpen.value = true
}

function handleDeleteRequest(dept: Department) {
  departmentToDelete.value = dept
}

async function confirmDelete() {
  if (!departmentToDelete.value) return
  isBusy.value = true
  try {
    const res = await deleteDepartment(departmentToDelete.value.id)
    showToast(res?.message || 'Department deleted successfully')
    departmentToDelete.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to delete department')
  } finally {
    isBusy.value = false
  }
}

async function handleFormSubmit(formData: DepartmentFormData) {
  isBusy.value = true
  try {
    const res = await saveDepartment(formData)
    showToast(res?.message || (isEditMode.value ? 'Department updated successfully' : 'Department created successfully'))
    isFormModalOpen.value = false
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to save department')
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
    title: 'Department List Report - PT Dulank Semesta Cida',
    columns: [
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Department Name' },
      { key: 'members', label: 'Members' },
      { key: 'totalMembers', label: 'Total Members' },
      { key: 'createdDate', label: 'Created Date' },
      { key: 'status', label: 'Status' },
    ],
    rows: filteredDepartments.value.map(d => ({
      id: d.id,
      name: d.name,
      members: d.members && d.members.length > 0 ? d.members.join(', ') : '-',
      totalMembers: d.totalMembers ?? (d.members?.length || 0),
      createdDate: d.createdDate || '-',
      status: d.status,
    })),
  })
}

function handleExportPdf() {
  handlePrint()
}

function handleExportExcel() {
  const header = ['ID', 'Department Name', 'Members', 'Total Members', 'Created Date', 'Status']
  const rows = filteredDepartments.value.map(d => [
    `"${d.id}"`,
    `"${d.name}"`,
    `"${(d.members || []).join('; ')}"`,
    `"${d.totalMembers ?? (d.members?.length || 0)}"`,
    `"${d.createdDate || ''}"`,
    `"${d.status}"`,
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map(r => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `departments_export_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('Department list exported to CSV successfully')
}
</script>

<template>
  <div class="space-y-4 p-4 md:p-6">
    <!-- Header -->
    <SalesListHeader
      title="Department"
      subtitle="Manage employee departments and teams"
      add-label="Add Department"
      @add="handleAdd"
      @refresh="refresh"
      @print="handlePrint"
      @export-pdf="handleExportPdf"
      @export-excel="handleExportExcel"
    />

    <!-- KPI Stats Widgets -->
    <DepartmentStatsWidgets :stats="stats" />

    <!-- Toast Notification -->
    <SalesFeedback
      v-if="toastMessage"
      :message="toastMessage"
      @dismiss="toastMessage = ''"
    />

    <!-- Skeleton and Error Feedback -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="6"
      :skeleton-rows="6"
      :error="error ? (error.message || 'Failed to load departments. Please try again.') : ''"
      @retry="refresh"
    />

    <!-- Department Records Table -->
    <DepartmentRecordsTable
      v-if="!pending && !error"
      :departments="filteredDepartments"
      :search-query="searchQuery"
      :filter-status="filterStatus"
      @update:search-query="searchQuery = $event"
      @update:filter-status="filterStatus = $event"
      @edit="handleEdit"
      @delete="handleDeleteRequest"
    />

    <!-- Add / Edit Modal -->
    <DepartmentFormModal
      :open="isFormModalOpen"
      :is-edit="isEditMode"
      :department-data="activeDepartmentForEdit"
      :available-members="availableMembers"
      :busy="isBusy"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <SalesConfirmDelete
      :open="!!departmentToDelete"
      title="Delete Department"
      :message="`Are you sure you want to delete department '${departmentToDelete?.name}'? Members assigned to this department will need reassignment.`"
      :busy="isBusy"
      @close="departmentToDelete = null"
      @confirm="confirmDelete"
    />

    <!-- Table Print / PDF Preview Modal -->
    <DocumentPrintModal
      :open="isPrintModalOpen"
      :title="printTitle"
      :columns="printColumns"
      :rows="printRows"
      @close="isPrintModalOpen = false"
    />
  </div>
</template>

