<script setup lang="ts">
import type { CustomField, CustomFieldInput } from '#server/types/custom-fields'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import { modalFormRowClass, modalFormLabelClass, modalFormInputColClass, formControlClass } from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  field: CustomField | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [payload: CustomFieldInput]
}>()

const form = ref<CustomFieldInput>({
  module: 'Expense',
  label: '',
  type: 'Text',
  defaultValue: '',
  required: true,
  disabled: false,
  status: 'Active'
})

watch(() => props.field, (val) => {
  if (val) {
    form.value = {
      module: val.module,
      label: val.label,
      type: val.type,
      defaultValue: val.defaultValue,
      required: val.required,
      disabled: val.disabled,
      status: val.status
    }
  } else {
    form.value = {
      module: 'Expense',
      label: '',
      type: 'Text',
      defaultValue: '',
      required: true,
      disabled: false,
      status: 'Active'
    }
  }
}, { immediate: true })

function handleSubmit() {
  emit('submit', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="field ? 'Edit Custom Field' : 'Tambah Custom Field'"
    max-width="md"
    @close="emit('close')"
  >
    <form class="space-y-4 py-2" @submit.prevent="handleSubmit">
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Modul</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.module" :class="formControlClass">
            <option value="Expense">Expense</option>
            <option value="Transaction">Transaction</option>
            <option value="Customer">Customer</option>
            <option value="Product">Product</option>
          </select>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Label Field</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.label"
            type="text"
            required
            placeholder="Contoh: NPWP Perusahaan"
            :class="formControlClass"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Tipe Data</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.type" :class="formControlClass">
            <option value="Text">Text</option>
            <option value="Textarea">Textarea</option>
            <option value="Number">Number</option>
            <option value="Select">Select</option>
            <option value="Date">Date</option>
          </select>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Nilai Default</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.defaultValue"
            type="text"
            placeholder="Nilai awal field"
            :class="formControlClass"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Wajib Diisi (Required)</label>
        <div :class="modalFormInputColClass" class="flex items-center gap-2">
          <input
            v-model="form.required"
            type="checkbox"
            id="field-required"
            class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label for="field-required" class="text-xs text-gray-700 dark:text-gray-300">Wajib diisi saat submit form</label>
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
          {{ busy ? 'Menyimpan...' : 'Simpan Field' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>

