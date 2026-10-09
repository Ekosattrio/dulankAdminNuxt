<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Priority Filters Header -->
    <div class="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-4 dark:border-gray-800">
      <span class="me-1 font-bold text-gray-500 dark:text-gray-400">Priority:</span>
      <button
        type="button"
        class="rounded-full px-4 py-1.5 text-xs font-semibold transition"
        :class="selectedPriority === 'all' ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900' : 'border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'"
        @click="selectedPriority = 'all'"
      >
        All
      </button>
      <button
        type="button"
        class="rounded-full px-4 py-1.5 text-xs font-semibold transition"
        :class="selectedPriority === 'urgent' ? 'bg-rose-600 text-white' : 'border border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-950'"
        @click="selectedPriority = 'urgent'"
      >
        Urgent
      </button>
      <button
        type="button"
        class="rounded-full px-4 py-1.5 text-xs font-semibold transition"
        :class="selectedPriority === 'high' ? 'bg-sky-500 text-white' : 'border border-sky-300 text-sky-600 hover:bg-sky-50 dark:border-sky-800 dark:hover:bg-sky-950'"
        @click="selectedPriority = 'high'"
      >
        High
      </button>
      <button
        type="button"
        class="rounded-full px-4 py-1.5 text-xs font-semibold transition"
        :class="selectedPriority === 'normal' ? 'bg-gray-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800'"
        @click="selectedPriority = 'normal'"
      >
        Normal
      </button>
    </div>

    <div class="flex items-center justify-between">
      <h6 class="text-sm font-medium text-gray-500 dark:text-gray-400">Your Assigned Jobs in Waiting / Active Queue</h6>
      <span class="inline-flex items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">{{ filteredJobs.length }} Tasks</span>
    </div>

    <!-- Job Cards Grid -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div
        v-for="job in filteredJobs"
        :key="job.id"
        :class="['flex flex-col rounded-xl border bg-white shadow-sm dark:bg-gray-900', job.priority === 'Urgent' ? 'border-rose-300 dark:border-rose-800' : job.priority === 'High' ? 'border-sky-300 dark:border-sky-800' : 'border-gray-200 dark:border-gray-800']"
      >
        <div class="p-3">
          <div class="mb-2 border-b border-gray-100 pb-2 dark:border-gray-800">
            <small class="block text-[11px] text-gray-400">Flow Name :</small>
            <h6 class="mb-0 text-sm font-bold text-gray-900 dark:text-gray-100">{{ job.flowName }}</h6>
          </div>
          <div class="mb-2 text-end">
            <span class="text-xs font-bold" :class="job.priority === 'Urgent' ? 'text-rose-600 dark:text-rose-400' : job.priority === 'High' ? 'text-sky-600 dark:text-sky-400' : 'text-gray-600 dark:text-gray-400'">
              Priority : {{ job.priority }}
            </span>
          </div>
          <div class="mb-2">
            <small class="block text-[11px] text-gray-400">Product</small>
            <p class="mb-0 text-[13px] font-bold text-gray-900 dark:text-gray-100">{{ job.product }}</p>
          </div>
          <div class="mb-2">
            <small class="block text-[11px] text-gray-400">Job Title</small>
            <p class="mb-0 text-[13px] font-semibold text-gray-800 dark:text-gray-200">{{ job.title }}</p>
          </div>
          <div class="mb-3">
            <small class="block text-[11px] text-gray-400">Description</small>
            <p class="mb-0 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{{ job.description }}</p>
          </div>

          <div class="flex items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
            <select
              v-model="job.status"
              class="h-9 flex-1 rounded-lg border border-gray-200 bg-white px-2.5 text-xs text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="Waiting">Waiting</option>
              <option value="On Process">On Process</option>
              <option value="Complete">Complete</option>
              <option value="Hold">Hold</option>
            </select>
            <button
              type="button"
              class="rounded-lg p-1.5 text-amber-500 transition hover:bg-amber-50 dark:hover:bg-amber-950"
              title="View Detail"
              @click="viewJob(job)"
            >
              <CommonFeatherIcon name="eye" size="17" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="filteredJobs.length === 0" class="col-span-full py-10 text-center text-gray-400">
        No jobs found for the selected priority.
      </div>
    </div>

    <!-- View Modal -->
    <CommonBaseModal v-model="viewModalVisible" title="Job Task Details" maxWidth="md">
      <div v-if="selectedJob" class="divide-y divide-gray-100 dark:divide-gray-800">
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Flow Operation</span>
          <span class="font-bold text-gray-900 dark:text-gray-100">{{ selectedJob.flowName }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Product</span>
          <span class="text-gray-800 dark:text-gray-200">{{ selectedJob.product }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Job Title</span>
          <span class="font-bold text-gray-900 dark:text-gray-100">{{ selectedJob.title }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Priority</span>
          <span :class="selectedJob.priority === 'Urgent' ? 'font-bold text-rose-600 dark:text-rose-400' : selectedJob.priority === 'High' ? 'font-bold text-sky-600 dark:text-sky-400' : 'font-bold text-gray-700 dark:text-gray-300'">{{ selectedJob.priority }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="text-gray-500 dark:text-gray-400">Current Status</span>
          <CommonStatusPill :status="selectedJob.status" />
        </div>
        <div class="py-2.5">
          <div class="mb-1 text-xs text-gray-400">Specifications</div>
          <div class="text-sm text-gray-700 dark:text-gray-300">{{ selectedJob.description }}</div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="viewModalVisible = false"
          >
            Close
          </button>
        </div>
      </template>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">definePageMeta({
  layout: "default",
});

useHead({
  title: "My Job - Kacetak System",
});

const { data: myJobData } = await useFetch<MyJobItem[]>('/api/my-job')
const jobs = ref<MyJobItem[]>(myJobData.value ?? [])
useMockSync('my-job', jobs);

const selectedPriority = ref<"all" | "urgent" | "high" | "normal">("all");

const filteredJobs = computed(() => {
  if (selectedPriority.value === "all") return jobs.value;
  return jobs.value.filter((j) => j.priority.toLowerCase() === selectedPriority.value);
});

function getCardBorderClass(priority: string) {
  if (priority === "Urgent") return "border-danger border-2";
  if (priority === "High") return "border-info border-2";
  return "border-secondary";
}

function getPriorityTextClass(priority: string) {
  if (priority === "Urgent") return "text-danger";
  if (priority === "High") return "text-info";
  return "text-muted";
}

const viewModalVisible = ref(false);
const selectedJob = ref<MyJobItem | null>(null);

function viewJob(job: MyJobItem) {
  selectedJob.value = job;
  viewModalVisible.value = true;
}
</script>
=======
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
>>>>>>> origin/eko
