<script setup lang="ts">
import type { Invoice } from '#server/types/invoice'

defineProps<{ record: Invoice }>()
const isProforma = ref(false)
const printDocument = () => window.print()
</script>

<template>
  <div class="dulank-page dulank-page-invoice-details">
    <SalesDocumentDetailHeader
      title="Invoice Details"
      back-to="/invoice"
      back-label="Back to Invoices List"
      @print="printDocument"
    >
      <template #status><SalesStatusBadge :status="record.status" /></template>
    </SalesDocumentDetailHeader>

    <label class="mb-4 inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm print:hidden dark:border-gray-700 dark:bg-gray-800">
      <input v-model="isProforma" type="checkbox" class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
      Proforma Invoice
    </label>

    <article id="invoice-sheet" class="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8 print:max-w-none print:border-0 print:p-0 print:shadow-none dark:border-gray-800 dark:bg-gray-900">
      <SalesDocumentCompanyHeader />
      <div class="my-6 text-center">
        <h2 class="text-2xl font-bold uppercase tracking-wider text-gray-900 dark:text-white">
          {{ isProforma ? 'Proforma Invoice' : 'Invoice' }}
        </h2>
        <p class="mt-1 text-sm text-gray-500">Ref: {{ record.invoiceNo }}</p>
      </div>

      <div class="mb-6 grid gap-6 text-sm sm:grid-cols-2">
        <div>
          <p class="font-bold text-gray-900 dark:text-white">Invoiced To:</p>
          <p class="mt-1 text-gray-600 dark:text-gray-300">{{ record.customer }}</p>
          <p class="mt-4 text-xs text-gray-500">Alamat, PO Number, dan Shipping To tidak tersedia pada transaksi lama ini.</p>
        </div>
        <dl class="space-y-1 text-gray-600 sm:text-end dark:text-gray-300">
          <div class="flex justify-between gap-4 sm:justify-end"><dt class="font-semibold">Due Date:</dt><dd class="sm:w-36">{{ record.dueDate }}</dd></div>
          <div class="flex justify-between gap-4 sm:justify-end"><dt class="font-semibold">Status:</dt><dd class="sm:w-36">{{ record.status }}</dd></div>
        </dl>
      </div>

      <div class="mb-6 overflow-x-auto">
        <h3 class="app-section-title mb-2">Invoice Items</h3>
        <SalesDocumentUnavailable message="Rincian produk untuk invoice lama ini tidak tersedia. Nilai ringkasan di bawah tetap berasal dari record invoice yang dipilih." />
        <table :class="salesDocumentTable" class="mt-4 min-w-[520px]">
          <tbody>
            <tr><th class="text-end">Amount</th><td class="text-end"><CurrencyDisplay :value="record.amount" align="right" /></td></tr>
            <tr><th class="text-end">Paid</th><td class="text-end"><CurrencyDisplay :value="record.paid" align="right" /></td></tr>
            <tr><th class="text-end">Due</th><td class="text-end font-semibold"><CurrencyDisplay :value="record.amountDue" align="right" /></td></tr>
          </tbody>
        </table>
      </div>

      <SalesDocumentUnavailable message="Informasi rekening pembayaran dan penandatangan tidak tersimpan pada record invoice lama ini." />
    </article>
  </div>
</template>
