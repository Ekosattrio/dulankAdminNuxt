<script setup lang="ts">
import type { Invoice, InvoiceFormData } from '~/types/invoice'

const props = defineProps<{
  isOpen: boolean
  isEdit: boolean
  editData?: Invoice | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', form: InvoiceFormData): void
}>()

const form = reactive<InvoiceFormData>({
  id: '',
  invoiceNo: '',
  customer: '',
  dueDate: '',
  amount: 0,
  paid: 0,
  status: 'Unpaid'
})

watch(
  () => props.editData,
  (val) => {
    if (val && props.isEdit) {
      form.id = val.id
      form.invoiceNo = val.invoiceNo
      form.customer = val.customer
      form.dueDate = val.dueDate
      form.amount = val.amount
      form.paid = val.paid
      form.status = val.status
    } else {
      const due = new Date()
      due.setDate(due.getDate() + 30)
      const dueStr = `${String(due.getDate()).padStart(2, '0')}/${String(due.getMonth() + 1).padStart(2, '0')}/${due.getFullYear()}`

      form.id = ''
      form.invoiceNo = ''
      form.customer = ''
      form.dueDate = dueStr
      form.amount = 0
      form.paid = 0
      form.status = 'Unpaid'
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
              {{ isEdit ? 'Edit Invoice' : 'Add Invoice' }}
            </h4>
            <button type="button" class="btn-close" @click="emit('close')"></button>
          </div>

          <!-- Body -->
          <form @submit.prevent="handleSubmit">
            <div class="row g-3">
              <div v-if="isEdit" class="col-12">
                <label class="form-label text-xs fw-semibold text-muted">Invoice No</label>
                <input :value="form.invoiceNo" type="text" class="form-control bg-light" disabled />
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
                <label class="form-label text-xs fw-semibold text-muted">Total Amount (IDR) <span class="text-danger">*</span></label>
                <input
                  v-model.number="form.amount"
                  type="number"
                  class="form-control"
                  placeholder="0"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Amount Paid (IDR)</label>
                <input
                  v-model.number="form.paid"
                  type="number"
                  class="form-control"
                  placeholder="0"
                />
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

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Status</label>
                <select v-model="form.status" class="form-select">
                  <option value="Paid">Paid</option>
                  <option value="Partial">Partial</option>
                  <option value="Unpaid">Unpaid</option>
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
                {{ isEdit ? 'Save Changes' : 'Create Invoice' }}
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

