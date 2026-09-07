<script setup lang="ts">
const route = useRoute();
const rfqNo = computed(() => (route.query.no as string) || "6100167851");

useHead({
  title: computed(() => `Detail RFQ #${rfqNo.value} - Kacetak System`),
});

const rfqStatus = ref<"pending" | "ordered" | "unavailable">("pending");
const notice = ref("");

const handleOrder = () => {
  rfqStatus.value = "ordered";
  notice.value = "Quotation Ordered! Added to Purchase Pipeline.";
};

const handleUnavailable = () => {
  rfqStatus.value = "unavailable";
  notice.value = "Marked as Unavailable.";
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
          <h4 class="text-xl font-bold text-gray-900 dark:text-white">Detail Request For Quotation (RFQ)</h4>
          <span
            v-if="rfqStatus === 'ordered'"
            class="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200"
          >
            Ordered
          </span>
          <span
            v-else-if="rfqStatus === 'unavailable'"
            class="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200"
          >
            Unavailable
          </span>
        </div>

        <div class="flex items-center gap-2">
          <NuxtLink
            to="/request-quotation"
            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <FeatherIcon name="arrow-left" size="14" />
            <span>Back to RFQ List</span>
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
            title="Print RFQ"
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
          rfqStatus === 'ordered'
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
            : 'bg-rose-50 text-rose-800 border-rose-200',
        ]"
      >
        {{ notice }}
      </div>
    </div>

    <!-- Printable RFQ Sheet -->
    <div
      id="rfq-sheet"
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

      <!-- Metadata Grid -->
      <div class="my-6 grid grid-cols-2 gap-x-8 gap-y-2 text-xs text-gray-700 dark:text-gray-300">
        <div class="flex"><span class="w-24 font-bold">To:</span> <span>DULANK SEMESTA CIDA, PT</span></div>
        <div class="flex">
          <span class="w-24 font-bold">No. RFQ:</span> <span class="font-mono font-bold">{{ rfqNo }}</span>
        </div>
        <div class="flex"><span class="w-24 font-bold">Att:</span> <span>CECEP</span></div>
        <div class="flex"><span class="w-24 font-bold">Date:</span> <span>26.11.2025</span></div>
        <div class="flex"><span class="w-24 font-bold">No. Telp:</span> <span>+62877 8813 1400</span></div>
        <div class="flex"><span class="w-24 font-bold">Email:</span> <span>setting.percetakan.dulank@gmail.com</span></div>
      </div>

      <p class="mt-4 text-xs italic text-gray-600 dark:text-gray-400 leading-relaxed">
        Yours faithfully,<br />
        Please provide an offer for the provision of the following goods/services with the best quality, price, and delivery time
        via fax or email.
      </p>

      <!-- Items Table -->
      <div class="my-6 overflow-x-auto">
        <table class="w-full border-collapse text-xs">
          <thead>
            <tr
              class="border-y border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              <th class="p-3 text-center" style="width: 50px">No</th>
              <th class="p-3 text-start">Descriptions</th>
              <th class="p-3 text-end" style="width: 90px">Quantity</th>
              <th class="p-3 text-center" style="width: 90px">Unit</th>
              <th class="p-3 text-start" style="width: 120px">ETA</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr>
              <td class="p-3 text-center text-gray-500">1</td>
              <td class="p-3 font-medium text-gray-900 dark:text-white">SAFETY SIGN, STIKER, @MUDAH TERBAKAR</td>
              <td class="p-3 text-end font-semibold text-gray-900 dark:text-white">50</td>
              <td class="p-3 text-center text-gray-600 dark:text-gray-400">PC</td>
              <td class="p-3 text-gray-600 dark:text-gray-400">15/12/2025</td>
            </tr>
            <tr>
              <td class="p-3 text-center text-gray-500">2</td>
              <td class="p-3 font-medium text-gray-900 dark:text-white">SAFETY SIGN, @AWAS BAHAYA ALIRAN LISTRIK</td>
              <td class="p-3 text-end font-semibold text-gray-900 dark:text-white">50</td>
              <td class="p-3 text-center text-gray-600 dark:text-gray-400">PC</td>
              <td class="p-3 text-gray-600 dark:text-gray-400">15/12/2025</td>
            </tr>
            <tr>
              <td class="p-3 text-center text-gray-500">3</td>
              <td class="p-3 font-medium text-gray-900 dark:text-white">STIKER, @CARA MENGGUNAKAN APAR</td>
              <td class="p-3 text-end font-semibold text-gray-900 dark:text-white">100</td>
              <td class="p-3 text-center text-gray-600 dark:text-gray-400">PC</td>
              <td class="p-3 text-gray-600 dark:text-gray-400">15/12/2025</td>
            </tr>
            <tr>
              <td class="p-3 text-center text-gray-500">4</td>
              <td class="p-3 font-medium text-gray-900 dark:text-white">SAFETY SIGN, STIKER, @WSPD PEGANG HANDRAIL</td>
              <td class="p-3 text-end font-semibold text-gray-900 dark:text-white">50</td>
              <td class="p-3 text-center text-gray-600 dark:text-gray-400">PC</td>
              <td class="p-3 text-gray-600 dark:text-gray-400">15/12/2025</td>
            </tr>
            <tr>
              <td class="p-3 text-center text-gray-500">5</td>
              <td class="p-3 font-medium text-gray-900 dark:text-white">SAFETY SIGN, @AREA DILARANG MEROKOK</td>
              <td class="p-3 text-end font-semibold text-gray-900 dark:text-white">20</td>
              <td class="p-3 text-center text-gray-600 dark:text-gray-400">PC</td>
              <td class="p-3 text-gray-600 dark:text-gray-400">15/12/2025</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer Info -->
      <div class="space-y-4 text-xs text-gray-700 dark:text-gray-300">
        <div class="space-y-1">
          <p><span class="font-bold">Due Date:</span> 26/11/2025</p>
          <p><span class="font-bold">Payment Term:</span> 30 days</p>
        </div>

        <div class="pt-2">
          <p class="font-semibold">Quotation requested to:</p>
          <p class="font-bold text-gray-900 dark:text-white">Purchasing Department</p>
          <p>Att. Dani Alfa</p>
          <p>e-mail : dani.alfa@bmjpaperpack.com</p>
          <p>Telp : +62 67 601030 | Fax : +62 67 601228</p>
        </div>

        <p class="text-gray-500">
          All quotations must include the RFQ number above as a reference.<br />
          All quotations and procurement of goods must adhere to the terms and conditions of purchase for goods/services of PT.
          Dulank Semesta Cida. Thank you for your attention and cooperation.
        </p>

        <div class="pt-6">
          <p>Hormat kami,</p>
          <div class="my-10 font-bold text-gray-900 dark:text-white">Dani Alfa</div>
        </div>
      </div>
    </div>

    <!-- Bottom Actions (Hidden in Print) -->
    <div class="mx-auto mt-6 flex max-w-4xl justify-end gap-3 print:hidden">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
        @click="handleOrder"
      >
        <FeatherIcon name="shopping-cart" size="14" />
        <span>Order (Add to purchase)</span>
      </button>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700"
        @click="handleUnavailable"
      >
        <FeatherIcon name="x-circle" size="14" />
        <span>Unavailable</span>
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
