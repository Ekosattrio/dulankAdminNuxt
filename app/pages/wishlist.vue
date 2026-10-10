<script setup lang="ts">
import type { WishlistFilterQuery } from '#server/types/wishlist'
import type { DateRangeValue } from '~/composables/useDateRange'
import { useWishlists } from '~/composables/useWishlists'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import WishlistStatsWidgets from '~/components/Pages/Wishlist/WishlistStatsWidgets.vue'
import WishlistRecordsTable from '~/components/Pages/Wishlist/WishlistRecordsTable.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'

import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'
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
