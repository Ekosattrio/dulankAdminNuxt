<script setup lang="ts">
import type { AddressFormData } from '#server/types/address'
import BaseModal from '~/components/Modal/BaseModal.vue'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits<{ close: []; save: [value: AddressFormData] }>()
const emptyForm = (): AddressFormData => ({ customerId: '', name: '', contact: '', province: '', city: '', district: '', detailAddress: '', otherDetail: '', status: 'Home' })
const form = ref(emptyForm())
watch(() => props.isOpen, (open) => { if (open) form.value = emptyForm() })

const fields = [
  { key: 'customerId', label: 'Customer ID', required: true },
  { key: 'name', label: 'Name', required: true },
  { key: 'contact', label: 'Contact', required: false },
  { key: 'province', label: 'Province', required: false },
  { key: 'city', label: 'City', required: false },
  { key: 'district', label: 'District', required: false },
] as const
</script>

<template>
  <BaseModal :model-value="isOpen" title="Add New Address" max-width="2xl" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="emit('save', { ...form })" @keydown.esc="emit('close')">
      <div class="grid gap-4 sm:grid-cols-2">
        <label v-for="field in fields" :key="field.key" class="block text-sm font-medium">
          {{ field.label }} <span v-if="field.required" class="text-danger">*</span>
          <input v-model="form[field.key]" :required="field.required" class="mt-1 block w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 focus:border-primary dark:border-gray-700" />
        </label>
      </div>
      <label class="block text-sm font-medium">Detail Address
        <textarea v-model="form.detailAddress" rows="3" class="mt-1 block w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700" />
      </label>
      <label class="block text-sm font-medium">Other Detail
        <input v-model="form.otherDetail" class="mt-1 block w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700" />
      </label>
      <label class="block text-sm font-medium">Status
        <select v-model="form.status" class="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900">
          <option>Home</option><option>Work</option><option>Office</option>
        </select>
      </label>
      <div class="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
        <button type="button" class="rounded-md bg-secondary px-4 py-2 font-medium text-white" @click="emit('close')">Cancel</button>
        <button type="submit" class="rounded-md bg-primary px-4 py-2 font-medium text-white hover:bg-primary-hover">Save Address</button>
      </div>
    </form>
  </BaseModal>
</template>
