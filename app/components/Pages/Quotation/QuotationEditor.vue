<script setup lang="ts">
import type { Quotation, QuotationFormData } from '#server/types/quotation'
import CurrencyInput from '~/components/Common/CurrencyInput.vue'

const props = defineProps<{
  isOpen: boolean
  busy?: boolean
  error?: string
  isEdit: boolean
  editData?: Quotation | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', form: QuotationFormData): void
}>()

const formId = useId()

const form = reactive<QuotationFormData>({
  id: '',
  noQuotation: '',
  customer: '',
  email: '',
  status: 'Send',
  total: 0,
  channel: 'Online',
  dueDate: '',
})

watch(
  () => [props.editData, props.isOpen] as const,
  ([val]) => {
    if (val && props.isEdit) {
      form.id = val.id
      form.noQuotation = val.noQuotation
      form.customer = val.customer
      form.email = val.email
      form.status = val.status
      form.total = val.total
      form.channel = val.channel
      form.dueDate = val.dueDate
    } else {
      const now = new Date()
      const due = new Date()
      due.setDate(due.getDate() + 30)
      const dueStr = `${String(due.getDate()).padStart(2, '0')}/${String(due.getMonth() + 1).padStart(2, '0')}/${due.getFullYear()}`

      form.id = ''
      form.noQuotation = ''
      form.customer = ''
      form.email = ''
      form.status = 'Send'
      form.total = 0
      form.channel = 'Online'
      form.dueDate = dueStr
    }
  },
  { immediate: true },
)

const handleSubmit = () => {
  emit('submit', { ...form })
}
</script>
<template>
  <SalesDialog
    :open="isOpen"
    :title="isEdit ? 'Edit Quotation List' : 'Add New Quotation'"
    :busy="busy"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit">
      <p v-if="error" role="alert" class="mb-4 text-sm text-red-600">{{ error }}</p>
      <fieldset :disabled="busy" class="min-w-0 disabled:opacity-60">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-12 gap-4">
          <div v-if="isEdit" class="md:col-span-12">
            <label
              class="mb-2 block text-sm font-medium text-xs font-semibold text-gray-500 dark:text-gray-400"
              :for="formId + '-field-0'"
              >No Quotation</label
            >
            <input
              :id="formId + '-field-0'"
              :value="form.noQuotation"
              type="text"
              class="block w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-800"
              disabled
            />
          </div>

          <div class="md:col-span-12">
            <label
              class="mb-2 block text-sm font-medium text-xs font-semibold text-gray-500 dark:text-gray-400"
              :for="formId + '-field-1'"
              >Customer Name <span class="text-danger">*</span></label
            >
            <input
              :id="formId + '-field-1'"
              v-model="form.customer"
              type="text"
              class="block w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              placeholder="e.g. PT Semesta Digital"
              required
            />
          </div>

          <div class="md:col-span-12">
            <label
              class="mb-2 block text-sm font-medium text-xs font-semibold text-gray-500 dark:text-gray-400"
              :for="formId + '-field-2'"
              >Customer Email <span class="text-danger">*</span></label
            >
            <input
              :id="formId + '-field-2'"
              v-model="form.email"
              type="email"
              class="block w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              placeholder="email@example.com"
              required
            />
          </div>

          <div class="md:col-span-6">
            <label
              class="mb-2 block text-sm font-medium text-xs font-semibold text-gray-500 dark:text-gray-400"
              :for="formId + '-field-3'"
              >Total Amount (IDR) <span class="text-danger">*</span></label
            >
            <CurrencyInput
              :id="formId + '-field-3'"
              v-model="form.total"
              thousand-separator="."
              :min="0"
              placeholder="0"
              required
            />
          </div>

          <div class="md:col-span-6">
            <label
              class="mb-2 block text-sm font-medium text-xs font-semibold text-gray-500 dark:text-gray-400"
              :for="formId + '-field-4'"
              >Channel</label
            >
            <select
              :id="formId + '-field-4'"
              v-model="form.channel"
              class="block w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="Online">Online</option>
              <option value="Sales Staff">Sales Staff</option>
              <option value="Offline">Offline</option>
            </select>
          </div>

          <div class="md:col-span-6">
            <label
              class="mb-2 block text-sm font-medium text-xs font-semibold text-gray-500 dark:text-gray-400"
              :for="formId + '-field-5'"
              >Status</label
            >
            <select
              :id="formId + '-field-5'"
              v-model="form.status"
              class="block w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              <option value="Send">Send</option>
              <option value="Ordered">Ordered</option>
              <option value="Complete">Complete</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div class="md:col-span-6">
            <label
              class="mb-2 block text-sm font-medium text-xs font-semibold text-gray-500 dark:text-gray-400"
              :for="formId + '-field-6'"
              >Due Date (DD/MM/YYYY) <span class="text-danger">*</span></label
            >
            <input
              :id="formId + '-field-6'"
              v-model="form.dueDate"
              type="text"
              class="block w-full rounded border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              placeholder="DD/MM/YYYY"
              required
            />
          </div>
        </div>

        <!-- Footer -->
        <div class="justify-end p-0 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 border-gray-800 bg-gray-800 text-white hover:bg-gray-700"
            @click="emit('close')"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="inline-flex items-center justify-center rounded border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 border-primary bg-primary text-white hover:bg-primary/90 px-4 font-semibold"
          >
            {{ isEdit ? 'Save Changes' : 'Create Quotation' }}
          </button>
        </div>
      </fieldset>
    </form>
  </SalesDialog>
</template>
