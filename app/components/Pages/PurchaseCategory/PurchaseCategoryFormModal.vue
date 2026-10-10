<script setup lang="ts">
import type { PurchaseCategory, PurchaseCategoryFormData } from '#server/types/purchase-category'
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
  categoryData: PurchaseCategory | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [formData: PurchaseCategoryFormData]
}>()

const form = ref<PurchaseCategoryFormData>({
  name: '',
  status: 'Active',
})

const errorMessage = ref('')

watch(
  () => props.categoryData,
  (val) => {
    if (val && props.isEdit) {
      form.value = {
        id: val.id,
        name: val.name,
        status: val.status,
      }
    } else {
      form.value = {
        name: '',
        status: 'Active',
      }
    }
    errorMessage.value = ''
  },
  { immediate: true }
)

function handleSubmit() {
  if (!form.value.name?.trim()) {
    errorMessage.value = 'Category Name is required'
    return
  }

  errorMessage.value = ''
  emit('submit', {
    ...form.value,
    name: form.value.name.trim(),
  })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="isEdit ? 'Edit Purchase Category' : 'Add Purchase Category'"
    size="md"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Error banner if validation fails -->
      <div
        v-if="errorMessage"
        class="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400"
      >
        {{ errorMessage }}
      </div>

      <!-- Category Name -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">
          Category Name <span class="text-rose-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.name"
            type="text"
            placeholder="e.g. Kertas & Bahan Baku Cetak"
            :class="formControlClass"
            :disabled="busy"
            required
          />
        </div>
      </div>

      <!-- Status -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">
          Status <span class="text-rose-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <select
            v-model="form.status"
            :class="formControlClass"
            :disabled="busy"
          >
            <option value="Active">Active</option>
            <option value="Deactive">Deactive</option>
          </select>
        </div>
      </div>

      <!-- Modal Action Buttons -->
      <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 focus:outline-hidden dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          :disabled="busy"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary/90 focus:outline-hidden disabled:opacity-50"
          :disabled="busy"
        >
          <span v-if="busy" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          {{ isEdit ? 'Update Category' : 'Save Category' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>
