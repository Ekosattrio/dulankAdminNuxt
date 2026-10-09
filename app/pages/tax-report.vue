<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Tax Report" subtitle="Manage your monthly VAT / PPN tax report">
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

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-5">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search month or year..." />
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Month</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Year</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Output Tax (IDR)</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Input Tax (IDR)</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Input Tax (Carry Over)</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">VAT is under or (over) paid</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredRows" :key="item.month + item.year" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-semibold text-gray-900 dark:text-gray-100">{{ item.month }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.year }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end">{{ formatNumber(item.outputTax) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end">{{ formatNumber(item.inputTax) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end">{{ formatNumber(item.carryOver) }}</td>
              <td :class="item.vatDiff < 0 ? 'px-4 py-3 whitespace-nowrap text-end font-bold text-rose-600 dark:text-rose-400' : 'px-4 py-3 whitespace-nowrap text-end font-bold text-emerald-600 dark:text-emerald-400'">
                {{ formatNumber(item.vatDiff) }}
              </td>
            </tr>
          </tbody>
          <tfoot class="border-t-2 border-gray-200 bg-gray-50/75 font-semibold text-gray-800 dark:border-gray-700 dark:bg-gray-800/60 dark:text-white">
            <tr>
              <td class="px-4 py-3" colspan="2">Total</td>
              <td class="px-4 py-3 text-end text-primary">{{ formatNumber(totalOutput) }}</td>
              <td class="px-4 py-3 text-end text-gray-500 dark:text-gray-400">{{ formatNumber(totalInput) }}</td>
              <td class="px-4 py-3 text-end text-gray-500 dark:text-gray-400">{{ formatNumber(totalCarryOver) }}</td>
              <td :class="totalDiff < 0 ? 'px-4 py-3 text-end text-rose-600 dark:text-rose-400' : 'px-4 py-3 text-end text-emerald-600 dark:text-emerald-400'">
                {{ formatNumber(totalDiff) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { formatNumber } from "~/composables/useFormatters";

const { data: taxReportData } = await useFetch<any[]>('/api/tax-report')
const rows = ref(taxReportData.value ?? []);

const searchQuery = ref("");
const yearFilter = ref("");

const filteredRows = computed(() => {
  return rows.value.filter((r) => {
    const matchesSearch = !searchQuery.value || r.month.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesYear = !yearFilter.value || r.year === yearFilter.value;
    return matchesSearch && matchesYear;
  });
});

const totalOutput = computed(() => filteredRows.value.reduce((acc, r) => acc + r.outputTax, 0));
const totalInput = computed(() => filteredRows.value.reduce((acc, r) => acc + r.inputTax, 0));
const totalCarryOver = computed(() => filteredRows.value.reduce((acc, r) => acc + r.carryOver, 0));
const totalDiff = computed(() => filteredRows.value.reduce((acc, r) => acc + r.vatDiff, 0));

const printReport = () => {
  window.print();
};

const refreshReport = () => {
  searchQuery.value = "";
  yearFilter.value = "";
};

const toggleHeader = () => {
  // toggle
};
useMockSync('tax-report', rows);
</script>
=======
<script setup lang="ts">
import TaxReportWorkspace from '~/components/pages/reports/TaxReportWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Tax Report (PPN & Fiskal) - Kacetak System',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-tax-report p-4 md:p-6">
    <TaxReportWorkspace />
  </div>
</template>
>>>>>>> origin/eko
