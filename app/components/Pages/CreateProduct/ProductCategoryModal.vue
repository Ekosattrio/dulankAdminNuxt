<script setup lang="ts">
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import {
  formControlClass,
  modalFormInputColClass,
  modalFormLabelClass,
  modalFormRowClass,
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  busy?: boolean
  title?: string
  label?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  close: []
  submit: [name: string]
}>()

const categoryName = ref('')

watch(
  () => props.open,
  (val) => {
    if (val) categoryName.value = ''
  },
)

function handleSubmit() {
  const trimmed = categoryName.value.trim()
  if (trimmed) {
    emit('submit', trimmed)
  }
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="title || 'Add New Category'"
    :busy="busy"
    @close="$emit('close')"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">{{ label || 'Category Name' }} <span class="text-red-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="categoryName"
            type="text"
            required
            :placeholder="placeholder || 'e.g. Digital Printing'"
            :class="formControlClass"
            :disabled="busy"
          />
        </div>
      </div>

      <div class="flex justify-end gap-2.5 border-t border-gray-200 pt-4 dark:border-gray-700">
        <button
          type="button"
          class="min-w-24 rounded-md bg-[#212b36] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#092c4c] focus:outline-none"
          :disabled="busy"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="min-w-24 rounded-md bg-[#ff9f43] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#f39334] focus:outline-none disabled:opacity-50"
          :disabled="busy || !categoryName.trim()"
        >
          {{ busy ? 'Saving...' : 'Submit' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>
