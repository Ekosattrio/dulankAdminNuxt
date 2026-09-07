<script setup lang="ts">
const route = useRoute();
const quoteNo = computed(() => (route.query.no as string) || "#Q21000220213");

useHead({
  title: computed(() => `Quotation ${quoteNo.value} - Kacetak System`),
});

const quoteStatus = ref<"pending" | "accepted" | "rejected">("pending");
const notice = ref("");

const handleAccept = () => {
  quoteStatus.value = "accepted";
  notice.value = "Order Accepted! Quotation moved to sales pipeline.";
};

const handleReject = () => {
  quoteStatus.value = "rejected";
  notice.value = "Quotation has been rejected.";
};

const handlePrint = () => {
  window.print();
};
</script>

<template>
  <div>
    <!-- Top Action Bar (Hidden in Print) -->
    <div class="print:hidden">
      <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-3">
          <h4 class="text-xl font-bold text-gray-900 dark:text-white">Quotation {{ quoteNo }}</h4>
          <span
            v-if="quoteStatus === 'accepted'"
            class="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200"
          >
            Accepted
          </span>
          <span
            v-else-if="quoteStatus === 'rejected'"
            class="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200"
          >
            Rejected
          </span>
        </div>

        <div class="flex items-center gap-2">
          <NuxtLink
            to="/quotation"
            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <FeatherIcon name="arrow-left" size="14" />
            <span>Back to Quotation List</span>
          </NuxtLink>

          <button
            type="button"
            class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            title="Export PDF"
          >
            <img src="/assets/img/icons/pdf.svg" alt="PDF" class="h-4 w-4" />
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary/90"
            title="Print Quotation"
            @click="handlePrint"
          >
            <FeatherIcon name="printer" size="14" />
            <span>Print</span>
          </button>
        </div>
      </div>

      <div
        v-if="notice"
        :class="[
          'mb-4 rounded-lg p-3 text-xs font-medium border',
          quoteStatus === 'accepted'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : 'bg-rose-50 text-rose-800 border-rose-200',
        ]"
      >
        {{ notice }}
      </div>
    </div>

    <!-- Printable Quotation Sheet -->
    <div
      id="quotation-sheet"
      class="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm print:max-w-none print:border-none print:p-0 print:shadow-none dark:border-gray-800 dark:bg-gray-900"
    >
      <!-- Header: Logo & Company Info -->
      <div class="flex items-start justify-between border-b border-gray-100 pb-6 dark:border-gray-800">
        <!-- Logo Box -->
        <div
          class="flex h-24 w-44 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
        >
          <span class="text-sm font-bold text-gray-400">Logo</span>
        </div>

        <!-- Company Details -->
        <div class="text-end text-xs text-gray-600 dark:text-gray-400">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">PT. DULANK SEMESTA CIDA</h3>
          <p class="mt-1">Jl. Arif Rahman Hakim / Niaga (depan stasiun) Karawang</p>
          <p>Kel. Nagasari Kec. Karawang Barat Kab. Karawang Jawa Barat</p>
          <p class="font-medium text-gray-800 dark:text-gray-300">ptdulanksemestacida@gmail.com</p>
        </div>
      </div>

      <!-- Title & Metadata -->
      <div class="my-6">
        <h1 class="text-2xl font-bold uppercase tracking-wider text-gray-900 dark:text-white">Quotation</h1>
        <div class="mt-3 grid grid-cols-2 gap-x-8 gap-y-1 text-xs text-gray-600 dark:text-gray-300 sm:w-1/2">
          <div class="flex">
            <span class="w-20 font-semibold">No:</span> <span class="font-mono">{{ quoteNo }}</span>
          </div>
          <div class="flex"><span class="w-20 font-semibold">Date:</span> <span>26/06/2025</span></div>
          <div class="flex"><span class="w-20 font-semibold">Currency:</span> <span>IDR</span></div>
          <div class="flex"><span class="w-20 font-semibold">TOP:</span> <span>14 Days</span></div>
          <div class="col-span-2 flex"><span class="w-20 font-semibold">Att:</span> <span>Ibu Dewi Utri</span></div>
        </div>
      </div>

      <!-- Address Blocks -->
      <div class="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 text-xs">
        <div>
          <div class="font-bold text-gray-900 dark:text-white">To:</div>
          <div class="mt-1 leading-relaxed text-gray-600 dark:text-gray-300">
            <strong>PT. Exabytes Network Indonesia</strong><br />
            Cyber 2 Tower, Lantai 29,<br />
            Jalan HR Rasuna Said,<br />
            XS No. 13, Jakarta Selatan, 12950.
          </div>
        </div>

        <div>
          <div class="font-bold text-gray-900 dark:text-white">Ship To:</div>
          <div class="mt-1 leading-relaxed text-gray-600 dark:text-gray-300">
            <strong>PT. Exabytes Network Indonesia</strong><br />
            Cyber 2 Tower, Lantai 29,<br />
            Jalan HR Rasuna Said,<br />
            XS No. 13, Jakarta Selatan, 12950.
          </div>
        </div>
      </div>

      <!-- Products Table -->
      <div class="mb-6 overflow-x-auto">
        <table class="w-full border-collapse text-xs">
          <thead>
            <tr
              class="border-y border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <th class="p-3 text-start">Products</th>
              <th class="p-3 text-end" style="width: 80px">MOQ</th>
              <th class="p-3 text-end" style="width: 120px">Unit Price</th>
              <th class="p-3 text-center" style="width: 100px">Order</th>
              <th class="p-3 text-end" style="width: 140px">Amount</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr>
              <td class="p-3">
                <span class="font-bold text-gray-900 dark:text-white">Brosur PPDN SMAN 1 Bandung</span>
              </td>
              <td class="p-3 text-end text-gray-600 dark:text-gray-400">5</td>
              <td class="p-3 text-end font-medium">34.000</td>
              <td class="p-3 text-center font-medium">10 pcs</td>
              <td class="p-3 text-end font-bold text-gray-900 dark:text-white">Rp.899,500</td>
            </tr>

            <!-- Summary -->
            <tr class="border-t border-gray-200 font-medium dark:border-gray-700">
              <td colspan="4" class="p-2.5 text-end text-gray-600 dark:text-gray-400">Sub Total</td>
              <td class="p-2.5 text-end font-semibold text-gray-900 dark:text-white">Rp.899,500</td>
            </tr>
            <tr>
              <td colspan="4" class="p-2 text-end text-gray-600 dark:text-gray-400">PPN (11%)</td>
              <td class="p-2 text-end font-semibold text-gray-900 dark:text-white">Rp.0</td>
            </tr>
            <tr class="border-t-2 border-gray-300 text-sm font-bold dark:border-gray-700">
              <td colspan="4" class="p-3 text-end text-gray-900 dark:text-white">Grand Total</td>
              <td class="p-3 text-end text-primary">Rp.998,445</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Terms & Signoff -->
      <div class="flex flex-col justify-between gap-6 sm:flex-row text-xs border-t border-gray-100 pt-6 dark:border-gray-800">
        <div>
          <span class="font-bold text-gray-900 dark:text-white">Terms & Conditions:</span>
          <ol class="mt-2 list-decimal space-y-1 ps-4 text-gray-600 dark:text-gray-400">
            <li>Harga sudah termasuk PPN</li>
            <li>Penawaran ini berlaku 30 hari</li>
          </ol>
        </div>

        <div class="text-end">
          <p class="text-gray-600 dark:text-gray-400">Yours Faithfully,</p>
          <div class="mt-14 font-bold text-gray-900 dark:text-white">Cecep Sudirman</div>
          <p class="text-gray-500">Director</p>
        </div>
      </div>
    </div>

    <!-- Bottom Actions (Hidden in Print) -->
    <div class="mx-auto mt-6 flex max-w-4xl justify-end gap-3 print:hidden">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
        @click="handleAccept"
      >
        <FeatherIcon name="check-circle" size="14" />
        <span>Order (Accept Quotation)</span>
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700"
        @click="handleReject"
      >
        <FeatherIcon name="x-circle" size="14" />
        <span>Reject Quotation</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
@media print {
  @page {
    size: A4;
    margin: 0.4in;
  }
}
</style>
