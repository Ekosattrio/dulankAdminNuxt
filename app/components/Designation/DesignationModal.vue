<script setup lang="ts">
import type { Designation, DesignationFormData } from '#server/types/designation'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import {
  formControlClass,
  modalFormInputColClass,
  modalFormLabelClass,
  modalFormRowClass,
} from '~/utils/salesUi'

const props = defineProps<{
  isOpen: boolean
  editData: Designation | null
  employees?: { id: string | number; name: string }[]
  busy?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: DesignationFormData): void
}>()

const form = ref<DesignationFormData>({
  name: '',
  memberIds: [],
  status: 'Active'
})
const validationError = ref('')

watch(
  () => [props.isOpen, props.editData] as const,
  ([open, val]) => {
    if (!open) return
    if (val) {
      form.value = {
        id: val.id,
        memberIds: [...(val.memberIds || [])],
        name: val.name,
        createdOn: val.createdOn,
        status: val.status,
        members: val.members,
        totalMembers: val.totalMembers
      }
    } else {
      form.value = {
        name: '',
        memberIds: [],
        status: 'Active'
      }
    }
    validationError.value = ''
  },
  { immediate: true }
)

const handleSubmit = () => {
  if (props.busy) return
  validationError.value = ''
  if (!form.value.name?.trim()) {
    validationError.value = 'Nama jabatan / designation tidak boleh kosong.'
    return
  }
  emit('save', { ...form.value })
}
</script>

<template>
  <SalesDialog
    :open="isOpen"
    :title="editData ? 'Edit Designation' : 'Add New Designation'"
    max-width="md"
    :busy="busy"
    @close="emit('close')"
  >
    <form class="space-y-4 py-2" @submit.prevent="handleSubmit">
      <p v-if="validationError" role="alert" class="rounded-md bg-red-50 p-2.5 text-xs text-red-600 dark:bg-red-950/40 dark:text-red-300">
        {{ validationError }}
      </p>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">
          Nama Posisi / Jabatan <span class="text-red-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <input
            v-model="form.name"
            type="text"
            :class="formControlClass"
            placeholder="e.g. Graphic Designer, Lead Press Operator"
            required
          />
        </div>
      </div>

      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Members</label><div :class="modalFormInputColClass"><OrganizationMemberPicker :model-value="form.memberIds || []" :employees="employees || []" :disabled="busy" @update:model-value="form.memberIds = $event" /></div></div>
      <div v-if="editData" :class="modalFormRowClass"><span :class="modalFormLabelClass">Created On</span><span :class="modalFormInputColClass">{{ editData.createdOn || '-' }} (otomatis)</span></div>
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Status</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.status" :class="formControlClass">
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          class="inline-flex h-9 items-center justify-center rounded-md border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none disabled:opacity-50"
          :disabled="busy"
        >
          {{ editData ? 'Update Designation' : 'Save Designation' }}
        </button>
      </div>
    </form>
  </SalesDialog>
</template>

<style scoped>
/* Scoped styles for DesignationModal */
</style>
