<script setup lang="ts">
import type { PrintingMachine, PrintingMachineFormData } from '~/types/printing-machine'

const props = defineProps<{
  isOpen: boolean
  editData: PrintingMachine | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: PrintingMachineFormData): void
}>()

const form = ref<PrintingMachineFormData>({
  type: 'Offset',
  name: '',
  colors: 4,
  maxArea: '36 x 52 cm',
  plateCost: 65000,
  minim: 240000,
  druck: 85,
  status: 'Active'
})

const formActive = ref(true)

watch(
  () => props.editData,
  (val) => {
    if (val) {
      form.value = {
        id: val.id,
        type: val.type,
        name: val.name,
        colors: val.colors,
        maxArea: val.maxArea,
        plateCost: val.plateCost,
        minim: val.minim,
        druck: val.druck,
        status: val.status
      }
      formActive.value = val.status === 'Active'
    } else {
      form.value = {
        type: 'Offset',
        name: '',
        colors: 4,
        maxArea: '36 x 52 cm',
        plateCost: 65000,
        minim: 240000,
        druck: 85,
        status: 'Active'
      }
      formActive.value = true
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  if (!form.value.name) {
    alert('Nama mesin cetak tidak boleh kosong')
    return
  }
  form.value.status = formActive.value ? 'Active' : 'Inactive'
  emit('save', { ...form.value })
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop-custom">
    <div class="modal-dialog-custom modal-lg">
      <div class="modal-content border-0 shadow-lg rounded-3">
        <div class="modal-header border-bottom px-4 py-3 bg-light">
          <h5 class="modal-title fs-5 fw-bold text-dark">
            {{ editData ? 'Edit Printing Machine' : 'Add Printing Machine' }}
          </h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body p-4">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Machine Type <span class="text-danger">*</span></label>
                <select v-model="form.type" class="form-select" required>
                  <option value="Offset">Offset Press</option>
                  <option value="Digital Printing">Digital Printing / Laser</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Machine Name / Seri <span class="text-danger">*</span></label>
                <input
                  v-model="form.name"
                  type="text"
                  class="form-control"
                  required
                  placeholder="e.g. Heidelberg SM52, Xerox C70"
                />
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold">Warna / Unit Cetak</label>
                <input
                  v-model.number="form.colors"
                  type="number"
                  min="1"
                  max="12"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold">Max Area Cetak (cm)</label>
                <input
                  v-model="form.maxArea"
                  type="text"
                  class="form-control"
                  placeholder="e.g. 36 x 52 cm"
                  required
                />
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold">Biaya Plate / Set (Rp)</label>
                <input
                  v-model.number="form.plateCost"
                  type="number"
                  min="0"
                  class="form-control"
                  placeholder="0 jika digital"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Ongkos Minimal (Base Minim Rp)</label>
                <input
                  v-model.number="form.minim"
                  type="number"
                  min="0"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Tarif per Druck / Click (Rp)</label>
                <input
                  v-model.number="form.druck"
                  type="number"
                  min="0"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-12 d-flex align-items-center">
                <div class="form-check form-switch mt-2">
                  <input
                    v-model="formActive"
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="pressActiveSwitch"
                  />
                  <label class="form-check-label fw-semibold ms-2" for="pressActiveSwitch">
                    Status Aktif (Mesin Siap Operasi)
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
              {{ editData ? 'Update Machine' : 'Save Machine' }}
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
  max-width: 700px;
  margin: 1rem;
}
</style>

