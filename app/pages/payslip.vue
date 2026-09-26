<script setup lang="ts">
import type { PayslipItem, PayslipFormData } from '~/types/payslip'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Payslips - Penggajian Karyawan',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

const { payslips, pending, refresh, savePayslip, deletePayslip } = usePayslips()

const searchQuery = ref('')
const selectedStatus = ref('')

const isModalOpen = ref(false)
const editData = ref<PayslipItem | null>(null)
const isViewOnly = ref(false)

const filteredPayslips = computed(() => {
  return payslips.value.filter((p) => {
    const matchSearch =
      !searchQuery.value ||
      p.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.slipNo?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchStatus = !selectedStatus.value || p.status === selectedStatus.value
    return matchSearch && matchStatus
  })
})

const openAddModal = () => {
  editData.value = null
  isViewOnly.value = false
  isModalOpen.value = true
}

const handleView = (item: PayslipItem) => {
  editData.value = item
  isViewOnly.value = true
  isModalOpen.value = true
}

const handleEdit = (item: PayslipItem) => {
  editData.value = item
  isViewOnly.value = false
  isModalOpen.value = true
}

const handleDelete = async (id: string) => {
  if (confirm('Apakah Anda yakin ingin menghapus data slip gaji ini?')) {
    try {
      await deletePayslip(id)
    } catch (error) {
      console.error('Failed to delete payslip:', error)
    }
  }
}

const handleSave = async (payload: PayslipFormData) => {
  try {
    await savePayslip(payload)
    isModalOpen.value = false
  } catch (error) {
    console.error('Failed to save payslip:', error)
  }
}

const printList = () => {
  window.print()
}
</script>

<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div class="page-title">
          <h4 class="fw-bold mb-1">Payslips / Slip Gaji</h4>
          <h6 class="text-muted mb-0">Kelola payroll, slip gaji bulanan/mingguan seluruh karyawan</h6>
        </div>
        <div class="d-flex align-items-center gap-2">
          <ul class="table-top-head d-flex align-items-center list-unstyled gap-2 mb-0">
            <li>
              <button type="button" class="btn btn-outline-secondary btn-sm" title="Print" @click="printList">
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
            <span>Create Payslip</span>
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
                  placeholder="Cari nama karyawan atau no slip..."
                />
              </div>
            </div>
            <div class="col-md-4 d-flex justify-content-md-end gap-2">
              <select v-model="selectedStatus" class="form-select form-select-sm" style="width: auto">
                <option value="">Semua Status</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
          </div>

          <div v-if="pending" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <PagesPayslipTable
            v-else
            :payslips="filteredPayslips"
            @view="handleView"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>
      </div>
    </div>

    <PagesPayslipModal
      :is-open="isModalOpen"
      :edit-data="editData"
      :view-only="isViewOnly"
      @close="isModalOpen = false"
      @save="handleSave"
    />
  </div>
</template>
