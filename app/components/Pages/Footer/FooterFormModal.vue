<script setup lang="ts">
import type { FooterLinkItem, FooterLinkFormData } from '#server/types/footer'
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
  footerData: FooterLinkItem | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [formData: FooterLinkFormData]
}>()

const form = ref<FooterLinkFormData>({
  id: '',
  sectionName: 'Info Kami',
  linkTitle: '',
  url: '',
  order: 1,
  status: 'Active',
  target: '_self',
})

const errorMessage = ref('')

const sections = ['Info Kami', 'Panduan Pelanggan', 'Layanan Populer', 'Kontak & Bantuan', 'Legal & Privasi']

watch(
  () => props.footerData,
  (val) => {
    if (val && props.isEdit) {
      form.value = {
        id: val.id,
        sectionName: val.sectionName || 'Info Kami',
        linkTitle: val.linkTitle,
        url: val.url,
        order: val.order || 1,
        status: val.status || 'Active',
        target: val.target || '_self',
      }
    } else {
      form.value = {
        id: '',
        sectionName: 'Info Kami',
        linkTitle: '',
        url: '',
        order: 1,
        status: 'Active',
        target: '_self',
      }
    }
    errorMessage.value = ''
  },
  { immediate: true },
)

function handleSubmit() {
  if (!form.value.linkTitle.trim()) {
    errorMessage.value = 'Link title is required'
    return
  }
  if (!form.value.url.trim()) {
    errorMessage.value = 'URL is required'
    return
  }
  errorMessage.value = ''
  emit('submit', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="isEdit ? 'Edit Footer Link' : 'Add Footer Link'"
    medium
    :busy="busy"
    @close="$emit('close')"
  >
    <form class="space-y-4 p-6" @submit.prevent="handleSubmit">
      <div v-if="errorMessage" class="rounded-md bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-400">
        {{ errorMessage }}
      </div>

      <!-- Section Name -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Footer Section <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <select v-model="form.sectionName" :class="formControlClass">
            <option v-for="sec in sections" :key="sec" :value="sec">{{ sec }}</option>
          </select>
        </div>
      </div>

      <!-- Link Title -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Link Title <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.linkTitle"
            type="text"
            placeholder="e.g. Tentang Kami / Panduan Ukuran"
            required
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- URL -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">URL / Path <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.url"
            type="text"
            placeholder="e.g. /about-us or https://..."
            required
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Status, Order, Target -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
        <div>
          <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Open Link In</label>
          <select v-model="form.target" :class="formControlClass">
            <option value="_self">Same Tab (_self)</option>
            <option value="_blank">New Tab (_blank)</option>
          </select>
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
