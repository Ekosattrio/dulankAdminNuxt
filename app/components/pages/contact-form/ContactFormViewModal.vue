<script setup lang="ts">
import type { ContactFormItem } from '#server/types/contact-form'
import SalesDialog from '~/components/sales/SalesDialog.vue'

const props = defineProps<{
  show: boolean
  contact: ContactFormItem | null
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
}>()

function handleClose() {
  emit('update:show', false)
}
</script>

<template>
  <SalesDialog
    :model-value="show"
    title="Contact Message Details"
    max-width="max-w-lg"
    @update:model-value="emit('update:show', $event)"
  >
    <div v-if="contact" class="space-y-4">
      <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between mb-2">
          <h5 class="text-sm font-bold text-gray-900 dark:text-gray-100">{{ contact.name }}</h5>
          <span class="text-xs text-gray-500">{{ contact.date }}</span>
        </div>
        <p class="text-xs text-gray-600 dark:text-gray-400">
          <span class="font-medium">Email:</span> {{ contact.email }}
        </p>
        <p class="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
          <span class="font-medium">Phone:</span> {{ contact.phone }}
        </p>
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          Subject
        </label>
        <p class="text-xs font-medium text-gray-800 dark:text-gray-200">
          {{ contact.subject || 'General Inquiry' }}
        </p>
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
          Message
        </label>
        <div class="text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded-md border border-gray-200 dark:border-gray-700 leading-relaxed whitespace-pre-wrap">
          {{ contact.message }}
        </div>
      </div>

      <div class="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          class="h-9 px-4 rounded-md text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 transition-colors"
          @click="handleClose"
        >
          Close
        </button>
      </div>
    </div>
  </SalesDialog>
</template>
