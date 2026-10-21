<script setup lang="ts">
import type { Department, DepartmentFormData } from '#server/types/department'
import { formControlClass, modalFormInputColClass, modalFormLabelClass, modalFormRowClass } from '~/utils/salesUi'
const props = defineProps<{ open: boolean; isEdit: boolean; departmentData: Department | null; availableMembers?: string[]; employees?: { id: string | number; name: string }[]; busy?: boolean }>()
const emit = defineEmits<{ close: []; submit: [formData: DepartmentFormData] }>()
const form = ref<DepartmentFormData>({ name: '', status: 'Active', memberIds: [] })
const errorMessage = ref('')
watch(() => [props.open, props.departmentData], () => {
  if (!props.open) return
  const record = props.isEdit ? props.departmentData : null
  form.value = { id: record?.id, name: record?.name || '', status: record?.status || 'Active', memberIds: [...(record?.memberIds || [])] }
  errorMessage.value = ''
}, { immediate: true })
function handleSubmit() {
  if (props.busy) return
  if (!form.value.name.trim()) { errorMessage.value = 'Department name is required'; return }
  emit('submit', { ...form.value, name: form.value.name.trim() })
}
</script>
<template>
  <SalesDialog :open="open" :title="isEdit ? 'Edit Department' : 'Add New Department'" medium :busy="busy" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <p v-if="errorMessage" role="alert" class="text-sm text-red-600">{{ errorMessage }}</p>
      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Department Name *</label><div :class="modalFormInputColClass"><input v-model="form.name" type="text" required :class="formControlClass" /></div></div>
      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Members</label><div :class="modalFormInputColClass"><OrganizationMemberPicker :model-value="form.memberIds || []" :employees="employees || []" :disabled="busy" @update:model-value="form.memberIds = $event" /></div></div>
      <div v-if="isEdit" :class="modalFormRowClass"><span :class="modalFormLabelClass">Created</span><span :class="modalFormInputColClass">{{ departmentData?.createdDate || '-' }} (otomatis)</span></div>
      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Status</label><div :class="modalFormInputColClass"><select v-model="form.status" :class="formControlClass"><option value="Active">Active</option><option value="Inactive">Inactive</option></select></div></div>
    </form>
    <template #footer><button type="button" class="h-9 rounded-lg border border-gray-200 px-4 text-sm" :disabled="busy" @click="emit('close')">Cancel</button><button type="button" class="h-9 rounded-lg bg-primary px-4 text-sm text-white disabled:opacity-50" :disabled="busy" @click="handleSubmit">{{ isEdit ? 'Update Department' : 'Save Department' }}</button></template>
  </SalesDialog>
</template>
