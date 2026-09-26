<script setup lang="ts">
import type { JobOrder, JobOrderFormData } from '~/types/job-order'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Job Orders - SPK Produksi',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

const { jobOrders, pending, refresh, saveJobOrder, deleteJobOrder } = useJobOrders()

const searchQuery = ref('')
const filterStatus = ref('')

const isModalOpen = ref(false)
const isEdit = ref(false)
const editData = ref<JobOrder | null>(null)

const isProgressOpen = ref(false)
const progressData = ref<JobOrder | null>(null)
const toastMessage = ref('')

const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const filteredList = computed(() => {
  return jobOrders.value.filter((j) => {
    const matchesSearch =
      !searchQuery.value ||
      j.jobOrderNo?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      j.jobName?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      j.customer?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !filterStatus.value || j.status === filterStatus.value
    return matchesSearch && matchesStatus
  })
})

const handleAdd = () => {
  isEdit.value = false
  editData.value = null
  isModalOpen.value = true
}

const handleEdit = (j: JobOrder) => {
  isEdit.value = true
  editData.value = j
  isModalOpen.value = true
}

const handleProgress = (j: JobOrder) => {
  progressData.value = j
  isProgressOpen.value = true
}

const handleDelete = async (id: string) => {
  if (confirm('Apakah Anda yakin ingin menghapus SPK Job Order ini?')) {
    try {
      await deleteJobOrder(id)
      showToast('Job order deleted successfully')
    } catch (err) {
      console.error('Failed to delete job order:', err)
      alert('Failed to delete job order')
    }
  }
}

const handleSubmit = async (formData: JobOrderFormData) => {
  try {
    const res = await saveJobOrder(formData)
    showToast(res?.message || 'Job order saved successfully')
    isModalOpen.value = false
  } catch (err) {
    console.error('Failed to save job order:', err)
    alert('Failed to save job order')
  }
}

const handleProgressUpdate = async (updatedSteps: any) => {
  if (!progressData.value) return
  try {
    const payload: JobOrderFormData = {
      ...progressData.value,
      steps: updatedSteps
    }
    await saveJobOrder(payload)
    showToast('Job progress updated successfully')
    isProgressOpen.value = false
  } catch (err) {
    console.error('Failed to update progress:', err)
  }
}

const printTable = () => {
  window.print()
}

const exportPdf = () => {
  showToast('Exporting Job Orders to PDF...')
}
</script>

<template>
  <div class="page-wrapper mt-3">
    <div class="content container-fluid">
      <div v-if="toastMessage" class="alert alert-success position-fixed top-0 end-0 m-4 shadow-lg z-3 d-flex align-items-center gap-2" role="alert">
        <FeatherIcon name="check-circle" size="18" />
        <div>{{ toastMessage }}</div>
      </div>

      <div class="page-header d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div class="page-title">
          <h4 class="fw-bold mb-1">Job Orders / SPK Produksi</h4>
          <h6 class="text-muted mb-0">Kelola surat perintah kerja produksi dan alur divisi cetak</h6>
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
          <button type="button" class="btn btn-primary d-flex align-items-center gap-2" @click="handleAdd">
            <FeatherIcon name="plus-circle" size="18" />
            <span>Create Job Order</span>
          </button>
        </div>
      </div>

      <div v-if="pending" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <PagesJobOrderTable
        v-else
        :job-orders="filteredList"
        :search-query="searchQuery"
        :filter-status="filterStatus"
        @update:search-query="searchQuery = $event"
        @update:filter-status="filterStatus = $event"
        @add-job-order="handleAdd"
        @edit-job-order="handleEdit"
        @view-progress="handleProgress"
        @delete-job-order="handleDelete"
        @export-pdf="exportPdf"
        @print-table="printTable"
        @refresh="refresh"
      />
    </div>

    <PagesJobOrderModal
      :is-open="isModalOpen"
      :is-edit="isEdit"
      :edit-data="editData"
      @close="isModalOpen = false"
      @submit="handleSubmit"
    />

    <PagesJobOrderProgressModal
      :is-open="isProgressOpen"
      :job="progressData"
      @close="isProgressOpen = false"
      @update-steps="handleProgressUpdate"
    />
  </div>
</template>
