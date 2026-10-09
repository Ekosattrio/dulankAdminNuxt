<script setup lang="ts">
import type { Designation, DesignationFormData } from '~/types/designation'

const props = defineProps<{
  isOpen: boolean
  editData: Designation | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: DesignationFormData): void
}>()

const form = ref<DesignationFormData>({
  name: '',
  status: 'Active'
})
const validationError = ref('')

watch(
  () => props.editData,
  (val) => {
    if (val) {
      form.value = {
        id: val.id,
        name: val.name,
        createdOn: val.createdOn,
        status: val.status,
        members: val.members,
        totalMembers: val.totalMembers
      }
    } else {
      form.value = {
        name: '',
        status: 'Active'
      }
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  validationError.value = ''
  if (!form.value.name) {
    validationError.value = 'Nama jabatan / designation tidak boleh kosong.'
    return
  }
  emit('save', { ...form.value })
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop-custom">
    <div class="modal-dialog-custom modal-md">
      <div class="modal-content border-0 shadow-lg rounded-3">
        <div class="modal-header border-bottom px-4 py-3 bg-light">
          <h5 class="modal-title fs-5 fw-bold text-dark">
            {{ editData ? 'Edit Designation' : 'Add Designation' }}
          </h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body p-4">
            <p v-if="validationError" role="alert" class="mb-3 text-sm text-danger">{{ validationError }}</p>
            <div class="mb-3">
              <label class="form-label fw-semibold">Designation / Nama Posisi <span class="text-danger">*</span></label>
              <input
                v-model="form.name"
                type="text"
                class="form-control"
                placeholder="e.g. Graphic Designer, Lead Press Operator"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Status</label>
              <select v-model="form.status" class="form-select">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div class="modal-footer border-top px-4 py-3 bg-light">
            <button type="button" class="btn btn-secondary px-4" @click="emit('close')">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary px-4">
              {{ editData ? 'Update Designation' : 'Save Designation' }}
            </button>
          </div>
        </form>
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
  justify-content: center;
  align-items: center;
  z-index: 1050;
}
.modal-dialog-custom {
  width: 100%;
  max-width: 500px;
  margin: 1rem;
}
</style>

