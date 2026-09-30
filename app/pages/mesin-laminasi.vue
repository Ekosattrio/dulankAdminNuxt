<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Mesin Laminasi (Vendor)" subtitle="Manage lamination machine rates from partners">
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
        <CommonSearchFilter v-model="searchQuery" placeholder="Search laminating type or partner..." />
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Sumber Percetakan</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Jenis Laminasi</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Ukuran Max</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Tarif per cm²</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Ongkos Minim</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Last Update</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="l in filteredLaminates" :key="l.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <img :src="l.avatar" :alt="l.sumber" class="me-2 h-9 w-9 rounded-full border border-gray-200 object-cover dark:border-gray-700" />
                  <div>
                    <span class="block font-semibold text-gray-900 dark:text-gray-100">{{ l.sumber }}</span>
                    <span class="block text-[11px] text-gray-400">{{ l.lokasi }}</span>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">{{ l.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 font-mono text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">{{ l.maxSize }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-semibold">Rp {{ formatNumber(l.rateCm) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-bold text-gray-900 dark:text-gray-100">Rp {{ formatNumber(l.minim) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ l.update }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex gap-1.5">
                  <CommonStatusPill status="Publish" tone="emerald" />
                  <CommonStatusPill status="Active" tone="sky" />
                </div>
              </td>
            </tr>
            <tr v-if="filteredLaminates.length === 0">
              <td colspan="7" class="p-8 text-center text-gray-400">No laminating machines found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from "vue";

const { data: mesinLaminasiData } = await useFetch<VendorLaminate[]>('/api/mesin-laminasi')
const laminates = ref<VendorLaminate[]>(mesinLaminasiData.value ?? [])
useMockSync('mesin-laminasi', laminates);

const searchQuery = ref("");

const filteredLaminates = computed(() => {
  return laminates.value.filter((l) => {
    return (
      !searchQuery.value ||
      l.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      l.sumber.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });
});

function formatNumber(val: number) {
  return val.toLocaleString("id-ID");
}

function exportPdf() {
  alert("Exporting laminating rates as PDF...");
}

function printTable() {
  window.print();
}

function refresh() {
  searchQuery.value = "";
}
</script>