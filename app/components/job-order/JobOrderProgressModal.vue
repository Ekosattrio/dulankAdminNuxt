<script setup lang="ts">
import type { JobOrder } from '~/types/job-order'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const props = defineProps<{
  isOpen: boolean
  jobOrder?: JobOrder | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div v-if="isOpen && jobOrder" class="modal-backdrop-custom">
    <div class="modal-dialog-centered custom-modal-two" style="max-width: 650px; width: 100%; margin: auto;">
      <div class="modal-content bg-white rounded-3 shadow border-0 overflow-hidden">
        <div class="p-4">
          <!-- Header -->
          <div class="modal-header border-0 p-0 pb-3 mb-3 d-flex justify-content-between align-items-center">
            <div>
              <span class="badge bg-primary px-2 py-1 mb-1 font-monospace">{{ jobOrder.no }}</span>
              <h4 class="fw-bold mb-0 text-dark">{{ jobOrder.jobTitle || jobOrder.product }}</h4>
            </div>
            <button type="button" class="btn-close" @click="emit('close')"></button>
          </div>

          <!-- Body -->
          <div class="modal-body p-0">
            <div class="bg-light p-3 rounded-3 mb-3">
              <div class="row g-2 text-sm">
                <div class="col-6">
                  <span class="text-muted d-block small">Customer:</span>
                  <strong class="text-dark">{{ jobOrder.customer }}</strong>
                </div>
                <div class="col-6">
                  <span class="text-muted d-block small">Due Date:</span>
                  <strong class="text-danger">{{ jobOrder.dueDate }}</strong>
                </div>
                <div class="col-6">
                  <span class="text-muted d-block small">Sales Order:</span>
                  <span class="font-monospace text-primary">{{ jobOrder.salesNo }}</span>
                </div>
                <div class="col-6">
                  <span class="text-muted d-block small">Priority:</span>
                  <span class="badge bg-warning bg-opacity-10 text-warning border border-warning">{{ jobOrder.priority }}</span>
                </div>
              </div>
            </div>

            <!-- Steps timeline -->
            <h6 class="fw-bold mb-3 text-dark">Production Flow Steps</h6>
            <div class="timeline ps-3 border-start ms-2 mb-3">
              <div
                v-for="(step, idx) in jobOrder.steps"
                :key="idx"
                class="position-relative mb-3 pb-1"
              >
                <div
                  class="position-absolute translate-middle-x rounded-circle d-flex align-items-center justify-content-center"
                  style="left: -17px; top: 0; width: 22px; height: 22px;"
                  :class="step.status === 'done' ? 'bg-success text-white' : step.status === 'active' ? 'bg-primary text-white' : 'bg-light border text-muted'"
                >
                  <FeatherIcon v-if="step.status === 'done'" name="check" size="12" />
                  <span v-else class="small fw-bold">{{ idx + 1 }}</span>
                </div>
                <div class="ms-3">
                  <h6 class="mb-0 fw-semibold" :class="step.status === 'active' ? 'text-primary' : 'text-dark'">
                    {{ step.name }}
                  </h6>
                  <span
                    class="badge mt-1"
                    :class="step.status === 'done' ? 'bg-success bg-opacity-10 text-success' : step.status === 'active' ? 'bg-primary bg-opacity-10 text-primary' : 'bg-secondary bg-opacity-10 text-secondary'"
                  >
                    {{ step.status.toUpperCase() }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer justify-content-end p-0 pt-3 border-top d-flex gap-2">
            <button type="button" class="btn btn-secondary px-4" @click="emit('close')">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 15px;
}
</style>

