<script setup lang="ts">
import type { MyJob, JobStatus } from '#server/types/my-job'
import { useMyJobs } from '~/composables/useMyJobs'
import MyJobCardGrid from '~/components/pages/my-job/MyJobCardGrid.vue'
import MyJobDetailModal from '~/components/pages/my-job/MyJobDetailModal.vue'
import MyJobStatusModal from '~/components/pages/my-job/MyJobStatusModal.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'My Job - Dulank Admin',
  sweetAlert: false
})

const priorityFilter = ref('all')
const { myJobs, pending, error, refresh, updateJobStatus } = useMyJobs()

// Detail Modal
const isDetailOpen = ref(false)
const selectedJobForDetail = ref<MyJob | null>(null)

// Status Modal
const isStatusModalOpen = ref(false)
const selectedJobForStatus = ref<MyJob | null>(null)
const targetStatus = ref<JobStatus | ''>('')
const isSubmitting = ref(false)
const feedbackMessage = ref('')
const feedbackType = ref<'success' | 'error'>('success')

const handleViewDetail = (job: MyJob) => {
  selectedJobForDetail.value = job
  isDetailOpen.value = true
}

const handleStatusPrompt = (job: MyJob, newStatus: JobStatus) => {
  selectedJobForStatus.value = job
  targetStatus.value = newStatus
  isStatusModalOpen.value = true
}

const handleStatusSubmit = async (payload: { status: JobStatus; qtyOk: string; qtyRusak: string }) => {
  if (!selectedJobForStatus.value) return
  isSubmitting.value = true
  try {
    await updateJobStatus(selectedJobForStatus.value.id, {
      status: payload.status,
      qtyOk: payload.qtyOk ? Number(payload.qtyOk) : undefined,
      qtyRusak: payload.qtyRusak ? Number(payload.qtyRusak) : undefined
    })
    isStatusModalOpen.value = false
    feedbackMessage.value = `Status job ${selectedJobForStatus.value.title} berhasil diubah ke ${payload.status}`
    feedbackType.value = 'success'
  } catch (err: any) {
    feedbackMessage.value = err?.message || 'Gagal mengubah status job'
    feedbackType.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-my-job max-w-7xl mx-auto px-4 py-6">
    <SalesFeedback
      v-if="feedbackMessage"
      :message="feedbackMessage"
      class="mb-4"
      @dismiss="feedbackMessage = ''"
    />

    <SalesFeedback
      :pending="pending"
      skeleton="card"
      :error="error ? (error.message || 'Gagal memuat daftar pekerjaan') : ''"
      @retry="refresh"
    />

    <MyJobCardGrid
      v-if="!pending && !error"
      :jobs="myJobs"
      v-model:selected-priority="priorityFilter"
      @view-detail="handleViewDetail"
      @change-status-prompt="handleStatusPrompt"
    />

    <!-- Detail Modal -->
    <MyJobDetailModal
      :is-open="isDetailOpen"
      :job="selectedJobForDetail"
      @close="isDetailOpen = false"
    />

    <!-- Status Change Modal -->
    <MyJobStatusModal
      :is-open="isStatusModalOpen"
      :job="selectedJobForStatus"
      :target-status="targetStatus"
      :busy="isSubmitting"
      @close="isStatusModalOpen = false"
      @submit="handleStatusSubmit"
    />
  </div>
</template>
