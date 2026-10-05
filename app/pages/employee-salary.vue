<script setup lang="ts">
import type { EmployeeSalaryItem, EmployeeSalaryFormData } from '#server/types/employeeSalary'
import { useEmployeeSalaries } from '~/composables/useEmployeeSalaries'
import { useEmployees } from '~/composables/useEmployees'
import { useTablePrint } from '~/composables/useTablePrint'
import { formatIDR } from '~/utils/currency'
import EmployeeSalaryStatsWidgets from '~/components/pages/employee-salary/EmployeeSalaryStatsWidgets.vue'
import EmployeeSalaryRecordsTable from '~/components/pages/employee-salary/EmployeeSalaryRecordsTable.vue'
import EmployeeSalaryFormModal from '~/components/pages/employee-salary/EmployeeSalaryFormModal.vue'
import EmployeeSalaryViewModal from '~/components/pages/employee-salary/EmployeeSalaryViewModal.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'

useLegacyPage({ title: 'Employee Salary - Penggajian Karyawan', sweetAlert: false })

// Filter states
const searchQuery = ref('')
const filterSystem = ref('')
const filterStatus = ref('')

const filterParams = computed(() => ({
  search: searchQuery.value,
  system: filterSystem.value,
  status: filterStatus.value,
}))

const { salaries, pending, error, refresh, saveSalary, deleteSalary } = useEmployeeSalaries(filterParams)
const { employees } = useEmployees()

// Stats calculation
const stats = computed(() => {
  const all = salaries.value
  const totalRecords = all.length
  const activeCount = all.filter(s => s.status === 'Active').length
  const totalBasePayroll = all.reduce((sum, s) => sum + (Number(s.salary) || 0), 0)
  const totalAllowance = all.reduce((sum, s) => sum + (Number(s.allowanceTotal) || 0), 0)

  return {
    totalRecords,
    activeCount,
    totalBasePayroll,
    totalAllowance,
  }
})

// Modal states
const isFormModalOpen = ref(false)
const isEditMode = ref(false)
const activeSalaryForEdit = ref<EmployeeSalaryItem | null>(null)

const isViewModalOpen = ref(false)
const activeSalaryForView = ref<EmployeeSalaryItem | null>(null)

const salaryToDelete = ref<EmployeeSalaryItem | null>(null)
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
  activeSalaryForEdit.value = null
  isFormModalOpen.value = true
}

function handleEdit(item: EmployeeSalaryItem) {
  isEditMode.value = true
  activeSalaryForEdit.value = item
  isFormModalOpen.value = true
}

function handleView(item: EmployeeSalaryItem) {
  activeSalaryForView.value = item
  isViewModalOpen.value = true
}

function handleEditFromView(item: EmployeeSalaryItem) {
  isViewModalOpen.value = false
  handleEdit(item)
}

function handleDeleteRequest(item: EmployeeSalaryItem) {
  salaryToDelete.value = item
}

async function confirmDelete() {
  if (!salaryToDelete.value) return
  isBusy.value = true
  try {
    const res = await deleteSalary(salaryToDelete.value.id)
    showToast(res?.message || 'Employee salary record deleted successfully')
    salaryToDelete.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to delete record')
  } finally {
    isBusy.value = false
  }
}

async function handleFormSubmit(formData: EmployeeSalaryFormData) {
  isBusy.value = true
  try {
    const res = await saveSalary(formData)
    showToast(res?.message || (isEditMode.value ? 'Salary record updated successfully' : 'Salary record created successfully'))
    isFormModalOpen.value = false
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to save salary record')
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
    title: 'Employee Salary Report - PT Dulank Semesta Cida',
    columns: [
      { key: 'employeeId', label: 'Employee ID' },
      { key: 'name', label: 'Employee Name' },
      { key: 'salary', label: 'Base Salary (IDR)' },
      { key: 'system', label: 'Payroll System' },
      { key: 'allowanceTotal', label: 'Allowance (IDR)' },
      { key: 'overtimeRate', label: 'Overtime Rate (IDR)' },
      { key: 'status', label: 'Status' },
    ],
    rows: salaries.value.map(s => ({
      employeeId: s.employeeId,
      name: s.name,
      salary: formatIDR(s.salary),
      system: s.system,
      allowanceTotal: formatIDR(s.allowanceTotal),
      overtimeRate: formatIDR(s.overtimeRate),
      status: s.status,
    })),
  })
}

function handleExportPdf() {
  handlePrint()
}

function handleExportExcel() {
  const header = ['Employee ID', 'Name', 'Base Salary', 'System', 'Allowance Total', 'Overtime Rate', 'Status']
  const rows = salaries.value.map(s => [
    `"${s.employeeId}"`,
    `"${s.name}"`,
    `"${s.salary}"`,
    `"${s.system}"`,
    `"${s.allowanceTotal}"`,
    `"${s.overtimeRate}"`,
    `"${s.status}"`,
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map(r => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `employee_salaries_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('Salary data exported to CSV successfully')
}
</script>

<template>
  <div class="space-y-4 p-4 md:p-6">
    <!-- Header -->
    <SalesListHeader
      title="Employee Salary"
      subtitle="Manage employee salary, payroll system, and allowances"
      add-label="Add Employee Salary"
      @add="handleAdd"
      @refresh="refresh"
      @print="handlePrint"
      @export-pdf="handleExportPdf"
      @export-excel="handleExportExcel"
    />

    <!-- KPI Stats Widgets -->
    <EmployeeSalaryStatsWidgets :stats="stats" />

    <!-- Feedback Toast -->
    <SalesFeedback
      v-if="toastMessage"
      :message="toastMessage"
      @close="toastMessage = ''"
    />

    <!-- Error Banner -->
    <div
      v-if="error"
      class="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400"
    >
      Failed to load employee salaries: {{ error.message }}
    </div>

    <!-- Records Table -->
    <EmployeeSalaryRecordsTable
      :salaries="salaries"
      :search-query="searchQuery"
      :filter-system="filterSystem"
      :filter-status="filterStatus"
      @update:search-query="searchQuery = $event"
      @update:filter-system="filterSystem = $event"
      @update:filter-status="filterStatus = $event"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDeleteRequest"
    />

    <!-- Add / Edit Modal -->
    <EmployeeSalaryFormModal
      :open="isFormModalOpen"
      :is-edit="isEditMode"
      :salary-data="activeSalaryForEdit"
      :employees="employees"
      :busy="isBusy"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <!-- View Modal -->
    <EmployeeSalaryViewModal
      :open="isViewModalOpen"
      :salary-data="activeSalaryForView"
      @close="isViewModalOpen = false"
      @edit="handleEditFromView"
    />

    <!-- Delete Confirmation Modal -->
    <SalesConfirmDelete
      :open="!!salaryToDelete"
      title="Delete Employee Salary"
      :message="`Are you sure you want to delete salary configuration for '${salaryToDelete?.name}' (${salaryToDelete?.employeeId})?`"
      :busy="isBusy"
      @close="salaryToDelete = null"
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
