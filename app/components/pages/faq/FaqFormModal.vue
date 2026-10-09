<script setup lang="ts">
import type { FaqItem, FaqFormData } from '#server/types/faq'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import {
  formControlClass,
  modalFormInputColClass,
  modalFormLabelClass,
  modalFormRowClass,
} from '~/utils/salesUi'

import { useFaqCategories } from '~/composables/useFaqCategories'

const props = defineProps<{
  open: boolean
  isEdit: boolean
  faqData: FaqItem | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [formData: FaqFormData]
}>()

const { categories: fetchedCategories } = useFaqCategories()

const defaultCategories = ['General', 'Features', 'Hardware', 'Printing', 'Payment', 'Fitur', 'Percetakan', 'Umum']
const availableCategories = computed(() => {
  const fromDb = (fetchedCategories.value || []).map(c => c.name)
  return Array.from(new Set([...fromDb, ...defaultCategories]))
})

const form = ref<FaqFormData>({
  id: '',
  question: '',
  category: 'General',
  answer: '',
  status: 'Active',
  order: 1,
})

const errorMessage = ref('')

watch(
  () => props.faqData,
  (val) => {
    if (val && props.isEdit) {
      form.value = {
        id: val.id,
        question: val.question,
        category: val.category || 'General',
        answer: val.answer,
        status: val.status || 'Active',
        order: val.order || 1,
      }
    } else {
      form.value = {
        id: '',
        question: '',
        category: 'General',
        answer: '',
        status: 'Active',
        order: 1,
      }
    }
    errorMessage.value = ''
  },
  { immediate: true },
)

function handleSubmit() {
  if (!form.value.question.trim()) {
    errorMessage.value = 'Pertanyaan (question) wajib diisi'
    return
  }
  if (!form.value.answer.trim()) {
    errorMessage.value = 'Jawaban (answer) wajib diisi'
    return
  }
  errorMessage.value = ''
  emit('submit', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="isEdit ? 'Edit FAQ' : 'Add FAQ'"
    medium
    :busy="busy"
    @close="$emit('close')"
  >
    <form class="space-y-4 p-6" @submit.prevent="handleSubmit">
      <div v-if="errorMessage" class="rounded-md bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-400">
        {{ errorMessage }}
      </div>

      <!-- Question -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Question <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.question"
            type="text"
            placeholder="e.g. Apakah sistem mendukung pembayaran QRIS?"
            required
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Category -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Category <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <select v-model="form.category" :class="formControlClass">
            <option v-for="cat in availableCategories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
      </div>

      <!-- Answer -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Answer <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <textarea
            v-model="form.answer"
            rows="4"
            placeholder="Jelaskan jawaban secara rinci..."
            required
            :class="formControlClass"
          ></textarea>
        </div>
      </div>

      <!-- Status & Order -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select v-model="form.status" :class="formControlClass">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Display Order</label>
          <input
            v-model.number="form.order"
            type="number"
            min="1"
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
