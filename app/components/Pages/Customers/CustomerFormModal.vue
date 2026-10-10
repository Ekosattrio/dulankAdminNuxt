<script setup lang="ts">
import type { Customer, CustomerFormData } from '#server/types/customer'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import {
  formControlClass,
  modalFormInputColClass,
  modalFormLabelClass,
  modalFormRowClass,
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  isEdit: boolean
  customerData: Customer | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [formData: CustomerFormData]
}>()

const typeOptions = [
  'Reguler',
  'Standard',
  'Premium',
]

const form = ref<CustomerFormData>({
  id: '',
  customerId: '',
  name: '',
  email: '',
  type: 'General',
  phone: '',
})

const errorMessage = ref('')

watch(
  () => props.customerData,
  (val) => {
    if (val && props.isEdit) {
      form.value = {
        id: val.id,
        customerId: val.customerId,
        name: val.name,
        email: val.email,
        type: val.type || 'Standard',
        phone: val.phone || '',
      }
    } else {
      form.value = {
        id: '',
        customerId: 'Auto Generated',
        name: '',
        email: '',
        type: 'Standard',
        phone: '',
      }
    }
    errorMessage.value = ''
  },
  { immediate: true },
)

function handleSubmit() {
  if (!form.value.name.trim()) {
    errorMessage.value = 'Customer name is required'
    return
  }
  if (!form.value.email.trim()) {
    errorMessage.value = 'Customer email is required'
    return
  }
  errorMessage.value = ''
  emit('submit', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="isEdit ? 'Edit Customer' : 'Add Customer'"
    medium
    :busy="busy"
    @close="$emit('close')"
  >
    <form class="space-y-4 p-6" @submit.prevent="handleSubmit">
      <div v-if="errorMessage" class="rounded-md bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-400">
        {{ errorMessage }}
      </div>

      <!-- Customer ID -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Customer ID</label>
        <div :class="modalFormInputColClass">
          <input
            :value="form.customerId"
            type="text"
            disabled
            :class="[formControlClass, 'bg-gray-100 text-gray-500 cursor-not-allowed dark:bg-gray-800 dark:text-gray-400']"
          />
        </div>
      </div>

      <!-- Customer Type -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Customer Type</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.type" :class="formControlClass">
            <option v-for="opt in typeOptions" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
        </div>
      </div>

      <!-- Customer Name -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Customer Name <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.name"
            type="text"
            placeholder="e.g. Aditya Pratama"
            required
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Email -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Email <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.email"
            type="email"
            placeholder="e.g. customer@example.com"
            required
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Contact Number -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Contact Number</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.phone"
            type="text"
            placeholder="e.g. +6281234567890"
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          class="rounded-md border border-gray-300 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          :disabled="busy"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="rounded-md bg-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          :disabled="busy"
        >
          <span v-if="busy">Saving...</span>
          <span v-else>Submit</span>
        </button>
      </div>
    </form>
  </SalesDialog>
</template>
