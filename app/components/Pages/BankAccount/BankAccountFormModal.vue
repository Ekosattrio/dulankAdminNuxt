<script setup lang="ts">
import type { BankAccountFormData, BankAccountTypeView, BankAccountView } from '#server/types/bank-account'
import CurrencyInput from '~/components/Common/CurrencyInput.vue'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import { formControlClass, modalFormInputColClass, modalFormLabelClass, modalFormRowClass } from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  item: BankAccountView | null
  accountTypes: BankAccountTypeView[]
  busy?: boolean
  error?: string
}>()
const emit = defineEmits<{ close: []; submit: [payload: BankAccountFormData] }>()

const emptyForm = (): BankAccountFormData => ({
  accountTypeId: props.accountTypes.find((type) => type.status === 'Active')?.id ?? '',
  accountName: '',
  bankName: '',
  accountNo: '',
  openingBalance: 0,
  ifsc: '',
  description: '',
  status: 'Active',
})
const form = ref<BankAccountFormData>(emptyForm())

watch(
  [() => props.open, () => props.item, () => props.accountTypes],
  ([open, item]) => {
    if (!open) return
    form.value = item
      ? {
          id: item.id,
          branchId: item.branchId,
          accountTypeId: item.accountTypeId,
          accountName: item.accountName,
          bankName: item.bankName,
          accountNo: item.accountNo,
          openingBalance: item.openingBalance,
          ifsc: item.ifsc,
          description: item.description,
          status: item.status,
        }
      : emptyForm()
  },
  { immediate: true },
)

function submit() {
  emit('submit', { ...form.value })
}
</script>

<template>
  <SalesDialog :open="open" :title="item ? 'Edit Bank Account' : 'Add Bank Account'" size="lg" @close="!busy && emit('close')">
    <form class="space-y-4" @submit.prevent="submit">
      <p v-if="error" role="alert" class="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{{ error }}</p>
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Account Holder Name <span class="text-red-500">*</span></label>
        <div :class="modalFormInputColClass"><input v-model="form.accountName" :class="formControlClass" required /></div>
      </div>
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Bank Name <span class="text-red-500">*</span></label>
        <div :class="modalFormInputColClass"><input v-model="form.bankName" :class="formControlClass" required /></div>
      </div>
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Account No <span class="text-red-500">*</span></label>
        <div :class="modalFormInputColClass"><input v-model="form.accountNo" :class="formControlClass" inputmode="numeric" required /></div>
      </div>
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Type <span class="text-red-500">*</span></label>
        <div :class="modalFormInputColClass">
          <select v-model="form.accountTypeId" :class="formControlClass" required>
            <option disabled value="">Select account type</option>
            <option v-for="type in accountTypes" :key="type.id" :value="type.id" :disabled="type.status !== 'Active' && type.id !== item?.accountTypeId">{{ type.name }}</option>
          </select>
        </div>
      </div>
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Opening Balance <span class="text-red-500">*</span></label>
        <div :class="modalFormInputColClass"><CurrencyInput v-model="form.openingBalance" prefix="Rp" :min="0" required /></div>
      </div>
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">IFSC <span class="text-red-500">*</span></label>
        <div :class="modalFormInputColClass"><input v-model="form.ifsc" :class="formControlClass" required /></div>
      </div>
      <div class="grid grid-cols-12 items-start gap-3 sm:gap-4">
        <label :class="modalFormLabelClass">Description</label>
        <div :class="modalFormInputColClass">
          <textarea v-model="form.description" rows="3" class="min-h-20 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200" />
          <p class="mt-1 text-xs text-gray-500">Maximum 60 words</p>
        </div>
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

