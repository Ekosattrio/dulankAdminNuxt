<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Annual Report" subtitle="Annual comprehensive performance report">
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
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search month or year..." />
        <CommonFilterSelect
          v-model="yearFilter"
          allLabel="All Years"
          :options="[
            { value: '2025', label: '2025' },
            { value: '2024', label: '2024' },
          ]"
        />
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Month</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Year</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Total Revenue</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">COGS</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Gross Profit</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Operating Expenses</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Net Profit</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Net Margin (%)</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredRows" :key="item.month + item.year" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-semibold text-gray-900 dark:text-gray-100">{{ item.month }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.year }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end">{{ formatNumber(item.revenue) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end text-rose-600 dark:text-rose-400">{{ formatNumber(item.cogs) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-semibold text-primary">{{ formatNumber(item.revenue - item.cogs) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end text-rose-600 dark:text-rose-400">{{ formatNumber(item.opex) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-bold text-emerald-600 dark:text-emerald-400">{{ formatNumber(item.revenue - item.cogs - item.opex) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-bold">
                {{ (((item.revenue - item.cogs - item.opex) / item.revenue) * 100).toFixed(2) }}%
              </td>
            </tr>
          </tbody>
          <tfoot class="border-t-2 border-gray-200 bg-gray-50/75 font-semibold text-gray-800 dark:border-gray-700 dark:bg-gray-800/60 dark:text-white">
            <tr>
              <td class="px-4 py-3" colspan="2">TOTAL</td>
              <td class="px-4 py-3 text-end text-primary">{{ formatNumber(totalRevenue) }}</td>
              <td class="px-4 py-3 text-end text-rose-600 dark:text-rose-400">{{ formatNumber(totalCogs) }}</td>
              <td class="px-4 py-3 text-end text-primary">{{ formatNumber(totalGross) }}</td>
              <td class="px-4 py-3 text-end text-rose-600 dark:text-rose-400">{{ formatNumber(totalOpex) }}</td>
              <td class="px-4 py-3 text-end text-emerald-600 dark:text-emerald-400">{{ formatNumber(totalNet) }}</td>
              <td class="px-4 py-3 text-end">{{ ((totalNet / totalRevenue) * 100).toFixed(2) }}%</td>
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

const { data: annualReportsData } = await useFetch<any[]>('/api/annual-reports')
const rows = ref(annualReportsData.value ?? []);

const searchQuery = ref("");
const yearFilter = ref("2025");

const filteredRows = computed(() => {
  return rows.value.filter((r) => {
    const matchesSearch = !searchQuery.value || r.month.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesYear = !yearFilter.value || r.year === yearFilter.value;
    return matchesSearch && matchesYear;
  });
});

const totalRevenue = computed(() => filteredRows.value.reduce((acc, r) => acc + r.revenue, 0));
const totalCogs = computed(() => filteredRows.value.reduce((acc, r) => acc + r.cogs, 0));
const totalGross = computed(() => totalRevenue.value - totalCogs.value);
const totalOpex = computed(() => filteredRows.value.reduce((acc, r) => acc + r.opex, 0));
const totalNet = computed(() => totalGross.value - totalOpex.value);

const printReport = () => {
  window.print();
};

const refreshReport = () => {
  searchQuery.value = "";
};

const toggleHeader = () => {
  // toggle
};
useMockSync('annual-reports', rows);
</script>
=======
<script setup lang="ts">
import AnnualReportsWorkspace from '~/components/pages/reports/AnnualReportsWorkspace.vue'

useHead({
  title: 'Annual Report (Laporan Rekapitulasi Tahunan) - Kacetak System'
})
</script>

<template>
  <div class="dulank-page dulank-page-annual-reports">
    <AnnualReportsWorkspace />
  </div>
</template>
>>>>>>> origin/eko
