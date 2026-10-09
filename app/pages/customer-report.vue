<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Customer Report" subtitle="Manage customer order and performance reports">
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
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-3">
          <CommonSearchFilter v-model="searchQuery" placeholder="Search customer..." />

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
              <th class="px-4 py-3 text-start whitespace-nowrap">Customer Name</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Total Order</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Amount (IDR)</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Avg. Lead Time</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredCustomers" :key="item.name" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-semibold text-gray-900 dark:text-gray-100">{{ item.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.totalOrder }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-bold text-emerald-600 dark:text-emerald-400">{{ formatNumber(item.amount) }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.avgLeadTime }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end">
                <CommonRowActions :item="item" show-view @view="viewCustomer(item)" />
              </td>
            </tr>
          </tbody>
          <tfoot class="border-t-2 border-gray-200 bg-gray-50/75 font-semibold text-gray-800 dark:border-gray-700 dark:bg-gray-800/60 dark:text-white">
            <tr>
              <td class="px-4 py-3 font-bold">Total</td>
              <td class="px-4 py-3 font-bold">{{ totalOrders }}</td>
              <td class="px-4 py-3 text-end font-bold text-primary">{{ formatNumber(totalAmount) }}</td>
              <td class="px-4 py-3"></td>
              <td class="px-4 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- View Modal -->
    <CommonBaseModal v-model="showModal" :title="`Customer Order Summary - ${activeCustomer?.name ?? ''}`" maxWidth="md">
      <div v-if="activeCustomer" class="space-y-2 text-sm">
        <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Total Lifetime Orders</span><span class="font-semibold text-gray-800 dark:text-gray-200">{{ activeCustomer.totalOrder }} orders</span></div>
        <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Total Value</span><span class="font-semibold text-gray-800 dark:text-gray-200">Rp {{ formatNumber(activeCustomer.amount) }}</span></div>
        <div class="flex justify-between"><span class="text-gray-500 dark:text-gray-400">Avg. Turnaround Time</span><span class="font-semibold text-gray-800 dark:text-gray-200">{{ activeCustomer.avgLeadTime }}</span></div>
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
import { ref, computed } from 'vue'
import { formatNumber } from '~/composables/useFormatters'

const { data: customerReportData } = await useFetch<any[]>('/api/customer-report')
const customers = ref(customerReportData.value ?? [])

const searchQuery = ref('')
const selectedDateRangeLabel = ref('')
const showDateDropdown = ref(false)

const setDateRange = (range: string) => {
  if (range === 'kemarin') selectedDateRangeLabel.value = 'Kemarin'
  else if (range === '7hari') selectedDateRangeLabel.value = '7 Hari Terakhir'
  else if (range === 'bulanIni') selectedDateRangeLabel.value = 'Bulan Ini'
  else if (range === 'bulanLalu') selectedDateRangeLabel.value = 'Bulan Lalu'
  else selectedDateRangeLabel.value = ''
  showDateDropdown.value = false
}

const filteredCustomers = computed(() => {
  return customers.value.filter(c => !searchQuery.value || c.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
})

const totalOrders = computed(() => filteredCustomers.value.reduce((acc, c) => acc + c.totalOrder, 0))
const totalAmount = computed(() => filteredCustomers.value.reduce((acc, c) => acc + c.amount, 0))

const showModal = ref(false)
const activeCustomer = ref<any>(null)

const viewCustomer = (item: any) => {
  activeCustomer.value = item
  showModal.value = true
}

const printReport = () => {
  window.print()
}

const refreshReport = () => {
  searchQuery.value = ''
}

const toggleHeader = () => {
  // toggle
}
useMockSync('customer-report', customers);
</script>
=======
<script setup lang="ts">
import CustomerReportWorkspace from '~/components/pages/reports/CustomerReportWorkspace.vue'

definePageMeta({
  layout: 'default',
})

useLegacyPage({
  title: 'Customer Report',
  sweetAlert: false,
})
</script>

<template>
  <div class="dulank-page dulank-page-customer-report p-4 md:p-6">
    <CustomerReportWorkspace />
  </div>
</template>
>>>>>>> origin/eko
