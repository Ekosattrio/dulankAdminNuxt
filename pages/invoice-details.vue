<script setup lang="ts">
const route = useRoute();
const invoiceNo = computed(() => (route.query.no as string) || "INV00001");

const isProforma = ref(false);

useHead({
  title: computed(() => `${isProforma.value ? "Proforma Invoice" : "Invoice"} Details - Kacetak System`),
});

const handlePrint = () => {
  window.print();
};
</script>

<template>
  <div>
    <!-- Top Action Bar (Hidden in Print) -->
    <div class="print:hidden">
      <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex items-center gap-4">
          <h4 class="text-xl font-bold text-gray-900 dark:text-white">Invoice Details</h4>
          <label
            class="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <input
              v-model="isProforma"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-600 dark:bg-gray-700"
            />
            <span>Proforma Invoice</span>
          </label>
        </div>

        <div class="flex items-center gap-2">
          <NuxtLink
            to="/invoice"
            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <FeatherIcon name="arrow-left" size="14" />
            <span>Back to Invoices List</span>
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
            class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white shadow-sm hover:bg-primary/90"
            title="Print Invoice"
            @click="handlePrint"
          >
            <FeatherIcon name="printer" size="14" />
            <span>Print</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Printable Invoice Sheet -->
    <div
      id="invoice-sheet"
      class="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm print:max-w-none print:border-none print:p-0 print:shadow-none dark:border-gray-800 dark:bg-gray-900"
    >
      <!-- Sheet Header: Logo & Company Info -->
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

      <!-- Invoice Title -->
      <div class="my-6 text-center">
        <h1 class="text-2xl font-bold uppercase tracking-wider text-gray-900 dark:text-white">
          {{ isProforma ? "Proforma Invoice" : "Invoice" }}
        </h1>
        <p class="mt-1 text-xs text-gray-500">Ref: {{ invoiceNo }}</p>
      </div>

      <!-- Addresses & Metadata -->
      <div class="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 text-xs">
        <div>
          <div class="font-bold text-gray-900 dark:text-white">Invoiced To:</div>
          <div class="mt-1 leading-relaxed text-gray-600 dark:text-gray-300">
            <strong>PT. Exabytes Network Indonesia</strong><br />
            Cyber 2 Tower, Lantai 29,<br />
            Jalan HR Rasuna Said,<br />
            XS No. 13, Jakarta Selatan, 12950.
          </div>

          <div class="mt-3 font-semibold text-gray-800 dark:text-gray-200">
            PO Number: <span class="font-normal text-gray-600 dark:text-gray-400">600449168</span>
          </div>

          <div class="mt-3 font-bold text-gray-900 dark:text-white">Shipping To:</div>
          <div class="mt-1 leading-relaxed text-gray-600 dark:text-gray-300">
            <strong>PT. Exabytes Network Indonesia</strong><br />
            Cyber 2 Tower, Lantai 29,<br />
            Jalan HR Rasuna Said,<br />
            XS No. 13, Jakarta Selatan, 12950.
          </div>
        </div>

        <div class="flex flex-col items-end justify-start space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
          <div class="flex gap-4">
            <span class="w-28 text-end font-semibold text-gray-700 dark:text-gray-300">Invoice Date:</span>
            <span class="w-28 text-end">26/06/2025</span>
          </div>
          <div class="flex gap-4">
            <span class="w-28 text-end font-semibold text-gray-700 dark:text-gray-300">Due Date:</span>
            <span class="w-28 text-end">03/07/2025</span>
          </div>
        </div>
      </div>

      <!-- Items Table -->
      <div class="mb-6 overflow-x-auto">
        <div class="mb-2 text-xs font-bold text-gray-900 dark:text-white">Invoice Items</div>
        <table class="w-full border-collapse text-xs">
          <thead>
            <tr
              class="border-y border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <th class="p-3 text-start">Products</th>
              <th class="p-3 text-end">Price</th>
              <th class="p-3 text-center">Order</th>
              <th class="p-3 text-end">Amount</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr>
              <td class="p-3">
                <p class="font-bold text-gray-900 dark:text-white">Brosur PPDN SMAN 1 Bandung</p>
                <div class="mt-1.5 space-y-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                  <p>
                    <em class="font-semibold">Description:</em> Brosur Full Color A4 (210x297 Milimeter), Art paper 150gr, Tanpa
                    Laminasi, Tanpa Lipatan
                  </p>
                  <p><em>Artwork:</em> Ada file ready to print</p>
                  <p><em>Hasil Cetak:</em> Warna Standard CMYK</p>
                  <p><em class="italic">Note: Lorem ipsum dolor sit amet consectetur adipisicing elit.</em></p>
                </div>
              </td>
              <td class="p-3 text-end align-top font-medium">34.000</td>
              <td class="p-3 text-center align-top font-medium">1 pcs</td>
              <td class="p-3 text-end align-top font-bold">Rp.899,500</td>
            </tr>

            <!-- Summary Rows -->
            <tr class="border-t border-gray-200 font-medium dark:border-gray-700">
              <td colspan="3" class="p-2.5 text-end text-gray-600 dark:text-gray-400">Sub Total</td>
              <td class="p-2.5 text-end font-semibold text-gray-900 dark:text-white">Rp.899,500</td>
            </tr>
            <tr>
              <td colspan="3" class="p-2 text-end text-gray-600 dark:text-gray-400">Voucher (DUL4NK12)</td>
              <td class="p-2 text-end font-semibold text-gray-900 dark:text-white">Rp.899,500</td>
            </tr>
            <tr>
              <td colspan="3" class="p-2 text-end text-gray-600 dark:text-gray-400">Shipping Cost</td>
              <td class="p-2 text-end font-semibold text-gray-900 dark:text-white">Rp.89,500</td>
            </tr>
            <tr>
              <td colspan="3" class="p-2 text-end text-gray-600 dark:text-gray-400">Sub total before Tax</td>
              <td class="p-2 text-end font-semibold text-gray-900 dark:text-white">Rp.98,945</td>
            </tr>
            <tr>
              <td colspan="3" class="p-2 text-end text-gray-600 dark:text-gray-400">PPN (11%)</td>
              <td class="p-2 text-end font-semibold text-gray-900 dark:text-white">Rp.0</td>
            </tr>
            <tr class="border-t-2 border-gray-300 text-sm font-bold dark:border-gray-600">
              <td colspan="3" class="p-3 text-end text-gray-900 dark:text-white">Grand Total</td>
              <td class="p-3 text-end text-primary">Rp.998,445</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Payment & Signoff Section -->
      <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 text-xs border-t border-gray-100 pt-6 dark:border-gray-800">
        <div>
          <div class="mb-2 font-bold text-gray-900 dark:text-white">Payment Information</div>
          <div class="space-y-1 text-gray-600 dark:text-gray-400">
            <div class="flex">
              <span class="w-32 font-semibold">Bank:</span>
              <span>BCA KCP Karawang</span>
            </div>
            <div class="flex">
              <span class="w-32 font-semibold">Account Number:</span>
              <span class="font-mono">109-2993242</span>
            </div>
            <div class="flex">
              <span class="w-32 font-semibold">Account Name:</span>
              <span>PT. Dulank Semesta Cida</span>
            </div>
          </div>
          <p class="mt-3 italic text-gray-500">
            Kindly be informed if the payment has been sent.<br />
            Thank you.
          </p>
        </div>

        <div class="flex flex-col items-end justify-between text-end">
          <div class="text-gray-700 dark:text-gray-300">Best Regards,</div>
          <div class="mt-16 border-t border-gray-300 pt-1 font-bold text-gray-900 dark:text-white">Eko Satrio</div>
        </div>
      </div>
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
