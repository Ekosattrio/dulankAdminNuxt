<script setup lang="ts">
import type { Sale, SaleFormData } from '~/types/sale'

const props = defineProps<{
  isOpen: boolean
  isEdit: boolean
  editData?: Sale | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', form: SaleFormData): void
}>()

const form = reactive<SaleFormData>({
  id: '',
  saleNo: '',
  customer: '',
  subTotal: 0,
  deliveryFee: 0,
  discount: 0,
  tax: 0,
  delivery: 'Shipping',
  channel: 'POS',
  status: 'Paid',
  method: 'Cash'
})

watch(
  () => props.editData,
  (val) => {
    if (val && props.isEdit) {
      form.id = val.id
      form.saleNo = val.saleNo
      form.customer = val.customer
      form.subTotal = val.subTotal
      form.deliveryFee = val.deliveryFee
      form.discount = val.discount
      form.tax = val.tax
      form.delivery = val.delivery
      form.channel = val.channel
      form.status = val.status
      form.method = val.method
    } else {
      form.id = ''
      form.saleNo = ''
      form.customer = ''
      form.subTotal = 0
      form.deliveryFee = 0
      form.discount = 0
      form.tax = 0
      form.delivery = 'Shipping'
      form.channel = 'POS'
      form.status = 'Paid'
      form.method = 'Cash'
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
    <div class="modal-dialog-centered custom-modal-two" style="max-width: 600px; width: 100%; margin: auto;">
      <div class="modal-content bg-white rounded-3 shadow border-0 overflow-hidden">
        <div class="p-4">
          <!-- Header -->
          <div class="modal-header border-0 p-0 pb-3 mb-3 d-flex justify-content-between align-items-center">
            <h4 class="fw-bold mb-0 text-dark">
              {{ isEdit ? 'Edit Sale Transaction' : 'Add Sale Transaction' }}
            </h4>
            <button type="button" class="btn-close" @click="emit('close')"></button>
          </div>

          <!-- Body -->
          <form @submit.prevent="handleSubmit">
            <div class="row g-3">
              <div v-if="isEdit" class="col-12">
                <label class="form-label text-xs fw-semibold text-muted">No Sales</label>
                <input :value="form.saleNo" type="text" class="form-control bg-light" disabled />
              </div>

              <div class="col-12">
                <label class="form-label text-xs fw-semibold text-muted">Customer Name <span class="text-danger">*</span></label>
                <input
                  v-model="form.customer"
                  type="text"
                  class="form-control"
                  placeholder="e.g. Siti Aminah / PT Exabytes"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Sub Total (IDR) <span class="text-danger">*</span></label>
                <input
                  v-model.number="form.subTotal"
                  type="number"
                  class="form-control"
                  placeholder="0"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Delivery Fee (IDR)</label>
                <input
                  v-model.number="form.deliveryFee"
                  type="number"
                  class="form-control"
                  placeholder="0"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Discount (IDR)</label>
                <input
                  v-model.number="form.discount"
                  type="number"
                  class="form-control"
                  placeholder="0"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Tax (IDR)</label>
                <input
                  v-model.number="form.tax"
                  type="number"
                  class="form-control"
                  placeholder="0"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Delivery Type</label>
                <select v-model="form.delivery" class="form-select">
                  <option value="Shipping">Shipping</option>
                  <option value="Pick Up">Pick Up</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Sales Channel</label>
                <select v-model="form.channel" class="form-select">
                  <option value="POS">POS</option>
                  <option value="Website">Website</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Payment Status</label>
                <select v-model="form.status" class="form-select">
                  <option value="Paid">Paid</option>
                  <option value="Partial">Partial</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Payment Method</label>
                <select v-model="form.method" class="form-select">
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Debit Card">Debit Card</option>
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
                {{ isEdit ? 'Save Changes' : 'Create Sales' }}
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

