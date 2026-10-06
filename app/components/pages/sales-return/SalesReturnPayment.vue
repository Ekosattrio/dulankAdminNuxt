<script setup lang="ts">
import type { SalesReturn, ReturnPayment } from '#server/types/sales-return'
import CurrencyInput from '~/components/common/CurrencyInput.vue'
const props = defineProps<{ record: SalesReturn | null; busy: boolean; error: string }>()
defineEmits<{ close: []; submit: [form: ReturnPayment] }>()
const { formatRupiah } = useFormatters()
const form = ref<ReturnPayment>({
  method: 'Cash',
  bankName: '',
  accountNumber: '',
  accountName: '',
  amount: 0,
  notes: '',
  reference: '',
})
watch(
  () => props.record,
  (record) => {
    if (record)
      form.value = {
        method: 'Cash',
        bankName: '',
        accountNumber: '',
        accountName: record.customer,
        amount: record.total,
        notes: '',
        reference: '',
      }
  },
  { immediate: true },
)
</script>
<template>
  <SalesDialog :open="!!record" title="Payment-OUT" :busy="busy" @close="$emit('close')">
    <form @submit.prevent="$emit('submit', { ...form })">
      <fieldset :disabled="busy" class="space-y-5 disabled:opacity-60">
        <p v-if="error" role="alert" class="text-xs text-red-600">{{ error }}</p>
        <div class="space-y-2 text-xs">
          <p class="font-medium">Payment Method</p>
          <div class="flex gap-5">
            <label class="flex items-center gap-2"
              ><input v-model="form.method" type="radio" value="Cash" class="accent-primary" />Cash</label
            ><label class="flex items-center gap-2"
              ><input
                v-model="form.method"
                type="radio"
                value="Transfer"
                class="accent-primary"
              />Transfer</label
            >
          </div>
        </div>
        <div
          v-if="form.method === 'Transfer'"
          class="space-y-3 rounded-md border border-gray-200 p-4 dark:border-gray-700"
        >
          <h3 class="text-xs font-semibold">Transfer Detail</h3>
          <label :class="salesLabel"
            >Bank / Wallet<input v-model="form.bankName" :class="salesField" required /></label
          ><label :class="salesLabel"
            >Account Name<input v-model="form.accountName" :class="salesField" required /></label
          ><label :class="salesLabel"
            >Account Number<input v-model="form.accountNumber" :class="salesField" required /></label
          ><label :class="salesLabel">Reference<input v-model="form.reference" :class="salesField" /></label>
        </div>
        <label :class="salesLabel"
          >Paying Amount *<CurrencyInput
            v-model="form.amount"
            thousand-separator=","
            required
        /></label>
        <div class="flex justify-between text-xs">
          <span>Total Due ({{ record?.returnNo }})</span><span>{{ formatRupiah(record?.total || 0) }}</span>
        </div>
        <label :class="salesLabel">Notes<textarea v-model="form.notes" :class="salesField" rows="3" /></label>
        <div class="flex justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
          <button type="button" :class="salesSecondaryButton" @click="$emit('close')">Cancel</button
          ><button type="submit" :class="salesPrimaryButton">{{ busy ? 'Saving...' : 'Submit' }}</button>
        </div>
      </fieldset>
    </form>
  </SalesDialog>
</template>
