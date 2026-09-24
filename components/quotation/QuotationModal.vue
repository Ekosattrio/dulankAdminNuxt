<script setup lang="ts">
import type { Quotation, QuotationFormData } from '~/types/quotation'

const props = defineProps<{
  isOpen: boolean
  isEdit: boolean
  editData?: Quotation | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', form: QuotationFormData): void
}>()

const form = reactive<QuotationFormData>({
  id: '',
  noQuotation: '',
  customer: '',
  email: '',
  status: 'Send',
  total: 0,
  channel: 'Online',
  dueDate: ''
})

watch(
  () => props.editData,
  (val) => {
    if (val && props.isEdit) {
      form.id = val.id
      form.noQuotation = val.noQuotation
      form.customer = val.customer
      form.email = val.email
      form.status = val.status
      form.total = val.total
      form.channel = val.channel
      form.dueDate = val.dueDate
    } else {
      const now = new Date()
      const due = new Date()
      due.setDate(due.getDate() + 30)
      const dueStr = `${String(due.getDate()).padStart(2, '0')}/${String(due.getMonth() + 1).padStart(2, '0')}/${due.getFullYear()}`

      form.id = ''
      form.noQuotation = ''
      form.customer = ''
      form.email = ''
      form.status = 'Send'
      form.total = 0
      form.channel = 'Online'
      form.dueDate = dueStr
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
    <div class="modal-dialog-centered custom-modal-two" style="max-width: 550px; width: 100%; margin: auto;">
      <div class="modal-content bg-white rounded-3 shadow border-0 overflow-hidden">
        <div class="p-4">
          <!-- Header -->
          <div class="modal-header border-0 p-0 pb-3 mb-3 d-flex justify-content-between align-items-center">
            <h4 class="fw-bold mb-0 text-dark">
              {{ isEdit ? 'Edit Quotation' : 'Add Quotation' }}
            </h4>
            <button type="button" class="btn-close" @click="emit('close')"></button>
          </div>

          <!-- Body -->
          <form @submit.prevent="handleSubmit">
            <div class="row g-3">
              <div v-if="isEdit" class="col-12">
                <label class="form-label text-xs fw-semibold text-muted">No Quotation</label>
                <input :value="form.noQuotation" type="text" class="form-control bg-light" disabled />
              </div>

              <div class="col-12">
                <label class="form-label text-xs fw-semibold text-muted">Customer Name <span class="text-danger">*</span></label>
                <input
                  v-model="form.customer"
                  type="text"
                  class="form-control"
                  placeholder="e.g. PT Semesta Digital"
                  required
                />
              </div>

              <div class="col-12">
                <label class="form-label text-xs fw-semibold text-muted">Customer Email <span class="text-danger">*</span></label>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Total Amount (IDR) <span class="text-danger">*</span></label>
                <input
                  v-model.number="form.total"
                  type="number"
                  class="form-control"
                  placeholder="0"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Channel</label>
                <select v-model="form.channel" class="form-select">
                  <option value="Online">Online</option>
                  <option value="Sales Staff">Sales Staff</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Status</label>
                <select v-model="form.status" class="form-select">
                  <option value="Send">Send</option>
                  <option value="Ordered">Ordered</option>
                  <option value="Complete">Complete</option>
                  <option value="Pending">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Due Date (DD/MM/YYYY) <span class="text-danger">*</span></label>
                <input
                  v-model="form.dueDate"
                  type="text"
                  class="form-control"
                  placeholder="DD/MM/YYYY"
                  required
                />
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
                {{ isEdit ? 'Save Changes' : 'Create Quotation' }}
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

