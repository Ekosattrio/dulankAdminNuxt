<script setup lang="ts">
import type { JobListItem } from '#server/types/job-list'
import type { DateRangeValue } from '~/composables/useDateRange'
import { useJobList } from '~/composables/useJobList'
import { printSalesRows } from '~/utils/salesDocuments'
import JobListDetailModal from '~/components/pages/job-list/JobListDetailModal.vue'
import JobListFlowSidebar from '~/components/pages/job-list/JobListFlowSidebar.vue'
import JobListRecordsTable from '~/components/pages/job-list/JobListRecordsTable.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'

definePageMeta({
  layout: 'default',
  alias: ['/job-list.html'],
})

useLegacyPage({ title: 'All Job List', sweetAlert: false })

const searchQuery = ref('')
const selectedFlow = ref('')
const filterDateRange = ref<DateRangeValue | null>(null)

const activeItemForDetail = ref<JobListItem | null>(null)
const isDetailModalOpen = ref(false)

const filterParams = computed(() => ({
  search: searchQuery.value,
  flow: selectedFlow.value,
  startDate: filterDateRange.value?.start || '',
  endDate: filterDateRange.value?.end || '',
}))

const { jobList, flows, pending, error, refresh } = useJobList(filterParams)

function handleViewDetail(item: JobListItem) {
  activeItemForDetail.value = item
  isDetailModalOpen.value = true
}

import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import { useTablePrint } from '~/composables/useTablePrint'

const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const jobListPrintColumns = [
  { key: 'no', label: 'No Job Order' },
  { key: 'salesDate', label: 'Sales Date' },
  { key: 'customer', label: 'Customer' },
  { key: 'product', label: 'Product' },
  { key: 'flow', label: 'Flow' },
  { key: 'flowType', label: 'Flow Type' },
  { key: 'assignee', label: 'Assignee' },
  { key: 'dateComplete', label: 'Date Complete' }
]
</script>

<template>
  <div class="dulank-page dulank-page-job-list space-y-6">
    <SalesListHeader
      title="All Job List"
      subtitle="Manage all job list completed"
      :refreshing="pending"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="8"
      :skeleton-rows="6"
      :error="error ? 'Unable to load completed jobs. Please try again.' : ''"
      @retry="refresh()"
    />

    <!-- 2-Column Main Layout -->
    <div v-if="!pending && !error" class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left: All Flow Table -->
      <div class="lg:col-span-4 xl:col-span-3">
        <JobListFlowSidebar
          :flows="flows"
          :active-flow="selectedFlow"
          @select-flow="selectedFlow = $event"
        />
      </div>

      <!-- Right: Completed Jobs Table -->
      <div class="lg:col-span-8 xl:col-span-9">
        <JobListRecordsTable
          :items="jobList"
          :search-query="searchQuery"
          :filter-date-range="filterDateRange"
          @update:search-query="searchQuery = $event"
          @update:filter-date-range="filterDateRange = $event"
          @view-detail="handleViewDetail"
        />
      </div>
    </div>

    <!-- Detail Job List Modal -->
    <JobListDetailModal
      :open="isDetailModalOpen"
      :item="activeItemForDetail"
      @close="isDetailModalOpen = false; activeItemForDetail = null"
    />

    <!-- Standardized Print & Export PDF Modal -->
    <DocumentPrintModal
      v-if="isPrintModalOpen"
      :open="isPrintModalOpen"
      title="Laporan All Job List (Job List Completed)"
      :columns="jobListPrintColumns"
      :items="jobList"
      date-field="salesDate"
      :initial-date-range="filterDateRange"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
