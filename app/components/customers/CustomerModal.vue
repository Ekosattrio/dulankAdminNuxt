<script setup lang="ts">
import type { Customer, CustomerFormData } from '~/types/customer'

const props = defineProps<{
  isOpen: boolean
  isEdit: boolean
  editData?: Customer | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', form: CustomerFormData): void
}>()

const form = reactive<CustomerFormData>({
  id: '',
  customerId: '',
  name: '',
  email: '',
  type: 'General',
  phone: '',
  balance: 0,
  channel: 'Website'
})

watch(
  () => props.editData,
  (val) => {
    if (val && props.isEdit) {
      form.id = val.id
      form.customerId = val.customerId
      form.name = val.name
      form.email = val.email
      form.type = val.type
      form.phone = val.phone
      form.balance = val.balance
      form.channel = val.channel
    } else {
      form.id = ''
      form.customerId = ''
      form.name = ''
      form.email = ''
      form.type = 'General'
      form.phone = ''
      form.balance = 0
      form.channel = 'Website'
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
              {{ isEdit ? 'Edit Customer' : 'Add New Customer' }}
            </h4>
            <button type="button" class="btn-close" @click="emit('close')"></button>
          </div>

          <!-- Body -->
          <form @submit.prevent="handleSubmit">
            <div class="row g-3">
              <div v-if="isEdit" class="col-12">
                <label class="form-label text-xs fw-semibold text-muted">Customer ID</label>
                <input :value="form.customerId" type="text" class="form-control" disabled />
              </div>

              <div class="col-12">
                <label class="form-label text-xs fw-semibold text-muted">Full Name</label>
                <input
                  v-model="form.name"
                  type="text"
                  class="form-control"
                  placeholder="Masukkan nama pelanggan..."
                  required
                />
              </div>

              <div class="col-12">
                <label class="form-label text-xs fw-semibold text-muted">Email Address</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Customer Type</label>
                <select v-model="form.type" class="form-select">
                  <option value="Corporate">Corporate</option>
                  <option value="General">General</option>
                  <option value="VIP">VIP</option>
                  <option value="Reseller">Reseller</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Contact Phone</label>
                <input
                  v-model="form.phone"
                  type="text"
                  class="form-control"
                  placeholder="+628..."
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Initial Balance (Rp)</label>
                <input
                  v-model.number="form.balance"
                  type="number"
                  class="form-control"
                  placeholder="0"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Join Channel</label>
                <select v-model="form.channel" class="form-select">
                  <option value="Website">Website</option>
                  <option value="Offline">Offline</option>
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
                {{ isEdit ? 'Save Changes' : 'Create Customer' }}
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

