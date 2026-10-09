<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import BaseModal from '~/components/modal/BaseModal.vue'
import AnalyticsTopStats from '~/components/pages/analytics/AnalyticsTopStats.vue'
import AnalyticsConversionsCard from '~/components/pages/analytics/AnalyticsConversionsCard.vue'
import AnalyticsPerformanceChart from '~/components/pages/analytics/AnalyticsPerformanceChart.vue'
import AnalyticsBrowserStats from '~/components/pages/analytics/AnalyticsBrowserStats.vue'
import AnalyticsRegionStats from '~/components/pages/analytics/AnalyticsRegionStats.vue'
import AnalyticsTopPagesTable from '~/components/pages/analytics/AnalyticsTopPagesTable.vue'

definePageMeta({
  layout: 'default',
  alias: ['/analytics-dashboard.html'],
})

useLegacyPage({
  title: 'Analytics Dashboard',
  sweetAlert: false,
})

const isDetailModalOpen = ref(false)
const modalTitle = ref('')
const modalContent = ref('')

function handleOpenModal(title: string, desc: string) {
  modalTitle.value = title
  modalContent.value = desc
  isDetailModalOpen.value = true
}
</script>

<template>
  <div class="dulank-page dulank-page-analytics-dashboard min-h-screen p-4 sm:p-6 space-y-5">
    <!-- Top Stats (4 Cards) -->
    <AnalyticsTopStats @view-detail="handleOpenModal" />

    <!-- Middle Row: Conversions & Performance -->
    <div class="grid grid-cols-1 gap-5 xl:grid-cols-12">
      <AnalyticsConversionsCard @view-detail="handleOpenModal" />
      <AnalyticsPerformanceChart />
    </div>

    <!-- Bottom Row: Session By Browser, Sessions by Country, Top Pages -->
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-12">
      <AnalyticsBrowserStats @view-detail="handleOpenModal" />
      <AnalyticsRegionStats @view-detail="handleOpenModal" />
      <AnalyticsTopPagesTable @view-detail="handleOpenModal" />
    </div>

    <!-- Reusable BaseModal for Details -->
    <BaseModal v-model="isDetailModalOpen" :title="modalTitle" max-width="md">
      <div class="space-y-3 whitespace-pre-line text-xs sm:text-sm text-gray-600 dark:text-gray-300">
        {{ modalContent }}
      </div>
      <template #footer>
        <button
          type="button"
          class="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200"
          @click="isDetailModalOpen = false"
        >
          Close
        </button>
      </template>
    </BaseModal>
  </div>
</template>
