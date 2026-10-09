<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Sales Report" subtitle="Manage Your Sales Report">
      <template #actions>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Export PDF"
            @click="printReport"
          >
            <CommonFeatherIcon name="file-text" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Print"
            @click="printReport"
          >
            <CommonFeatherIcon name="printer" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Refresh"
            @click="refreshReport"
          >
            <CommonFeatherIcon name="rotate-ccw" size="18" />
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Metric Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <CommonStatCard label="Total Sold Unit" value="307.144" icon="package" tone="primary" />
      <CommonStatCard label="Total Sales" value="Rp 481.002.000" icon="shopping-cart" tone="sky" />
      <CommonStatCard label="Total Sales Due" value="Rp 38.565.000" icon="credit-card" tone="warning" />
      <CommonStatCard label="Total Sales Amount" value="Rp 442.437.000" icon="dollar-sign" tone="success" />
    </div>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <CommonStatCard label="Point of Sales" value="Rp 215.250.500" icon="shopping-bag" tone="primary" />
      <CommonStatCard label="Website" value="Rp 52.250.500" icon="globe" tone="sky" />
      <CommonStatCard label="Quotation" value="Rp 75.250.500" icon="file-text" tone="warning" />
      <CommonStatCard label="Sales Staff" value="Rp 138.250.500" icon="users" tone="success" />
    </div>

    <!-- Report Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-3">
          <CommonSearchFilter v-model="searchQuery" placeholder="Search category..." />

          <!-- Date Range Picker (custom) -->
          <div class="relative">
            <input
              type="text"
              readonly
              placeholder="Date Range"
              :value="selectedDateRangeLabel"
              class="w-full h-10 cursor-pointer rounded-lg border border-gray-200 bg-white px-3 pe-4 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              @click="showDateDropdown = !showDateDropdown"
            />
            <div
              v-if="showDateDropdown"
              class="absolute z-20 mt-1 w-48 rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="cursor-pointer rounded px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700" @click="setDateRange('kemarin')">Kemarin</div>
              <div class="cursor-pointer rounded px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700" @click="setDateRange('7hari')">7 Hari Terakhir</div>
              <div class="cursor-pointer rounded px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700" @click="setDateRange('bulanIni')">Bulan Ini</div>
              <div class="cursor-pointer rounded px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700" @click="setDateRange('bulanLalu')">Bulan Lalu</div>
              <div class="cursor-pointer rounded px-2.5 py-1.5 text-xs text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" @click="setDateRange('semua')">Semua</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Product Category</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Sold Qty</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Unit</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Total Sales</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Total Sales Due</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Total Sales Amount</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Percentage</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredRows" :key="item.category" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">{{ item.category }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.soldQty }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.unit }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ formatNumber(item.totalSales) }}</td>
              <td :class="item.due > 0 ? 'px-4 py-3 whitespace-nowrap text-rose-600 dark:text-rose-400' : 'px-4 py-3 whitespace-nowrap text-gray-400'">
                {{ formatNumber(item.due) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap font-semibold text-emerald-600 dark:text-emerald-400">{{ formatNumber(item.amount) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-bold">{{ item.percentage }}%</td>
              <td class="px-4 py-3 whitespace-nowrap text-end">
                <CommonRowActions :item="item" show-view @view="viewDetail(item)" />
              </td>
            </tr>
          </tbody>
          <tfoot class="border-t-2 border-gray-200 bg-gray-50/75 font-semibold text-gray-800 dark:border-gray-700 dark:bg-gray-800/60 dark:text-white">
            <tr>
              <td class="px-4 py-3 font-bold">Total</td>
              <td class="px-4 py-3 font-bold">{{ totalQty }}</td>
              <td class="px-4 py-3"></td>
              <td class="px-4 py-3 font-bold">{{ formatNumber(sumSales) }}</td>
              <td class="px-4 py-3 font-bold text-rose-600 dark:text-rose-400">{{ formatNumber(sumDue) }}</td>
              <td class="px-4 py-3 font-bold text-emerald-600 dark:text-emerald-400">{{ formatNumber(sumAmount) }}</td>
              <td class="px-4 py-3 text-end font-bold">100%</td>
              <td class="px-4 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- View Modal -->
    <CommonBaseModal v-model="showModal" :title="`Sales Category Breakdown - ${activeItem?.category ?? ''}`" maxWidth="lg">
      <div v-if="activeItem" class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
            <tr>
              <th class="px-3 py-2 text-start">Product</th>
              <th class="px-3 py-2 text-center">Sold Qty</th>
              <th class="px-3 py-2 text-end">Revenue</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="(p, idx) in activeItem.products" :key="idx">
              <td class="px-3 py-2 font-semibold text-gray-900 dark:text-gray-100">{{ p.name }}</td>
              <td class="px-3 py-2 text-center">{{ p.qty }} {{ activeItem.unit }}</td>
              <td class="px-3 py-2 text-end font-bold">Rp {{ formatNumber(p.revenue) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="showModal = false"
          >
            Close
          </button>
        </div>
      </template>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { formatNumber } from "~/composables/useFormatters";

const { data: salesReportData } = await useFetch<any[]>('/api/sales-report')
const rows = ref(salesReportData.value ?? []);

const searchQuery = ref("");
const selectedDateRangeLabel = ref("");
const showDateDropdown = ref(false);

const setDateRange = (range: string) => {
  if (range === "kemarin") selectedDateRangeLabel.value = "Kemarin";
  else if (range === "7hari") selectedDateRangeLabel.value = "7 Hari Terakhir";
  else if (range === "bulanIni") selectedDateRangeLabel.value = "Bulan Ini";
  else if (range === "bulanLalu") selectedDateRangeLabel.value = "Bulan Lalu";
  else selectedDateRangeLabel.value = "";
  showDateDropdown.value = false;
};

const filteredRows = computed(() => {
  return rows.value.filter((r) => {
    return !searchQuery.value || r.category.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

const totalQty = computed(() => filteredRows.value.reduce((acc, r) => acc + r.soldQty, 0));
const sumSales = computed(() => filteredRows.value.reduce((acc, r) => acc + r.totalSales, 0));
const sumDue = computed(() => filteredRows.value.reduce((acc, r) => acc + r.due, 0));
const sumAmount = computed(() => filteredRows.value.reduce((acc, r) => acc + r.amount, 0));

const showModal = ref(false);
const activeItem = ref<any>(null);

const viewDetail = (item: any) => {
  activeItem.value = item;
  showModal.value = true;
};

const printReport = () => {
  window.print();
};

const refreshReport = () => {
  searchQuery.value = "";
};

const toggleHeader = () => {
  // toggle
};
useMockSync('sales-report', rows);
</script>
=======
<script setup lang="ts">
import SalesReportWorkspace from '~/components/pages/reports/SalesReportWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Sales Report - Kacetak System',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-sales-report p-4 md:p-6">
    <SalesReportWorkspace />
  </div>
</template>
>>>>>>> origin/eko
