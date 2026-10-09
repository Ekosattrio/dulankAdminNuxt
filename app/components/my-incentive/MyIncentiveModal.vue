<script setup lang="ts">
import type { MyIncentive, MyIncentiveFormData } from '~/types/my-incentive'

const props = defineProps<{
  isOpen: boolean
  editData: MyIncentive | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: MyIncentiveFormData): void
}>()

const form = ref<MyIncentiveFormData>({
  process: '',
  date: '',
  qty: 1,
  amount: 0,
  status: 'Pending'
})
const validationError = ref('')

watch(
  () => props.editData,
  (val) => {
    if (val) {
      form.value = {
        id: val.id,
        code: val.code,
        process: val.process,
        date: val.date,
        qty: val.qty,
        amount: val.amount,
        status: val.status
      }
    } else {
      form.value = {
        process: 'Printing',
        date: new Date().toISOString().split('T')[0],
        qty: 1,
        amount: 25000,
        status: 'Pending'
      }
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  validationError.value = ''
  if (!form.value.process) {
    validationError.value = 'Pilih atau isi proses pekerjaan.'
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
            {{ editData ? 'Edit Data Insentif' : 'Tambah Klaim Insentif' }}
          </h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body p-4">
            <p v-if="validationError" role="alert" class="mb-3 text-sm text-danger">{{ validationError }}</p>
            <div class="mb-3">
              <label class="form-label fw-semibold">Proses / Pekerjaan <span class="text-danger">*</span></label>
              <select v-model="form.process" class="form-select" required>
                <option value="Printing">Printing</option>
                <option value="Cutting">Cutting / Potong</option>
                <option value="Laminasi">Laminasi</option>
                <option value="Pond / Die-Cut">Pond / Die-Cut</option>
                <option value="Finishing & Packing">Finishing & Packing</option>
              </select>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Tanggal</label>
                <input v-model="form.date" type="date" class="form-control" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Jumlah (Qty/Druk)</label>
                <input v-model.number="form.qty" type="number" min="1" class="form-control" required />
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Nominal Insentif (Rp)</label>
                <input v-model.number="form.amount" type="number" min="0" class="form-control" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Status Pembayaran</label>
                <select v-model="form.status" class="form-select">
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>
          </div>

          <div class="modal-footer border-top px-4 py-3 bg-light">
            <button type="button" class="btn btn-secondary px-4" @click="emit('close')">Batal</button>
            <button type="submit" class="btn btn-primary px-4">Simpan</button>
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

