<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Mesin Pond (Vendor)" subtitle="Manage die-cutting machine rates from partners">
      <template #actions>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Export PDF"
            @click="exportPdf"
          >
            <CommonFeatherIcon name="file-text" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Print"
            @click="printTable"
          >
            <CommonFeatherIcon name="printer" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Refresh"
            @click="refresh"
          >
            <CommonFeatherIcon name="rotate-ccw" size="18" />
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Data Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-5">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search die-cut machine or partner..." />
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Sumber Percetakan</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Nama Mesin</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Ukuran Max</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Pond Putus (Per Lbr / Minim)</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Setengah Putus (Kiss-cut)</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Last Update</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="p in filteredPonds" :key="p.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <img :src="p.avatar" :alt="p.sumber" class="me-2 h-9 w-9 rounded-full border border-gray-200 object-cover dark:border-gray-700" />
                  <div>
                    <span class="block font-semibold text-gray-900 dark:text-gray-100">{{ p.sumber }}</span>
                    <span class="block text-[11px] text-gray-400">{{ p.lokasi }}</span>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">{{ p.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 font-mono text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">{{ p.maxSize }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="block font-semibold text-gray-900 dark:text-gray-100">Rp {{ formatNumber(p.putusRate) }} / lbr</span>
                <span class="block text-xs text-gray-500 dark:text-gray-400">Minim: Rp {{ formatNumber(p.putusMinim) }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="block font-semibold text-gray-900 dark:text-gray-100">Rp {{ formatNumber(p.kissRate) }} / lbr</span>
                <span class="block text-xs text-gray-500 dark:text-gray-400">Minim: Rp {{ formatNumber(p.kissMinim) }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ p.update }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex gap-1.5">
                  <CommonStatusPill status="Publish" tone="emerald" />
                  <CommonStatusPill status="Active" tone="sky" />
                </div>
              </td>
            </tr>
            <tr v-if="filteredPonds.length === 0">
              <td colspan="7" class="p-8 text-center text-gray-400">No die-cut machines found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from "vue";

const { data: mesinPondData } = await useFetch<VendorPond[]>('/api/mesin-pond')
const ponds = ref<VendorPond[]>(mesinPondData.value ?? [])
useMockSync('mesin-pond', ponds);

const searchQuery = ref("");

const filteredPonds = computed(() => {
  return ponds.value.filter((p) => {
    return (
      !searchQuery.value ||
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.sumber.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
});

function formatNumber(val: number) {
  return val.toLocaleString("id-ID");
}

function exportPdf() {
  alert("Exporting die-cut rates as PDF...");
}

function printTable() {
  window.print();
}

function refresh() {
  searchQuery.value = "";
}
</script>
=======
<script setup lang="ts">
import CalculatorListingsPage from '~/components/pages/calculator/CalculatorListingsPage.vue'

definePageMeta({ layout: 'default' })
</script>

<template>
  <CalculatorListingsPage category="die_cutting" />
</template>
>>>>>>> origin/eko
