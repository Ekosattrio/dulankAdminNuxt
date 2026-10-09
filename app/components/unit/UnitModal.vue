<script setup lang="ts">
import type { Unit, UnitFormData } from '#server/types/unit'
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
  editData?: Unit | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', form: UnitFormData): void
}>()

const form = reactive<UnitFormData>({
  id: '',
  name: '',
  shortName: '',
  status: 'Active',
})

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      if (props.isEdit && props.editData) {
        form.id = props.editData.id
        form.name = props.editData.name
        form.shortName = props.editData.shortName
        form.status = props.editData.status
      } else {
        form.id = ''
        form.name = ''
        form.shortName = ''
        form.status = 'Active'
      }
    }
  },
  { immediate: true },
)

const handleSubmit = () => {
  if (!form.name.trim() || !form.shortName.trim()) return
  emit('submit', { ...form })
}
</script>

<template>
  <SalesDialog
    :open="isOpen"
    :title="isEdit ? 'Edit Unit' : 'Create Unit'"
    size="md"
    @close="emit('close')"
  >
    <form id="unit-form" class="space-y-4" @submit.prevent="handleSubmit">
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">
          Unit Name <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.name"
            type="text"
            :class="formControlClass"
            placeholder="e.g. Piece, Kilogram, Ream"
            required
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">
          Short Name <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.shortName"
            type="text"
            :class="formControlClass"
            placeholder="e.g. PC, KG, RIM"
            required
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
      <button type="submit" form="unit-form" :class="salesPrimaryButton">
        {{ isEdit ? 'Save Changes' : 'Submit' }}
      </button>
    </template>
  </SalesDialog>
</template>
