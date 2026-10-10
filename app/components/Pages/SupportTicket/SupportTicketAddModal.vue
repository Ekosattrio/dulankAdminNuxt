<script setup lang="ts">
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import {
  modalFormRowClass,
  modalFormLabelClass,
  modalFormInputColClass,
  formControlClass
} from '~/utils/salesUi'

const props = defineProps<{
  show: boolean
  busy?: boolean
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
  submit: [formData: {
    customerName: string
    email: string
    phone: string
    address: string
    city: string
    country: string
    descriptions: string
  }]
}>()

const form = ref({
  customerName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: 'United Kingdom',
  descriptions: ''
})

const countryOptions = ['United Kingdom', 'United States', 'Indonesia', 'Singapore', 'Malaysia']

function resetForm() {
  form.value = {
    customerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'United Kingdom',
    descriptions: ''
  }
}

function handleClose() {
  emit('update:show', false)
  resetForm()
}

function handleSubmit() {
  emit('submit', { ...form.value })
  handleClose()
}
</script>

<template>
  <SalesDialog
    :open="show"
    title="Add Support Ticket"
    medium
    :busy="busy"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="flex items-center gap-4 pb-2 border-b border-gray-100 dark:border-gray-800">
        <div class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-400">
          <FeatherIcon name="plus-circle" class="w-6 h-6" />
        </div>
        <div>
          <label class="text-xs font-semibold text-gray-700 dark:text-gray-300">Customer Avatar</label>
          <p class="text-xs text-gray-500">Upload profile image (optional)</p>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">
          Customer Name <span class="text-rose-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.customerName"
            type="text"
            required
            placeholder="Enter customer name..."
            :class="formControlClass"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">
          Email <span class="text-rose-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="customer@email.com"
            :class="formControlClass"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Phone</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.phone"
            type="text"
            placeholder="+62 812 3456 7890"
            :class="formControlClass"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Address</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.address"
            type="text"
            placeholder="Street address..."
            :class="formControlClass"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">City</label>
          <input
            v-model="form.city"
            type="text"
            placeholder="City"
            :class="formControlClass"
          />
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Country</label>
          <select v-model="form.country" :class="formControlClass">
            <option v-for="c in countryOptions" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
          Descriptions <span class="text-rose-500">*</span>
        </label>
        <textarea
          v-model="form.descriptions"
          rows="3"
          required
          maxlength="300"
          placeholder="Detailed problem description..."
          class="w-full text-xs rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2.5 focus:ring-1 focus:ring-amber-500 focus:outline-none"
        ></textarea>
        <p class="text-xs text-gray-400 mt-1">Maximum 300 Characters</p>
      </div>

      <div class="flex items-center justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          class="h-9 px-4 rounded-md text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 transition-colors"
          @click="handleClose"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="h-9 px-5 rounded-md text-xs font-medium text-white bg-amber-500 hover:bg-amber-600 transition-colors shadow-xs"
        >
          Submit
        </button>
      </div>
    </form>
  </SalesDialog>
</template>
