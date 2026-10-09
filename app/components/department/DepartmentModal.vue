<script setup lang="ts">
import type { Department, DepartmentFormData } from '~/types/department'

const props = defineProps<{
  isOpen: boolean
  editData: Department | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: DepartmentFormData): void
}>()

const form = ref<DepartmentFormData>({
  name: '',
  members: [],
  status: 'Active'
})

const membersInput = ref('')

watch(
  () => props.editData,
  (val) => {
    if (val) {
      form.value = {
        id: val.id,
        name: val.name,
        members: [...val.members],
        createdDate: val.createdDate,
        status: val.status
      }
      membersInput.value = val.members.join(', ')
    } else {
      form.value = {
        name: '',
        members: [],
        status: 'Active'
      }
      membersInput.value = ''
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  if (!form.value.name) {
    alert('Nama departemen tidak boleh kosong')
    return
  }
  const members = membersInput.value
    ? membersInput.value.split(',').map((m) => m.trim()).filter(Boolean)
    : []
  emit('save', {
    ...form.value,
    members
  })
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop-custom">
    <div class="modal-dialog-custom modal-md">
      <div class="modal-content border-0 shadow-lg rounded-3">
        <div class="modal-header border-bottom px-4 py-3 bg-light">
          <h5 class="modal-title fs-5 fw-bold text-dark">
            {{ editData ? 'Edit Department' : 'Add Department' }}
          </h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="form-label fw-semibold">Department Name <span class="text-danger">*</span></label>
              <input
                v-model="form.name"
                type="text"
                class="form-control"
                placeholder="e.g. Produksi, Keuangan, Marketing"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Anggota / Members (pisahkan dengan koma)</label>
              <input
                v-model="membersInput"
                type="text"
                class="form-control"
                placeholder="e.g. Budi, Siti, Agus"
              />
            </div>

            <div class="mb-3">
              <label class="form-label fw-semibold">Status</label>
              <select v-model="form.status" class="form-select">
                <option value="Active">Active</option>
                <option value="Disable">Disable</option>
              </select>
            </div>
          </div>

          <div class="modal-footer border-top px-4 py-3 bg-light">
            <button type="button" class="btn btn-secondary px-4" @click="emit('close')">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary px-4">
              {{ editData ? 'Update Department' : 'Save Department' }}
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

