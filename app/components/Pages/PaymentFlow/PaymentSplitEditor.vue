<script setup lang="ts">
import CurrencyInput from '~/components/Common/CurrencyInput.vue'
import type { PaymentSplitEntry } from '#server/types/payment-flow'
import { formControlClass, modalFormInputColClass, modalFormLabelClass, modalFormRowClass } from '~/utils/salesUi'

const props = defineProps<{
  modelValue: PaymentSplitEntry[]
  open: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: PaymentSplitEntry[]]
  open: []
  cancel: []
}>()

function updateEntry(index: number, patch: Partial<PaymentSplitEntry>) {
  emit(
    'update:modelValue',
    props.modelValue.map((entry, entryIndex) => (entryIndex === index ? { ...entry, ...patch } : entry)),
  )
}

function addEntry() {
  emit('update:modelValue', [
    ...props.modelValue,
    { id: crypto.randomUUID(), method: 'Cash', amount: 0 },
  ])
}
</script>

<template>
  <div class="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
    <div v-if="!open" class="text-end">
      <button type="button" class="text-xs font-semibold text-[#ff9f43] hover:underline" @click="emit('open')">
        Add Split Payment
      </button>
    </div>
    <div v-else class="space-y-4 rounded-md border border-dashed border-[#ff9f43]/40 bg-amber-50/30 p-3 dark:bg-amber-950/20">
      <section v-for="(entry, index) in modelValue" :key="entry.id" class="space-y-3">
        <h4 class="app-supporting-text font-semibold text-gray-800 dark:text-gray-200">Payment {{ index + 1 }}</h4>
        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">Payment Method</label>
          <div :class="modalFormInputColClass">
            <select
              :value="entry.method"
              :class="formControlClass"
              @change="updateEntry(index, { method: ($event.target as HTMLSelectElement).value as PaymentSplitEntry['method'] })"
            >
              <option>Cash</option>
              <option>Balance</option>
              <option>Transfer</option>
            </select>
          </div>
        </div>
        <div :class="modalFormRowClass">
          <label :class="modalFormLabelClass">Amount</label>
          <div :class="modalFormInputColClass">
            <CurrencyInput
              :model-value="entry.amount"
              :min="0"
              align="left"
              @update:model-value="updateEntry(index, { amount: $event })"
            />
          </div>
        </div>
      </section>
      <div class="flex justify-between pt-1">
        <button type="button" class="text-xs font-semibold text-[#ff9f43] hover:underline" @click="emit('cancel')">Cancel</button>
        <button type="button" class="text-xs font-semibold text-[#ff9f43] hover:underline" @click="addEntry">Add Payment</button>
      </div>
    </div>
  </div>
</template>
