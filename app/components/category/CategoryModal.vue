<script setup lang="ts">
import type { Category, CategoryFormData } from '#server/types/category'
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
  editData?: Category | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', form: CategoryFormData): void
}>()

const form = reactive<CategoryFormData>({
  id: '',
  name: '',
  code: '',
  status: 'Active',
})

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      if (props.isEdit && props.editData) {
        form.id = props.editData.id
        form.name = props.editData.name
        form.code = props.editData.code
        form.status = props.editData.status
      } else {
        form.id = ''
        form.name = ''
        form.code = ''
        form.status = 'Active'
      }
    }
  },
  { immediate: true },
)

const handleSubmit = () => {
  if (!form.name.trim()) return
  emit('submit', { ...form })
}
</script>

<template>
  <SalesDialog
    :open="isOpen"
    :title="isEdit ? 'Edit Category' : 'Create Category'"
    size="md"
    @close="emit('close')"
  >
    <form id="category-form" class="space-y-4" @submit.prevent="handleSubmit">
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">
          Category Name <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.name"
            type="text"
            :class="formControlClass"
            placeholder="e.g. Digital Printing A3+"
            required
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">
          Category Slug
        </label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.code"
            type="text"
            :class="formControlClass"
            placeholder="e.g. digital-printing (leave empty to auto-slug)"
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
      <button type="submit" form="category-form" :class="salesPrimaryButton">
        {{ isEdit ? 'Save Changes' : 'Submit' }}
      </button>
    </template>
  </SalesDialog>
</template>
