<script setup lang="ts">
import type { DownloadFileItem, DownloadFileFormData } from '#server/types/download-file'
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
  fileData: DownloadFileItem | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [formData: DownloadFileFormData]
}>()

const form = ref<DownloadFileFormData>({
  id: '',
  name: '',
  category: 'Katalog',
  size: '1.2 MB',
  fileType: 'pdf',
  fileUrl: '',
  uploadedBy: 'Admin',
})

const errorMessage = ref('')

const categories = ['Katalog', 'Template', 'Price List', 'Desain Proof', 'Panduan', 'Laporan', 'General']
const fileTypes: Array<DownloadFileItem['fileType']> = ['pdf', 'excel', 'image', 'word', 'archive', 'file']

watch(
  () => props.fileData,
  (val) => {
    if (val && props.isEdit) {
      form.value = {
        id: val.id,
        name: val.name,
        category: val.category || 'Katalog',
        size: val.size || '1.0 MB',
        fileType: val.fileType || 'pdf',
        fileUrl: val.fileUrl || '',
        uploadedBy: val.uploadedBy || 'Admin',
      }
    } else {
      form.value = {
        id: '',
        name: '',
        category: 'Katalog',
        size: '1.5 MB',
        fileType: 'pdf',
        fileUrl: '',
        uploadedBy: 'Admin',
      }
    }
    errorMessage.value = ''
  },
  { immediate: true },
)

function handleSubmit() {
  if (!form.value.name.trim()) {
    errorMessage.value = 'File name is required'
    return
  }
  if (!form.value.category.trim()) {
    errorMessage.value = 'Category is required'
    return
  }
  errorMessage.value = ''
  emit('submit', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="isEdit ? 'Edit Download File' : 'Upload / Add Download File'"
    medium
    :busy="busy"
    @close="$emit('close')"
  >
    <form class="space-y-4 p-6" @submit.prevent="handleSubmit">
      <div v-if="errorMessage" class="rounded-md bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-400">
        {{ errorMessage }}
      </div>

      <!-- File Name -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">File Name <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.name"
            type="text"
            placeholder="e.g. Price_List_Percetakan_2026.pdf"
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
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
      </div>

      <!-- File Type & File Size -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">File Type</label>
          <select v-model="form.fileType" :class="formControlClass">
            <option v-for="t in fileTypes" :key="t" :value="t">{{ t.toUpperCase() }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">File Size</label>
          <input
            v-model="form.size"
            type="text"
            placeholder="e.g. 2.4 MB"
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- File URL / Download Path -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">File / Download URL</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.fileUrl"
            type="text"
            placeholder="/downloads/file.pdf or https://..."
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Uploaded By -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Uploaded By</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.uploadedBy"
            type="text"
            placeholder="e.g. Admin, Designer, Tim Produksi"
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
