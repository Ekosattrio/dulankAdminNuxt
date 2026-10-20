<script setup lang="ts">
import type { OnlineOrderItem } from '#server/types/online-order'
import { formControlClass, modalFormRowClass, modalFormLabelClass, modalFormInputColClass } from '~/utils/salesUi'
import { formatNumber } from '~/composables/useFormatters'

const props = defineProps<{
  open: boolean
  order: OnlineOrderItem | null
  busy?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [payload: { amount: number; method: string }]
}>()

const payingAmount = ref(0)
const paymentMethod = ref('Midtrans Virtual Account')

watch(
  () => props.order,
  (val) => {
    if (val) {
      payingAmount.value = val.due
      paymentMethod.value = 'Midtrans Virtual Account'
    }
  },
  { immediate: true },
)

function handleSubmit() {
  if (payingAmount.value <= 0) return
  emit('submit', {
    amount: payingAmount.value,
    method: paymentMethod.value,
  })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="`Create Payment: ${order?.reference || ''}`"
    :busy="busy"
    max-width="max-w-md"
    @close="emit('close')"
  >
    <form v-if="order" class="space-y-4" @submit.prevent="handleSubmit">
      <div class="rounded bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
        Total Due: <strong>Rp {{ formatNumber(order.due) }}</strong> for customer <strong>{{ order.customer }}</strong>
      </div>

      <div :class="modalFormRowClass">
        <label for="pay-amount" :class="modalFormLabelClass">
          Paying Amount (Rp) <span class="text-rose-500">*</span>
        </label>
        <div :class="modalFormInputColClass">
          <input
            id="pay-amount"
            v-model.number="payingAmount"
            type="number"
            min="1"
            :max="order.due"
            required
            :class="formControlClass"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label for="pay-gateway" :class="modalFormLabelClass">Payment Gateway</label>
        <div :class="modalFormInputColClass">
          <select id="pay-gateway" v-model="paymentMethod" :class="formControlClass">
            <option value="Midtrans Virtual Account">Midtrans Virtual Account</option>
            <option value="Xendit QRIS">Xendit QRIS</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Direct Bank Transfer">Direct Bank Transfer</option>
          </select>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          type="button"
          class="h-9 px-4 text-sm font-medium rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="busy || payingAmount <= 0"
          class="h-9 px-4 text-sm font-medium rounded bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-400 disabled:opacity-50"
        >
          Confirm Payment
        </button>
      </div>
    </form>
  </SalesDialog>
</template>

