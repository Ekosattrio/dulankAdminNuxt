<script setup lang="ts">
import type { IncentiveItem, IncentiveFormData } from '~/types/incentive'

const props = defineProps<{
  isOpen: boolean
  editData: IncentiveItem | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: IncentiveFormData): void
}>()

const form = ref<IncentiveFormData>({
  employee: '',
  period: '2025-08',
  qtyComplete: 1,
  totalAmount: 50000,
  status: 'Pending'
})

watch(
  () => props.editData,
  (val) => {
    if (val) {
      form.value = {
        id: val.id,
        code: val.code,
        employee: val.employee,
        period: val.period,
        qtyComplete: val.qtyComplete,
        totalAmount: val.totalAmount,
        status: val.status
      }
    } else {
      form.value = {
        employee: '',
        period: '2025-08',
        qtyComplete: 1,
        totalAmount: 50000,
        status: 'Pending'
      }
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  if (!form.value.employee) {
    alert('Nama karyawan harus diisi')
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
            {{ editData ? 'Edit Data Insentif' : 'Tambah Rekap Insentif Karyawan' }}
          </h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="form-label fw-semibold">Nama Karyawan <span class="text-danger">*</span></label>
              <input v-model="form.employee" type="text" class="form-control" required placeholder="e.g. Budi Santoso" />
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Periode (YYYY-MM)</label>
                <input v-model="form.period" type="text" class="form-control" placeholder="2025-08" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Qty Selesai (Job Count)</label>
                <input v-model.number="form.qtyComplete" type="number" min="1" class="form-control" required />
              </div>
            </div>

            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label fw-semibold">Total Insentif (Rp) <span class="text-danger">*</span></label>
                <input v-model.number="form.totalAmount" type="number" min="0" class="form-control" required />
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
            <button type="submit" class="btn btn-primary px-4">
              {{ editData ? 'Update Insentif' : 'Simpan Insentif' }}
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

