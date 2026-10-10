<script setup lang="ts">
import type { MyJob } from '~/types/my-job'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

const props = defineProps<{
  jobs: MyJob[]
  selectedPriority: string
}>()

const emit = defineEmits<{
  (e: 'update:selectedPriority', val: string): void
  (e: 'view-job', job: MyJob): void
  (e: 'edit-job', job: MyJob): void
  (e: 'delete-job', id: string): void
  (e: 'status-change', job: MyJob, newStatus: string): void
}>()

const getCardBorderClass = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'urgent':
      return 'border-danger border-2'
    case 'high':
      return 'border-info border-2'
    case 'normal':
    default:
      return 'border-secondary'
  }
}

const getPriorityTextClass = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'urgent':
      return 'text-danger'
    case 'high':
      return 'text-info'
    default:
      return 'text-secondary'
  }
}
</script>

<template>
  <div>
    <!-- Priority Filters Header -->
    <div class="d-flex align-items-center mb-4 pb-3 border-bottom flex-wrap gap-2">
      <span class="me-3 fw-bold text-muted">Priority:</span>
      <div class="d-flex gap-2 flex-wrap">
        <button
          type="button"
          class="btn btn-sm px-4 rounded"
          :class="selectedPriority === 'all' ? 'btn-dark' : 'btn-outline-dark'"
          @click="emit('update:selectedPriority', 'all')"
        >
          All
        </button>
        <button
          type="button"
          class="btn btn-sm px-4 rounded"
          :class="selectedPriority === 'urgent' ? 'btn-danger' : 'btn-outline-danger'"
          @click="emit('update:selectedPriority', 'urgent')"
        >
          Urgent
        </button>
        <button
          type="button"
          class="btn btn-sm px-4 rounded"
          :class="selectedPriority === 'high' ? 'btn-info text-white' : 'btn-outline-info'"
          @click="emit('update:selectedPriority', 'high')"
        >
          High
        </button>
        <button
          type="button"
          class="btn btn-sm px-4 rounded"
          :class="selectedPriority === 'normal' ? 'btn-secondary' : 'btn-outline-secondary'"
          @click="emit('update:selectedPriority', 'normal')"
        >
          Normal
        </button>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-3">
      <h6 class="text-muted mb-0">Your Assigned Jobs in Waiting / Active Queue</h6>
      <span class="badge bg-primary px-3 py-1">{{ jobs.length }} Tasks</span>
    </div>

    <!-- Job Cards Grid -->
    <div class="row g-4">
      <div v-for="job in jobs" :key="job.id" class="col-xl-3 col-lg-4 col-md-6 col-sm-12">
        <div class="card h-100 rounded-3 shadow-sm bg-white" :class="getCardBorderClass(job.priority)">
          <div class="card-body d-flex flex-column p-3">
            <div class="border-bottom pb-2 mb-2 d-flex justify-content-between align-items-start">
              <div>
                <small class="text-muted d-block" style="font-size: 11px">Flow Station :</small>
                <h6 class="fw-bold mb-0 text-dark">{{ job.flowName }}</h6>
              </div>
              <span class="small fw-bold text-uppercase" :class="getPriorityTextClass(job.priority)">
                {{ job.priority }}
              </span>
            </div>

            <div class="mb-2">
              <small class="text-muted d-block" style="font-size: 11px">Product</small>
              <p class="mb-0 fw-bold text-dark" style="font-size: 13px">{{ job.product }}</p>
            </div>

            <div class="mb-2">
              <small class="text-muted d-block" style="font-size: 11px">Job Title</small>
              <p class="mb-0 fw-semibold text-secondary" style="font-size: 13px">{{ job.title }}</p>
            </div>

            <div class="mb-3">
              <small class="text-muted d-block" style="font-size: 11px">Instructions</small>
              <p class="text-muted mb-0 small" style="line-height: 1.4">
                {{ job.description }}
              </p>
            </div>

            <div class="d-flex justify-content-between align-items-center mt-auto pt-3 border-top gap-2">
              <div class="flex-grow-1">
                <select
                  :value="job.status"
                  class="form-select form-select-sm"
                  @change="emit('status-change', job, ($event.target as HTMLSelectElement).value)"
                >
                  <option value="Waiting">Waiting</option>
                  <option value="On Process">On Process</option>
                  <option value="Complete">Complete</option>
                  <option value="Hold">Hold</option>
                </select>
              </div>
              <button
                type="button"
                class="btn btn-sm btn-outline-info p-1"
                title="View Details"
                @click="emit('view-job', job)"
              >
                <FeatherIcon name="eye" size="14" />
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-primary p-1"
                title="Edit Task"
                @click="emit('edit-job', job)"
              >
                <FeatherIcon name="edit" size="14" />
              </button>
              <button
                type="button"
                class="btn btn-sm btn-outline-danger p-1"
                title="Delete Task"
                @click="emit('delete-job', job.id)"
              >
                <FeatherIcon name="trash-2" size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="jobs.length === 0" class="col-12 text-center py-5 text-muted">
        No jobs found for the selected priority.
      </div>
    </div>
  </div>
</template>

