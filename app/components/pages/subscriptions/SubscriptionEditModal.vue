<script setup lang="ts">
import type { SubscriptionItem } from '#server/types/subscription'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import CurrencyInput from '~/components/common/CurrencyInput.vue'
import { formControlClass } from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  subscription: SubscriptionItem | null
  busy?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', data: Partial<SubscriptionItem>): void
}>()

const form = ref<Partial<SubscriptionItem>>({
  subscriber: '',
  plan: 'Basic (Monthly)',
  billingCycle: '30 Days',
  method: 'Credit Card',
  amount: 0,
  status: 'Paid'
})

watch(
  () => props.subscription,
  (val) => {
    if (val) {
      form.value = { ...val }
    } else {
      form.value = {
        subscriber: '',
        plan: 'Basic (Monthly)',
        billingCycle: '30 Days',
        method: 'Credit Card',
        amount: 0,
        status: 'Paid'
      }
    }
  },
  { immediate: true }
)

const handleSubmit = () => {
  emit('save', form.value)
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="subscription ? 'Edit Subscription' : 'Add Subscription'"
    max-width-class="max-w-md"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <div>
        <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Subscriber Name</label>
        <input
          v-model="form.subscriber"
          type="text"
          :class="formControlClass"
          placeholder="e.g. Acme Corp"
          required
        />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Plan</label>
          <select v-model="form.plan" :class="formControlClass">
            <option value="Basic (Monthly)">Basic (Monthly)</option>
            <option value="Basic (Yearly)">Basic (Yearly)</option>
            <option value="Advanced (Monthly)">Advanced (Monthly)</option>
            <option value="Enterprise (Monthly)">Enterprise (Monthly)</option>
            <option value="Enterprise (Yearly)">Enterprise (Yearly)</option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Billing Cycle</label>
          <select v-model="form.billingCycle" :class="formControlClass">
            <option value="30 Days">30 Days</option>
            <option value="365 Days">365 Days</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Payment Method</label>
          <select v-model="form.method" :class="formControlClass">
            <option value="Credit Card">Credit Card</option>
            <option value="Paypal">Paypal</option>
            <option value="Debit Card">Debit Card</option>
          </select>
        </div>

        <div>
          <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Status</label>
          <select v-model="form.status" :class="formControlClass">
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      <div>
        <label class="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">Amount (IDR)</label>
        <CurrencyInput
          v-model="form.amount"
          prefix="Rp "
        />
      </div>

      <div class="flex items-center justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
          :disabled="busy"
        >
          Save
        </button>
      </div>
    </form>
  </SalesDialog>
</template>

