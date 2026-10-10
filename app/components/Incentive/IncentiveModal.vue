<script setup lang="ts">
import type { IncentiveItem, IncentiveFormData } from '#server/types/incentive'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import CurrencyInput from '~/components/Common/CurrencyInput.vue'
import { formControlClass, modalFormRowClass, modalFormLabelClass, modalFormInputColClass } from '~/utils/salesUi'

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
    return
  }
  emit('save', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="isOpen"
    :title="editData ? 'Edit Data Insentif' : 'Tambah Rekap Insentif Karyawan'"
    size="md"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Nama Karyawan <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.employee"
            type="text"
            :class="formControlClass"
            required
            placeholder="e.g. Budi Santoso"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Periode (YYYY-MM)</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.period"
            type="text"
            :class="formControlClass"
            placeholder="2025-08"
            required
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Qty Selesai (Job Count)</label>
        <div :class="modalFormInputColClass">
          <input
            v-model.number="form.qtyComplete"
            type="number"
            min="1"
            :class="formControlClass"
            required
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Total Insentif (Rp) <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <CurrencyInput
            v-model="form.totalAmount"
            placeholder="50.000"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Status Pembayaran</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.status" :class="formControlClass">
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          class="h-9 px-4 rounded-md border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          @click="emit('close')"
        >
          Batal
        </button>
        <button
          type="submit"
          class="h-9 px-4 rounded-md bg-primary text-sm font-semibold text-white shadow hover:bg-primary/90"
        >
          {{ editData ? 'Update Insentif' : 'Simpan Insentif' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>
