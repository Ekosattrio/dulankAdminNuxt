<script setup lang="ts">
import type { SubscriptionRecord, SubscriptionUpdateCommand } from '#server/types/subscription'
import { formControlClass, modalFormInputColClass, modalFormLabelClass, modalFormRowClass } from '~/utils/salesUi'

const props = defineProps<{ open: boolean; item: SubscriptionRecord | null; busy?: boolean }>()
const emit = defineEmits<{ close: []; submit: [payload: SubscriptionUpdateCommand] }>()

const form = reactive<Required<SubscriptionUpdateCommand>>({
  subscriber: '',
  planTier: 'Basic',
  billingCycle: '30 Days',
  paymentMethod: 'Credit Card',
  amount: 0,
  createdDate: '',
  expiringOn: '',
  status: 'Paid',
})
const errorMessage = ref('')

watch(() => props.item, (item) => {
  if (!item) return
  Object.assign(form, {
    subscriber: item.subscriber,
    planTier: item.planTier,
    billingCycle: item.billingCycle,
    paymentMethod: item.paymentMethod,
    amount: item.amount,
    createdDate: item.createdDate,
    expiringOn: item.expiringOn,
    status: item.status,
  })
  errorMessage.value = ''
}, { immediate: true })

function submit() {
  if (!form.subscriber.trim()) return void (errorMessage.value = 'Subscriber is required')
  if (form.amount < 0) return void (errorMessage.value = 'Amount cannot be negative')
  if (!form.createdDate || !form.expiringOn) return void (errorMessage.value = 'Created and expiring dates are required')
  errorMessage.value = ''
  emit('submit', { ...form, subscriber: form.subscriber.trim() })
}
</script>

<template>
  <SalesDialog :open="open" title="Edit Subscription" medium :busy="busy" @close="$emit('close')">
    <form class="space-y-4" @submit.prevent="submit">
      <p v-if="errorMessage" role="alert" class="rounded-md bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">{{ errorMessage }}</p>
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Subscriber <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass"><input v-model="form.subscriber" :class="formControlClass" required /></div>
      </div>
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Plan</label>
        <div :class="modalFormInputColClass"><select v-model="form.planTier" :class="formControlClass"><option>Basic</option><option>Advanced</option><option>Enterprise</option></select></div>
      </div>
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Billing Cycle</label>
        <div :class="modalFormInputColClass"><select v-model="form.billingCycle" :class="formControlClass"><option>30 Days</option><option>365 Days</option></select></div>
      </div>
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Payment Method</label>
        <div :class="modalFormInputColClass"><select v-model="form.paymentMethod" :class="formControlClass"><option>Credit Card</option><option>Paypal</option><option>Debit Card</option></select></div>
      </div>
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Amount</label>
        <div :class="modalFormInputColClass"><CurrencyInput v-model="form.amount" prefix="Rp" :min="0" /></div>
      </div>
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Created Date</label>
        <div :class="modalFormInputColClass"><input v-model="form.createdDate" type="date" :class="formControlClass" required /></div>
      </div>
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Expiring On</label>
        <div :class="modalFormInputColClass"><input v-model="form.expiringOn" type="date" :class="formControlClass" required /></div>
      </div>
      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Status</label>
        <div :class="modalFormInputColClass"><select v-model="form.status" :class="formControlClass"><option>Paid</option><option>Unpaid</option></select></div>
      </div>
      <div class="flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
        <button type="button" :class="salesSecondaryButton" :disabled="busy" @click="$emit('close')">Cancel</button>
        <button type="submit" :class="salesPrimaryButton" :disabled="busy">{{ busy ? 'Saving...' : 'Submit' }}</button>
      </div>
    </form>
  </SalesDialog>
</template>
