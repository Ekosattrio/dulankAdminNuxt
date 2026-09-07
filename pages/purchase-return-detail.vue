<template>
  <div class="content">
    <div class="page-header">
      <div class="add-item d-flex">
        <div class="page-title">
          <h4>Purchase Return Details</h4>
        </div>
      </div>
      <ul class="table-top-head">
        <li>
          <div class="page-btn">
            <NuxtLink to="/purchase-return" class="btn btn-secondary">
              <i class="feather-arrow-left me-2"></i>Back to Purchase Return List
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

    <!-- START: Purchase Return Detail layout -->
    <div class="mb-4 shadow bg-white">
      <div class="d-flex justify-content-end action-button pt-4 pe-4">
        <ul class="table-top-head gap-4">
          <li>
            <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf" @click.prevent="printReturn">
              <img src="/assets/img/icons/pdf.svg" alt="img" />
            </a>
          </li>
          <li id="download-pdf">
            <a data-bs-toggle="tooltip" data-bs-placement="top" title="Print" @click.prevent="printReturn">
              <i class="feather-printer feather-rotate-ccw"></i>
            </a>
          </li>
        </ul>
      </div>

      <div class="p-5" id="detail">
        <div class="container-fluid">
          <!-- Title centered -->
          <div class="text-center mb-4">
            <h1 class="fw-bold mb-1 fs-2">PURCHASE RETURN</h1>
            <small class="text-muted">Date : {{ returnData.date }}</small>
          </div>

          <!-- Header: logo / company / supplier -->
          <div class="row align-items-start mb-4">
            <div class="col-sm-2">
              <div class="border p-3 d-flex align-items-center justify-content-center bg-light" style="height: 90px">
                <img src="/assets/img/kacetak.jpeg" alt="Logo" class="max-h-full max-w-full object-contain" />
              </div>
            </div>

            <div class="col-sm-5">
              <h3 class="mb-1 fw-bold text-dark">PT. DULANK SEMESTA CIDA</h3>
              <p class="small mb-0 text-muted leading-relaxed">
                Jl. Arif Rahman Hakim Niaga Kel. Nagasari<br />
                Kec. Karawang Barat Kab. Karawang
              </p>
            </div>

            <div class="col-sm-5">
              <div class="row my-1">
                <div class="offset-1 col-3 text-start small fw-bold">Supplier</div>
                <div class="col-8 small">
                  : <strong>{{ returnData.supplier.name }}</strong>
                </div>
              </div>
              <div class="row my-1">
                <div class="offset-1 col-3 text-start small"></div>
                <div class="col-8 small text-muted">{{ returnData.supplier.address }}</div>
              </div>
              <div class="row my-1">
                <div class="offset-1 col-3 text-start small fw-bold">No Reff</div>
                <div class="col-8 small">: {{ returnData.noReff }}</div>
              </div>
            </div>
          </div>

          <div class="mb-3 small">
            <strong>No Purchase Return :</strong>
            <span class="fw-bold text-primary ms-1">{{ returnData.noPR }}</span>
          </div>

          <!-- Items table -->
          <div class="table-responsive">
            <table class="table table-bordered table-sm align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th>Product Name</th>
                  <th class="text-center" style="width: 60px">Qty</th>
                  <th class="text-center" style="width: 80px">Unit</th>
                  <th class="text-end" style="width: 140px">Price (IDR)</th>
                  <th class="text-end" style="width: 140px">Amount (IDR)</th>
                  <th>Description of return</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in returnData.items" :key="idx">
                  <td class="fw-semibold">{{ item.name }}</td>
                  <td class="text-center">{{ item.qty }}</td>
                  <td class="text-center">{{ item.unit }}</td>
                  <td class="text-end">{{ formatNumber(item.price) }}</td>
                  <td class="text-end fw-bold">{{ formatNumber(item.qty * item.price) }}</td>
                  <td class="text-danger small">{{ item.reason }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Bank / Note and Totals -->
          <div class="row mt-4">
            <div class="col-sm-7">
              <p class="small mb-1"><strong>Bank</strong> : {{ returnData.bank }}</p>
              <p class="small mb-2"><strong>Note :</strong></p>
              <hr />
              <div class="mt-4 row">
                <div class="col-5">
                  <p class="small mb-5 text-center fw-semibold">Supplier</p>
                  <p class="small mb-0 text-center">( .................................. )</p>
                </div>
                <div class="col-5 offset-1">
                  <p class="small mb-5 text-center fw-semibold">PT. Dulank Semesta Cida</p>
                  <p class="small text-center fw-bold">( Sales Staff )</p>
                </div>
              </div>
            </div>

            <div class="col-sm-5">
              <div class="float-end" style="min-width: 240px">
                <div class="d-flex justify-content-between small">
                  <div>Sub Total</div>
                  <div class="text-end">{{ formatNumber(subTotal) }}</div>
                </div>
                <div class="d-flex justify-content-between small mt-2">
                  <div>Tax</div>
                  <div class="text-end">0</div>
                </div>
                <div class="d-flex justify-content-between fw-bold mt-3 pt-2 border-top fs-5">
                  <div>Total (IDR)</div>
                  <div class="text-end text-primary">{{ formatNumber(subTotal) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- END: Purchase Return Detail layout -->
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
