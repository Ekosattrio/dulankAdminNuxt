<script setup lang="ts">
import type { ReviewFilterQuery } from '#server/types/review'
import type { DateRangeValue } from '~/composables/useDateRange'
import { useReviews } from '~/composables/useReviews'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import ReviewsStatsWidgets from '~/components/pages/reviews/ReviewsStatsWidgets.vue'
import ReviewsRecordsTable from '~/components/pages/reviews/ReviewsRecordsTable.vue'

import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import { useTablePrint } from '~/composables/useTablePrint'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Reviews List - Dulank Admin',
  sweetAlert: false
})

const searchQuery = ref('')
const filterRating = ref('')
const filterDateRange = ref<DateRangeValue | null>(null)

const filterParams = computed<ReviewFilterQuery>(() => ({
  search: searchQuery.value || undefined,
  rating: filterRating.value || undefined,
  startDate: filterDateRange.value?.start || undefined,
  endDate: filterDateRange.value?.end || undefined
}))

const { reviews, stats, pending, error, refresh } = useReviews(filterParams)
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const reviewPrintColumns = [
  { key: 'userEmail', label: 'User' },
  { key: 'productId', label: 'Product ID' },
  { key: 'productName', label: 'Product' },
  { key: 'date', label: 'Date' },
  { key: 'rating', label: 'Rating', align: 'center' as const },
  { key: 'title', label: 'Title' },
  { key: 'review', label: 'Review' },
  { key: 'status', label: 'Status', align: 'center' as const }
]
</script>

<template>
  <div class="dulank-page dulank-page-reviews max-w-7xl mx-auto px-4 py-6">
    <!-- Header with literal title and subtitle from Netlify / legacy HTML -->
    <SalesListHeader
      title="Reviews List"
      subtitle="Manage Reviews"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <!-- KPI Widgets (3 cards matching legacy HTML) -->
    <ReviewsStatsWidgets :stats="stats" />

    <!-- Error State -->
    <div v-if="error" class="p-4 bg-red-50 text-red-600 rounded-lg text-sm mb-4">
      Gagal memuat ulasan pelanggan: {{ error.message }}
      <button class="ml-2 underline font-semibold" @click="refresh">Coba lagi</button>
    </div>

    <!-- Reviews Records Table -->
    <ReviewsRecordsTable
      :reviews="reviews"
      v-model:search-query="searchQuery"
      v-model:filter-rating="filterRating"
      v-model:filter-date-range="filterDateRange"
    />

    <!-- Standardized Print & Export PDF Modal -->
    <DocumentPrintModal
      v-if="isPrintModalOpen"
      :open="isPrintModalOpen"
      title="Laporan Ulasan Pelanggan (Reviews List)"
      :columns="reviewPrintColumns"
      :items="reviews"
      date-field="date"
      :initial-date-range="filterDateRange"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
