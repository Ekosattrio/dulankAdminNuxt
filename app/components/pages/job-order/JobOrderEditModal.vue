<script setup lang="ts">
import type { JobOrder, JobOrderFormData } from '#server/types/job-order'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import {
  formControlClass,
  modalFormInputColClass,
  modalFormLabelClass,
  modalFormRowClass,
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  order: JobOrder | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [form: JobOrderFormData]
}>()

const form = ref<JobOrderFormData>({
  customer: '',
  product: '',
  jobTitle: '',
  dueDate: '',
  priority: 'High',
  status: 'Waiting',
  workflowCategory: 'Cetak',
})
const qty = ref('500')

watch(
  () => props.order,
  (val) => {
    if (val) {
      form.value = {
        id: val.id,
        no: val.no,
        customer: val.customer,
        product: val.product,
        jobTitle: val.jobTitle,
        dueDate: val.dueDate,
        priority: val.priority,
        status: val.status,
        workflowCategory: val.workflowCategory,
        workflowType: val.workflowType,
      }
      qty.value = '500'
    }
  },
  { immediate: true },
)

function handleSubmit() {
  emit('submit', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="open"
    title="Edit Job Order"
    medium
    :busy="busy"
    @close="$emit('close')"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <!-- Customer -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Customer</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.customer"
            type="text"
            required
            placeholder="Search Customer"
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Product -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Product</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.product"
            type="text"
            required
            placeholder="Product Name"
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Job Title -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Job Title</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.jobTitle"
            type="text"
            required
            placeholder="Job Title"
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Qty -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Qty</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="qty"
            type="text"
            inputmode="numeric"
            placeholder="Qty"
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="flex justify-end gap-2.5 border-t border-gray-200 pt-4 dark:border-gray-700">
        <button
          type="button"
          class="min-w-24 rounded-md bg-[#212b36] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#092c4c] focus:outline-none"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="busy"
          class="min-w-24 rounded-md bg-[#ff9f43] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#f39334] focus:outline-none disabled:opacity-50"
        >
          {{ busy ? 'Saving...' : 'Submit' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>
