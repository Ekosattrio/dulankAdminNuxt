<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Checkout List" subtitle="Manage completed and pending customer checkouts" />

    <!-- Dashboard Metric Widgets -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <CommonStatCard label="Total Checkout" :value="String(checkouts.length)" icon="shopping-cart" tone="primary" />
      <CommonStatCard label="Total Revenue" :value="`Rp ${formatNumber(totalRevenue)}`" icon="dollar-sign" tone="success" />
      <CommonStatCard label="Total Success" :value="String(successCount)" icon="check-circle" tone="sky" />
      <CommonStatCard label="Total Failed" :value="String(failedCount)" icon="alert-triangle" tone="danger" />
    </div>

    <!-- Data Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search customer or product details..." />
        <div class="flex flex-wrap items-center gap-3">
          <CommonFilterSelect
            v-model="filterMethod"
            allLabel="Metode: All"
            :options="[
              { value: 'Kartu Kredit', label: 'Kartu Kredit' },
              { value: 'Transfer Bank', label: 'Transfer Bank' },
              { value: 'E-Wallet', label: 'E-Wallet' },
              { value: 'Virtual Account', label: 'Virtual Account' },
            ]"
          />
          <CommonFilterSelect
            v-model="filterStatus"
            allLabel="Status: All"
            :options="[
              { value: 'Berhasil', label: 'Berhasil' },
              { value: 'Gagal', label: 'Gagal' },
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
              <th class="px-4 py-3 text-start whitespace-nowrap">User</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Date Checkout</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Payment Amount</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Metode</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Voucher</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Delivery Fee</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Detail Product</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredCheckouts" :key="item.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-semibold text-gray-900 dark:text-gray-100">{{ item.user }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.date }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-bold text-gray-900 dark:text-gray-100">Rp {{ formatNumber(item.amount) }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">{{ item.method }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="item.status" :tone="item.status === 'Berhasil' ? 'emerald' : 'rose'" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span v-if="item.voucher !== '-'" class="inline-flex rounded-md bg-amber-100 px-2 py-0.5 font-mono text-[11px] text-amber-800 dark:bg-amber-950 dark:text-amber-300">{{ item.voucher }}</span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-end">{{ item.deliveryFee > 0 ? `Rp ${formatNumber(item.deliveryFee)}` : '-' }}</td>
              <td class="max-w-[250px] truncate px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ item.details }}</td>
            </tr>
            <tr v-if="filteredCheckouts.length === 0">
              <td colspan="8" class="p-8 text-center text-gray-400">No checkout records found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from 'vue'

const { data: checkoutData } = await useFetch<CheckoutItem[]>('/api/checkout')
const checkouts = ref<CheckoutItem[]>(checkoutData.value ?? [])
useMockSync('checkout', checkouts)
=======
<script setup lang="ts">
import type { CheckoutFilterQuery } from '#server/types/checkout'
import type { DateRangeValue } from '~/composables/useDateRange'
import { useCheckouts } from '~/composables/useCheckouts'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import CheckoutStatsWidgets from '~/components/pages/checkout/CheckoutStatsWidgets.vue'
import CheckoutRecordsTable from '~/components/pages/checkout/CheckoutRecordsTable.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'

import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import { useTablePrint } from '~/composables/useTablePrint'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Checkout List - Dulank Admin',
  sweetAlert: false
})
>>>>>>> origin/eko

const searchQuery = ref('')
const filterMethod = ref('')
const filterStatus = ref('')
<<<<<<< HEAD
const methodDropdownOpen = ref(false)
const statusDropdownOpen = ref(false)

const totalRevenue = computed(() => {
  return checkouts.value
    .filter(c => c.status === 'Berhasil')
    .reduce((sum, c) => sum + c.amount, 0)
})
const successCount = computed(() => checkouts.value.filter(c => c.status === 'Berhasil').length)
const failedCount = computed(() => checkouts.value.filter(c => c.status === 'Gagal').length)

const filteredCheckouts = computed(() => {
  return checkouts.value.filter(c => {
    const matchMethod = !filterMethod.value || c.method === filterMethod.value
    const matchStatus = !filterStatus.value || c.status === filterStatus.value
    const matchSearch = !searchQuery.value ||
      c.user.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.details.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.voucher.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchMethod && matchStatus && matchSearch
  })
})

function formatNumber(val: number) {
  return val.toLocaleString('id-ID')
}
</script>
=======
const filterDateRange = ref<DateRangeValue | null>(null)

const filterParams = computed<CheckoutFilterQuery>(() => ({
  search: searchQuery.value || undefined,
  method: filterMethod.value || undefined,
  status: filterStatus.value || undefined,
  startDate: filterDateRange.value?.start || undefined,
  endDate: filterDateRange.value?.end || undefined
}))

const { checkouts, stats, pending, error, refresh } = useCheckouts(filterParams)
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const checkoutPrintColumns = [
  { key: 'transactionId', label: 'ID' },
  { key: 'customer', label: 'Customer' },
  { key: 'product', label: 'Product' },
  { key: 'method', label: 'Payment Method' },
  { key: 'payment', label: 'Payment (IDR)', align: 'right' as const },
  { key: 'deliveryFee', label: 'Delivery Fee', align: 'right' as const },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status', align: 'center' as const }
]
</script>

<template>
  <div class="dulank-page dulank-page-checkout max-w-7xl mx-auto px-4 py-6">
    <!-- Header with literal title and subtitle from Netlify / legacy HTML -->
    <SalesListHeader
      title="Checkout List"
      subtitle="Manage Checkout"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <!-- KPI Widgets -->
    <CheckoutStatsWidgets :stats="stats" />

    <!-- Error & Skeleton Feedback -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="8"
      :skeleton-rows="6"
      :error="error ? (error.message || 'Gagal memuat data checkout. Silakan coba lagi.') : ''"
      @retry="refresh"
    />

    <!-- Checkout Records Table -->
    <CheckoutRecordsTable
      v-if="!pending && !error"
      :checkouts="checkouts"
      v-model:search-query="searchQuery"
      v-model:filter-method="filterMethod"
      v-model:filter-status="filterStatus"
      v-model:filter-date-range="filterDateRange"
    />

    <!-- Standardized Print & Export PDF Modal -->
    <DocumentPrintModal
      v-if="isPrintModalOpen"
      :open="isPrintModalOpen"
      title="Laporan Transaksi Checkout (Checkout List)"
      :columns="checkoutPrintColumns"
      :items="checkouts"
      date-field="date"
      :initial-date-range="filterDateRange"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
>>>>>>> origin/eko
