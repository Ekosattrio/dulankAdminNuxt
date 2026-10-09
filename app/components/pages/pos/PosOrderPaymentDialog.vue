<script setup lang="ts">
import type { PosOrderRecord } from '~/composables/usePosOrders'
import SalesDialog from '~/components/sales/SalesDialog.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
import CurrencyInput from '~/components/common/CurrencyInput.vue'
import { modalFormRowClass, modalFormLabelClass, modalFormInputColClass } from '~/utils/salesUi'

const props = defineProps<{
  open: boolean
  order: PosOrderRecord | null
  busy?: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', payload: { saleId: string; amount: number; paymentType: string }): void
}>()

const payingAmount = ref(0)
const paymentType = ref('Cash')
const errorText = ref('')

watch(
  () => props.order,
  (val) => {
    if (val) {
      payingAmount.value = val.due
      paymentType.value = 'Cash'
      errorText.value = ''
    }
  },
  { immediate: true }
)

function handleSubmit() {
  if (!props.order) return
  if (payingAmount.value <= 0) {
    errorText.value = 'Paying amount must be greater than 0'
    return
  }
  if (payingAmount.value > props.order.due) {
    errorText.value = 'Paying amount cannot exceed balance due'
    return
  }
  errorText.value = ''
  emit('save', {
    saleId: props.order.id,
    amount: payingAmount.value,
    paymentType: paymentType.value
  })
}
</script>

<template>
  <SalesDialog
    :open="open"
    :title="`Create Payment: ${order?.saleNo || ''}`"
    size="md"
    @close="emit('close')"
  >
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="order" class="rounded-lg border border-gray-200 bg-gray-50/50 p-3 dark:border-gray-800 dark:bg-gray-800/40">
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-600 dark:text-gray-400">Balance Due:</span>
          <CurrencyDisplay :value="order.due" class="font-bold text-rose-600 dark:text-rose-400" />
        </div>
      </div>

      <div v-if="errorText" class="rounded-md bg-rose-50 p-2.5 text-xs font-semibold text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300">
        {{ errorText }}
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Paying Amount <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <CurrencyInput
            v-model="payingAmount"
            placeholder="0"
            prefix="Rp"
            align="right"
          />
        </div>
      </div>

      <div :class="modalFormRowClass">
        <label :class="modalFormLabelClass">Payment Type <span class="text-rose-500">*</span></label>
        <div :class="modalFormInputColClass">
          <select
            v-model="paymentType"
            class="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 shadow-xs focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          >
            <option value="Cash">Cash</option>
            <option value="QRIS">QRIS / EDC</option>
            <option value="Transfer">Bank Transfer</option>
          </select>
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <button
          type="button"
          class="inline-flex h-9 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          @click="emit('close')"
        >
          Cancel
        </button>
        <button
          type="button"
          :disabled="busy"
          class="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-xs hover:bg-emerald-700 disabled:opacity-50"
          @click="handleSubmit"
        >
          <span v-if="busy">Recording...</span>
          <span v-else>Record Payment</span>
        </button>
      </div>
    </template>
  </SalesDialog>
</template>

