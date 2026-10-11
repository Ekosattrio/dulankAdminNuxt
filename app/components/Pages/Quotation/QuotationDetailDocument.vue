<script setup lang="ts">
import type { Quotation } from '#server/types/quotation'

const props = defineProps<{ record: Quotation; busy?: boolean; message?: string; error?: string }>()
defineEmits<{ status: [value: Quotation['status']] }>()
const subtotal = computed(() => props.record.document?.items.reduce((sum, item) => sum + item.amount, 0) || 0)
const taxableBase = computed(() => subtotal.value + (props.record.document?.shippingCost || 0))
const tax = computed(() => props.record.document?.pricesIncludeTax ? 0 : Math.round(taxableBase.value * (props.record.document?.taxRate || 0) / 100))
const printDocument = () => window.print()
</script>

<template>
  <div class="dulank-page dulank-page-quotation-detail">
    <SalesDocumentDetailHeader
      :title="`Quotation ${record.noQuotation}`"
      back-to="/quotation"
      back-label="Back to Quotation List"
      :busy="busy"
      @print="printDocument"
    >
      <template #status><SalesStatusBadge :status="record.status" /></template>
    </SalesDocumentDetailHeader>
    <SalesFeedback :message="message" :error="error" />

    <article id="quotation-sheet" class="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8 print:max-w-none print:border-0 print:p-0 print:shadow-none dark:border-gray-800 dark:bg-gray-900">
      <SalesDocumentCompanyHeader />
      <div class="my-6">
        <h2 class="text-2xl font-bold uppercase tracking-wider">Quotation</h2>
        <dl class="mt-3 grid gap-x-8 gap-y-1 text-sm text-gray-600 sm:grid-cols-2 dark:text-gray-300">
          <div class="flex"><dt class="w-24 font-semibold">No:</dt><dd class="font-mono">{{ record.noQuotation }}</dd></div>
          <div class="flex"><dt class="w-24 font-semibold">Date:</dt><dd>{{ record.date }}</dd></div>
          <div class="flex"><dt class="w-24 font-semibold">Currency:</dt><dd>{{ record.document?.currency || '-' }}</dd></div>
          <div class="flex"><dt class="w-24 font-semibold">TOP:</dt><dd>{{ record.document?.top || '-' }}</dd></div>
          <div class="flex"><dt class="w-24 font-semibold">Att:</dt><dd>{{ record.document?.att || '-' }}</dd></div>
          <div class="flex"><dt class="w-24 font-semibold">Channel:</dt><dd>{{ record.channel }}</dd></div>
        </dl>
      </div>

      <div class="mb-6 grid gap-6 text-sm sm:grid-cols-2">
        <div><p class="font-bold">To:</p><p class="font-semibold">{{ record.customer }}</p><p>{{ record.email || '-' }}</p><p class="whitespace-pre-line text-gray-600 dark:text-gray-300">{{ record.document?.contact.address || '-' }}</p></div>
        <div><p class="font-bold">Ship To:</p><p>{{ record.document?.shipping.method || '-' }}</p><p class="whitespace-pre-line text-gray-600 dark:text-gray-300">{{ record.document?.shipping.address || '-' }}</p></div>
      </div>

      <div v-if="record.document?.items.length" class="mb-6 overflow-x-auto">
        <table :class="salesDocumentTable" class="min-w-[760px]">
          <thead><tr><th>Products</th><th class="text-end">MOQ</th><th class="text-end">Unit Price</th><th class="text-end">Order</th><th>Unit</th><th class="text-end">Amount</th></tr></thead>
          <tbody>
            <tr v-for="(item, index) in record.document.items" :key="`${item.productName}-${index}`">
              <td><strong>{{ item.productName }}</strong><p class="whitespace-pre-line text-gray-500">{{ item.description }}</p></td>
              <td class="text-end">{{ item.moq }}</td><td><CurrencyDisplay :value="item.unitPrice" align="right" /></td><td class="text-end">{{ item.order }}</td><td>{{ item.unit }}</td><td><CurrencyDisplay :value="item.amount" align="right" /></td>
            </tr>
            <tr><th colspan="5" class="text-end">Sub Total</th><td><CurrencyDisplay :value="subtotal" align="right" /></td></tr>
            <tr><th colspan="5" class="text-end">Shipping Cost</th><td><CurrencyDisplay :value="record.document.shippingCost" align="right" /></td></tr>
            <tr><th colspan="5" class="text-end">PPN ({{ record.document.taxRate }}%)</th><td><CurrencyDisplay :value="tax" align="right" /></td></tr>
            <tr><th colspan="5" class="text-end">Grand Total</th><td><CurrencyDisplay :value="record.total" align="right" /></td></tr>
          </tbody>
        </table>
      </div>
      <SalesDocumentUnavailable v-else message="Rincian produk, pengiriman, dan term quotation lama ini tidak tersedia. Total di bawah tetap berasal dari record yang dipilih." />

      <div class="mt-6 grid gap-6 border-t border-gray-100 pt-6 text-sm sm:grid-cols-2 dark:border-gray-800">
        <div><h3 class="font-bold">Terms & Conditions:</h3><ol v-if="record.document?.terms.length" class="mt-2 list-decimal space-y-1 ps-5"><li v-for="term in record.document.terms" :key="term">{{ term }}</li></ol><p v-else>-</p></div>
        <div class="sm:text-end"><p>Yours Faithfully,</p><p class="mt-12 font-bold">{{ record.document?.signature || '-' }}</p><p>{{ record.document?.position || '-' }}</p></div>
      </div>
    </article>

    <div class="mx-auto mt-6 flex max-w-4xl flex-wrap justify-end gap-3 print:hidden">
      <button type="button" :class="salesPrimaryButton" :disabled="busy || record.status === 'Ordered'" @click="$emit('status', 'Ordered')"><FeatherIcon name="check-circle" :size="14" />Order (Accept Quotation)</button>
      <button type="button" :class="salesDangerButton" :disabled="busy || record.status === 'Rejected'" @click="$emit('status', 'Rejected')"><FeatherIcon name="x-circle" :size="14" />Reject Quotation</button>
    </div>
  </div>
</template>
