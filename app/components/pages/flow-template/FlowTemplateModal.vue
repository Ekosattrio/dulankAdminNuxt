<script setup lang="ts">
import type { FlowTemplate, FlowTemplateFormData } from '#server/types/flow-template'
import SalesDialog from '~/components/sales/SalesDialog.vue'

const props = defineProps<{
  open: boolean
  record: FlowTemplate | null
  busy?: boolean
  error?: string
}>()

const emit = defineEmits<{
  close: []
  submit: [form: FlowTemplateFormData]
}>()

const form = ref<FlowTemplateFormData>({
  name: '',
  information: '',
})

watch(
  () => props.record,
  (rec) => {
    if (rec) {
      form.value = {
        id: rec.id,
        no: rec.no,
        name: rec.name,
        information: rec.information,
      }
    } else {
      form.value = {
        name: '',
        information: '',
      }
    }
  },
  { immediate: true },
)

function submit() {
  emit('submit', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="record ? 'Edit Flow Template' : 'Add New Flow Template'"
    :busy="busy"
    medium
    @close="$emit('close')"
  >
    <form class="space-y-4" @submit.prevent="submit">
      <p v-if="error" role="alert" class="text-xs text-red-600">{{ error }}</p>
      <fieldset :disabled="busy" class="space-y-4 text-xs disabled:opacity-60">
        <!-- Flow Template Name -->
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
          <div class="text-xs font-semibold text-gray-700 sm:w-1/3 dark:text-gray-300">
            Flow Template <span class="text-red-500">*</span>
          </div>
          <div class="sm:w-2/3">
            <input
              v-model="form.name"
              type="text"
              required
              placeholder="e.g. SPK Heidelberg SM52 4 Warna"
              class="h-9 w-full rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 shadow-sm outline-none transition-colors hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            />
          </div>
        </div>

        <!-- Information / Specifications -->
        <div class="flex flex-col gap-1 sm:flex-row sm:items-start sm:gap-4">
          <div class="pt-2 text-xs font-semibold text-gray-700 sm:w-1/3 dark:text-gray-300">
            Information <span class="text-red-500">*</span>
          </div>
          <div class="sm:w-2/3">
            <textarea
              v-model="form.information"
              required
              rows="4"
              placeholder="Enter parameters separated by comma (e.g. Project Name, Kertas, Sisi Cetak...)"
              class="w-full rounded-md border border-gray-200 bg-white p-3 text-xs font-medium text-gray-700 shadow-sm outline-none transition-colors hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            />
          </div>
        </div>

        <!-- Action Footer -->
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
            class="min-w-24 rounded-md bg-[#ff9f43] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[#f39334] focus:outline-none"
          >
            {{ busy ? 'Saving...' : 'Submit' }}
          </button>
        </div>
      </fieldset>
    </form>
  </SalesDialog>
</template>
