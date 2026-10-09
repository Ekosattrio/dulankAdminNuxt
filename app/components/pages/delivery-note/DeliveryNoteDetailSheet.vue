<script setup lang="ts">
defineProps<{
  dnNo: string
}>()
</script>

<template>
  <div
    id="dn-sheet"
    class="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-8 shadow-xs print:max-w-none print:border-none print:p-0 print:shadow-none dark:border-gray-800 dark:bg-gray-900"
  >
    <!-- Header: Logo & Company Info -->
    <div class="flex items-start justify-between border-b border-gray-100 pb-6 dark:border-gray-800">
      <div class="flex h-24 w-44 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
        <span class="text-sm font-bold text-gray-400">Logo</span>
      </div>

      <div class="text-end text-xs text-gray-600 dark:text-gray-400">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">PT. DULANK SEMESTA CIDA</h3>
        <p class="mt-1">Jl. Arif Rahman Hakim Niaga Kel. Nagasari Karawang Barat - Karawang</p>
        <p>Email: ptdulanksemestacida@gmail.com</p>
        <p>Website: www.percetakan-dulank.com</p>
        <p class="font-medium text-gray-800 dark:text-gray-300">WhatsApp: 0877 8813 1400</p>
      </div>
    </div>

    <!-- Document Title -->
    <div class="my-6">
      <h1 class="text-2xl font-bold uppercase tracking-wider text-gray-900 dark:text-white">Delivery Note</h1>
    </div>

    <!-- Shipping & Meta Grid -->
    <div class="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 text-xs">
      <div>
        <div class="font-bold text-gray-900 dark:text-white">Ship To:</div>
        <div class="mt-1 leading-relaxed text-gray-600 dark:text-gray-300">
          <strong>PT. Exabytes Network Indonesia</strong><br />
          Cyber 2 Tower, Lantai 29,<br />
          Jalan HR Rasuna Said,<br />
          XS No. 13, Jakarta Selatan, 12950.
        </div>
      </div>

      <div class="space-y-1 text-xs text-gray-700 dark:text-gray-300 sm:text-end">
        <div class="flex sm:justify-end gap-3">
          <span class="w-28 font-semibold">DN No:</span>
          <span class="w-32 font-mono font-bold">{{ dnNo }}</span>
        </div>
        <div class="flex sm:justify-end gap-3">
          <span class="w-28 font-semibold">DN Date:</span>
          <span class="w-32">12/12/2025</span>
        </div>
        <div class="flex sm:justify-end gap-3">
          <span class="w-28 font-semibold">PO:</span>
          <span class="w-32 font-mono">PO - 2512000009</span>
        </div>
        <div class="flex sm:justify-end gap-3">
          <span class="w-28 font-semibold">Shipping By:</span>
          <span class="w-32">Car</span>
        </div>
        <div class="flex sm:justify-end gap-3">
          <span class="w-28 font-semibold">Reference:</span>
          <span class="w-32">Mr. Aman</span>
        </div>
      </div>
    </div>

    <!-- Items Table -->
    <div class="mb-8 overflow-x-auto">
      <table class="w-full border-collapse text-xs">
        <thead>
          <tr class="border-y border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <th class="p-3 text-center" style="width: 40px">No</th>
            <th class="p-3 text-start">Item Description</th>
            <th class="p-3 text-end" style="width: 80px">Qty</th>
            <th class="p-3 text-start" style="width: 100px">Unit</th>
            <th class="p-3 text-start" style="width: 110px">Packing Qty</th>
            <th class="p-3 text-start" style="width: 100px">Weight (Kg)</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
          <tr>
            <td class="p-3 text-center text-gray-500">1</td>
            <td class="p-3">
              <span class="font-bold text-gray-900 dark:text-white">Brosur Full Color</span><br />
              <span class="text-gray-600 dark:text-gray-400">Brosur PPDB SMAN 1 Bandung</span>
            </td>
            <td class="p-3 text-end font-semibold text-gray-900 dark:text-white">2</td>
            <td class="p-3 text-gray-700 dark:text-gray-300">Ream</td>
            <td class="p-3 text-gray-700 dark:text-gray-300">2 Pax</td>
            <td class="p-3 text-gray-700 dark:text-gray-300">6 Kg</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 4-Column Signature Block -->
    <div class="grid grid-cols-4 gap-4 border-t border-gray-100 pt-8 text-center text-xs dark:border-gray-800">
      <div class="flex flex-col items-center">
        <p class="font-bold text-gray-900 dark:text-white">Receive By</p>
        <div class="mt-16 w-3/4 border-b border-gray-400"></div>
        <small class="mt-1 text-[10px] text-gray-500">Your Name, Sign & Stamp</small>
      </div>

      <div class="flex flex-col items-center">
        <p class="font-bold text-gray-900 dark:text-white">Security / Check</p>
        <div class="mt-16 w-3/4 border-b border-gray-400"></div>
        <small class="mt-1 text-[10px] text-gray-500">Your Name, Sign & Stamp</small>
      </div>

      <div class="flex flex-col items-center">
        <p class="font-bold text-gray-900 dark:text-white">Driver</p>
        <div class="mt-16 w-3/4 border-b border-gray-400"></div>
        <small class="mt-1 font-semibold text-gray-800 dark:text-gray-200">Nurdin</small>
      </div>

      <div class="flex flex-col items-center">
        <p class="font-bold text-gray-900 dark:text-white">Issued By</p>
        <div class="mt-16 w-3/4 border-b border-gray-400"></div>
        <small class="mt-1 font-semibold text-gray-800 dark:text-gray-200">Nurdin</small>
      </div>
    </div>
  </div>
</template>

