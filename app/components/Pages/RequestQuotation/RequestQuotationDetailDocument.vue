<script setup lang="ts">
import type { RFQItem } from '#server/types/request-quotation'

defineProps<{ record: RFQItem; busy?: boolean; message?: string; error?: string }>()
defineEmits<{ status: [value: RFQItem['status']] }>()
const printDocument = () => window.print()
</script>

<template>
  <div class="dulank-page dulank-page-request-quotation-detail">
    <SalesDocumentDetailHeader
      :title="`Request Quotation ${record.noRequest}`"
      back-to="/request-quotation"
      back-label="Back to RFQ List"
      :busy="busy"
      @print="printDocument"
    >
      <template #status><SalesStatusBadge :status="record.status" /></template>
    </SalesDocumentDetailHeader>
    <SalesFeedback :message="message" :error="error" />

    <article id="rfq-sheet" class="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8 print:max-w-none print:border-0 print:p-0 print:shadow-none dark:border-gray-800 dark:bg-gray-900">
      <SalesDocumentCompanyHeader />
      <div class="my-6 grid gap-x-8 gap-y-2 text-sm text-gray-700 sm:grid-cols-2 dark:text-gray-300">
        <div class="flex"><span class="w-24 font-bold">To:</span><span>{{ record.document?.to || record.customer }}</span></div>
        <div class="flex"><span class="w-24 font-bold">No. RFQ:</span><span class="font-mono font-bold">{{ record.noRequest }}</span></div>
        <div class="flex"><span class="w-24 font-bold">Att:</span><span>{{ record.document?.att || '-' }}</span></div>
        <div class="flex"><span class="w-24 font-bold">Date:</span><span>{{ record.date }}</span></div>
        <div class="flex"><span class="w-24 font-bold">No. Telp:</span><span>{{ record.telp || '-' }}</span></div>
        <div class="flex"><span class="w-24 font-bold">Email:</span><span>{{ record.email || '-' }}</span></div>
      </div>

      <p class="text-sm italic text-gray-600 dark:text-gray-400">Please provide an offer for the following goods/services with the best quality, price, and delivery time via fax or email.</p>

      <div v-if="record.document?.items.length" class="my-6 overflow-x-auto">
        <table :class="salesDocumentTable" class="min-w-[680px]">
          <thead><tr><th>No</th><th>Descriptions</th><th class="text-end">Quantity</th><th>Unit</th><th>ETA</th></tr></thead>
          <tbody><tr v-for="(item, index) in record.document.items" :key="`${item.description}-${index}`"><td>{{ index + 1 }}</td><td>{{ item.description }}</td><td class="text-end">{{ item.quantity }}</td><td>{{ item.unit }}</td><td>{{ item.eta }}</td></tr></tbody>
        </table>
      </div>
      <SalesDocumentUnavailable v-else message="Rincian barang RFQ lama ini tidak tersedia. Metadata di atas tetap berasal dari record yang dipilih." />

      <div class="mt-6 space-y-4 text-sm text-gray-700 dark:text-gray-300">
        <div><p><strong>Due Date:</strong> {{ record.document?.dueDate || '-' }}</p><p><strong>Payment Term:</strong> {{ record.document?.paymentTerm || '-' }}</p></div>
        <div>
          <p class="font-semibold">Quotation requested to:</p>
          <template v-if="record.document?.requestedTo?.length">
            <div v-for="recipient in record.document.requestedTo" :key="`${recipient.department}-${recipient.email}`" class="mt-2">
              <p class="font-bold">{{ recipient.department }}</p><p>Att. {{ recipient.attn || '-' }}</p><p>{{ recipient.email || '-' }}</p><p>{{ recipient.telp || '-' }}</p>
            </div>
          </template>
          <p v-else>-</p>
        </div>
        <div class="pt-5"><p>Hormat kami,</p><p class="mt-10 font-bold">{{ record.document?.signature || '-' }}</p></div>
      </div>
    </article>

    <div class="mx-auto mt-6 flex max-w-4xl flex-wrap justify-end gap-3 print:hidden">
      <button type="button" :class="salesPrimaryButton" :disabled="busy || record.status === 'Ordered'" @click="$emit('status', 'Ordered')"><FeatherIcon name="shopping-cart" :size="14" />Order (Add to purchase)</button>
      <button type="button" :class="salesDangerButton" :disabled="busy || record.status === 'Unavailable'" @click="$emit('status', 'Unavailable')"><FeatherIcon name="x-circle" :size="14" />Unavailable</button>
    </div>
  </div>
</template>
