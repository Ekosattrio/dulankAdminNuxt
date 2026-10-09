<script setup lang="ts">
import type { SubCategory, SubCategoryFormData } from '#server/types/sub-category'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import {
  formControlClass,
  modalFormRowClass,
  modalFormLabelClass,
  modalFormInputColClass,
  salesPrimaryButton,
  salesSecondaryButton,
} from '~/utils/salesUi'

const props = defineProps<{
  isOpen: boolean
  isEdit: boolean
  editData?: SubCategory | null
  categories: string[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', form: SubCategoryFormData): void
}>()

const form = reactive<SubCategoryFormData>({
  id: '',
  name: '',
  category: '',
  categoryCode: '',
  description: '',
  status: 'Active',
})

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      if (props.isEdit && props.editData) {
        form.id = props.editData.id
        form.name = props.editData.name
        form.category = props.editData.category
        form.categoryCode = props.editData.categoryCode
        form.description = props.editData.description
        form.status = props.editData.status
      } else {
        form.id = ''
        form.name = ''
        form.category = props.categories[0] || ''
        form.categoryCode = ''
        form.description = ''
        form.status = 'Active'
      }
    }
  },
  { immediate: true },
)

const generateCode = () => {
  const prefix = form.name ? form.name.slice(0, 3).toUpperCase() : 'SUB'
  const random = Math.floor(100 + Math.random() * 900)
  form.categoryCode = `${prefix}-${random}`
}

const handleSubmit = () => {
  if (!form.name.trim() || !form.category.trim()) return
  emit('submit', { ...form })
}
</script>

<template>
  <SalesDialog
    :open="isOpen"
    :title="isEdit ? 'Edit Sub Category' : 'Create Sub Category'"
    size="md"
    @close="emit('close')"
  >
    <form id="sub-category-form" class="space-y-4" @submit.prevent="handleSubmit">
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">
          Category <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <select v-model="form.category" :class="formControlClass" required>
            <option value="" disabled>Choose Category</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">
          Sub Category Name <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.name"
            type="text"
            :class="formControlClass"
            placeholder="e.g. Spanduk Flexi"
            required
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">
          Category Code
        </label>
        <div :class="modalFormInputColClass">
          <div class="flex gap-2">
            <input
              v-model="form.categoryCode"
              type="text"
              :class="formControlClass"
              placeholder="e.g. SUB-001"
            />
            <button
              type="button"
              class="shrink-0 rounded-md border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              @click="generateCode"
            >
              Generate
            </button>
          </div>
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">
          Description
        </label>
        <div :class="modalFormInputColClass">
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full rounded-md border border-gray-200 bg-white p-2.5 text-sm text-gray-700 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            placeholder="Keterangan singkat sub-kategori produk..."
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">
          Status
        </label>
        <div :class="modalFormInputColClass">
          <select v-model="form.status" :class="formControlClass">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>
    </form>

    <template #footer>
      <button type="button" :class="salesSecondaryButton" @click="emit('close')">
        Cancel
      </button>
      <button type="submit" form="sub-category-form" :class="salesPrimaryButton">
        {{ isEdit ? 'Save Changes' : 'Submit' }}
      </button>
    </template>
  </SalesDialog>
</template>
