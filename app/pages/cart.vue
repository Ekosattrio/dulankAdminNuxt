<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Cart List" subtitle="Manage customer carts and abandoned checkout tracking" />

    <!-- Dashboard Metric Widgets -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <CommonStatCard label="Total Cart Amount" :value="`Rp ${formatNumber(totalCartAmount)}`" icon="shopping-cart" tone="primary" />
      <CommonStatCard label="Total Cart Active" :value="String(activeCount)" icon="activity" tone="success" />
      <CommonStatCard label="Total Cart Checkout" :value="String(checkoutCount)" icon="credit-card" tone="sky" />
      <CommonStatCard label="Total Cart Deleted" :value="String(deleteCount)" icon="trash-2" tone="danger" />
    </div>

    <!-- Data Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search product or customer email..." />
        <div class="flex flex-wrap items-center gap-3">
          <CommonFilterSelect
            v-model="filterCategory"
            allLabel="All Categories"
            :options="[
              { value: 'Brochure', label: 'Brochure' },
              { value: 'Flyer', label: 'Flyer' },
              { value: 'Packaging', label: 'Packaging' },
              { value: 'Stationery', label: 'Stationery' },
            ]"
          />
          <CommonFilterSelect
            v-model="filterStatus"
            allLabel="All Status"
            :options="[
              { value: 'Active', label: 'Active' },
              { value: 'Checkout', label: 'Checkout' },
              { value: 'Delete', label: 'Delete' },
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
              <th class="px-4 py-3 text-start whitespace-nowrap">Product</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Customer User</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Category</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Unit Price</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Qty</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Total Price</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Date</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredCarts" :key="item.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <img :src="item.image" :alt="item.product" class="me-2 h-11 w-11 rounded border border-gray-200 object-cover dark:border-gray-700" />
                  <span class="font-semibold text-gray-900 dark:text-gray-100">{{ item.product }}</span>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.user }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">{{ item.category }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-end">Rp {{ formatNumber(item.price) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-center font-bold">{{ item.qty }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-bold text-gray-900 dark:text-gray-100">Rp {{ formatNumber(item.totalPrice) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ item.date }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill
                  :status="item.status"
                  :tone="item.status === 'Active' ? 'emerald' : item.status === 'Checkout' ? 'sky' : 'rose'"
                />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <CommonRowActions :item="item" @delete="deleteCartItem(item.id)" />
              </td>
            </tr>
            <tr v-if="filteredCarts.length === 0">
              <td colspan="9" class="p-8 text-center text-gray-400">No cart records found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from 'vue'

const { data: cartData } = await useFetch<CartItem[]>('/api/cart')
const carts = ref<CartItem[]>(cartData.value ?? [])
useMockSync('cart', carts)
=======
<script setup lang="ts">
import type { CartFilterQuery } from '#server/types/cart'
import type { DateRangeValue } from '~/composables/useDateRange'
import { useCarts } from '~/composables/useCarts'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import CartStatsWidgets from '~/components/pages/cart/CartStatsWidgets.vue'
import CartRecordsTable from '~/components/pages/cart/CartRecordsTable.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'

import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import { useTablePrint } from '~/composables/useTablePrint'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Cart List - Dulank Admin',
  sweetAlert: false
})
>>>>>>> origin/eko

const searchQuery = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
<<<<<<< HEAD
const catDropdownOpen = ref(false)
const statusDropdownOpen = ref(false)

const totalCartAmount = computed(() => carts.value.reduce((sum, item) => sum + item.totalPrice, 0))
const activeCount = computed(() => carts.value.filter(item => item.status === 'Active').length)
const checkoutCount = computed(() => carts.value.filter(item => item.status === 'Checkout').length)
const deleteCount = computed(() => carts.value.filter(item => item.status === 'Delete').length)

const filteredCarts = computed(() => {
  return carts.value.filter(c => {
    const matchCat = !filterCategory.value || c.category === filterCategory.value
    const matchStatus = !filterStatus.value || c.status === filterStatus.value
    const matchSearch = !searchQuery.value ||
      c.product.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.user.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchCat && matchStatus && matchSearch
  })
})

function formatNumber(val: number) {
  return val.toLocaleString('id-ID')
}

function deleteCartItem(id: number) {
  if (confirm('Delete this cart record?')) {
    carts.value = carts.value.filter(c => c.id !== id)
  }
}
</script>
=======
const filterDateRange = ref<DateRangeValue | null>(null)

const filterParams = computed<CartFilterQuery>(() => ({
  search: searchQuery.value || undefined,
  category: filterCategory.value || undefined,
  status: filterStatus.value || undefined,
  startDate: filterDateRange.value?.start || undefined,
  endDate: filterDateRange.value?.end || undefined
}))

const { carts, stats, pending, error, refresh } = useCarts(filterParams)
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const cartPrintColumns = [
  { key: 'customer', label: 'Customer' },
  { key: 'product', label: 'Product' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price', align: 'right' as const },
  { key: 'qty', label: 'Qty', align: 'center' as const },
  { key: 'total', label: 'Total Price', align: 'right' as const },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status', align: 'center' as const }
]
</script>

<template>
  <div class="dulank-page dulank-page-cart max-w-7xl mx-auto px-4 py-6">
    <!-- Header with literal title and subtitle from Netlify / legacy HTML -->
    <SalesListHeader
      title="Cart List"
      subtitle="Manage cart"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <!-- KPI Widgets -->
    <CartStatsWidgets :stats="stats" />

    <!-- Error & Skeleton Feedback -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="8"
      :skeleton-rows="6"
      :error="error ? (error.message || 'Gagal memuat data keranjang. Silakan coba lagi.') : ''"
      @retry="refresh"
    />

    <!-- Cart Records Table -->
    <CartRecordsTable
      v-if="!pending && !error"
      :carts="carts"
      v-model:search-query="searchQuery"
      v-model:filter-category="filterCategory"
      v-model:filter-status="filterStatus"
      v-model:filter-date-range="filterDateRange"
    />

    <!-- Standardized Print & Export PDF Modal -->
    <DocumentPrintModal
      v-if="isPrintModalOpen"
      :open="isPrintModalOpen"
      title="Laporan Keranjang Pelanggan (Cart List)"
      :columns="cartPrintColumns"
      :items="carts"
      date-field="date"
      :initial-date-range="filterDateRange"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
>>>>>>> origin/eko
