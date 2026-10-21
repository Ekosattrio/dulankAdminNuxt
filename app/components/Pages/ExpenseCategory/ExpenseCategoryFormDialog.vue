<script setup lang="ts">
import type { ExpenseCategory, ExpenseCategoryFormData } from '#server/types/expense-category'
import { formControlClass, modalFormInputColClass, modalFormLabelClass, modalFormRowClass, salesPrimaryButton, salesSecondaryButton } from '~/utils/salesUi'

const props = defineProps<{ open: boolean; item: ExpenseCategory | null; busy?: boolean }>()

const emit = defineEmits<{ close: []; submit: [payload: ExpenseCategoryFormData] }>()

const form = reactive<ExpenseCategoryFormData>({ categoryName: '', status: 'Active' })
const errorMessage = ref('')

watch(
  () => [props.open, props.item] as const,
  ([open, item]) => {
    if (!open) return
    Object.assign(form, item
      ? { id: item.id, categoryName: item.categoryName, status: item.status }
      : { id: undefined, categoryName: '', status: 'Active' })
    errorMessage.value = ''
  },
  { immediate: true },
)

function submit() {
  if (!form.categoryName.trim()) return void (errorMessage.value = 'Category Name wajib diisi')
  errorMessage.value = ''
  emit('submit', { ...form, categoryName: form.categoryName.trim() })
}
</script>

<template>
  <SalesDialog :open="open" :title="item ? 'Edit Expense Category' : 'Add Expense Category'" :busy="busy" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="submit">
      <p v-if="errorMessage" role="alert" class="rounded-md bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{{ errorMessage }}</p>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Category Name<span class="ml-1 text-rose-600">*</span></label>
        <div :class="modalFormInputColClass"><input v-model="form.categoryName" :class="formControlClass" required /></div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Status</label>
        <div :class="modalFormInputColClass">
          <label class="flex min-h-9 items-center gap-2 text-sm">
            <input v-model="form.status" type="checkbox" true-value="Active" false-value="Deactive" class="size-4 accent-primary" />{{ form.status }}
          </label>
        </div>
      </div>

      <div class="flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
        <button type="button" :class="salesSecondaryButton" :disabled="busy" @click="emit('close')">Cancel</button>
        <button type="submit" :class="salesPrimaryButton" :disabled="busy">{{ busy ? 'Saving...' : 'Submit' }}</button>
      </div>
    </form>
  </SalesDialog>
</template>