<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Paper Size (Vendor)" subtitle="Manage available paper sizes from vendors">
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
        <CommonSearchFilter v-model="searchQuery" placeholder="Search paper size, vendor..." />
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Sumber</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Ukuran</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Dimensi (P x L)</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Unit</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Last Update</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="u in filteredSizes" :key="u.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <img :src="u.avatar" :alt="u.sumber" class="me-2 h-9 w-9 rounded-full border border-gray-200 object-cover dark:border-gray-700" />
                  <div>
                    <span class="block font-semibold text-gray-900 dark:text-gray-100">{{ u.sumber }}</span>
                    <span class="block text-[11px] text-gray-400">{{ u.lokasi }}</span>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{{ u.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-mono">{{ u.dimension }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ u.unit }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ u.update }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex gap-1.5">
                  <CommonStatusPill status="Publish" tone="emerald" />
                  <CommonStatusPill status="Active" tone="sky" />
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <CommonRowActions :item="u" show-view @view="viewDetails(u)" />
              </td>
            </tr>
            <tr v-if="filteredSizes.length === 0">
              <td colspan="7" class="p-8 text-center text-gray-400">No paper sizes found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from 'vue'

const { data: kertasUkuranData } = await useFetch<PaperSizeItem[]>('/api/kertas-ukuran')
const sizes = ref<PaperSizeItem[]>(kertasUkuranData.value ?? [])
useMockSync('kertas-ukuran', sizes)

const searchQuery = ref('')

const filteredSizes = computed(() => {
  return sizes.value.filter(s => {
    return !searchQuery.value ||
      s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.dimension.includes(searchQuery.value) ||
      s.sumber.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})

function viewDetails(u: PaperSizeItem) {
  alert(`Paper Size: ${u.name} (${u.dimension} ${u.unit}) by ${u.sumber}`)
}

function exportPdf() {
  alert('Exporting paper sizes as PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
}
</script>