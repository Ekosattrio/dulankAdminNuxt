<script setup lang="ts">
import type { CashAdvanceFormData, CashAdvanceView } from '#server/types/cash-advance'
import type { EmployeeItem } from '#server/types/employee'
import CurrencyInput from '~/components/Common/CurrencyInput.vue'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import { formControlClass, modalFormInputColClass, modalFormLabelClass, modalFormRowClass } from '~/utils/salesUi'
const props = defineProps<{ open: boolean; item: CashAdvanceView | null; employees: EmployeeItem[]; busy?: boolean; error?: string }>()
const emit = defineEmits<{ close: []; submit: [payload: CashAdvanceFormData] }>()
const empty = (): CashAdvanceFormData => ({ employeeId: props.employees[0]?.id ?? '', date: new Date().toISOString().slice(0, 10), totalCash: 0, period: 'Monthly', note: '' })
const form = ref<CashAdvanceFormData>(empty())
watch([() => props.open, () => props.item, () => props.employees], ([open, item]) => {
  if (!open) return
  form.value = item ? { id: item.id, employeeId: item.employeeId, date: item.date, totalCash: item.totalCash, period: item.period, note: item.note } : empty()
}, { immediate: true })
</script>
<template>
  <SalesDialog :open="open" :title="item ? 'Edit Cash Advance' : 'Add New Cash Advance'" size="lg" :busy="busy" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="emit('submit', { ...form })">
      <p v-if="error" role="alert" class="rounded-md bg-red-50 p-3 text-sm text-red-700">{{ error }}</p>
      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Name <span class="text-red-500">*</span></label><div :class="modalFormInputColClass"><select v-model="form.employeeId" :class="formControlClass" required :disabled="!!item"><option disabled value="">Choose employee</option><option v-for="employee in employees" :key="employee.id" :value="employee.id">{{ employee.name }} - {{ employee.department }}</option></select></div></div>
      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Expense Date <span class="text-red-500">*</span></label><div :class="modalFormInputColClass"><input v-model="form.date" type="date" :class="formControlClass" required /></div></div>
      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Amount Cash Advance <span class="text-red-500">*</span></label><div :class="modalFormInputColClass"><CurrencyInput v-model="form.totalCash" prefix="Rp" :min="1" required /></div></div>
      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Payment Period</label><div :class="modalFormInputColClass"><select v-model="form.period" :class="formControlClass"><option value="Daily">Daily</option><option value="Weekly">Weekly</option><option value="Monthly">Monthly</option></select></div></div>
      <div class="grid grid-cols-12 items-start gap-3 sm:gap-4"><label :class="modalFormLabelClass">Description</label><div :class="modalFormInputColClass"><textarea v-model="form.note" rows="3" class="min-h-20 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-900" /></div></div>
      <div class="flex justify-end gap-2 border-t border-gray-100 pt-4"><button type="button" class="h-9 rounded-md border border-gray-200 px-4 text-sm" :disabled="busy" @click="emit('close')">Cancel</button><button type="submit" class="h-9 rounded-md bg-primary px-4 text-sm font-semibold text-white disabled:opacity-50" :disabled="busy">{{ busy ? 'Saving...' : 'Submit' }}</button></div>
    </form>
  </SalesDialog>
</template>

