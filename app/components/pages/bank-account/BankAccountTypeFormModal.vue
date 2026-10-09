<script setup lang="ts">
import type { BankAccountTypeFormData, BankAccountTypeView } from '#server/types/bank-account'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import { formControlClass, modalFormInputColClass, modalFormLabelClass, modalFormRowClass } from '~/utils/salesUi'

const props = defineProps<{ open: boolean; item: BankAccountTypeView | null; busy?: boolean; error?: string }>()
const emit = defineEmits<{ close: []; submit: [payload: BankAccountTypeFormData] }>()
const form = ref<BankAccountTypeFormData>({ name: '', status: 'Active' })

watch(
  [() => props.open, () => props.item],
  ([open, item]) => {
    if (!open) return
    form.value = item ? { id: item.id, name: item.name, status: item.status } : { name: '', status: 'Active' }
  },
  { immediate: true },
)
</script>

<template>
  <SalesDialog :open="open" :title="item ? 'Edit Type' : 'Add Type'" size="md" @close="!busy && emit('close')">
    <form class="space-y-4" @submit.prevent="emit('submit', { ...form })">
      <p v-if="error" role="alert" class="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{{ error }}</p>
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Name <span class="text-red-500">*</span></label>
        <div :class="modalFormInputColClass"><input v-model="form.name" :class="formControlClass" required /></div>
      </div>
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Status</label>
        <div :class="modalFormInputColClass">
          <select v-model="form.status" :class="formControlClass"><option value="Active">Active</option><option value="Inactive">Inactive</option></select>
        </div>
      </div>
      <div class="flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
        <button type="button" class="h-9 rounded-md border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200" :disabled="busy" @click="emit('close')">Cancel</button>
        <button type="submit" class="h-9 rounded-md bg-primary px-4 text-sm font-semibold text-white disabled:opacity-50" :disabled="busy">{{ busy ? 'Saving...' : 'Submit' }}</button>
      </div>
    </form>
  </SalesDialog>
</template>

