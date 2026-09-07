<template>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- END: Purchase Order Detail layout -->
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
  .page-header,
  .action-button {
    display: none !important;
  }
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
