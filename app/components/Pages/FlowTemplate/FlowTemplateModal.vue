<script setup lang="ts">
import type { FlowTemplate, FlowTemplateFormData, FlowTemplateItem } from '#server/types/flow-template'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import { formControlClass, modalFormInputColClass, modalFormLabelClass, modalFormRowClass } from '~/utils/salesUi'

const props = defineProps<{ open: boolean; record: FlowTemplate | null; busy?: boolean; error?: string }>()
const emit = defineEmits<{ close: []; submit: [form: FlowTemplateFormData] }>()
const templateName = ref('')
const items = ref<FlowTemplateItem[]>([])
const defaultOptions: Record<string, string[]> = {
  'Sisi Cetak': ['Depan', 'Bolak-balik'],
  'Ada Contoh': ['Ya', 'Tidak'],
  'Ada Contoh?': ['Ya', 'Tidak'],
  'Acc Warna': ['Ya', 'Tidak'],
  'Acc Warna?': ['Ya', 'Tidak'],
}

watch(() => props.open, (open) => {
  if (!open) return
  templateName.value = props.record?.name || ''
  items.value = props.record?.items?.map((item) => ({ ...item, options: [...(item.options || [])] }))
    || props.record?.information?.split(',').map((label, index) => {
      const trimmed = label.trim()
      const options = defaultOptions[trimmed] || []
      return { id: `info-${index + 1}`, label: trimmed, type: options.length ? 'Select Type' as const : 'Input Type' as const, options: [...options] }
    }).filter((item) => item.label)
    || []
}, { immediate: true })

function submit() {
  const name = templateName.value.trim()
  if (!name || items.value.length === 0) return
  emit('submit', {
    id: props.record?.id,
    no: props.record?.no,
    name,
    information: items.value.map((item) => item.label.trim()).filter(Boolean).join(', '),
    items: items.value,
  })
}
</script>

<template>
  <SalesDialog :open="open" :title="record ? 'Edit Flow Template' : 'Add Flow Template'" :busy="busy" medium @close="$emit('close')">
    <form class="space-y-4" @submit.prevent="submit">
      <p class="text-xs text-gray-500 dark:text-gray-400">Add all Information you need in your flow Templete</p>
      <p v-if="error" role="alert" class="text-xs text-red-600 dark:text-red-400">{{ error }}</p>
      <fieldset :disabled="busy" class="space-y-4 disabled:opacity-60">
        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">Flow Templete Name</label>
          <div :class="modalFormInputColClass"><input v-model="templateName" required placeholder="SPK Heidelberg Sm52 4 Warna" :class="formControlClass" /></div>
        </div>
        <FlowTemplateInformationEditor v-model:items="items" />
        <div class="flex justify-end gap-2.5 border-t border-gray-200 pt-4 dark:border-gray-700">
          <button type="button" class="min-w-24 rounded-md bg-[#212b36] px-4 py-2 text-sm font-semibold text-white" @click="$emit('close')">Cancel</button>
          <button type="submit" class="min-w-24 rounded-md bg-[#ff9f43] px-5 py-2 text-sm font-semibold text-white" :disabled="busy || items.length === 0">{{ busy ? 'Saving...' : 'Submit' }}</button>
        </div>
      </fieldset>
    </form>
  </SalesDialog>
</template>
