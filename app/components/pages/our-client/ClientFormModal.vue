<script setup lang="ts">
import type { ClientItem, ClientFormData } from '#server/types/client'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import {
  formControlClass,
  modalFormInputColClass,
  modalFormLabelClass,
  modalFormRowClass,
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  isEdit: boolean
  clientData: ClientItem | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [formData: ClientFormData]
}>()

const form = ref<ClientFormData>({
  id: '',
  name: '',
  logoUrl: '',
  website: '',
  category: 'Enterprise',
  status: 'Active',
  order: 1,
})

const errorMessage = ref('')

const categories = ['Enterprise', 'Technology', 'Media & Creative', 'Manufacturing', 'Retail', 'General']

const sampleLogos = [
  { name: 'Google', url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg' },
  { name: 'YouTube', url: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg' },
  { name: 'Microsoft', url: 'https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg' },
  { name: 'Amazon', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg' },
  { name: 'Netflix', url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
  { name: 'Adobe', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Adobe_Systems_logo_and_wordmark.svg' },
  { name: 'Canon', url: 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Canon_wordmark.svg' },
]

watch(
  () => props.clientData,
  (val) => {
    if (val && props.isEdit) {
      form.value = {
        id: val.id,
        name: val.name,
        logoUrl: val.logoUrl,
        website: val.website || '',
        category: val.category || 'Enterprise',
        status: val.status || 'Active',
        order: val.order || 1,
      }
    } else {
      form.value = {
        id: '',
        name: '',
        logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
        website: '',
        category: 'Enterprise',
        status: 'Active',
        order: 1,
      }
    }
    errorMessage.value = ''
  },
  { immediate: true },
)

function handleSubmit() {
  if (!form.value.name.trim()) {
    errorMessage.value = 'Client Name is required'
    return
  }
  if (!form.value.logoUrl.trim()) {
    errorMessage.value = 'Logo URL is required'
    return
  }
  errorMessage.value = ''
  emit('submit', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="isEdit ? 'Edit Client Logo' : 'Add Client Logo'"
    medium
    :busy="busy"
    @close="$emit('close')"
  >
    <form class="space-y-4 p-6" @submit.prevent="handleSubmit">
      <div v-if="errorMessage" class="rounded-md bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-400">
        {{ errorMessage }}
      </div>

      <!-- Client Name -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Client Name <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.name"
            type="text"
            placeholder="e.g. Google Partner Indonesia"
            required
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Logo URL & Sample Preset -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Logo Image URL <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.logoUrl"
            type="url"
            placeholder="https://.../logo.svg"
            required
            :class="formControlClass"
          />
          <div class="mt-2 flex flex-wrap items-center gap-1.5">
            <span class="text-[11px] text-gray-500 dark:text-gray-400">Contoh Cepat:</span>
            <button
              v-for="preset in sampleLogos"
              :key="preset.name"
              type="button"
              class="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              @click="form.logoUrl = preset.url"
            >
              {{ preset.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Live Logo Preview -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Logo Preview</label>
        <div :class="modalFormInputColClass">
          <div class="flex h-20 w-full items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50 p-2">
            <img
              v-if="form.logoUrl"
              :src="form.logoUrl"
              alt="Logo Preview"
              class="max-h-16 max-w-full object-contain"
            />
            <span v-else class="text-xs text-gray-400">Masukkan URL logo</span>
          </div>
        </div>
      </div>

      <!-- Website URL -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Website URL</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.website"
            type="text"
            placeholder="https://client-website.com"
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Category -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Category</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.category" :class="formControlClass">
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
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
