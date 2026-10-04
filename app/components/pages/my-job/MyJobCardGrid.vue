<script setup lang="ts">
import type { MyJob, JobPriority, JobStatus } from '#server/types/my-job'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

interface Props {
  jobs: MyJob[]
  selectedPriority: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:selectedPriority', value: string): void
  (e: 'view-detail', job: MyJob): void
  (e: 'change-status-prompt', job: MyJob, targetStatus: JobStatus): void
}>()

const priorities: { id: string; label: string; activeClass: string; inactiveClass: string }[] = [
  { id: 'all', label: 'All', activeClass: 'bg-gray-800 text-white border-gray-800', inactiveClass: 'border-gray-300 text-gray-700 hover:bg-gray-100' },
  { id: 'urgent', label: 'Urgent', activeClass: 'bg-red-600 text-white border-red-600', inactiveClass: 'border-red-500 text-red-600 hover:bg-red-50' },
  { id: 'high', label: 'High', activeClass: 'bg-sky-500 text-white border-sky-500', inactiveClass: 'border-sky-500 text-sky-600 hover:bg-sky-50' },
  { id: 'normal', label: 'Normal', activeClass: 'bg-gray-500 text-white border-gray-500', inactiveClass: 'border-gray-400 text-gray-600 hover:bg-gray-50' }
]

const setPriority = (id: string) => {
  emit('update:selectedPriority', id)
}

const filteredJobs = computed(() => {
  if (!props.selectedPriority || props.selectedPriority === 'all') {
    return props.jobs
  }
  return props.jobs.filter(j => j.priority.toLowerCase() === props.selectedPriority.toLowerCase())
})

const getBorderClass = (priority: JobPriority) => {
  switch (priority) {
    case 'urgent':
      return 'border-red-500 dark:border-red-600 shadow-sm hover:shadow-md transition-shadow'
    case 'high':
      return 'border-sky-500 dark:border-sky-600 shadow-sm hover:shadow-md transition-shadow'
    case 'normal':
    default:
      return 'border-gray-300 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow'
  }
}

const getPriorityTextClass = (priority: JobPriority) => {
  switch (priority) {
    case 'urgent':
      return 'text-red-600 font-semibold'
    case 'high':
      return 'text-sky-600 font-semibold'
    case 'normal':
    default:
      return 'text-gray-500 font-medium'
  }
}

const onStatusDropdownChange = (event: Event, job: MyJob) => {
  const target = event.target as HTMLSelectElement
  const val = target.value as JobStatus
  if (val) {
    emit('change-status-prompt', job, val)
    target.value = '' // reset dropdown back to placeholder until confirmed
  }
}
</script>

<template>
  <div class="my-job-container">
    <!-- Priority Filters Header -->
    <div class="flex items-center gap-4 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
      <span class="text-sm font-bold text-gray-500 dark:text-gray-400">Priority</span>
      <div class="flex items-center gap-2">
        <button
          v-for="p in priorities"
          :key="p.id"
          type="button"
          :class="[
            'px-4 py-1.5 rounded text-xs font-semibold border transition-colors',
            selectedPriority === p.id || (!selectedPriority && p.id === 'all')
              ? p.activeClass
              : p.inactiveClass
          ]"
          @click="setPriority(p.id)"
        >
          {{ p.label }}
        </button>
      </div>
    </div>

    <!-- Section Subheading -->
    <h6 class="mb-4 text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
      Your All Job in waiting List
    </h6>

    <!-- Grid of Job Cards -->
    <div v-if="filteredJobs.length === 0" class="text-center py-12 text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
      <FeatherIcon name="check-circle" size="32" class="mx-auto mb-2 text-gray-400" />
      <p class="text-sm">Tidak ada antrian pekerjaan untuk prioritas ini.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="job in filteredJobs"
        :key="job.id"
        :class="[
          'bg-white dark:bg-gray-800 rounded-xl border p-4 flex flex-col justify-between',
          getBorderClass(job.priority)
        ]"
      >
        <div>
          <!-- Card Header -->
          <div class="border-b border-gray-100 dark:border-gray-700 pb-2 mb-2">
            <span class="text-[11px] text-gray-500 dark:text-gray-400 block">Flow Name :</span>
            <h6 class="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{{ job.flowName }}</h6>
          </div>

          <!-- Priority Indicator -->
          <div class="text-right mb-3">
            <span :class="['text-xs uppercase tracking-wider', getPriorityTextClass(job.priority)]">
              Priority : {{ job.priority }}
            </span>
          </div>

          <!-- Product -->
          <div class="mb-3">
            <span class="text-[11px] text-gray-500 dark:text-gray-400 block">Product</span>
            <p class="font-bold text-xs text-gray-900 dark:text-white line-clamp-1">{{ job.product }}</p>
          </div>

          <!-- Job Title -->
          <div class="mb-3">
            <span class="text-[11px] text-gray-500 dark:text-gray-400 block">Job Title</span>
            <p class="font-bold text-xs text-gray-900 dark:text-white line-clamp-1">{{ job.title }}</p>
          </div>

          <!-- Description -->
          <div class="mb-4">
            <span class="text-[11px] text-gray-500 dark:text-gray-400 block">Description</span>
            <p class="text-xs text-gray-700 dark:text-gray-300 font-medium line-clamp-3 leading-relaxed">
              {{ job.description }}
            </p>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700 gap-2 mt-2">
          <div class="flex-1">
            <select
              class="w-full h-9 text-xs rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-750 text-gray-700 dark:text-gray-200 px-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              @change="onStatusDropdownChange($event, job)"
            >
              <option value="">Change Status</option>
              <option value="Complete">Complete</option>
              <option value="On Process">On Process</option>
              <option value="Hold">Hold</option>
            </select>
          </div>

          <button
            type="button"
            class="w-9 h-9 flex items-center justify-center text-amber-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-lg transition-colors"
            title="View Job Detail"
            @click="emit('view-detail', job)"
          >
            <FeatherIcon name="eye" size="16" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
