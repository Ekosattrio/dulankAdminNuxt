<script setup lang="ts">
import type { PaymentBankTransfer, PaymentFlowKind, PaymentFlowMethod } from '#server/types/payment-flow'
import { formControlClass, modalFormInputColClass, modalFormLabelClass, modalFormRowClass } from '~/utils/salesUi'

const props = defineProps<{
  kind: PaymentFlowKind
  mode: 'add' | 'edit' | 'payment'
  method: PaymentFlowMethod
  bankTransfer: PaymentBankTransfer
}>()

const emit = defineEmits<{
  'update:method': [value: PaymentFlowMethod]
  'update:bankTransfer': [value: PaymentBankTransfer]
}>()

const paymentMethods = computed<PaymentFlowMethod[]>(() =>
  props.kind === 'inflow' ? ['Cash', 'Transfer', 'Balance'] : ['Cash', 'Transfer'],
)

function updateTransfer(patch: Partial<PaymentBankTransfer>) {
  emit('update:bankTransfer', { ...props.bankTransfer, ...patch })
}
</script>

<template>
  <div :class="modalFormRowClass">
    <label :class="modalFormLabelClass">Payment Method</label>
    <div :class="[modalFormInputColClass, 'flex flex-wrap items-center gap-4']">
      <label v-for="option in paymentMethods" :key="option" class="inline-flex cursor-pointer items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300">
        <input
          class="size-4 accent-primary"
          type="radio"
          :value="option"
          :checked="method === option"
          @change="emit('update:method', option)"
        />
        <span>{{ option === 'Balance' && mode !== 'add' ? 'Balanced' : option }}</span>
      </label>
    </div>
  </div>

  <div v-if="method === 'Transfer'" class="space-y-3 rounded-lg border border-gray-200 bg-gray-50/50 p-3 dark:border-gray-700 dark:bg-gray-800/40">
    <div :class="modalFormRowClass">
      <label :class="modalFormLabelClass">From Bank Account</label>
      <div :class="modalFormInputColClass">
        <select
          :value="bankTransfer.fromBankAccount"
          :class="formControlClass"
          @change="updateTransfer({ fromBankAccount: ($event.target as HTMLSelectElement).value })"
        >
          <option>Cipta Kreasi PT / BRI / 1320009982282</option>
          <option>Dulank Semesta Cida PT / BCA / 1092993242</option>
        </select>
      </div>
    </div>
    <template v-if="kind === 'outflow'">
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">To Bank Account</label>
        <div :class="modalFormInputColClass" class="app-supporting-text font-semibold text-gray-700 dark:text-gray-300">Recipient details</div>
      </div>
      <div v-for="field in [
        { key: 'toBankWallet', label: 'Bank / Wallet' },
        { key: 'toAccountName', label: 'Account Name' },
        { key: 'toAccountNumber', label: 'Account Number' },
        { key: 'reference', label: 'Reference' },
      ]" :key="field.key" :class="modalFormRowClass">
        <label :class="modalFormLabelClass">{{ field.label }}</label>
        <div :class="modalFormInputColClass">
          <input
            :value="bankTransfer[field.key as keyof PaymentBankTransfer]"
            :class="formControlClass"
            @input="updateTransfer({ [field.key]: ($event.target as HTMLInputElement).value })"
          />
        </div>
      </div>
    </template>
  </div>

  <div v-if="method === 'Balance'" :class="modalFormRowClass">
    <label :class="modalFormLabelClass">Balance</label>
    <div :class="modalFormInputColClass" class="text-xs font-semibold text-gray-900 dark:text-gray-100">1.500.000</div>
  </div>
</template>
