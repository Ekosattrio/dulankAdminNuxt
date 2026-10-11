<script setup lang="ts">
import type { DeliveryNote } from '#server/types/delivery-note'

defineProps<{ record: DeliveryNote; busy?: boolean; message?: string; error?: string }>()
defineEmits<{ status: [value: DeliveryNote['status']] }>()
const printDocument = () => window.print()
</script>

<template>
  <div class="dulank-page dulank-page-delivery-note-detail">
    <SalesDocumentDetailHeader
      title="Delivery Note Detail"
      back-to="/delivery-note"
      back-label="Back to Delivery Note List"
      :busy="busy"
      @print="printDocument"
    >
      <template #status><SalesStatusBadge :status="record.status" /></template>
    </SalesDocumentDetailHeader>
    <SalesFeedback :message="message" :error="error" />

    <article id="dn-sheet" class="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8 print:max-w-none print:border-0 print:p-0 print:shadow-none dark:border-gray-800 dark:bg-gray-900">
      <SalesDocumentCompanyHeader />
      <h2 class="my-6 text-2xl font-bold uppercase tracking-wider text-gray-900 dark:text-white">Delivery Note</h2>

      <div class="mb-6 grid gap-6 text-sm sm:grid-cols-2">
        <div>
          <p class="font-bold text-gray-900 dark:text-white">Ship To:</p>
          <p class="mt-1 font-semibold">{{ record.customer }}</p>
          <p class="whitespace-pre-line text-gray-600 dark:text-gray-300">{{ record.shippingAddress || '-' }}</p>
        </div>
        <dl class="space-y-1 text-gray-700 sm:text-end dark:text-gray-300">
          <div class="flex justify-between gap-3 sm:justify-end"><dt class="font-semibold">DN No:</dt><dd class="font-mono sm:w-40">{{ record.dnNo }}</dd></div>
          <div class="flex justify-between gap-3 sm:justify-end"><dt class="font-semibold">DN Date:</dt><dd class="sm:w-40">{{ record.date }}</dd></div>
          <div class="flex justify-between gap-3 sm:justify-end"><dt class="font-semibold">No Sales:</dt><dd class="sm:w-40">{{ record.noSales }}</dd></div>
          <div class="flex justify-between gap-3 sm:justify-end"><dt class="font-semibold">PO:</dt><dd class="sm:w-40">{{ record.po || '-' }}</dd></div>
          <div class="flex justify-between gap-3 sm:justify-end"><dt class="font-semibold">Shipping By:</dt><dd class="sm:w-40">{{ record.shippingBy || '-' }}</dd></div>
          <div class="flex justify-between gap-3 sm:justify-end"><dt class="font-semibold">Reference:</dt><dd class="sm:w-40">{{ record.reference || '-' }}</dd></div>
        </dl>
      </div>

      <div class="mb-8 overflow-x-auto">
        <table :class="salesDocumentTable" class="min-w-[720px]">
          <thead><tr><th>No</th><th>Item Description</th><th class="text-end">Qty</th><th>Unit</th><th>Packing Qty</th><th>Weight (Kg)</th></tr></thead>
          <tbody>
            <tr v-for="(item, index) in record.items" :key="`${item.description}-${index}`">
              <td>{{ index + 1 }}</td><td>{{ item.description }}</td><td class="text-end">{{ item.qty }}</td><td>{{ item.unit }}</td><td>{{ item.packingQty }}</td><td>{{ item.weight }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="grid grid-cols-2 gap-5 border-t border-gray-100 pt-8 text-center text-sm sm:grid-cols-4 dark:border-gray-800">
        <div v-for="item in [{ label: 'Receive By', value: record.receiveBy }, { label: 'Security / Check', value: record.security }, { label: 'Driver', value: record.driver }, { label: 'Issued By', value: record.issuedBy }]" :key="item.label">
          <p class="font-bold">{{ item.label }}</p><div class="mx-auto mt-12 w-3/4 border-b border-gray-400" /><p class="mt-1">{{ item.value || '-' }}</p>
        </div>
      </div>
    </article>

    <div class="mx-auto mt-6 flex max-w-4xl flex-wrap justify-end gap-3 print:hidden">
      <button type="button" :class="salesPrimaryButton" :disabled="busy || record.status === 'Complete'" @click="$emit('status', 'Complete')">
        <FeatherIcon name="check-circle" :size="14" />Complete
      </button>
      <button type="button" :class="salesDangerButton" :disabled="busy || record.status === 'Rescheduled'" @click="$emit('status', 'Rescheduled')">
        <FeatherIcon name="x-circle" :size="14" />Fail (Reschedule)
      </button>
    </div>
  </div>
</template>
