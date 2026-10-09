<template>
<<<<<<< HEAD
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Purchase Detail">
      <template #actions>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Export PDF"
            @click="printPO"
          >
            <CommonFeatherIcon name="file-text" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Print"
            @click="printPO"
          >
            <CommonFeatherIcon name="printer" size="18" />
          </button>
          <NuxtLink
            to="/purchase-order"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <CommonFeatherIcon name="arrow-left" size="16" />
            Back to Purchase Order List
          </NuxtLink>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Purchased Document -->
    <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="p-5" id="detail">
        <!-- Company Header -->
        <div class="mb-6 flex items-start gap-4">
          <div class="flex h-[100px] w-[200px] shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <img src="/assets/img/kacetak.jpeg" alt="Logo" class="max-h-full max-w-full object-contain" />
          </div>
          <div>
            <h3 class="mb-1 text-lg font-bold text-gray-900 dark:text-gray-100">PT. DULANK SEMESTA CIDA</h3>
            <p class="text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Jl. Arif Rahman Hakim Niaga Kel. Nagasari<br />
              Kec. Karawang Barat Kab. Karawang<br />
              email : ptdulanksemestacida@gmail.com<br />
              website : www.percetakan-dulank.com<br />
              WhatsApp : 0877 8813 1400
            </p>
          </div>
        </div>

        <h1 class="mb-5 text-2xl font-bold text-gray-900 dark:text-gray-100">Purchase Order</h1>

        <!-- To and PO info -->
        <div class="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="flex gap-2">
            <strong class="shrink-0">To</strong>
            <div>
              <p class="font-bold text-gray-900 dark:text-gray-100">{{ poData.vendor.name }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ poData.vendor.address }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ poData.vendor.email }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ poData.vendor.phone }}</p>
            </div>
          </div>
          <div class="space-y-1 text-sm">
            <div class="flex justify-between"><span class="font-semibold text-gray-700 dark:text-gray-300">PO</span><span>: {{ poData.noPO }}</span></div>
            <div class="flex justify-between"><span class="font-semibold text-gray-700 dark:text-gray-300">PO Date</span><span>: {{ poData.date }}</span></div>
            <div class="flex justify-between"><span class="font-semibold text-gray-700 dark:text-gray-300">Vendor Reff</span><span>: {{ poData.vendorReff || "-" }}</span></div>
          </div>
        </div>

        <!-- Items Table -->
        <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
            <thead class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
              <tr>
                <th class="w-10 px-3 py-2 text-center">No.</th>
                <th class="px-3 py-2 text-start">Product Name</th>
                <th class="w-20 px-3 py-2 text-center">Qty</th>
                <th class="w-20 px-3 py-2 text-center">Unit</th>
                <th class="w-32 px-3 py-2 text-end">Unit Price</th>
                <th class="w-32 px-3 py-2 text-end">Sub Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="(item, idx) in poData.items" :key="idx">
                <td class="px-3 py-2 text-center">{{ idx + 1 }}</td>
                <td class="px-3 py-2 font-semibold text-gray-900 dark:text-gray-100">{{ item.name }}</td>
                <td class="px-3 py-2 text-center">{{ item.qty }}</td>
                <td class="px-3 py-2 text-center">{{ item.unit }}</td>
                <td class="px-3 py-2 text-end">Rp. {{ formatNumber(item.price) }}</td>
                <td class="px-3 py-2 text-end font-bold">Rp. {{ formatNumber(item.qty * item.price) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- PO Detail & Summary -->
        <div class="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <h6 class="mb-3 text-sm font-bold text-gray-800 dark:text-gray-200">PO Detail</h6>
            <div class="space-y-1.5 text-sm">
              <div class="flex gap-2"><span class="w-28 shrink-0 font-semibold text-gray-700 dark:text-gray-300">No. PR</span><span>: {{ poData.noPR }}</span></div>
              <div class="flex gap-2"><span class="w-28 shrink-0 font-semibold text-gray-700 dark:text-gray-300">Delivery Date</span><span>: {{ poData.deliveryDate }}</span></div>
              <div class="flex gap-2"><span class="w-28 shrink-0 font-semibold text-gray-700 dark:text-gray-300">Term of Payment</span><span>: {{ poData.paymentTerm }}</span></div>
              <div class="flex gap-2"><span class="w-28 shrink-0 font-semibold text-gray-700 dark:text-gray-300">Delivery Address</span><span>: {{ poData.deliveryAddress }}</span></div>
            </div>
          </div>
          <div class="sm:text-end">
            <div class="inline-block w-full max-w-[280px] text-start">
              <div class="flex justify-between py-1 text-sm font-bold text-gray-800 dark:text-gray-200">
                <span>Sub Total</span><span>Rp. {{ formatNumber(subTotal) }}</span>
              </div>
              <div class="flex justify-between py-1 text-sm font-bold text-gray-800 dark:text-gray-200">
                <span>Tax (PPN 11%)</span><span>Rp. {{ formatNumber(taxAmount) }}</span>
              </div>
              <div class="mt-1 flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900 dark:border-gray-700 dark:text-white">
                <span>Total (IDR)</span><span class="text-primary">Rp. {{ formatNumber(totalAmount) }}</span>
=======
  <div class="content">
    <div class="page-header transfer">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>Purchase Detail</h4>
        </div>
      </div>
      <ul class="table-top-head">
        <li>
          <div class="page-btn">
            <NuxtLink to="/purchase-order" class="btn btn-secondary">
              <i class="feather-arrow-left me-2"></i>Back to Purchase Order List
            </NuxtLink>
          </div>
        </li>
        <li>
          <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header" @click.prevent="toggleHeader">
            <i class="feather-chevron-up"></i>
          </a>
        </li>
      </ul>
    </div>

    <!-- START: Purchase Order Detail layout -->
    <div class="mb-4 shadow bg-white">
      <div class="d-flex justify-content-end action-button pt-4 pe-4">
        <ul class="table-top-head gap-4">
          <li>
            <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf" @click.prevent="printPO">
              <img src="/assets/img/icons/pdf.svg" alt="img" />
            </a>
          </li>
          <li id="download-pdf">
            <a data-bs-toggle="tooltip" data-bs-placement="top" title="Print" @click.prevent="printPO">
              <i class="feather-printer feather-rotate-ccw"></i>
            </a>
          </li>
        </ul>
      </div>

      <div class="p-5" id="detail">
        <div class="container-fluid">
          <!-- Company Header -->
          <div class="row align-items-start mb-4">
            <div class="col-3 text-center">
              <div
                class="border p-4 d-flex align-items-center justify-content-center bg-light"
                style="height: 100px; width: 200px"
              >
                <img src="/assets/img/kacetak.jpeg" alt="Logo" class="max-h-full max-w-full object-contain" />
              </div>
            </div>
            <div class="col-6">
              <h3 class="mb-1 fw-bold text-dark">PT. DULANK SEMESTA CIDA</h3>
              <p class="mb-0 small text-muted leading-relaxed">
                Jl. Arif Rahman Hakim Niaga Kel. Nagasari<br />
                Kec. Karawang Barat Kab. Karawang<br />
                email : ptdulanksemestacida@gmail.com<br />
                website : www.percetakan-dulank.com<br />
                WhatsApp : 0877 8813 1400
              </p>
            </div>
          </div>

          <h1 class="fw-bold mb-4 text-dark fs-2">Purchase Order</h1>

          <!-- To and PO info -->
          <div class="row mb-4">
            <div class="col-7">
              <div class="row">
                <div class="col-2"><strong>To</strong></div>
                <div class="col-8">
                  <p class="mb-0 fw-bold">{{ poData.vendor.name }}</p>
                  <p class="small mb-0 text-muted">{{ poData.vendor.address }}</p>
                  <p class="small mb-0 text-muted">{{ poData.vendor.email }}</p>
                  <p class="small mb-0 text-muted">{{ poData.vendor.phone }}</p>
                </div>
              </div>
            </div>
            <div class="col-5">
              <div class="row my-1">
                <div class="offset-4 col-4 text-start small fw-semibold">PO</div>
                <div class="col-4 small">: {{ poData.noPO }}</div>
              </div>
              <div class="row my-1">
                <div class="offset-4 col-4 text-start small fw-semibold">PO Date</div>
                <div class="col-4 small">: {{ poData.date }}</div>
              </div>
              <div class="row my-1">
                <div class="offset-4 col-4 text-start small fw-semibold">Vendor Reff</div>
                <div class="col-4 small">: {{ poData.vendorReff || "-" }}</div>
              </div>
            </div>
          </div>

          <!-- Items Table -->
          <div class="row">
            <div class="col-12">
              <table class="table table-bordered align-middle">
                <thead class="table-light">
                  <tr>
                    <th style="width: 40px" class="text-center">No.</th>
                    <th>Product Name</th>
                    <th class="text-center" style="width: 80px">Qty</th>
                    <th class="text-center" style="width: 80px">Unit</th>
                    <th class="text-end" style="width: 140px">Unit Price</th>
                    <th class="text-end" style="width: 140px">Sub Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, idx) in poData.items" :key="idx">
                    <td class="text-center">{{ idx + 1 }}</td>
                    <td class="fw-semibold">{{ item.name }}</td>
                    <td class="text-center">{{ item.qty }}</td>
                    <td class="text-center">{{ item.unit }}</td>
                    <td class="text-end">Rp. {{ formatNumber(item.price) }}</td>
                    <td class="text-end fw-bold">Rp. {{ formatNumber(item.qty * item.price) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- PO Detail & Summary -->
          <div class="row mt-4">
            <div class="col-6">
              <h6 class="fw-bold mb-3">PO Detail</h6>
              <div class="row small g-2">
                <div class="col-4 fw-semibold">No. PR</div>
                <div class="col-8">: {{ poData.noPR }}</div>

                <div class="col-4 fw-semibold">Delivery Date</div>
                <div class="col-8">: {{ poData.deliveryDate }}</div>

                <div class="col-4 fw-semibold">Term of Payment</div>
                <div class="col-8">: {{ poData.paymentTerm }}</div>

                <div class="col-4 fw-semibold">Delivery Address</div>
                <div class="col-8">: {{ poData.deliveryAddress }}</div>
              </div>
            </div>

            <div class="col-6 text-end">
              <div class="d-inline-block text-start" style="min-width: 260px">
                <div class="row fw-bold mt-2">
                  <div class="col-6 text-end small">Sub Total</div>
                  <div class="col-6 text-end">Rp. {{ formatNumber(subTotal) }}</div>
                </div>
                <div class="row fw-bold mt-2">
                  <div class="col-6 text-end small">Tax (PPN 11%)</div>
                  <div class="col-6 text-end">Rp. {{ formatNumber(taxAmount) }}</div>
                </div>
                <div class="row fw-bold mt-3 pt-2 border-top fs-5">
                  <div class="col-6 text-end text-dark">Total (IDR)</div>
                  <div class="col-6 text-end text-primary">Rp. {{ formatNumber(totalAmount) }}</div>
                </div>
>>>>>>> origin/eko
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
<<<<<<< HEAD
=======
    <!-- END: Purchase Order Detail layout -->
>>>>>>> origin/eko
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { formatNumber } from "~/composables/useFormatters";

const poData = ref({
  noPO: "PO2545852200",
  date: "25/12/2025",
  vendorReff: "",
  noPR: "PR-2512000001",
  deliveryDate: "25/12/2025",
  paymentTerm: "30 Days after Invoice Receive",
  deliveryAddress: "Jl. Arif Rahman Hakim Niaga Kel. Nagasari Kec. Karawang Barat Kab. Karawang",
  vendor: {
    name: "PT Cipta Kreasi",
    address: "Cyber 2 Tower, Lantai 29, Jalan HR Rasuna Said, XS No. 13, Jakarta Selatan, 12950",
    email: "ciptakreasi@gmail.com",
    phone: "62819 0685 5554",
  },
  items: [
    { name: "Tinta Neotex 1Kg Cyan", qty: 2, unit: "Kg", price: 450000 },
    { name: "Kertas Art Paper 150gr", qty: 1, unit: "Ream", price: 600000 },
  ],
});

const subTotal = computed(() => {
  return poData.value.items.reduce((acc, item) => acc + item.qty * item.price, 0);
});

const taxAmount = computed(() => Math.round(subTotal.value * 0.11));
const totalAmount = computed(() => subTotal.value + taxAmount.value);

const printPO = () => {
  window.print();
};

const toggleHeader = () => {
  // header toggle
};
</script>

<style scoped>
@media print {
<<<<<<< HEAD
=======
  .page-header,
  .action-button {
    display: none !important;
  }
>>>>>>> origin/eko
  body,
  .content,
  #detail {
    padding: 0 !important;
    margin: 0 !important;
    background: transparent !important;
    box-shadow: none !important;
  }
}
<<<<<<< HEAD
</style>
=======
</style>
>>>>>>> origin/eko
