<script setup lang="ts">
import type { TaxRateItem, TaxRateInput } from '#server/types/tax-rates'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import { modalFormRowClass, modalFormLabelClass, modalFormInputColClass, formControlClass } from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  tax: TaxRateItem | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [payload: TaxRateInput]
}>()

const form = ref<TaxRateInput>({
  name: '',
  rate: 11,
  status: 'Active'
})

watch(() => props.tax, (val) => {
  if (val) {
    form.value = {
      name: val.name,
      rate: val.rate,
      status: val.status
    }
  } else {
    form.value = {
      name: '',
      rate: 11,
      status: 'Active'
    }
  }
}, { immediate: true })

function handleSubmit() {
  emit('submit', {
    name: form.value.name,
    rate: Number(form.value.rate),
    status: form.value.status
  })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="tax ? 'Edit Tarif Pajak' : 'Tambah Tarif Pajak Baru'"
    max-width="md"
    @close="emit('close')"
  >
    <form class="space-y-4 py-2" @submit.prevent="handleSubmit">
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Nama Pajak</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="Contoh: PPN 12%"
            :class="formControlClass"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Tarif Persentase (%)</label>
        <div :class="modalFormInputColClass">
          <input
            v-model.number="form.rate"
            type="number"
            min="0"
            max="100"
            step="0.01"
            required
            placeholder="12"
            :class="formControlClass"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Status</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.status" :class="formControlClass">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
        <button
          type="button"
          class="h-9 rounded-md border border-gray-300 px-4 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
          :disabled="busy"
          @click="emit('close')"
        >
          Batal
        </button>
        <button
          type="submit"
          class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-xs font-semibold text-white shadow hover:bg-primary/90 disabled:opacity-50"
          :disabled="busy"
        >
          {{ busy ? 'Menyimpan...' : 'Simpan Pajak' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>

