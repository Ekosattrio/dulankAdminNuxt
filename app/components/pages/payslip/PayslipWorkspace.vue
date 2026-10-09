<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PayslipItem, PayslipFormData } from '#server/types/payslip'
import { usePayslips } from '~/composables/usePayslips'
import { useEmployees } from '~/composables/useEmployees'
import { useTablePrint } from '~/composables/useTablePrint'
import { formatIDR } from '~/utils/currency'
import PayslipStatsWidgets from '~/components/pages/payslip/PayslipStatsWidgets.vue'
import PayslipRecordsTable from '~/components/pages/payslip/PayslipRecordsTable.vue'
import PayslipFormModal from '~/components/pages/payslip/PayslipFormModal.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'

// Filter states
const searchQuery = ref('')
const filterStatus = ref('')

const { payslips, pending, error, refresh, savePayslip, deletePayslip } = usePayslips()
const { employees } = useEmployees()

// Client-side filtering for 0ms smooth search without skeleton flicker
const filteredPayslips = computed(() => {
  return payslips.value.filter((p) => {
    if (filterStatus.value && p.status.toLowerCase() !== filterStatus.value.toLowerCase()) {
      return false
    }
    return true
  })
})

// Stats calculation
const stats = computed(() => {
  const all = payslips.value
  const totalSlips = all.length
  const paidCount = all.filter(p => p.status === 'Paid').length
  const unpaidCount = all.filter(p => p.status === 'Unpaid').length
  const totalDisbursed = all.filter(p => p.status === 'Paid').reduce((sum, p) => sum + (Number(p.total) || 0), 0)

  return {
    totalSlips,
    paidCount,
    unpaidCount,
    totalDisbursed,
  }
})

// Modal states
const isFormModalOpen = ref(false)
const isEditMode = ref(false)
const activePayslipForEdit = ref<PayslipItem | null>(null)
const payslipToDelete = ref<PayslipItem | null>(null)
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
  activePayslipForEdit.value = null
  isFormModalOpen.value = true
}

function handleEdit(item: PayslipItem) {
  isEditMode.value = true
  activePayslipForEdit.value = item
  isFormModalOpen.value = true
}

function handleDeleteRequest(item: PayslipItem) {
  payslipToDelete.value = item
}

async function confirmDelete() {
  if (!payslipToDelete.value) return
  isBusy.value = true
  try {
    const res = await deletePayslip(payslipToDelete.value.id)
    showToast(res?.message || 'Payslip record deleted successfully')
    payslipToDelete.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to delete payslip')
  } finally {
    isBusy.value = false
  }
}

async function handleFormSubmit(formData: PayslipFormData) {
  isBusy.value = true
  try {
    const res = await savePayslip(formData)
    showToast(res?.message || (isEditMode.value ? 'Payslip updated successfully' : 'Payslip created successfully'))
    isFormModalOpen.value = false
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to save payslip')
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
    title: 'Payroll & Payslips Report - PT Dulank Semesta Cida',
    columns: [
      { key: 'slipNo', label: 'Slip No' },
      { key: 'name', label: 'Employee Name' },
      { key: 'period', label: 'Period' },
      { key: 'salaryRate', label: 'Salary Rate (IDR)' },
      { key: 'dayWorked', label: 'Days Worked' },
      { key: 'allowance', label: 'Allowance (IDR)' },
      { key: 'overtime', label: 'Overtime (IDR)' },
      { key: 'deduction', label: 'Deduction (IDR)' },
      { key: 'total', label: 'Total Net Pay (IDR)' },
      { key: 'status', label: 'Status' },
      { key: 'paidDate', label: 'Paid Date' },
    ],
    rows: filteredPayslips.value.map(p => ({
      slipNo: p.slipNo,
      name: p.name,
      period: p.period,
      salaryRate: formatIDR(p.salaryRate),
      dayWorked: `${p.dayWorked} hari`,
      allowance: formatIDR(p.allowance),
      overtime: formatIDR(p.overtime),
      deduction: formatIDR(p.deduction),
      total: formatIDR(p.total),
      status: p.status,
      paidDate: p.paidDate || '-',
    })),
  })
}

function handleExportPdf() {
  handlePrint()
}

function handleExportExcel() {
  const header = ['Slip No', 'Name', 'Period', 'Salary Rate', 'Days Worked', 'Allowance', 'Overtime', 'Deduction', 'Total Net Pay', 'Status', 'Paid Date']
  const rows = filteredPayslips.value.map(p => [
    `"${p.slipNo}"`,
    `"${p.name}"`,
    `"${p.period}"`,
    `"${p.salaryRate}"`,
    `"${p.dayWorked}"`,
    `"${p.allowance}"`,
    `"${p.overtime}"`,
    `"${p.deduction}"`,
    `"${p.total}"`,
    `"${p.status}"`,
    `"${p.paidDate || ''}"`,
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map(r => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `payslips_export_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('Payslips exported to CSV successfully')
}
</script>

<template>
  <div class="space-y-4 p-4 md:p-6">
    <!-- Header -->
    <SalesListHeader
      title="Payslips / Slip Gaji"
      subtitle="Manage employee payroll, slips, allowances, and disbursements"
      add-label="Add Payslip"
      @add="handleAdd"
      @refresh="refresh"
      @print="handlePrint"
      @export-pdf="handleExportPdf"
      @export-excel="handleExportExcel"
    />

    <!-- KPI Stats Widgets -->
    <PayslipStatsWidgets :stats="stats" />

    <!-- Feedback Toast -->
    <SalesFeedback
      v-if="toastMessage"
      :message="toastMessage"
      @dismiss="toastMessage = ''"
    />

    <!-- Skeleton & Error Feedback -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="8"
      :skeleton-rows="6"
      :error="error ? (error.message || 'Failed to load payslips. Please try again.') : ''"
      @retry="refresh"
    />

    <!-- Records Table -->
    <PayslipRecordsTable
      v-if="!pending && !error"
      :payslips="filteredPayslips"
      :search-query="searchQuery"
      :filter-status="filterStatus"
      @update:search-query="searchQuery = $event"
      @update:filter-status="filterStatus = $event"
      @edit="handleEdit"
      @delete="handleDeleteRequest"
    />

    <!-- Add / Edit Modal -->
    <PayslipFormModal
      :open="isFormModalOpen"
      :is-edit="isEditMode"
      :payslip-data="activePayslipForEdit"
      :employees="employees"
      :busy="isBusy"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <SalesConfirmDelete
      :open="!!payslipToDelete"
      title="Delete Payslip"
      :message="`Are you sure you want to delete payslip '${payslipToDelete?.slipNo}' for ${payslipToDelete?.name}?`"
      :busy="isBusy"
      @close="payslipToDelete = null"
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

