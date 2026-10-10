<script setup lang="ts">
import type { FaqCategory, FaqCategoryFormData } from '#server/types/faq'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import {
  formControlClass,
  modalFormInputColClass,
  modalFormLabelClass,
  modalFormRowClass,
} from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  isEdit: boolean
  categoryData: FaqCategory | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [formData: FaqCategoryFormData]
}>()

const form = ref<FaqCategoryFormData>({
  id: '',
  name: '',
  slug: '',
  description: '',
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
        slug: val.slug,
        description: val.description || '',
        status: val.status || 'Active',
      }
    } else {
      form.value = {
        id: '',
        name: '',
        slug: '',
        description: '',
        status: 'Active',
      }
    }
    errorMessage.value = ''
  },
  { immediate: true },
)

function handleSubmit() {
  if (!form.value.name.trim()) {
    errorMessage.value = 'Category name is required'
    return
  }

  errorMessage.value = ''
  emit('submit', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="isEdit ? 'Edit FAQ Category' : 'Add FAQ Category'"
    medium
    :busy="busy"
    @close="$emit('close')"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div v-if="errorMessage" class="rounded-md bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-400">
        {{ errorMessage }}
      </div>

      <!-- Category Name -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Category Name <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.name"
            type="text"
            placeholder="e.g. Order & Shipping"
            required
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Slug -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Slug (Optional)</label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.slug"
            type="text"
            placeholder="Auto-generated if left empty"
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Description -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Description</label>
        <div :class="modalFormInputColClass">
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Category scope and explanation..."
            :class="formControlClass"
          />
        </div>
      </div>

      <!-- Status -->
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Status</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.status" :class="formControlClass">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4 dark:border-gray-800">
        <button
          type="button"
          :disabled="busy"
          class="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="busy"
          class="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
        >
          <FeatherIcon v-if="busy" name="rotate-cw" :size="14" class="animate-spin" />
          <span>{{ isEdit ? 'Update Category' : 'Create Category' }}</span>
        </button>
      </div>
    </form>
  </SalesDialog>
</template>
