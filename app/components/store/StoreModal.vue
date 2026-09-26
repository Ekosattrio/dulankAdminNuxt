<script setup lang="ts">
import type { Store, StoreFormData } from '~/types/store'

const props = defineProps<{
  isOpen: boolean
  isEdit: boolean
  editData?: Store | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', form: StoreFormData): void
}>()

const form = reactive<StoreFormData>({
  id: '',
  storeName: '',
  userName: '',
  address: '',
  phone: '',
  email: '',
  status: 'Active'
})

watch(
  () => props.editData,
  (val) => {
    if (val && props.isEdit) {
      form.id = val.id
      form.storeName = val.storeName
      form.userName = val.userName
      form.address = val.address
      form.phone = val.phone
      form.email = val.email
      form.status = val.status || 'Active'
    } else {
      form.id = ''
      form.storeName = ''
      form.userName = ''
      form.address = ''
      form.phone = ''
      form.email = ''
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
    <div class="modal-dialog-centered custom-modal-two" style="max-width: 600px; width: 100%; margin: auto;">
      <div class="modal-content bg-white rounded-3 shadow border-0 overflow-hidden">
        <div class="p-4">
          <!-- Header -->
          <div class="modal-header border-0 p-0 pb-3 mb-3 d-flex justify-content-between align-items-center">
            <h4 class="fw-bold mb-0 text-dark">
              {{ isEdit ? 'Edit Store' : 'Add Store' }}
            </h4>
            <button type="button" class="btn-close" @click="emit('close')"></button>
          </div>

          <!-- Body -->
          <form @submit.prevent="handleSubmit">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Store Outlet Name <span class="text-danger">*</span></label>
                <input
                  v-model="form.storeName"
                  type="text"
                  class="form-control"
                  placeholder="e.g. Workshop Karawang"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Manager / Username <span class="text-danger">*</span></label>
                <input
                  v-model="form.userName"
                  type="text"
                  class="form-control"
                  placeholder="e.g. Thomas21"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Phone <span class="text-danger">*</span></label>
                <input
                  v-model="form.phone"
                  type="text"
                  class="form-control"
                  placeholder="+62 812..."
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label text-xs fw-semibold text-muted">Email <span class="text-danger">*</span></label>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  placeholder="outlet@example.com"
                  required
                />
              </div>

              <div class="col-12">
                <label class="form-label text-xs fw-semibold text-muted">Address</label>
                <textarea
                  v-model="form.address"
                  rows="2"
                  class="form-control"
                  placeholder="Complete address of the outlet..."
                ></textarea>
              </div>

              <div class="col-12">
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
                {{ isEdit ? 'Save Changes' : 'Create Store' }}
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

