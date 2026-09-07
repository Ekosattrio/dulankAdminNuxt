<script setup lang="ts">
const route = useRoute();
const joNo = computed(() => (route.query.no as string) || "JO-0001");

useHead({
  title: computed(() => `Job Order SPK #${joNo.value} - Kacetak System`),
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
        <div class="flex items-center gap-3">
          <h4 class="text-xl font-bold text-gray-900 dark:text-white">Detail Job Order #{{ joNo }}</h4>
          <span class="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
            On Process
          </span>
        </div>

        <div class="flex items-center gap-2">
          <NuxtLink
            to="/job-order"
            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            <FeatherIcon name="arrow-left" size="14" />
            <span>Back to Job Order List</span>
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
            title="Print SPK Sheet"
            @click="handlePrint"
          >
            <FeatherIcon name="printer" size="14" />
            <span>Print SPK Traveler</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Printable Job Traveler Sheet (A4 SPK) -->
    <div
      id="spk-sheet"
      class="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-8 shadow-sm print:max-w-none print:border-none print:p-0 print:shadow-none dark:border-gray-800 dark:bg-gray-900"
    >
      <!-- SPK Header -->
      <div class="flex items-start justify-between border-b-2 border-gray-900 pb-4 dark:border-gray-100">
        <div>
          <h2 class="text-xl font-bold uppercase tracking-wider text-gray-900 dark:text-white">Surat Perintah Kerja (SPK)</h2>
          <p class="text-xs font-mono font-bold text-primary">Job Order No: {{ joNo }}</p>
        </div>
        <div class="text-end text-xs text-gray-600 dark:text-gray-400">
          <h4 class="font-bold text-gray-900 dark:text-white">PT. DULANK SEMESTA CIDA</h4>
          <p>Kacetak Production Management</p>
        </div>
      </div>

      <!-- SPK Details Table -->
      <div class="my-6 overflow-x-auto text-xs">
        <table class="w-full border-collapse">
          <tbody>
            <!-- Section 1: Sales Info -->
            <tr class="bg-gray-100 font-bold uppercase dark:bg-gray-800">
              <td colspan="2" class="p-2 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                1. Sales Information
              </td>
            </tr>
            <tr>
              <td class="w-1/3 p-2 border border-gray-200 font-medium text-gray-600 dark:border-gray-800 dark:text-gray-400">
                Sales Date
              </td>
              <td class="p-2 border border-gray-200 font-semibold dark:border-gray-800">17/12/2025</td>
            </tr>
            <tr>
              <td class="p-2 border border-gray-200 font-medium text-gray-600 dark:border-gray-800 dark:text-gray-400">
                No Sales Ref
              </td>
              <td class="p-2 border border-gray-200 font-mono font-bold dark:border-gray-800">25250025452</td>
            </tr>
            <tr>
              <td class="p-2 border border-gray-200 font-medium text-gray-600 dark:border-gray-800 dark:text-gray-400">
                Customer
              </td>
              <td class="p-2 border border-gray-200 font-bold dark:border-gray-800">PT. Makmur Abadi</td>
            </tr>
            <tr>
              <td class="p-2 border border-gray-200 font-medium text-gray-600 dark:border-gray-800 dark:text-gray-400">
                Shipping Method
              </td>
              <td class="p-2 border border-gray-200 dark:border-gray-800">Pick Up</td>
            </tr>
            <tr>
              <td class="p-2 border border-gray-200 font-medium text-gray-600 dark:border-gray-800 dark:text-gray-400">
                Order Summary
              </td>
              <td class="p-2 border border-gray-200 dark:border-gray-800">2 Products (Oplag: 2.500 pcs)</td>
            </tr>

            <!-- Section 2: Product Specifications -->
            <tr class="bg-gray-100 font-bold uppercase dark:bg-gray-800">
              <td colspan="2" class="p-2 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                2. Product Detail & Specifications
              </td>
            </tr>
            <tr>
              <td class="p-2 border border-gray-200 font-medium text-gray-600 dark:border-gray-800 dark:text-gray-400">
                Category
              </td>
              <td class="p-2 border border-gray-200 dark:border-gray-800">Brosur Full Color</td>
            </tr>
            <tr>
              <td class="p-2 border border-gray-200 font-medium text-gray-600 dark:border-gray-800 dark:text-gray-400">
                Product Name
              </td>
              <td class="p-2 border border-gray-200 font-semibold dark:border-gray-800">Brosur Full Color Promo</td>
            </tr>
            <tr>
              <td class="p-2 border border-gray-200 font-medium text-gray-600 dark:border-gray-800 dark:text-gray-400">
                Job Title
              </td>
              <td class="p-2 border border-gray-200 font-bold text-primary dark:border-gray-800">Brosur SMKN 1 Karawang</td>
            </tr>
            <tr>
              <td class="p-2 border border-gray-200 font-medium text-gray-600 dark:border-gray-800 dark:text-gray-400">
                Technical Description
              </td>
              <td class="p-2 border border-gray-200 dark:border-gray-800">
                Brosur Full Color A4 (210x297 Millimeter), Art paper 150gr, Tanpa Laminasi, Tanpa Lipatan
              </td>
            </tr>

            <!-- Section 3: Design Workflow -->
            <tr class="bg-gray-100 font-bold uppercase dark:bg-gray-800">
              <td colspan="2" class="p-2 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                3. Flow: Design & Pre-Press
              </td>
            </tr>
            <tr>
              <td class="p-2 border border-gray-200 font-medium text-gray-600 dark:border-gray-800 dark:text-gray-400">
                Ada Sample / Referensi
              </td>
              <td class="p-2 border border-gray-200 dark:border-gray-800">Tidak (File Ready to Print)</td>
            </tr>
            <tr>
              <td class="p-2 border border-gray-200 font-medium text-gray-600 dark:border-gray-800 dark:text-gray-400">
                Warna Dominan
              </td>
              <td class="p-2 border border-gray-200 dark:border-gray-800">Biru Corporate (Cyan/Magenta)</td>
            </tr>
            <tr>
              <td class="p-2 border border-gray-200 font-medium text-gray-600 dark:border-gray-800 dark:text-gray-400">
                Jumlah Page
              </td>
              <td class="p-2 border border-gray-200 dark:border-gray-800">2 Halaman (Bolak-Balik)</td>
            </tr>

            <!-- Section 4: CTP Plate Spec -->
            <tr class="bg-gray-100 font-bold uppercase dark:bg-gray-800">
              <td colspan="2" class="p-2 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                4. Flow: Plate Making (CTP)
              </td>
            </tr>
            <tr>
              <td class="p-2 border border-gray-200 font-medium text-gray-600 dark:border-gray-800 dark:text-gray-400">
                Jenis Plat
              </td>
              <td class="p-2 border border-gray-200 dark:border-gray-800">Thermal CTP Plate</td>
            </tr>
            <tr>
              <td class="p-2 border border-gray-200 font-medium text-gray-600 dark:border-gray-800 dark:text-gray-400">
                Ukuran Plat
              </td>
              <td class="p-2 border border-gray-200 font-mono dark:border-gray-800">650 x 550 mm</td>
            </tr>
            <tr>
              <td class="p-2 border border-gray-200 font-medium text-gray-600 dark:border-gray-800 dark:text-gray-400">
                Jumlah Plat
              </td>
              <td class="p-2 border border-gray-200 font-semibold dark:border-gray-800">1 Set (4 Plat CMYK)</td>
            </tr>

            <!-- Section 5: Press / Offset Spec -->
            <tr class="bg-gray-100 font-bold uppercase dark:bg-gray-800">
              <td colspan="2" class="p-2 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                5. Flow: Offset Press Machine
              </td>
            </tr>
            <tr>
              <td class="p-2 border border-gray-200 font-medium text-gray-600 dark:border-gray-800 dark:text-gray-400">
                Mesin Cetak
              </td>
              <td class="p-2 border border-gray-200 font-bold dark:border-gray-800">Heidelberg SM 52 (4 Warna)</td>
            </tr>
            <tr>
              <td class="p-2 border border-gray-200 font-medium text-gray-600 dark:border-gray-800 dark:text-gray-400">
                Oplag Cetak
              </td>
              <td class="p-2 border border-gray-200 font-mono font-bold text-primary dark:border-gray-800">2.500 Lembar</td>
            </tr>
            <tr>
              <td class="p-2 border border-gray-200 font-medium text-gray-600 dark:border-gray-800 dark:text-gray-400">
                Inschiet (Waste Allowance)
              </td>
              <td class="p-2 border border-gray-200 font-mono dark:border-gray-800">150 Lembar (Total Kertas: 2.650 Lembar)</td>
            </tr>

            <!-- Section 6: Finishing & Packaging -->
            <tr class="bg-gray-100 font-bold uppercase dark:bg-gray-800">
              <td colspan="2" class="p-2 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white">
                6. Flow: Finishing & Packaging
              </td>
            </tr>
            <tr>
              <td class="p-2 border border-gray-200 font-medium text-gray-600 dark:border-gray-800 dark:text-gray-400">
                Potong Jadi
              </td>
              <td class="p-2 border border-gray-200 dark:border-gray-800">Potong Pas A4 (210 x 297 mm) Siku Presisi</td>
            </tr>
            <tr>
              <td class="p-2 border border-gray-200 font-medium text-gray-600 dark:border-gray-800 dark:text-gray-400">
                Packing
              </td>
              <td class="p-2 border border-gray-200 dark:border-gray-800">Bungkus Kertas Kraft @ 500 pcs, Masuk Kardus Dulank</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- SPK Signatures -->
      <div class="grid grid-cols-3 gap-6 border-t-2 border-gray-900 pt-6 text-center text-xs dark:border-gray-100">
        <div>
          <p class="font-bold">Operator Cetak</p>
          <div class="mt-14 border-b border-gray-400"></div>
          <small class="text-gray-500">Sign & Name</small>
        </div>
        <div>
          <p class="font-bold">QC & Finishing</p>
          <div class="mt-14 border-b border-gray-400"></div>
          <small class="text-gray-500">Sign & Name</small>
        </div>
        <div>
          <p class="font-bold">Kepala Produksi</p>
          <div class="mt-14 border-b border-gray-400"></div>
          <small class="text-gray-500">Sign & Name</small>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media print {
  @page {
    size: A4;
    margin: 0.35in;
  }
}
</style>
