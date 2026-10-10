<script setup lang="ts">
import type { PaperPrice, PaperPriceFormData } from '~/types/paper-price'

const props = defineProps<{
  isOpen: boolean
  editData: PaperPrice | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: PaperPriceFormData): void
}>()

const form = ref<PaperPriceFormData>({
  nama: '',
  group: 'HVS Putih',
  merk: '',
  ukuran: '',
  satuan: 'lembar',
  gramatur: 80,
  minOrder: '1 lembar',
  kelipatan: '1 lembar',
  harga: 0,
  status: 'Active'
})

const formActive = ref(true)
const validationError = ref('')

watch(
  () => props.editData,
  (val) => {
    if (val) {
      form.value = {
        id: val.id,
        nama: val.nama,
        group: val.group,
        merk: val.merk,
        ukuran: val.ukuran,
        satuan: val.satuan,
        gramatur: val.gramatur,
        minOrder: val.minOrder,
        kelipatan: val.kelipatan,
        harga: val.harga,
        status: val.status
      }
      formActive.value = val.status === 'Active'
    } else {
      form.value = {
        nama: '',
        group: 'HVS Putih',
        merk: '',
        ukuran: '65x90 cm',
        satuan: 'lembar',
        gramatur: 80,
        minOrder: '1 lembar',
        kelipatan: '1 lembar',
        harga: 1000,
        status: 'Active'
      }
      formActive.value = true
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  validationError.value = ''
  if (!form.value.nama) {
    validationError.value = 'Nama kertas tidak boleh kosong.'
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
            {{ editData ? 'Edit Paper Price' : 'Add Paper Price' }}
          </h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body p-4">
            <p v-if="validationError" role="alert" class="mb-3 text-sm text-danger">{{ validationError }}</p>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Nama Kertas / Format <span class="text-danger">*</span></label>
                <input
                  v-model="form.nama"
                  type="text"
                  class="form-control"
                  required
                  placeholder="e.g. A4, Plano"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Group Kertas <span class="text-danger">*</span></label>
                <select v-model="form.group" class="form-select" required>
                  <option value="HVS Putih">HVS Putih</option>
                  <option value="Art Paper">Art Paper</option>
                  <option value="Art Carton">Art Carton</option>
                  <option value="Ivory">Ivory</option>
                  <option value="Duplex">Duplex</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label fw-semibold">Merk / Brand</label>
                <input
                  v-model="form.merk"
                  type="text"
                  class="form-control"
                  placeholder="e.g. Paperone, Sinar Mas"
                />
              </div>
              <div class="col-md-4">
                <label class="form-label fw-semibold">Ukuran (cm)</label>
                <input
                  v-model="form.ukuran"
                  type="text"
                  class="form-control"
                  placeholder="65x100 cm"
                />
              </div>
              <div class="col-md-4">
                <label class="form-label fw-semibold">Satuan <span class="text-danger">*</span></label>
                <select v-model="form.satuan" class="form-select">
                  <option value="lembar">Lembar Plano</option>
                  <option value="rim">Rim (500 lbr)</option>
                  <option value="kg">Kg</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label fw-semibold">Gramatur (GSM)</label>
                <input
                  v-model.number="form.gramatur"
                  type="number"
                  class="form-control"
                  placeholder="150"
                />
              </div>
              <div class="col-md-4">
                <label class="form-label fw-semibold">Min Order</label>
                <input
                  v-model="form.minOrder"
                  type="text"
                  class="form-control"
                  placeholder="1 rim / 1 lembar"
                />
              </div>
              <div class="col-md-4">
                <label class="form-label fw-semibold">Order Kelipatan</label>
                <input
                  v-model="form.kelipatan"
                  type="text"
                  class="form-control"
                  placeholder="1 rim / 10 lembar"
                />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold">Harga Satuan (Rp) <span class="text-danger">*</span></label>
                <input
                  v-model.number="form.harga"
                  type="number"
                  class="form-control"
                  required
                  placeholder="50000"
                />
              </div>
              <div class="col-md-6 d-flex align-items-center">
                <div class="form-check form-switch mt-4">
                  <input
                    v-model="formActive"
                    class="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="paperActiveSwitch"
                  />
                  <label class="form-check-label fw-semibold ms-2" for="paperActiveSwitch">
                    Status Aktif (Active)
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
              {{ editData ? 'Update Price' : 'Save Price' }}
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
  max-width: 750px;
  margin: 1rem;
}
</style>

