<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Wishlist List" subtitle="Manage customer wishlist items and product interests" />

    <!-- Dashboard Metric Widgets -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <CommonStatCard label="Total Wishlist Value" :value="`Rp ${formatNumber(totalWishlistAmount)}`" icon="heart" tone="primary" />
      <CommonStatCard label="Active Wishlists" :value="String(activeCount)" icon="check-circle" tone="success" />
      <CommonStatCard label="Converted to Order" :value="String(checkoutCount)" icon="shopping-cart" tone="sky" />
      <CommonStatCard label="Removed from Wishlist" :value="String(deleteCount)" icon="trash-2" tone="danger" />
    </div>

    <!-- Data Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search product or user..." />
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
              <th class="px-4 py-3 text-start whitespace-nowrap">User</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Category</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Price</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Qty</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Total Price</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Date</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="w in filteredWishlist" :key="w.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center">
                  <img :src="w.image" :alt="w.product" class="me-2 h-11 w-11 rounded border border-gray-200 object-cover dark:border-gray-700" />
                  <span class="font-semibold text-gray-900 dark:text-gray-100">{{ w.product }}</span>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">{{ w.user }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">{{ w.category }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-end">Rp {{ formatNumber(w.price) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-center font-bold">{{ w.qty }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-bold text-gray-900 dark:text-gray-100">Rp {{ formatNumber(w.totalPrice) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ w.date }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill
                  :status="w.status"
                  :tone="w.status === 'Active' ? 'emerald' : w.status === 'Checkout' ? 'sky' : 'rose'"
                />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <CommonRowActions :item="w" @delete="deleteItem(w.id)" />
              </td>
            </tr>
            <tr v-if="filteredWishlist.length === 0">
              <td colspan="9" class="p-8 text-center text-gray-400">No wishlist records found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from "vue";

const { data: wishlistData } = await useFetch<WishlistItem[]>('/api/wishlist')
const wishlist = ref<WishlistItem[]>(wishlistData.value ?? [])
useMockSync('wishlist', wishlist);

const searchQuery = ref("");
const filterCategory = ref("");
const filterStatus = ref("");
const catDropdownOpen = ref(false);
const statusDropdownOpen = ref(false);

const totalWishlistAmount = computed(() => wishlist.value.reduce((sum, item) => sum + item.totalPrice, 0));
const activeCount = computed(() => wishlist.value.filter((item) => item.status === "Active").length);
const checkoutCount = computed(() => wishlist.value.filter((item) => item.status === "Checkout").length);
const deleteCount = computed(() => wishlist.value.filter((item) => item.status === "Delete").length);

const filteredWishlist = computed(() => {
  return wishlist.value.filter((w) => {
    const matchCat = !filterCategory.value || w.category === filterCategory.value;
    const matchStatus = !filterStatus.value || w.status === filterStatus.value;
    const matchSearch =
      !searchQuery.value ||
      w.product.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      w.user.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchCat && matchStatus && matchSearch;
  });
});

function formatNumber(val: number) {
  return val.toLocaleString("id-ID");
}

function deleteItem(id: number) {
  if (confirm("Delete this item from wishlist?")) {
    wishlist.value = wishlist.value.filter((w) => w.id !== id);
  }
}
</script>
=======
<script setup lang="ts">
import type { WishlistFilterQuery } from '#server/types/wishlist'
import type { DateRangeValue } from '~/composables/useDateRange'
import { useWishlists } from '~/composables/useWishlists'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import WishlistStatsWidgets from '~/components/pages/wishlist/WishlistStatsWidgets.vue'
import WishlistRecordsTable from '~/components/pages/wishlist/WishlistRecordsTable.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'

import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import { useTablePrint } from '~/composables/useTablePrint'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Wishlist List - Dulank Admin',
  sweetAlert: false
})

const searchQuery = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const filterDateRange = ref<DateRangeValue | null>(null)

const filterParams = computed<WishlistFilterQuery>(() => ({
  search: searchQuery.value || undefined,
  category: filterCategory.value || undefined,
  status: filterStatus.value || undefined,
  startDate: filterDateRange.value?.start || undefined,
  endDate: filterDateRange.value?.end || undefined
}))

const { wishlists, stats, pending, error, refresh } = useWishlists(filterParams)
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const wishlistPrintColumns = [
  { key: 'customer', label: 'Customer' },
  { key: 'product', label: 'Product' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price', align: 'right' as const },
  { key: 'total', label: 'Total Price', align: 'right' as const },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status', align: 'center' as const }
]
</script>

<template>
  <div class="dulank-page dulank-page-wishlist max-w-7xl mx-auto px-4 py-6">
    <!-- Header with literal title and subtitle from Netlify / legacy HTML -->
    <SalesListHeader
      title="Wishlist List"
      subtitle="Manage Wishlist"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <!-- KPI Widgets -->
    <WishlistStatsWidgets :stats="stats" />

    <!-- Error & Skeleton Feedback -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="7"
      :skeleton-rows="6"
      :error="error ? (error.message || 'Gagal memuat data wishlist. Silakan coba lagi.') : ''"
      @retry="refresh"
    />

    <!-- Wishlist Records Table -->
    <WishlistRecordsTable
      v-if="!pending && !error"
      :wishlists="wishlists"
      v-model:search-query="searchQuery"
      v-model:filter-category="filterCategory"
      v-model:filter-status="filterStatus"
      v-model:filter-date-range="filterDateRange"
    />

    <!-- Standardized Print & Export PDF Modal -->
    <DocumentPrintModal
      v-if="isPrintModalOpen"
      :open="isPrintModalOpen"
      title="Laporan Wishlist Pelanggan (Wishlist List)"
      :columns="wishlistPrintColumns"
      :items="wishlists"
      date-field="date"
      :initial-date-range="filterDateRange"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
>>>>>>> origin/eko
