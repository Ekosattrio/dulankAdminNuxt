<script setup lang="ts">
import type { Sale } from '#server/types/sale'
const props = defineProps<{ record: Sale }>()
const { formatRupiah } = useFormatters()
const paid = computed(() =>
  props.record.status === 'Paid'
    ? props.record.total
    : props.record.payments?.length
      ? props.record.payments.reduce((sum, p) => sum + p.amount, 0)
      : props.record.status === 'Partial'
        ? null
        : 0,
)
const printDoc = () => window.print()
const printReceipt = printDoc
</script>
<template>
  <div>
    <!-- Top Action Bar (hidden when printing) -->
    <div
      class="no-print mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4 dark:border-gray-800"
    >
      <div class="flex items-center gap-2">
<<<<<<<< HEAD:app/pages/sales-note.vue
        <NuxtLink to="/sales" class="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white">
          <CommonFeatherIcon name="arrow-left" size="14" />
========
        <NuxtLink
          to="/sales"
          class="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          <FeatherIcon name="arrow-left" size="14" />
>>>>>>>> origin/eko:app/components/pages/sales/SalesNoteDocument.vue
          <span>Back to Sales List</span>
        </NuxtLink>
        <span class="text-gray-300">/</span>
        <h4 class="text-base font-bold text-gray-900 dark:text-white">Sales Note</h4>
      </div>

      <button
        type="button"
        class="allow-print flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-hover transition-colors"
        @click="printDoc"
      >
        <CommonFeatherIcon name="printer" size="14" />
        <span>Print Note</span>
      </button>
    </div>

    <!-- Document Paper Sheet (A4 format) -->
    <div
      id="sales-print-document"
      class="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-6 sm:p-10 shadow-sm text-xs text-gray-900"
    >
      <!-- Top Header Row -->
      <div class="flex flex-col sm:flex-row justify-between gap-4 border-b border-gray-200 pb-6 mb-6">
        <!-- Logo -->
        <div class="flex items-center justify-center border border-gray-200 rounded p-4 h-24 w-44">
          <img src="/assets/img/logo.png" alt="Logo" class="max-h-full max-w-full object-contain" />
        </div>

        <!-- Company Info -->
        <div class="text-start sm:text-end space-y-0.5">
          <h2 class="text-lg font-bold text-gray-900">PT. DULANK SEMESTA CIDA</h2>
          <p class="text-gray-600">Jl. Arif Rahman Hakim / Niaga (depan stasiun) Karawang</p>
          <p class="text-gray-600">Kel. Nagasari Kec. Karawang Barat Kab. Karawang Jawa Barat</p>
          <p class="text-gray-500">ptdulanksemestacida@gmail.com</p>
        </div>
      </div>

      <!-- Document Title -->
      <div class="text-center my-6">
        <h1 class="text-2xl font-bold uppercase tracking-wider text-gray-900">Sales Note</h1>
      </div>

      <!-- Invoiced To & Date Meta -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div>
          <span class="font-bold text-gray-700 block mb-1">Invoiced To:</span>
          <p class="text-gray-800 leading-relaxed">
            {{ record.customer }}<br />{{
              record.document?.contact.address || record.document?.shipping.address
            }}
          </p>
        </div>

        <div class="space-y-1.5 sm:text-end">
          <div class="flex sm:justify-end gap-2">
            <span class="text-gray-500 w-24">Sales Date</span>
            <span class="font-medium text-gray-800">: {{ record.date }}</span>
          </div>
          <div class="flex sm:justify-end gap-2">
            <span class="text-gray-500 w-24">No Sales</span>
            <span class="font-medium text-gray-800">: {{ record.saleNo }}</span>
          </div>
        </div>
      </div>

      <!-- Sales Items Table -->
      <div class="mb-6 overflow-x-auto">
        <table class="w-full border-collapse border border-gray-200">
          <thead class="bg-gray-50 font-semibold text-gray-700 border-b border-gray-200">
            <tr>
              <th class="border border-gray-200 px-4 py-2.5 text-start">Products</th>
              <th class="border border-gray-200 px-4 py-2.5 text-center w-24">Price</th>
              <th class="border border-gray-200 px-4 py-2.5 text-center w-20">Order</th>
              <th class="border border-gray-200 px-4 py-2.5 text-end w-32">Amount</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="item in record.items || []" :key="item.id">
              <td class="border border-gray-200 p-4">
                <p class="font-semibold">{{ item.name }}</p>
                <p class="whitespace-pre-line text-gray-600">{{ item.specs }}</p>
              </td>
              <td class="border border-gray-200 px-4 py-3 text-center">{{ formatRupiah(item.price) }}</td>
              <td class="border border-gray-200 px-4 py-3 text-center">
                {{ item.qty }} {{ item.unit || 'Pcs' }}
              </td>
              <td class="border border-gray-200 px-4 py-3 text-right">
                {{ formatRupiah(item.price * item.qty) }}
              </td>
            </tr>
            <tr v-if="!record.items?.length">
              <td colspan="4" class="p-4 text-center text-gray-500">No item details recorded.</td>
            </tr>
            <!-- Financial Breakdown Rows -->
            <tr>
              <td colspan="3" class="border border-gray-200 px-4 py-2 text-end font-semibold text-gray-700">
                Sub Total
              </td>
              <td class="border border-gray-200 px-4 py-2 text-end font-semibold">
                {{ formatRupiah(record.subTotal) }}
              </td>
            </tr>
            <tr>
              <td colspan="3" class="border border-gray-200 px-4 py-2 text-end font-semibold text-gray-700">
                Voucher {{ record.document?.voucher }}
              </td>
              <td class="border border-gray-200 px-4 py-2 text-end font-semibold">
                {{ formatRupiah(record.discount) }}
              </td>
            </tr>
            <tr>
              <td colspan="3" class="border border-gray-200 px-4 py-2 text-end font-semibold text-gray-700">
                Shipping Cost
              </td>
              <td class="border border-gray-200 px-4 py-2 text-end font-semibold">
                {{ formatRupiah(record.deliveryFee) }}
              </td>
            </tr>
            <tr>
              <td colspan="3" class="border border-gray-200 px-4 py-2 text-end font-semibold text-gray-700">
                Sub total before Tax
              </td>
              <td class="border border-gray-200 px-4 py-2 text-end font-semibold">
                {{ formatRupiah(record.subTotal + record.deliveryFee - record.discount) }}
              </td>
            </tr>
            <tr>
              <td colspan="3" class="border border-gray-200 px-4 py-2 text-end font-semibold text-gray-700">
                Tax
              </td>
              <td class="border border-gray-200 px-4 py-2 text-end font-semibold">
                {{ formatRupiah(record.tax) }}
              </td>
            </tr>
            <tr class="bg-gray-50 font-bold text-sm">
              <td colspan="3" class="border border-gray-200 px-4 py-2.5 text-end text-gray-900">
                Grand Total
              </td>
              <td class="border border-gray-200 px-4 py-2.5 text-end text-primary">
                {{ formatRupiah(record.total) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Payment Information & Signatures -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
        <div>
          <h6 class="font-bold text-gray-900 mb-2">Payment Information</h6>
          <div class="space-y-1 text-gray-700">
            <p><span class="font-medium">Bank:</span> BCA KCP Karawang</p>
            <p><span class="font-medium">Account Number:</span> 109-2993242</p>
            <p><span class="font-medium">Account Name:</span> PT. Dulank Semesta Cida</p>
          </div>
          <p class="text-[11px] text-gray-500 mt-3">
            Kindly be informed if the payment has been sent,<br />Thank you
          </p>
        </div>

        <div class="flex flex-col justify-between sm:items-end text-start sm:text-end">
          <span class="text-gray-700">Best Regard,</span>
          <div class="mt-16 border-t border-gray-400 w-44 pt-1">
            <span class="font-bold text-gray-900">Staff Admin</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  @page {
    size: A4;
    margin: 0.3in !important;
  }

  :global(body) {
    background: #fff !important;
    padding: 0 !important;
  }

  .no-print,
  :global(nav),
  :global(aside),
  :global(header) {
    display: none !important;
  }

  :global(main) {
    margin: 0 !important;
    padding: 0 !important;
  }

  #sales-print-document {
    box-shadow: none !important;
    border: none !important;
    margin: 0 !important;
    padding: 0 !important;
    max-width: 100% !important;
  }
}
</style>
