<script setup lang="ts">
import type { BankAccountView } from '#server/types/bank-account'
import type { MoneyTransferFormData, MoneyTransferView } from '#server/types/money-transfer'
import CurrencyInput from '~/components/Common/CurrencyInput.vue'
import SalesDialog from '~/components/Sales/SalesDialog.vue'
import { formControlClass, modalFormInputColClass, modalFormLabelClass, modalFormRowClass } from '~/utils/salesUi'

const props = defineProps<{ open: boolean; item: MoneyTransferView | null; accounts: BankAccountView[]; busy?: boolean; error?: string }>()
const emit = defineEmits<{ close: []; submit: [payload: MoneyTransferFormData] }>()
const empty = (): MoneyTransferFormData => ({
  fromAccountId: props.accounts[0]?.id ?? '', toAccountId: props.accounts[1]?.id ?? '', amount: 0,
  description: '', occurredAt: new Date().toISOString().slice(0, 16),
})
const form = ref<MoneyTransferFormData>(empty())
watch([() => props.open, () => props.item, () => props.accounts], ([open, item]) => {
  if (!open) return
  form.value = item ? {
    id: item.id, branchId: item.branchId, fromAccountId: item.fromAccountId, toAccountId: item.toAccountId,
    amount: item.amount, description: item.description, occurredAt: item.occurredAt.slice(0, 16),
  } : empty()
}, { immediate: true })
const accountLabel = (account: BankAccountView) => `${account.bankName} ${account.accountNo} - ${account.accountName}`
</script>

<template>
  <SalesDialog :open="open" :title="item ? 'Edit Money Transfer' : 'Add New Transfer'" size="lg" :busy="busy" @close="emit('close')">
    <form class="space-y-4" @submit.prevent="emit('submit', { ...form })">
      <p v-if="error" role="alert" class="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">{{ error }}</p>
      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Date <span class="text-red-500">*</span></label><div :class="modalFormInputColClass"><input v-model="form.occurredAt" type="datetime-local" :class="formControlClass" required /></div></div>
      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">From Account <span class="text-red-500">*</span></label><div :class="modalFormInputColClass"><select v-model="form.fromAccountId" :class="formControlClass" required><option v-for="account in accounts" :key="account.id" :value="account.id" :disabled="account.id === form.toAccountId">{{ accountLabel(account) }}</option></select></div></div>
      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">To Account <span class="text-red-500">*</span></label><div :class="modalFormInputColClass"><select v-model="form.toAccountId" :class="formControlClass" required><option v-for="account in accounts" :key="account.id" :value="account.id" :disabled="account.id === form.fromAccountId">{{ accountLabel(account) }}</option></select></div></div>
      <div :class="modalFormRowClass"><label :class="modalFormLabelClass">Amount <span class="text-red-500">*</span></label><div :class="modalFormInputColClass"><CurrencyInput v-model="form.amount" prefix="Rp" :min="1" required /></div></div>
      <div class="grid grid-cols-12 items-start gap-3 sm:gap-4"><label :class="modalFormLabelClass">Description</label><div :class="modalFormInputColClass"><textarea v-model="form.description" rows="3" class="min-h-20 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200" /></div></div>
      <div class="flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800"><button type="button" class="h-9 rounded-md border border-gray-200 px-4 text-sm font-medium" :disabled="busy" @click="emit('close')">Cancel</button><button type="submit" class="h-9 rounded-md bg-primary px-4 text-sm font-semibold text-white disabled:opacity-50" :disabled="busy">{{ busy ? 'Saving...' : 'Submit' }}</button></div>
    </form>
  </SalesDialog>
</template>

