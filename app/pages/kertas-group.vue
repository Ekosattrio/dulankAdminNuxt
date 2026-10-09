<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Paper Group (Vendor)" subtitle="Manage paper groups from printing vendors">
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

    <!-- KPI Widgets -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <CommonStatCard label="Total Paper Groups" :value="String(groups.length)" icon="file-text" tone="primary" />
      <CommonStatCard label="Total Percetakan" :value="String(vendorCount)" icon="printer" tone="success" />
      <CommonStatCard label="Total Published" :value="String(publishedCount)" icon="share-2" tone="sky" />
      <CommonStatCard label="Total Private" :value="String(privateCount)" icon="lock" tone="slate" />
    </div>

    <!-- Data Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search paper group, merk, or vendor..." />
        <div class="flex flex-wrap items-center gap-3">
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
          <CommonFilterSelect
            v-model="filterStatus"
            allLabel="All Status"
            :options="[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' },
            ]"
          />
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Sumber / Vendor</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Paper's Group</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Merk</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Last Update</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="g in filteredGroups" :key="g.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <img :src="g.avatar" :alt="g.sumber" class="me-2 h-9 w-9 rounded-full border border-gray-200 object-cover dark:border-gray-700" />
                  <div>
                    <span class="block font-semibold text-gray-900 dark:text-gray-100">{{ g.sumber }}</span>
                    <span class="block text-[11px] text-gray-400">{{ g.lokasi }}</span>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{{ g.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ g.merk }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ g.update }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="g.status" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <CommonRowActions :item="g" show-view @view="viewGroup(g)" />
              </td>
            </tr>
            <tr v-if="filteredGroups.length === 0">
              <td colspan="6" class="p-8 text-center text-gray-400">No paper groups found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from 'vue'

const { data: kertasGroupData } = await useFetch<PaperGroupItem[]>('/api/kertas-group')
const groups = ref<PaperGroupItem[]>(kertasGroupData.value ?? [])
useMockSync('kertas-group', groups)

const searchQuery = ref('')
const filterGroup = ref('')
const filterStatus = ref('')
const groupDropdownOpen = ref(false)
const statusDropdownOpen = ref(false)

const vendorCount = computed(() => new Set(groups.value.map(g => g.sumber)).size)
const publishedCount = computed(() => groups.value.filter(g => g.isPublic).length)
const privateCount = computed(() => groups.value.filter(g => !g.isPublic).length)

const filteredGroups = computed(() => {
  return groups.value.filter(g => {
    const matchGroup = !filterGroup.value || g.name === filterGroup.value
    const matchStatus = !filterStatus.value || g.status === filterStatus.value
    const matchSearch = !searchQuery.value ||
      g.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      g.merk.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      g.sumber.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchGroup && matchStatus && matchSearch
  })
})

function viewGroup(g: PaperGroupItem) {
  alert(`Paper Group: ${g.name} (${g.merk}) provided by ${g.sumber}`)
}

function exportPdf() {
  alert('Exporting paper groups as PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
  filterGroup.value = ''
  filterStatus.value = ''
}
</script>
=======
<script setup lang="ts">
import CalculatorListingsPage from '~/components/pages/calculator/CalculatorListingsPage.vue'

definePageMeta({ layout: 'default' })
</script>

<template>
  <CalculatorListingsPage category="paper_group" />
</template>

>>>>>>> origin/eko
