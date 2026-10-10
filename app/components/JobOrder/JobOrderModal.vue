<script setup lang="ts">
import type { JobOrder, JobOrderFormData } from '~/types/job-order'

const props = defineProps<{
  isOpen: boolean
  isEdit: boolean
  editData?: JobOrder | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', form: JobOrderFormData): void
}>()

const form = reactive<JobOrderFormData>({
  id: '',
  no: '',
  dueDate: '',
  customer: '',
  product: '',
  jobTitle: '',
  priority: 'Medium',
  status: 'Waiting',
  workflowType: 'sm52',
  workflowCategory: 'Cetak'
})

watch(
  () => props.editData,
  (val) => {
    if (val && props.isEdit) {
      form.id = val.id
      form.no = val.no
      form.dueDate = val.dueDate
      form.customer = val.customer
      form.product = val.product
      form.jobTitle = val.jobTitle
      form.priority = val.priority
      form.status = val.status
      form.workflowType = val.workflowType
      form.workflowCategory = val.workflowCategory
    } else {
      const now = new Date()
      const due = new Date()
      due.setDate(due.getDate() + 3)
      const dueStr = `${String(due.getDate()).padStart(2, '0')}/${String(due.getMonth() + 1).padStart(2, '0')}/${due.getFullYear()}`

      form.id = ''
      form.no = ''
      form.dueDate = dueStr
      form.customer = ''
      form.product = ''
      form.jobTitle = ''
      form.priority = 'Medium'
      form.status = 'Waiting'
      form.workflowType = 'sm52'
      form.workflowCategory = 'Cetak'
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  emit('submit', { ...form })
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop-custom">
    <div class="modal-dialog-centered custom-modal-two" style="max-width: 580px; width: 100%; margin: auto;">
      <div class="modal-content bg-white rounded-3 shadow border-0 overflow-hidden">
        <div class="p-4">
          <!-- Header -->
          <div class="modal-header border-0 p-0 pb-3 mb-3 d-flex justify-content-between align-items-center">
            <h4 class="fw-bold mb-0 text-dark">
              {{ isEdit ? 'Edit Job Order' : 'Add New Job Order' }}
            </h4>
            <button type="button" class="btn-close" @click="emit('close')"></button>
          </div>

          <!-- Body -->
          <form @submit.prevent="handleSubmit">
            <div class="row g-3">
              <div v-if="isEdit" class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Job Order No</label>
                <input :value="form.no" type="text" class="form-control bg-light" disabled />
              </div>

              <div :class="isEdit ? 'col-md-6' : 'col-12'">
                <label class="form-label text-xs fw-semibold text-muted">Due Date (DD/MM/YYYY) <span class="text-danger">*</span></label>
                <input
                  v-model="form.dueDate"
                  type="text"
                  class="form-control"
                  placeholder="DD/MM/YYYY"
                  required
                />
              </div>

              <div class="col-12">
                <label class="form-label text-xs fw-semibold text-muted">Customer Name <span class="text-danger">*</span></label>
                <input
                  v-model="form.customer"
                  type="text"
                  class="form-control"
                  placeholder="e.g. PT Makmur Abadi"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Product Name <span class="text-danger">*</span></label>
                <input
                  v-model="form.product"
                  type="text"
                  class="form-control"
                  placeholder="e.g. Brosur Full Color"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Job Title</label>
                <input
                  v-model="form.jobTitle"
                  type="text"
                  class="form-control"
                  placeholder="e.g. Brosur PPDB SMAN 1"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Workflow Category</label>
                <select v-model="form.workflowCategory" class="form-select">
                  <option value="Design">Design</option>
                  <option value="Pracetak">Pracetak</option>
                  <option value="Cetak">Cetak</option>
                  <option value="Finishing">Finishing</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Workflow Machinery / Flow</label>
                <select v-model="form.workflowType" class="form-select">
                  <option value="sm52">Mesin SM52</option>
                  <option value="ctp">Plate CTP</option>
                  <option value="potong">Potong & Finishing</option>
                  <option value="design">Design Approval</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Priority</label>
                <select v-model="form.priority" class="form-select">
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Status</label>
                <select v-model="form.status" class="form-select">
                  <option value="Waiting">Waiting</option>
                  <option value="On Process">On Process</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <!-- Footer -->
            <div class="modal-footer justify-content-end p-0 pt-4 mt-3 border-top d-flex gap-2">
              <button type="button" class="btn btn-secondary" @click="emit('close')">
                Cancel
              </button>
              <button
                type="submit"
                class="btn btn-primary px-4 fw-semibold"
              >
                {{ isEdit ? 'Save Changes' : 'Create Job Order' }}
              </button>
            </div>
          </form>
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

