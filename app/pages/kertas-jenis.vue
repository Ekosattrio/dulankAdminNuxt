<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Paper Type (Vendor)" subtitle="Manage paper types and specifications from vendors">
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
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search paper type, merk, or vendor..." />
        <CommonFilterSelect
          v-model="filterGroup"
          allLabel="All Groups"
          :options="[
            { value: 'HVS Putih', label: 'HVS Putih' },
            { value: 'Art Paper', label: 'Art Paper' },
            { value: 'Art Carton', label: 'Art Carton' },
            { value: 'Ivory', label: 'Ivory' },
            { value: 'Duplex', label: 'Duplex' },
          ]"
        />
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Sumber</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Group Kertas</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Merk</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Ukuran</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Satuan</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Gramatur (gsm)</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Last Update</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="j in filteredTypes" :key="j.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <img :src="j.avatar" :alt="j.sumber" class="me-2 h-9 w-9 rounded-full border border-gray-200 object-cover dark:border-gray-700" />
                  <div>
                    <span class="block font-semibold text-gray-900 dark:text-gray-100">{{ j.sumber }}</span>
                    <span class="block text-[11px] text-gray-400">{{ j.lokasi }}</span>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{{ j.group }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ j.merk }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-mono">{{ j.ukuran }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ j.satuan }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ j.gramatur }} gsm</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ j.update }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex gap-1.5">
                  <CommonStatusPill status="Publish" tone="emerald" />
                  <CommonStatusPill status="Active" tone="sky" />
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <CommonRowActions :item="j" show-view @view="viewSpec(j)" />
              </td>
            </tr>
            <tr v-if="filteredTypes.length === 0">
              <td colspan="9" class="p-8 text-center text-gray-400">No paper types found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from 'vue'

const { data: kertasJenisData } = await useFetch<PaperTypeItem[]>('/api/kertas-jenis')
const paperTypes = ref<PaperTypeItem[]>(kertasJenisData.value ?? [])
useMockSync('kertas-jenis', paperTypes)

const searchQuery = ref('')
const filterGroup = ref('')
const groupDropdownOpen = ref(false)

const filteredTypes = computed(() => {
  return paperTypes.value.filter(p => {
    const matchGroup = !filterGroup.value || p.group === filterGroup.value
    const matchSearch = !searchQuery.value ||
      p.group.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.merk.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.sumber.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      String(p.gramatur).includes(searchQuery.value)
    return matchGroup && matchSearch
  })
})

function viewSpec(j: PaperTypeItem) {
  alert(`Paper Type: ${j.group} ${j.gramatur}gsm (${j.merk}) - Size: ${j.ukuran} ${j.satuan}`)
}

function exportPdf() {
  alert('Exporting paper types as PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
  filterGroup.value = ''
}
</script>
=======
<script setup lang="ts">
import CalculatorListingsPage from '~/components/pages/calculator/CalculatorListingsPage.vue'

definePageMeta({ layout: 'default' })
</script>

<template>
  <CalculatorListingsPage category="paper_type" />
</template>

>>>>>>> origin/eko
