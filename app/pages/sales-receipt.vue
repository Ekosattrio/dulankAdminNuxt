<script setup lang="ts">
useHead({
  title: "Sales Receipt - Kacetak System",
});

const printReceipt = () => {
  window.print();
};
</script>

<template>
  <div>
    <!-- Top Action Bar (hidden when printing) -->
    <div
      class="no-print mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4 dark:border-gray-800"
    >
      <div class="flex items-center gap-2">
        <NuxtLink to="/sales" class="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 dark:hover:text-white">
          <FeatherIcon name="arrow-left" size="14" />
          <span>Back to Sales</span>
        </NuxtLink>
        <span class="text-gray-300">/</span>
        <h4 class="text-base font-bold text-gray-900 dark:text-white">Sales Receipt</h4>
      </div>

      <button
        type="button"
        class="allow-print flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-hover transition-colors"
        @click="printReceipt"
      >
        <FeatherIcon name="printer" size="14" />
        <span>Print Struk</span>
      </button>
    </div>

    <!-- Receipt Center Container -->
    <div class="eko flex items-center justify-center p-2">
      <!-- ID receipt-content used by print styles -->
      <div
        id="receipt-content"
        class="w-[320px] max-w-[80mm] rounded-lg border border-gray-200 bg-white p-4 text-center text-xs shadow-sm dark:border-gray-700 text-gray-900"
      >
        <!-- Logo -->
        <div class="mb-2 flex justify-center">
          <img src="/assets/img/logo-small.png" alt="Logo" class="w-14 h-auto" />
        </div>

        <!-- Header Store Info -->
        <h5 class="text-sm font-bold text-gray-900 mb-1">Percetakan Dulank</h5>
        <p class="text-[11px] text-gray-600 mb-3 leading-tight">
          Jl. Arif Rahman Hakim / Niaga (depan stasiun) Karawang<br />
          Chat WA: +6287788131400
        </p>

        <!-- Transaction Details -->
        <div class="border-t border-b border-dashed border-gray-300 py-2 mb-3 text-start space-y-1 text-[11px]">
          <p><strong>No Sales:</strong> PT002</p>
          <p><strong>Customer:</strong> Siti</p>
          <p><strong>Date:</strong> 02 Jan 2025</p>
          <p><strong>Delivery:</strong> Pickup</p>
          <p><strong>Biller:</strong> Staff Admin</p>
        </div>

        <!-- Products Section -->
        <div class="border-b border-dashed border-gray-300 pb-2 mb-3 text-start">
          <h6 class="text-center font-bold text-xs mb-1.5 uppercase text-gray-700">Products</h6>
          <div class="text-[11px] leading-tight">
            <span class="font-bold text-gray-900">Brosur Full Color</span><br />
            <span class="text-gray-600">Brosur PPDB SMAN 1 Bandung</span><br />
            <span class="text-[10px] text-gray-500"
              >Brosur Full Color A4 (210x297 Milimeter), Art paper 150gr, Tanpa Laminasi, Tanpa Lipatan</span
            >
            <div class="flex justify-between font-semibold mt-1">
              <span>2 x Rp20.000</span>
              <span>Rp40.000</span>
            </div>
          </div>
        </div>

        <!-- Payment Details Section -->
        <div class="border-b border-dashed border-gray-300 pb-2 mb-3 space-y-1 text-start text-[11px]">
          <h6 class="text-center font-bold text-xs mb-1 uppercase text-gray-700">Payment Details</h6>
          <div class="flex justify-between"><span>Sub Total</span><span>Rp900.000</span></div>
          <div class="flex justify-between"><span>Voucher (DUL4NK12)</span><span>Rp0</span></div>
          <div class="flex justify-between"><span>Shipping Cost</span><span>Rp125.000</span></div>
          <div class="flex justify-between font-medium"><span>Sub Total Before Tax</span><span>Rp1.025.000</span></div>
          <div class="flex justify-between"><span>Tax (Ppn 11%)</span><span>Rp125.000</span></div>
          <div class="flex justify-between font-bold text-xs pt-1 border-t border-gray-200">
            <span>Grand Total</span><span>Rp1.150.000</span>
          </div>
          <div class="flex justify-between"><span>Payment</span><span>Rp150.000</span></div>
          <div class="flex justify-between"><span>Payment Method</span><span>Cash</span></div>
          <div class="flex justify-between font-bold text-danger"><span>Due</span><span>Rp1.000.000</span></div>
        </div>

        <!-- Footer -->
        <div class="pt-2 text-[11px] text-gray-500">
          <p>Thank You For Shopping With Us. Please Come Again</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  @page {
    size: A6;
    margin: 0;
  }

  body * {
    visibility: hidden !important;
  }

  .eko,
  .eko * {
    visibility: visible !important;
  }

  .eko {
    position: fixed !important;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80mm !important;
    background: white !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  #receipt-content {
    width: 80mm !important;
    max-width: 80mm !important;
    background: white !important;
    padding: 10px !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    border: none !important;
  }
}
</style>
