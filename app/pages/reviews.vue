<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Product Reviews" subtitle="Manage customer ratings, product feedback, and testimonial publication">
      <template #actions>
        <button
          type="button"
          class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
          title="Refresh"
          @click="refresh"
        >
          <CommonFeatherIcon name="rotate-ccw" size="18" />
        </button>
      </template>
    </CommonPageHeader>

    <!-- Dashboard Metric Widgets -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <CommonStatCard label="Total Reviews" :value="String(reviews.length)" icon="message-square" tone="primary" />
      <CommonStatCard label="Average Rating" :value="`${avgRating} / 5.0`" icon="star" tone="warning" />
      <CommonStatCard label="Published Reviews" :value="String(publishedCount)" icon="check-circle" tone="success" />
    </div>

    <!-- Data Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search product, user or review text..." />
        <div class="flex flex-wrap items-center gap-3">
          <select
            v-model="filterRating"
            class="h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option :value="null">Rating: All</option>
            <option :value="5">5 Stars</option>
            <option :value="4">4 Stars</option>
            <option :value="3">3 Stars</option>
            <option :value="2">2 Stars</option>
            <option :value="1">1 Star</option>
          </select>
          <CommonFilterSelect
            v-model="filterStatus"
            allLabel="Status: All"
            :options="[
              { value: 'Publish', label: 'Publish' },
              { value: 'Archived', label: 'Archived' },
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
              <th class="px-4 py-3 text-start whitespace-nowrap">Product Code</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Product</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Date</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Rating</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Title</th>
              <th class="min-w-[250px] px-4 py-3 text-start whitespace-nowrap">Review Content</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="r in filteredReviews" :key="r.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{{ r.user }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 font-mono text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">{{ r.productCode }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap font-semibold text-gray-900 dark:text-gray-100">{{ r.product }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ r.date }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex gap-0.5 text-amber-400">
                  <CommonFeatherIcon
                    v-for="star in 5"
                    :key="star"
                    name="star"
                    size="14"
                    :class="star > r.rating ? 'opacity-25 text-gray-300 dark:text-gray-600' : ''"
                  />
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap font-semibold">{{ r.title }}</td>
              <td class="max-w-[250px] truncate px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ r.content }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <select
                  v-model="r.status"
                  class="h-8 w-28 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                >
                  <option value="Publish">Publish</option>
                  <option value="Archived">Archived</option>
                </select>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <CommonRowActions :item="r" @delete="deleteReview(r.id)" />
              </td>
            </tr>
            <tr v-if="filteredReviews.length === 0">
              <td colspan="9" class="p-8 text-center text-gray-400">No reviews found matching filter criteria.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from "vue";

const { data: reviewsData } = await useFetch<ReviewItem[]>('/api/reviews')
const reviews = ref<ReviewItem[]>(reviewsData.value ?? [])
useMockSync('reviews', reviews);

const searchQuery = ref("");
const filterRating = ref<number | null>(null);
const filterStatus = ref("");
const ratingDropdownOpen = ref(false);
const statusDropdownOpen = ref(false);

const avgRating = computed(() => {
  if (!reviews.value.length) return "0.0";
  const total = reviews.value.reduce((sum, r) => sum + r.rating, 0);
  return (total / reviews.value.length).toFixed(1);
});

const publishedCount = computed(() => reviews.value.filter((r) => r.status === "Publish").length);

const filteredReviews = computed(() => {
  return reviews.value.filter((r) => {
    const matchRating = filterRating.value === null || r.rating === filterRating.value;
    const matchStatus = !filterStatus.value || r.status === filterStatus.value;
    const matchSearch =
      !searchQuery.value ||
      r.user.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.product.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      r.content.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchRating && matchStatus && matchSearch;
  });
});

function deleteReview(id: number) {
  if (confirm("Delete this customer review?")) {
    reviews.value = reviews.value.filter((r) => r.id !== id);
  }
}

function refresh() {
  searchQuery.value = "";
  filterRating.value = null;
  filterStatus.value = "";
}
</script>
=======
<script setup lang="ts">
import type { ReviewFilterQuery } from '#server/types/review'
import type { DateRangeValue } from '~/composables/useDateRange'
import { useReviews } from '~/composables/useReviews'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import ReviewsStatsWidgets from '~/components/pages/reviews/ReviewsStatsWidgets.vue'
import ReviewsRecordsTable from '~/components/pages/reviews/ReviewsRecordsTable.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'

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

    <!-- Error & Skeleton Feedback -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="8"
      :skeleton-rows="6"
      :error="error ? (error.message || 'Gagal memuat ulasan pelanggan. Silakan coba lagi.') : ''"
      @retry="refresh"
    />

    <!-- Reviews Records Table -->
    <ReviewsRecordsTable
      v-if="!pending && !error"
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
>>>>>>> origin/eko
