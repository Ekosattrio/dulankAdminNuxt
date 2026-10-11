<script setup lang="ts">
import type { SalesDocument } from '#server/types/sales-document'
import CurrencyInput from '~/components/Common/CurrencyInput.vue'
import { salesField, salesLabel, salesPrimaryButton } from '~/utils/salesUi'

defineProps<{ voucherMessage?: string; disabled?: boolean }>()
const document = defineModel<SalesDocument>('document', { required: true })
const deliveryFee = defineModel<number>('deliveryFee', { required: true })
const directDiscount = defineModel<number>('directDiscount', { required: true })
const emit = defineEmits<{ applyVoucher: []; amountChange: [] }>()

const transactionCodes = [
  '01 - To Other party VAT Collector',
  '02 - To Government Intitution as VAT Colletor',
  '03 - To VAT Collector other than Governmnent Institution',
  '04 - Other Tax Base',
  '05 - Certain Value Tax Base',
  '06 - To Tourist for VAT Refund for Tourist',
  '07 - Vat Uncollected',
  '08 - VAT Exempted',
  '09 - Sale of unrekated to business asset',
  '10 - Other delivery of good/services',
]

function changeTax() {
  if (!document.value.taxRate) document.value.transactionCode = ''
  emit('amountChange')
}
</script>

<template>
  <section class="space-y-4" aria-label="Sales adjustments">
    <label :class="salesLabel">
      Voucher
      <div class="flex gap-2">
        <input v-model="document.voucher" :class="salesField" placeholder="Voucher code" />
        <button type="button" :class="salesPrimaryButton" :disabled="disabled" @click="emit('applyVoucher')">
          Apply
        </button>
      </div>
      <span v-if="voucherMessage" role="status" class="app-supporting-text text-gray-600 dark:text-gray-400">
        {{ voucherMessage }}
      </span>
    </label>
    <label :class="salesLabel">
      Shipping Costs
      <CurrencyInput
        v-model="deliveryFee"
        thousand-separator="."
        :min="0"
        align="right"
        @update:model-value="emit('amountChange')"
      />
    </label>
    <label :class="salesLabel">
      Discount
      <CurrencyInput
        v-model="directDiscount"
        thousand-separator="."
        :min="0"
        align="right"
        @update:model-value="emit('amountChange')"
      />
    </label>
    <div class="space-y-3 rounded-lg border border-gray-200 p-3 dark:border-gray-700">
      <label :class="salesLabel">
        Tax
        <select v-model.number="document.taxRate" :class="salesField" @change="changeTax">
          <option :value="0">Without Tax (Default)</option>
          <option :value="11">Ppn 11%</option>
        </select>
      </label>
      <label v-if="document.taxRate" :class="salesLabel">
        Transaction Code
        <select v-model="document.transactionCode" :class="salesField" required>
          <option value="">Select Transaction Code</option>
          <option v-for="option in transactionCodes" :key="option" :value="option.slice(0, 2)">
            {{ option }}
          </option>
        </select>
      </label>
    </div>
    <label :class="salesLabel">
      Notes
      <input v-model="document.notes" :class="salesField" />
    </label>
  </section>
</template>
