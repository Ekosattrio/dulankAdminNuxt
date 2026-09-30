<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Purchase Return Details">
      <template #actions>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Export PDF"
            @click="printReturn"
          >
            <CommonFeatherIcon name="file-text" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Print"
            @click="printReturn"
          >
            <CommonFeatherIcon name="printer" size="18" />
          </button>
          <NuxtLink
            to="/purchase-return"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <CommonFeatherIcon name="arrow-left" size="16" />
            Back to Purchase Return List
          </NuxtLink>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Return Document -->
    <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="p-5" id="detail">
        <!-- Title centered -->
        <div class="mb-5 text-center">
          <h1 class="mb-1 text-2xl font-bold text-gray-900 dark:text-gray-100">PURCHASE RETURN</h1>
          <small class="text-gray-500 dark:text-gray-400">Date : {{ returnData.date }}</small>
        </div>

        <!-- Header: logo / company / supplier -->
        <div class="mb-5 grid grid-cols-1 items-start gap-4 sm:grid-cols-3">
          <div class="flex h-[90px] items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <img src="/assets/img/kacetak.jpeg" alt="Logo" class="max-h-full max-w-full object-contain" />
          </div>
          <div>
            <h3 class="mb-1 font-bold text-gray-900 dark:text-gray-100">PT. DULANK SEMESTA CIDA</h3>
            <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Jl. Arif Rahman Hakim Niaga Kel. Nagasari<br />
              Kec. Karawang Barat Kab. Karawang
            </p>
          </div>
          <div class="space-y-1 text-sm">
            <div class="flex gap-2"><span class="w-16 shrink-0 font-bold text-gray-700 dark:text-gray-300">Supplier</span><span>: <strong class="text-gray-900 dark:text-gray-100">{{ returnData.supplier.name }}</strong></span></div>
            <div class="flex gap-2 ps-18"><span class="text-gray-500 dark:text-gray-400 ps-16">{{ returnData.supplier.address }}</span></div>
            <div class="flex gap-2"><span class="w-16 shrink-0 font-bold text-gray-700 dark:text-gray-300">No Reff</span><span>: {{ returnData.noReff }}</span></div>
          </div>
        </div>

        <div class="mb-4 text-sm">
          <strong class="text-gray-800 dark:text-gray-200">No Purchase Return :</strong>
          <span class="ms-1 font-bold text-primary">{{ returnData.noPR }}</span>
        </div>

        <!-- Items table -->
        <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
            <thead class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
              <tr>
                <th class="px-3 py-2 text-start">Product Name</th>
                <th class="w-16 px-3 py-2 text-center">Qty</th>
                <th class="w-20 px-3 py-2 text-center">Unit</th>
                <th class="w-32 px-3 py-2 text-end">Price (IDR)</th>
                <th class="w-32 px-3 py-2 text-end">Amount (IDR)</th>
                <th class="px-3 py-2 text-start">Description of return</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="(item, idx) in returnData.items" :key="idx">
                <td class="px-3 py-2 font-semibold text-gray-900 dark:text-gray-100">{{ item.name }}</td>
                <td class="px-3 py-2 text-center">{{ item.qty }}</td>
                <td class="px-3 py-2 text-center">{{ item.unit }}</td>
                <td class="px-3 py-2 text-end">{{ formatNumber(item.price) }}</td>
                <td class="px-3 py-2 text-end font-bold">{{ formatNumber(item.qty * item.price) }}</td>
                <td class="px-3 py-2 text-rose-600 dark:text-rose-400">{{ item.reason }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Bank / Note and Totals -->
        <div class="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div class="text-sm text-gray-700 dark:text-gray-300">
            <p class="mb-1 font-bold"><strong>Bank</strong> : {{ returnData.bank }}</p>
            <p class="mb-2 font-bold"><strong>Note :</strong></p>
            <hr class="my-4 border-gray-200 dark:border-gray-800" />
            <div class="mt-6 grid grid-cols-2 gap-4">
              <div class="text-center">
                <p class="mb-16 text-center font-semibold">Supplier</p>
                <p class="text-center">( .................................. )</p>
              </div>
              <div class="text-center">
                <p class="mb-16 text-center font-semibold">PT. Dulank Semesta Cida</p>
                <p class="text-center font-bold">( Sales Staff )</p>
              </div>
            </div>
          </div>
          <div class="space-y-1.5 sm:ms-auto sm:max-w-[300px]">
            <div class="flex justify-between text-sm text-gray-700 dark:text-gray-300"><span>Sub Total</span><span>{{ formatNumber(subTotal) }}</span></div>
            <div class="flex justify-between text-sm text-gray-700 dark:text-gray-300"><span>Tax</span><span>0</span></div>
            <div class="mt-2 flex justify-between border-t border-gray-200 pt-2 text-lg font-bold text-gray-900 dark:border-gray-700 dark:text-white">
              <span>Total (IDR)</span><span class="text-primary">{{ formatNumber(subTotal) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { formatNumber } from "~/composables/useFormatters";

const returnData = ref({
  noPR: "PRT00001",
  date: "25/12/2025",
  noReff: "PR-2512000001",
  bank: "Bank BCA PT Dulank Semesta Cida - 1091956271",
  supplier: {
    name: "PT Cipta Kreasi",
    address: "Cyber 2 Tower, Lantai 29, Jalan HR Rasuna Said, XS No. 13, Jakarta Selatan",
  },
  items: [
    {
      name: "Tinta Neotex 1Kg Cyan",
      qty: 2,
      unit: "Kg",
      price: 450000,
      reason: "Sudah Expired",
    },
    {
      name: "Kertas Art Paper 150gr",
      qty: 1,
      unit: "Ream",
      price: 600000,
      reason: "Salah Ukuran",
    },
  ],
});

const subTotal = computed(() => {
  return returnData.value.items.reduce((acc, item) => acc + item.qty * item.price, 0);
});

const printReturn = () => {
  window.print();
};

const toggleHeader = () => {
  // header toggle
};
</script>

<style scoped>
@media print {
  body,
  .content,
  #detail {
    padding: 0 !important;
    margin: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
  }
}
</style>