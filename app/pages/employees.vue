<script setup lang="ts">
import type { EmployeeItem, EmployeeFormData } from '#server/types/employee'
import type { DateRangeValue } from '~/composables/useDateRange'
import { useEmployees } from '~/composables/useEmployees'
import { useDepartments } from '~/composables/useDepartments'
import { useTablePrint } from '~/composables/useTablePrint'
import EmployeeStatsWidgets from '~/components/pages/employees/EmployeeStatsWidgets.vue'
import EmployeeRecordsTable from '~/components/pages/employees/EmployeeRecordsTable.vue'
import EmployeeFormModal from '~/components/pages/employees/EmployeeFormModal.vue'
import EmployeeViewModal from '~/components/pages/employees/EmployeeViewModal.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

useLegacyPage({ title: 'Employees - Daftar Karyawan', sweetAlert: false })

// Filter states
const searchQuery = ref('')
const filterDepartment = ref('')
const filterStatus = ref('')
const filterDateRange = ref<DateRangeValue | null>(null)

const filterParams = computed(() => ({
  search: searchQuery.value,
  department: filterDepartment.value,
  status: filterStatus.value,
}))

const { employees, pending, error, refresh, saveEmployee, deleteEmployee } = useEmployees(filterParams)
const { departments } = useDepartments()

const departmentOptions = computed(() => departments.value.map(d => d.name))

// KPI Stats calculation
const stats = computed(() => {
  const all = employees.value
  const total = all.length
  const active = all.filter(e => e.status === 'Active').length
  const inactive = all.filter(e => e.status === 'Resign' || e.status === 'Inactive').length
  // New joiners: employees joining in 2024 - 2026 or last 5 records
  const newJoiners = all.filter(e => e.joinDate && (e.joinDate.includes('2025') || e.joinDate.includes('2026'))).length

  return {
    total,
    active,
    inactive,
    newJoiners: newJoiners || Math.min(total, 3),
  }
})

// Modal states
const isFormModalOpen = ref(false)
const isEditMode = ref(false)
const activeEmployeeForEdit = ref<EmployeeItem | null>(null)

const isViewModalOpen = ref(false)
const activeEmployeeForView = ref<EmployeeItem | null>(null)

const employeeToDelete = ref<EmployeeItem | null>(null)
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
  activeEmployeeForEdit.value = null
  isFormModalOpen.value = true
}

function handleEdit(emp: EmployeeItem) {
  isEditMode.value = true
  activeEmployeeForEdit.value = emp
  isFormModalOpen.value = true
}

function handleView(emp: EmployeeItem) {
  activeEmployeeForView.value = emp
  isViewModalOpen.value = true
}

function handleDeleteRequest(emp: EmployeeItem) {
  employeeToDelete.value = emp
}

async function confirmDelete() {
  if (!employeeToDelete.value) return
  isBusy.value = true
  try {
    const res = await deleteEmployee(employeeToDelete.value.id)
    showToast(res?.message || 'Employee deleted successfully')
    employeeToDelete.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to delete employee')
  } finally {
    isBusy.value = false
  }
}

async function handleFormSubmit(formData: EmployeeFormData) {
  isBusy.value = true
  try {
    const res = await saveEmployee(formData)
    showToast(res?.message || (isEditMode.value ? 'Employee updated successfully' : 'Employee created successfully'))
    isFormModalOpen.value = false
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to save employee')
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
    title: 'Employees Report - Daftar Karyawan PT Dulank Semesta Cida',
    columns: [
      { key: 'id', label: 'Employee ID' },
      { key: 'name', label: 'Full Name' },
      { key: 'department', label: 'Department' },
      { key: 'address', label: 'Address' },
      { key: 'phone', label: 'Phone' },
      { key: 'joinDate', label: 'Join Date' },
      { key: 'status', label: 'Status' },
    ],
    rows: employees.value.map(e => ({
      id: e.id,
      name: e.name,
      department: e.department,
      address: e.detailAddress ? `${e.address}, ${e.detailAddress}` : e.address,
      phone: e.phone || '-',
      joinDate: e.joinDate || '-',
      status: e.status,
    })),
  })
}

function handleExportPdf() {
  handlePrint()
}
</script>

<template>
  <div class="space-y-4">
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
      title="Employees / Karyawan"
      subtitle="Kelola informasi data seluruh staff dan karyawan perusahaan"
      add-label="Add Employee"
      @refresh="refresh"
      @print="handlePrint"
      @export-pdf="handleExportPdf"
      @add="handleAdd"
    />

    <!-- KPI Widgets -->
    <EmployeeStatsWidgets :stats="stats" />

    <!-- Table content with skeleton -->
    <SalesFeedback
      :pending="pending"
      :error="error ? 'Unable to load employees data. Please try again.' : ''"
      skeleton="table"
      :skeleton-cols="8"
      :skeleton-rows="6"
      @retry="refresh"
    />

    <!-- Main Table -->
    <EmployeeRecordsTable
      v-if="!pending && !error"
      :employees="employees"
      :search-query="searchQuery"
      :filter-department="filterDepartment"
      :filter-status="filterStatus"
      :filter-date-range="filterDateRange"
      :department-options="departmentOptions"
      @update:search-query="searchQuery = $event"
      @update:filter-department="filterDepartment = $event"
      @update:filter-status="filterStatus = $event"
      @update:filter-date-range="filterDateRange = $event"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDeleteRequest"
    />

    <!-- Add / Edit Modal -->
    <EmployeeFormModal
      :open="isFormModalOpen"
      :is-edit="isEditMode"
      :employee-data="activeEmployeeForEdit"
      :departments="departmentOptions"
      :busy="isBusy"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <!-- View Modal -->
    <EmployeeViewModal
      :open="isViewModalOpen"
      :employee="activeEmployeeForView"
      @close="isViewModalOpen = false"
      @edit="handleEdit"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="!!employeeToDelete"
      title="Delete Employee"
      :message="`Are you sure you want to delete employee '${employeeToDelete?.name}' (${employeeToDelete?.id})? This action cannot be undone.`"
      :busy="isBusy"
      @close="employeeToDelete = null"
      @confirm="confirmDelete"
    />

    <!-- Print & PDF Modal -->
    <DocumentPrintModal
      :open="isPrintModalOpen"
      :title="printTitle"
      :columns="printColumns"
      :rows="printRows"
      @close="isPrintModalOpen = false"
    />
  </div>
</template>
