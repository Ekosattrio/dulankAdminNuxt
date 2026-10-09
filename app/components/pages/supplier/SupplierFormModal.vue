<script setup lang="ts">
import type { Supplier, SupplierFormData } from '#server/types/supplier'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import {
  formControlClass,
  modalFormInputColClass,
  modalFormLabelClass,
  modalFormRowClass,
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  isEdit: boolean
  supplierData: Supplier | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [formData: SupplierFormData]
}>()

const statusOptions = ['Active', 'Inactive']

const form = ref<SupplierFormData>({
  id: '',
  supplierId: '',
  name: '',
  email: '',
  contact: '',
  picName: '',
  status: 'Active',
})

const errorMessage = ref('')

watch(
  () => props.supplierData,
  (val) => {
    if (val && props.isEdit) {
      form.value = {
        id: val.id,
        supplierId: val.supplierId || val.id,
        name: val.name,
        email: val.email,
        contact: val.contact || '',
        picName: val.picName || '',
        status: val.status || 'Active',
      }
    } else {
      form.value = {
        id: '',
        supplierId: 'Auto Generated',
        name: '',
        email: '',
        contact: '',
        picName: '',
        status: 'Active',
      }
    }
    errorMessage.value = ''
  },
  { immediate: true },
)

function handleSubmit() {
  if (!form.value.name.trim()) {
    errorMessage.value = 'Supplier name is required'
    return
  }
  if (!form.value.email.trim()) {
    errorMessage.value = 'Supplier email is required'
    return
  }
  errorMessage.value = ''
  emit('submit', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="isEdit ? 'Edit Supplier' : 'Add New Supplier'"
    medium
    :busy="busy"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div v-if="errorMessage" class="rounded-lg bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
        {{ errorMessage }}
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Supplier ID</label>
        <div :class="modalFormInputColClass">
          <input
            type="text"
            :value="form.supplierId || 'Auto Generated'"
            disabled
            :class="[formControlClass, 'bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed']"
          >
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Supplier Name <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.name"
            type="text"
            placeholder="Enter supplier company name"
            :class="formControlClass"
            required
          >
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Email <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.email"
            type="email"
            placeholder="Enter email address"
            :class="formControlClass"
            required
          >
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Contact Number</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.contact"
            type="text"
            placeholder="Enter phone or mobile number"
            :class="formControlClass"
          >
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">PIC Name</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.picName"
            type="text"
            placeholder="Enter PIC contact person name"
            :class="formControlClass"
          >
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Status</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.status" :class="formControlClass">
            <option v-for="opt in statusOptions" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
        </div>
      </div>
    </form>

    <template #footer>
      <button
        type="button"
        class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
        @click="emit('close')"
      >
        Cancel
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 disabled:opacity-50"
        :disabled="busy"
        @click="handleSubmit"
      >
        <span v-if="busy" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        <span>{{ isEdit ? 'Update Supplier' : 'Save Supplier' }}</span>
      </button>
    </template>
  </SalesDialog>
</template>
