<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="All Job List" subtitle="Manage all job orders and production flows">
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

    <div class="grid grid-cols-1 gap-5 lg:grid-cols-12">
      <!-- Left Panel: Production Flows -->
      <div class="lg:col-span-3">
        <div class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
            <h6 class="font-bold text-gray-800 dark:text-gray-200">Production Flows</h6>
            <button v-if="selectedFlow" type="button" class="text-xs font-semibold text-rose-500 hover:underline" @click="selectedFlow = ''">Reset</button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
              <thead class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
                <tr>
                  <th class="px-4 py-2 text-start">All Flow</th>
                  <th class="px-3 py-2 text-end">Job Qty</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr
                  v-for="f in flowCategories"
                  :key="f.name"
                  class="cursor-pointer transition"
                  :class="selectedFlow === f.name ? 'bg-primary/5 font-bold text-primary' : 'hover:bg-gray-50 dark:hover:bg-gray-800/40'"
                  @click="selectedFlow = (selectedFlow === f.name ? '' : f.name)"
                >
                  <td class="px-4 py-2">{{ f.name }}</td>
                  <td class="px-3 py-2 text-end">
                    <span
                      :class="[
                        'inline-flex min-w-6 justify-center rounded-full px-2 py-0.5 text-[11px] font-medium',
                        selectedFlow === f.name ? 'bg-primary text-white' : 'border border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300',
                      ]"
                    >
                      {{ f.count }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Right Panel: Main Job Table -->
      <div class="lg:col-span-9">
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <!-- Toolbar -->
          <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
            <CommonSearchFilter v-model="searchQuery" placeholder="Search order no, customer, product..." />
            <div v-if="selectedFlow" class="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white">
              Flow Filter: {{ selectedFlow }}
              <button type="button" class="hover:text-white/70" @click="selectedFlow = ''">
                <CommonFeatherIcon name="x" size="13" />
              </button>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
              <thead
                class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
              >
                <tr>
                  <th class="px-4 py-3 text-start whitespace-nowrap">No Job Order</th>
                  <th class="px-4 py-3 text-start whitespace-nowrap">Sales Date</th>
                  <th class="px-4 py-3 text-start whitespace-nowrap">Customer</th>
                  <th class="px-4 py-3 text-start whitespace-nowrap">Product</th>
                  <th class="px-4 py-3 text-start whitespace-nowrap">Flow</th>
                  <th class="px-4 py-3 text-start whitespace-nowrap">Flow Type</th>
                  <th class="px-4 py-3 text-start whitespace-nowrap">Assignee</th>
                  <th class="px-4 py-3 text-start whitespace-nowrap">Date Complete</th>
                  <th class="px-4 py-3 text-center whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                <tr v-for="job in filteredJobs" :key="job.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
                  <td class="px-4 py-3 whitespace-nowrap font-bold text-primary">{{ job.jobOrderNo }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">{{ job.salesDate }}</td>
                  <td class="px-4 py-3 whitespace-nowrap font-semibold text-gray-900 dark:text-gray-100">{{ job.customer }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">{{ job.product }}</td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <span class="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">{{ job.flow }}</span>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <CommonStatusPill :status="job.flowType" :tone="job.flowType === 'In-House' ? 'emerald' : 'amber'" />
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">{{ job.assignee }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ job.dateComplete }}</td>
                  <td class="px-4 py-3 whitespace-nowrap text-center">
                    <button
                      type="button"
                      class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-sky-500 dark:hover:bg-gray-800"
                      title="View Job Details"
                      @click="viewJob(job)"
                    >
                      <CommonFeatherIcon name="eye" size="16" />
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredJobs.length === 0">
                  <td colspan="9" class="p-8 text-center text-gray-400">No job orders found matching the filter criteria.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- View Job Details Modal (Printable) -->
    <CommonBaseModal v-model="viewModalVisible" :title="`Job Sheet: ${selectedJob?.jobOrderNo ?? ''}`" maxWidth="lg">
      <div v-if="selectedJob" class="space-y-4">
        <div class="rounded-lg border border-gray-100 bg-gray-50/60 p-3 dark:border-gray-800 dark:bg-gray-800/30">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <div class="text-xs text-gray-400">Customer</div>
              <div class="font-bold text-gray-900 dark:text-gray-100">{{ selectedJob.customer }}</div>
              <div class="text-xs text-gray-400">Sales Date: {{ selectedJob.salesDate }}</div>
            </div>
            <div class="sm:text-end">
              <div class="text-xs text-gray-400">Completion Date</div>
              <div class="font-bold text-emerald-600 dark:text-emerald-400">{{ selectedJob.dateComplete }}</div>
              <div class="text-xs text-gray-400">Assignee: {{ selectedJob.assignee }} ({{ selectedJob.flowType }})</div>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
          <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
            <thead class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
              <tr>
                <th class="px-3 py-2 text-start">Job Title / Product</th>
                <th class="px-3 py-2 text-start">Flow Process</th>
                <th class="px-3 py-2 text-start">Execution Type</th>
                <th class="px-3 py-2 text-start">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr>
                <td class="px-3 py-2 font-bold text-gray-900 dark:text-gray-100">{{ selectedJob.product }}</td>
                <td class="px-3 py-2">{{ selectedJob.flow }}</td>
                <td class="px-3 py-2">{{ selectedJob.flowType }}</td>
                <td class="px-3 py-2">
                  <CommonStatusPill status="Completed" tone="emerald" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <template #footer>
        <div class="flex items-center justify-between">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            @click="printTable"
          >
            <CommonFeatherIcon name="printer" size="15" />
            Print SPK Sheet
          </button>
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="viewModalVisible = false"
          >
            Close
          </button>
        </div>
      </template>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">definePageMeta({
  layout: 'default'
})

useHead({
  title: 'All Job List - Kacetak System'
})

const { data: jobListData } = await useFetch<{ flowCategories: FlowCategoryCount[]; jobs: JobItem[] }>('/api/job-list')
const flowCategories = ref<FlowCategoryCount[]>(jobListData.value?.flowCategories ?? [])

const jobs = ref<JobItem[]>(jobListData.value?.jobs ?? [])

const selectedFlow = ref('')
const searchQuery = ref('')

const filteredJobs = computed(() => {
  return jobs.value.filter(j => {
    const matchFlow = selectedFlow.value ? j.flow === selectedFlow.value : true
    const matchSearch =
      j.jobOrderNo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      j.customer.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      j.product.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      j.assignee.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchFlow && matchSearch
  })
})

const viewModalVisible = ref(false)
const selectedJob = ref<JobItem | null>(null)

function viewJob(job: JobItem) {
  selectedJob.value = job
  viewModalVisible.value = true
}

function exportPdf() {
  alert('Exporting Job List PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  selectedFlow.value = ''
  searchQuery.value = ''
}
</script>
=======
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
>>>>>>> origin/eko
