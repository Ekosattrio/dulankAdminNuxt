<script setup lang="ts">
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'

defineProps<{
  subTotal: number
  voucher: number
  shippingCost: number
  discount: number
  totalBeforeTax: number
  tax: number
  grandTotal: number
}>()
</script>

<template>
  <section class="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/60" aria-labelledby="sales-summary-title">
    <h2 id="sales-summary-title" class="app-section-title mb-3">Order Calculation Summary</h2>
    <dl class="space-y-3 text-sm text-gray-600 dark:text-gray-300">
      <div class="flex items-center justify-between gap-4"><dt>Sub Total</dt><dd><CurrencyDisplay :value="subTotal" prefix="" /></dd></div>
      <div class="flex items-center justify-between gap-4"><dt>Voucher</dt><dd><CurrencyDisplay :value="voucher" prefix="" /></dd></div>
      <div class="flex items-center justify-between gap-4"><dt>Shipping Cost</dt><dd><CurrencyDisplay :value="shippingCost" prefix="" /></dd></div>
      <div class="flex items-center justify-between gap-4"><dt>Discount</dt><dd><CurrencyDisplay :value="discount" prefix="" /></dd></div>
      <div class="flex items-center justify-between gap-4 border-t border-gray-200 pt-3 dark:border-gray-700"><dt>Total Before Tax</dt><dd><CurrencyDisplay :value="totalBeforeTax" prefix="" /></dd></div>
      <div class="flex items-center justify-between gap-4"><dt>Tax</dt><dd><CurrencyDisplay :value="tax" prefix="" /></dd></div>
      <div class="flex items-center justify-between gap-4 border-t border-gray-200 pt-3 text-base font-bold text-gray-900 dark:border-gray-700 dark:text-white"><dt>Grand Total</dt><dd><CurrencyDisplay :value="grandTotal" prefix="" /></dd></div>
    </dl>
  </section>
</template>
