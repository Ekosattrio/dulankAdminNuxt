<script setup lang="ts">
import type { IncomeRecord, IncomeFormData } from '~/types/income'
import type { BankAccountView } from '#server/types/bank-account'
import { formatNumber } from '~/composables/useFormatters'

const props = defineProps<{
  isOpen: boolean
  editData: IncomeRecord | null
  viewOnly?: boolean
  categories: string[]
  accounts: BankAccountView[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: IncomeFormData): void
}>()

const form = ref<IncomeFormData>({
  date: '',
  name: '',
  category: 'Penjualan Jasa Cetak',
  notes: '',
  amount: 0,
  paymentMethod: 'Transfer Bank',
  bankAccountId: '',
  isCancelled: false
})

watch(
  () => props.editData,
  (val) => {
    if (val) {
      form.value = {
        id: val.id,
        no: val.no,
        date: val.date,
        name: val.name,
        category: val.category,
        notes: val.notes,
        amount: val.amount,
        paymentMethod: val.paymentMethod || 'Transfer Bank',
        bankAccountId: val.bankAccountId,
        isCancelled: Boolean(val.isCancelled)
      }
    } else {
      form.value = {
        date: new Date().toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        name: '',
        category: props.categories[0] || 'Penjualan Jasa Cetak',
        notes: '',
        amount: 0,
        paymentMethod: 'Transfer Bank',
        bankAccountId: props.accounts[0]?.id || '',
        isCancelled: false
      }
    }
  },
  { immediate: true }
)

const validationError = ref('')

const handleSubmit = () => {
  if (props.viewOnly) {
    emit('close')
    return
  }
  if (!form.value.name || !form.value.amount) {
    validationError.value = 'Nama pembayar dan nominal pemasukan harus diisi.'
    return
  }
  if (!form.value.bankAccountId) {
    validationError.value = 'Rekening / Akun Tujuan wajib dipilih.'
    return
  }
  validationError.value = ''
  emit('save', { ...form.value })
}
</script>

<template>
  <div v-if="isOpen" class="modal-backdrop-custom">
    <div class="modal-dialog-custom modal-lg">
      <div class="modal-content border-0 shadow-lg rounded-3">
        <div class="modal-header border-bottom px-4 py-3 bg-light">
          <h5 class="modal-title fs-5 fw-bold text-dark">
            <span v-if="viewOnly">Detail Pemasukan / Income</span>
            <span v-else-if="editData">Edit Catatan Pemasukan</span>
            <span v-else>Tambah Pemasukan Baru</span>
          </h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="modal-body p-4">
            <!-- View Only Display -->
            <div v-if="viewOnly && editData" class="row g-3">
              <div class="col-md-6">
                <span class="text-muted d-block small">No. Transaksi</span>
                <span class="fw-bold text-primary">{{ editData.no }}</span>
              </div>
              <div class="col-md-6">
                <span class="text-muted d-block small">Tanggal</span>
                <span>{{ editData.date }}</span>
              </div>
              <div class="col-md-6">
                <span class="text-muted d-block small">Nama Customer / Sumber</span>
                <span class="fw-bold">{{ editData.name }}</span>
              </div>
              <div class="col-md-6">
                <span class="text-muted d-block small">Kategori Pemasukan</span>
                <span class="badge bg-light text-dark border">{{ editData.category }}</span>
              </div>
              <div class="col-md-6">
                <span class="text-muted d-block small">Total Nominal</span>
                <span class="fs-5 fw-bold text-success font-monospace">Rp {{ formatNumber(editData.amount) }}</span>
              </div>
              <div class="col-md-6">
                <span class="text-muted d-block small">Metode Pembayaran</span>
                <span>{{ editData.paymentMethod }} ({{ editData.bankAccount || '-' }})</span>
              </div>
              <div class="col-12">
                <span class="text-muted d-block small">Catatan</span>
                <div class="p-3 bg-light rounded text-dark">{{ editData.notes || '-' }}</div>
              </div>
            </div>

            <!-- Form Mode -->
            <div v-else class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold">Kategori Pemasukan <span class="text-danger">*</span></label>
                <select v-model="form.category" class="form-select" required>
                  <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                  <option v-if="categories.length === 0" value="Penjualan Jasa Cetak">Penjualan Jasa Cetak</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Tanggal <span class="text-danger">*</span></label>
                <input v-model="form.date" type="text" class="form-control" placeholder="DD/MM/YYYY" required />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Nama Customer / Penyetor <span class="text-danger">*</span></label>
                <input v-model="form.name" type="text" class="form-control" placeholder="e.g. Budi Santoso" required />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Nominal Pemasukan (IDR) <span class="text-danger">*</span></label>
                <input v-model.number="form.amount" type="number" min="0" class="form-control" required />
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Metode Pembayaran</label>
                <select v-model="form.paymentMethod" class="form-select">
                  <option value="Transfer Bank">Transfer Bank</option>
                  <option value="Tunai / Cash">Tunai / Cash</option>
                  <option value="QRIS">QRIS</option>
                </select>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-semibold">Rekening / Akun Tujuan</label>
                <select v-model="form.bankAccountId" class="form-select" required>
                  <option disabled value="">Pilih rekening</option>
                  <option v-for="account in accounts" :key="account.id" :value="account.id">
                    {{ account.bankName }} {{ account.accountNo }} - {{ account.accountName }}
                  </option>
                </select>
              </div>

              <div class="col-12">
                <label class="form-label fw-semibold">Keterangan / Notes</label>
                <textarea v-model="form.notes" class="form-control" rows="3" placeholder="Rincian sumber pemasukan..."></textarea>
              </div>
            </div>
          </div>

          <p v-if="validationError" role="alert" class="mx-4 mb-0 text-sm text-danger">{{ validationError }}</p>
          <div class="modal-footer border-top px-4 py-3 bg-light">
            <button type="button" class="btn btn-secondary px-4" @click="emit('close')">
              {{ viewOnly ? 'Tutup' : 'Batal' }}
            </button>
            <button v-if="!viewOnly" type="submit" class="btn btn-primary px-4">
              {{ editData ? 'Update Income' : 'Simpan Income' }}
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
  max-width: 650px;
  margin: 1rem;
}
</style>

