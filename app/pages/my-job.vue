<script setup lang="ts">
import type { MyJob, MyJobFormData } from '~/types/my-job'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'My Jobs - Tugas Kerja Saya',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

const { myJobs, pending, refresh, saveMyJob, deleteMyJob } = useMyJobs()

const selectedPriority = ref('')

const isModalOpen = ref(false)
const editData = ref<MyJob | null>(null)
const isViewOnly = ref(false)

const handleAdd = () => {
  editData.value = null
  isViewOnly.value = false
  isModalOpen.value = true
}

const handleView = (job: MyJob) => {
  editData.value = job
  isViewOnly.value = true
  isModalOpen.value = true
}

const handleEdit = (job: MyJob) => {
  editData.value = job
  isViewOnly.value = false
  isModalOpen.value = true
}

const handleDelete = async (id: string) => {
  if (confirm('Apakah Anda yakin ingin menghapus kartu tugas kerja ini?')) {
    try {
      await deleteMyJob(id)
    } catch (err) {
      console.error('Failed to delete job:', err)
    }
  }
}

const handleStatusChange = async (job: MyJob, newStatus: string) => {
  try {
    await saveMyJob({
      ...job,
      status: newStatus as any
    })
  } catch (err) {
    console.error('Failed to update status:', err)
  }
}

const handleSave = async (formData: MyJobFormData) => {
  try {
    await saveMyJob(formData)
    isModalOpen.value = false
  } catch (err) {
    console.error('Failed to save job:', err)
  }
}
</script>

<template>
  <div class="page-wrapper mt-3">
    <div class="content container-fluid">
      <div class="page-header d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div class="page-title">
          <h4 class="fw-bold mb-1">My Jobs / Tugas Kerja Saya</h4>
          <h6 class="text-muted mb-0">Board antrian pengerjaan order cetak harian</h6>
        </div>
        <div class="d-flex align-items-center gap-2">
          <button type="button" class="btn btn-outline-secondary btn-sm" title="Refresh" @click="refresh">
            <FeatherIcon name="rotate-cw" size="16" />
          </button>
          <button type="button" class="btn btn-primary d-flex align-items-center gap-2" @click="handleAdd">
            <FeatherIcon name="plus-circle" size="18" />
            <span>Add Job Card</span>
          </button>
        </div>
      </div>

      <div v-if="pending" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <PagesMyJobCardGrid
        v-else
        :jobs="myJobs"
        v-model:selected-priority="selectedPriority"
        @view-job="handleView"
        @edit-job="handleEdit"
        @delete-job="handleDelete"
        @status-change="handleStatusChange"
      />
    </div>

    <PagesMyJobModal
      :is-open="isModalOpen"
      :edit-data="editData"
      :view-only="isViewOnly"
      @close="isModalOpen = false"
      @save="handleSave"
    />
  </div>
</template>
