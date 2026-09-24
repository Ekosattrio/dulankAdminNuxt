<script setup lang="ts">
import type { Expense, ExpenseFormData } from '~/types/expense'

const props = defineProps<{
  isOpen: boolean
  editData: Expense | null
  viewOnly?: boolean
  categories: string[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: ExpenseFormData): void
}>()

const form = ref<ExpenseFormData>({
  date: '',
  category: 'Biaya Gaji & Upah',
  name: '',
  status: 'Paid',
  amount: 0,
  paid: 0,
  due: 0,
  description: ''
})

const recalcDue = () => {
  form.value.due = Math.max(0, Number(form.value.amount || 0) - Number(form.value.paid || 0))
  if (form.value.due === 0 && form.value.amount > 0) {
    form.value.status = 'Paid'
  } else if (form.value.paid > 0) {
    form.value.status = 'Partial'
  } else {
    form.value.status = 'Unpaid'
  }
}

watch(
  () => props.editData,
  (val) => {
    if (val) {
      form.value = {
        id: val.id,
        noExpense: val.noExpense,
        date: val.date,
        category: val.category,
        name: val.name,
        status: val.status,
        amount: val.amount,
        paid: val.paid,
        due: val.due,
        description: val.description
      }
    } else {
      form.value = {
        date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        category: props.categories[0] || 'Biaya Operasional',
        name: '',
        status: 'Unpaid',
        amount: 0,
        paid: 0,
        due: 0,
        description: ''
      }
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  if (props.viewOnly) {
    emit('close')
    return
  }
  if (!form.value.name || !form.value.amount) {
    alert('Nama penerima / vendor dan amount harus diisi')
    return
  }
  recalcDue()
  emit('save', { ...form.value })
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop-custom">
    <div class="modal-dialog-custom modal-lg">
      <div class="modal-content border-0 shadow-lg rounded-3">
        <div class="modal-header border-bottom px-4 py-3 bg-light">
          <h5 class="modal-title fs-5 fw-bold text-dark">
            <span v-if="viewOnly">Detail Pengeluaran (Expense)</span>
            <span v-else-if="editData">Edit Pengeluaran</span>
            <span v-else>Tambah Pengeluaran Baru</span>
          </h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body p-4">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Expense Category <span class="text-danger">*</span></label>
                <select v-model="form.category" class="form-select" :disabled="viewOnly" required>
                  <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                  <option v-if="categories.length === 0" value="General">General</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Tanggal Transaksi <span class="text-danger">*</span></label>
                <input
                  v-model="form.date"
                  type="text"
                  class="form-control"
                  placeholder="DD/MM/YYYY"
                  :disabled="viewOnly"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Vendor / Penerima / Person <span class="text-danger">*</span></label>
                <input
                  v-model="form.name"
                  type="text"
                  class="form-control"
                  placeholder="e.g. Toko Berkah, PLN, Supir"
                  :disabled="viewOnly"
                  required
                />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Status Pembayaran</label>
                <select v-model="form.status" class="form-select" :disabled="viewOnly">
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Partial">Partial</option>
                  <option value="Canceled">Canceled</option>
                </select>
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold">Total Amount (Rp) <span class="text-danger">*</span></label>
                <input
                  v-model.number="form.amount"
                  type="number"
                  min="0"
                  class="form-control"
                  :disabled="viewOnly"
                  @input="recalcDue"
                  required
                />
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold">Jumlah Dibayar (Paid Rp)</label>
                <input
                  v-model.number="form.paid"
                  type="number"
                  min="0"
                  class="form-control"
                  :disabled="viewOnly"
                  @input="recalcDue"
                />
              </div>

              <div class="col-md-4">
                <label class="form-label fw-semibold">Sisa Tagihan (Due Rp)</label>
                <input
                  :value="form.due"
                  type="number"
                  class="form-control bg-light"
                  readonly
                />
              </div>

              <div class="col-12">
                <label class="form-label fw-semibold">Keterangan / Description</label>
                <textarea
                  v-model="form.description"
                  class="form-control"
                  rows="3"
                  placeholder="Rincian pengeluaran..."
                  :disabled="viewOnly"
                ></textarea>
              </div>
            </div>
          </div>

          <div class="modal-footer border-top px-4 py-3 bg-light">
            <button type="button" class="btn btn-secondary px-4" @click="emit('close')">
              {{ viewOnly ? 'Tutup' : 'Batal' }}
            </button>
            <button v-if="!viewOnly" type="submit" class="btn btn-primary px-4">
              {{ editData ? 'Update Expense' : 'Simpan Expense' }}
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

