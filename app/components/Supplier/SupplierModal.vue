<script setup lang="ts">
import type { Supplier, SupplierFormData } from '~/types/supplier'

const props = defineProps<{
  isOpen: boolean
  isEdit: boolean
  editData?: Supplier | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', form: SupplierFormData): void
}>()

const form = reactive<SupplierFormData>({
  id: '',
  supplierId: '',
  name: '',
  email: '',
  contact: '',
  picName: '',
  status: 'Active'
})

watch(
  () => props.editData,
  (val) => {
    if (val && props.isEdit) {
      form.id = val.id
      form.supplierId = val.supplierId
      form.name = val.name
      form.email = val.email
      form.contact = val.contact
      form.picName = val.picName
      form.status = val.status || 'Active'
    } else {
      form.id = ''
      form.supplierId = ''
      form.name = ''
      form.email = ''
      form.contact = ''
      form.picName = ''
      form.status = 'Active'
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
              {{ isEdit ? 'Edit Supplier' : 'Add New Supplier' }}
            </h4>
            <button type="button" class="btn-close" @click="emit('close')"></button>
          </div>

          <!-- Body -->
          <form @submit.prevent="handleSubmit">
            <div class="row g-3">
              <div v-if="isEdit" class="col-12">
                <label class="form-label text-xs fw-semibold text-muted">Supplier ID</label>
                <input :value="form.supplierId" type="text" class="form-control bg-light" disabled />
              </div>

              <div class="col-12">
                <label class="form-label text-xs fw-semibold text-muted">Supplier Name <span class="text-danger">*</span></label>
                <input
                  v-model="form.name"
                  type="text"
                  class="form-control"
                  placeholder="e.g. PT Kertas Jaya Makmur"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Email Address <span class="text-danger">*</span></label>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  placeholder="info@supplier.com"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Contact / Phone <span class="text-danger">*</span></label>
                <input
                  v-model="form.contact"
                  type="text"
                  class="form-control"
                  placeholder="+62..."
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">PIC Name <span class="text-danger">*</span></label>
                <input
                  v-model="form.picName"
                  type="text"
                  class="form-control"
                  placeholder="Person in Charge"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Status</label>
                <select v-model="form.status" class="form-select">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
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
                {{ isEdit ? 'Save Changes' : 'Create Supplier' }}
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

