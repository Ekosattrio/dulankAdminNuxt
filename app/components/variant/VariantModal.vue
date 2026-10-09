<script setup lang="ts">
import type { Variant, VariantFormData } from '#server/types/variant'
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
  editData?: Variant | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', form: VariantFormData): void
}>()

const form = reactive<VariantFormData>({
  id: '',
  name: '',
  values: '',
  status: 'Active',
})

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      if (props.isEdit && props.editData) {
        form.id = props.editData.id
        form.name = props.editData.name
        form.values = props.editData.values
        form.status = props.editData.status
      } else {
        form.id = ''
        form.name = ''
        form.values = ''
        form.status = 'Active'
      }
    }
  },
  { immediate: true },
)

const handleSubmit = () => {
  if (!form.name.trim() || !form.values.trim()) return
  emit('submit', { ...form })
}
</script>

<template>
  <SalesDialog
    :open="isOpen"
    :title="isEdit ? 'Edit Attributes' : 'Create Variant'"
    size="md"
    @close="emit('close')"
  >
    <form id="variant-form" class="space-y-4" @submit.prevent="handleSubmit">
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">
          Variant Name <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.name"
            type="text"
            :class="formControlClass"
            placeholder="e.g. Color, Size, Gramatur"
            required
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">
          Variant Values <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.values"
            type="text"
            :class="formControlClass"
            placeholder="e.g. Red, Blue, Green (comma separated)"
            required
          />
          <span class="mt-1 block text-xs text-gray-500">
            Enter values separated by comma
          </span>
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
      <button type="submit" form="variant-form" :class="salesPrimaryButton">
        {{ isEdit ? 'Save Changes' : 'Submit' }}
      </button>
    </template>
  </SalesDialog>
</template>
