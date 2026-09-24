<script setup lang="ts">
import type { DeliveryNote, DeliveryNoteFormData } from '~/types/delivery-note'

const props = defineProps<{
  isOpen: boolean
  isEdit: boolean
  editData?: DeliveryNote | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', form: DeliveryNoteFormData): void
}>()

const form = reactive<DeliveryNoteFormData>({
  id: '',
  dnNo: '',
  customer: '',
  noSales: '',
  shippingAddress: '',
  status: 'Pending',
  po: '',
  shippingBy: 'Motorcycle',
  reference: 'Admin'
})

watch(
  () => props.editData,
  (val) => {
    if (val && props.isEdit) {
      form.id = val.id
      form.dnNo = val.dnNo
      form.customer = val.customer
      form.noSales = val.noSales
      form.shippingAddress = val.shippingAddress
      form.status = val.status
      form.po = val.po
      form.shippingBy = val.shippingBy
      form.reference = val.reference
    } else {
      form.id = ''
      form.dnNo = ''
      form.customer = ''
      form.noSales = ''
      form.shippingAddress = ''
      form.status = 'Pending'
      form.po = ''
      form.shippingBy = 'Motorcycle'
      form.reference = 'Admin'
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
              {{ isEdit ? 'Edit Delivery Note' : 'Add Delivery Note' }}
            </h4>
            <button type="button" class="btn-close" @click="emit('close')"></button>
          </div>

          <!-- Body -->
          <form @submit.prevent="handleSubmit">
            <div class="row g-3">
              <div v-if="isEdit" class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">No. DN</label>
                <input :value="form.dnNo" type="text" class="form-control bg-light" disabled />
              </div>

              <div :class="isEdit ? 'col-md-6' : 'col-12'">
                <label class="form-label text-xs fw-semibold text-muted">Sales Order No <span class="text-danger">*</span></label>
                <input
                  v-model="form.noSales"
                  type="text"
                  class="form-control"
                  placeholder="e.g. 2511000001"
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

              <div class="col-12">
                <label class="form-label text-xs fw-semibold text-muted">Shipping Address <span class="text-danger">*</span></label>
                <textarea
                  v-model="form.shippingAddress"
                  rows="2"
                  class="form-control"
                  placeholder="Full recipient address..."
                  required
                ></textarea>
              </div>

              <div class="col-md-4">
                <label class="form-label text-xs fw-semibold text-muted">PO Number</label>
                <input
                  v-model="form.po"
                  type="text"
                  class="form-control"
                  placeholder="PO-1212..."
                />
              </div>

              <div class="col-md-4">
                <label class="form-label text-xs fw-semibold text-muted">Shipping By</label>
                <select v-model="form.shippingBy" class="form-select">
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Car">Car</option>
                  <option value="Truck">Truck</option>
                </select>
              </div>

              <div class="col-md-4">
                <label class="form-label text-xs fw-semibold text-muted">Status</label>
                <select v-model="form.status" class="form-select">
                  <option value="Pending">Pending</option>
                  <option value="Ordered">Ordered</option>
                  <option value="Received">Received</option>
                  <option value="Complete">Complete</option>
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
                {{ isEdit ? 'Save Changes' : 'Create Delivery Note' }}
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

