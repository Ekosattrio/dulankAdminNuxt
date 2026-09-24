<script setup lang="ts">
import type { PaperSize, PaperSizeFormData } from '~/types/paper-size'

const props = defineProps<{
  isOpen: boolean
  editData: PaperSize | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: PaperSizeFormData): void
}>()

const form = ref<PaperSizeFormData>({
  name: '',
  length: 65,
  width: 100,
  unit: 'cm',
  status: 'Active'
})

const formActive = ref(true)

watch(
  () => props.editData,
  (val) => {
    if (val) {
      form.value = {
        id: val.id,
        name: val.name,
        length: val.length,
        width: val.width,
        unit: val.unit,
        status: val.status
      }
      formActive.value = val.status === 'Active'
    } else {
      form.value = {
        name: '',
        length: 65,
        width: 100,
        unit: 'cm',
        status: 'Active'
      }
      formActive.value = true
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  if (!form.value.name) {
    alert('Nama format / ukuran tidak boleh kosong')
    return
  }
  form.value.status = formActive.value ? 'Active' : 'Inactive'
  emit('save', { ...form.value })
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop-custom">
    <div class="modal-dialog-custom modal-md">
      <div class="modal-content border-0 shadow-lg rounded-3">
        <div class="modal-header border-bottom px-4 py-3 bg-light">
          <h5 class="modal-title fs-5 fw-bold text-dark">
            {{ editData ? 'Edit Paper Size' : 'Add Paper Size' }}
          </h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body p-4">
            <div class="row g-3">
              <div class="col-12">
                <label class="form-label fw-semibold">Format / Ukuran Name <span class="text-danger">*</span></label>
                <input
                  v-model="form.name"
                  type="text"
                  class="form-control"
                  required
                  placeholder="e.g. A4, F4, Plano 65x100"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Panjang (Length) <span class="text-danger">*</span></label>
                <input
                  v-model.number="form.length"
                  type="number"
                  step="0.1"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Lebar (Width) <span class="text-danger">*</span></label>
                <input
                  v-model.number="form.width"
                  type="number"
                  step="0.1"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Satuan Unit</label>
                <select v-model="form.unit" class="form-select">
                  <option value="cm">cm (Centimeter)</option>
                  <option value="mm">mm (Millimeter)</option>
                  <option value="inch">inch (Inci)</option>
                </select>
              </div>

              <div class="col-md-6 d-flex align-items-center">
                <div class="form-check form-switch mt-4">
                  <input
                    v-model="formActive"
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="sizeActiveSwitch"
                  />
                  <label class="form-check-label fw-semibold ms-2" for="sizeActiveSwitch">
                    Status Aktif
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer border-top px-4 py-3 bg-light">
            <button type="button" class="btn btn-secondary px-4" @click="emit('close')">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary px-4">
              {{ editData ? 'Update Size' : 'Save Size' }}
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

