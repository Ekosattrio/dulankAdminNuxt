<script setup lang="ts">
import type { OnlineOrder } from '#server/types/online-order'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import CurrencyInput from '~/components/common/CurrencyInput.vue'
import { formatNumber } from '~/composables/useFormatters'

const props = defineProps<{
  open: boolean
  order: OnlineOrder | null
  busy?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: { amount: number; paymentMethod: string }): void
}>()

const payingAmount = ref(0)
const paymentMethod = ref('Midtrans')

watch(
  () => props.order,
  (val) => {
    if (val) {
      payingAmount.value = val.due
      paymentMethod.value = val.paymentMethod || 'Midtrans'
    }
  },
  { immediate: true }
)

function handleSubmit() {
  if (payingAmount.value <= 0) return
  emit('submit', {
    amount: payingAmount.value,
    paymentMethod: paymentMethod.value,
  })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="`Record Payment: ${order?.reference || ''}`"
    size="md"
    :busy="busy"
    @close="emit('close')"
  >
    <form id="online-order-payment-form" @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="order" class="rounded-lg bg-gray-50 p-3 text-xs dark:bg-gray-800">
        <div class="flex justify-between py-0.5">
          <span class="text-gray-500 dark:text-gray-400">Customer:</span>
          <span class="font-bold text-gray-900 dark:text-white">{{ order.customer }}</span>
        </div>
        <div class="flex justify-between py-0.5">
          <span class="text-gray-500 dark:text-gray-400">Total Order:</span>
          <span class="font-medium text-gray-900 dark:text-white">Rp {{ formatNumber(order.grandTotal) }}</span>
        </div>
        <div class="flex justify-between py-0.5">
          <span class="text-gray-500 dark:text-gray-400">Outstanding Due:</span>
          <span class="font-bold text-rose-600 dark:text-rose-400">Rp {{ formatNumber(order.due) }}</span>
        </div>
      </div>

      <!-- Payment Amount -->
      <div class="grid grid-cols-12 items-center gap-3">
        <label class="col-span-5 text-xs font-semibold text-gray-700 dark:text-gray-300">
          Payment Amount (IDR) <span class="text-rose-500">*</span>
        </label>
        <div class="col-span-7">
          <CurrencyInput
            v-model="payingAmount"
            :max="order?.due || 0"
            required
            class="h-9 w-full"
          />
        </div>
      </div>

      <!-- Payment Gateway / Method -->
      <div class="grid grid-cols-12 items-center gap-3">
        <label class="col-span-5 text-xs font-semibold text-gray-700 dark:text-gray-300">
          Payment Gateway
        </label>
        <div class="col-span-7">
          <select
            v-model="paymentMethod"
            class="h-9 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 shadow-xs focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="Midtrans">Midtrans Virtual Account</option>
            <option value="Xendit">Xendit QRIS</option>
            <option value="CreditCard">Credit Card</option>
            <option value="Transfer">Direct Bank Transfer</option>
          </select>
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <button
          type="button"
          :disabled="busy"
          class="h-9 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          type="submit"
          form="online-order-payment-form"
          :disabled="busy || payingAmount <= 0"
          class="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-xs hover:bg-primary-600 disabled:opacity-50"
        >
          {{ busy ? 'Saving...' : 'Confirm Payment' }}
        </button>
      </div>
    </template>
  </SalesDialog>
</template>

