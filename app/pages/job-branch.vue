<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Job Branch" subtitle="Manage job distribution and branch operations">
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
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            @click="historyModalVisible = true"
          >
            <CommonFeatherIcon name="clock" size="16" />
            History Job Branch
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search job, branch, customer, flow..." />
        <CommonFilterSelect
          v-model="filterBranch"
          allLabel="All Branches"
          :options="[
            { value: 'Dulank Karawang', label: 'Dulank Karawang' },
            { value: 'Dulank Jakarta', label: 'Dulank Jakarta' },
            { value: 'Dulank Cirebon', label: 'Dulank Cirebon' },
          ]"
        />
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">No Job</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Branch</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Customer</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Product</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Flow Name</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Priority</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="job in filteredJobs" :key="job.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-bold text-primary">{{ job.jobNo }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">{{ job.branch }}</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap font-semibold text-gray-900 dark:text-gray-100">{{ job.customer }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ job.product }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ job.flowName }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill
                  :status="job.priority"
                  :tone="job.priority === 'Urgent' ? 'rose' : job.priority === 'High' ? 'amber' : 'slate'"
                />
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="job.status" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-center">
                <button
                  type="button"
                  class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
                  title="Setting Detail Job"
                  @click="openSettingModal(job)"
                >
                  <CommonFeatherIcon name="settings" size="16" />
                </button>
              </td>
            </tr>
            <tr v-if="filteredJobs.length === 0">
              <td colspan="8" class="p-8 text-center text-gray-400">No jobs found matching criteria.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- History Job Branch Modal -->
    <CommonBaseModal v-model="historyModalVisible" title="History Job Branch" maxWidth="lg">
      <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
            <tr>
              <th class="px-3 py-2 text-start">Date</th>
              <th class="px-3 py-2 text-start">Branch</th>
              <th class="px-3 py-2 text-start">Customer</th>
              <th class="px-3 py-2 text-start">Flow Name</th>
              <th class="px-3 py-2 text-start">Date Finish</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="hist in historyData" :key="hist.id">
              <td class="px-3 py-2">{{ hist.date }}</td>
              <td class="px-3 py-2">
                <span class="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">{{ hist.branch }}</span>
              </td>
              <td class="px-3 py-2">{{ hist.customer }}</td>
              <td class="px-3 py-2">{{ hist.flowName }}</td>
              <td class="px-3 py-2 font-semibold text-emerald-600 dark:text-emerald-400">{{ hist.dateFinish }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="historyModalVisible = false"
          >
            Close
          </button>
        </div>
      </template>
    </CommonBaseModal>

    <!-- Setting Detail Job Branch Modal -->
    <CommonBaseModal v-model="settingModalVisible" :title="`Setting Detail Job Branch: ${selectedJob?.jobNo ?? ''}`" maxWidth="lg">
      <div v-if="selectedJob" class="space-y-4">
        <!-- Job Info -->
        <div class="rounded-lg border border-gray-100 bg-gray-50/60 p-3 dark:border-gray-800 dark:bg-gray-800/30">
          <div class="grid grid-cols-1 gap-1.5 text-sm sm:grid-cols-2">
            <div class="flex"><span class="w-24 shrink-0 text-gray-400">Job Title:</span><span class="font-bold text-gray-800 dark:text-gray-200">{{ selectedJob.product }}</span></div>
            <div class="flex"><span class="w-24 shrink-0 text-gray-400">Customer:</span><span class="text-gray-700 dark:text-gray-300">{{ selectedJob.customer }}</span></div>
            <div class="flex"><span class="w-24 shrink-0 text-gray-400">Flow Process:</span><span class="font-bold text-primary">{{ selectedJob.flowName }}</span></div>
            <div class="flex"><span class="w-24 shrink-0 text-gray-400">Branch:</span><span class="text-gray-700 dark:text-gray-300">{{ selectedJob.branch }}</span></div>
          </div>
        </div>

        <CommonFormField label="Priority">
          <select
            v-model="selectedJob.priority"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Reguler">Reguler</option>
          </select>
        </CommonFormField>

        <!-- Parameters Checklist -->
        <div>
          <h6 class="mb-2 text-sm font-bold text-gray-800 dark:text-gray-200">Process Information & Specifications</h6>
          <div class="space-y-2">
            <div v-for="(spec, idx) in jobSpecs" :key="idx" class="flex items-center gap-2">
              <input
                v-model="spec.label"
                type="text"
                class="w-44 h-9 rounded-md border border-gray-200 bg-white px-2.5 text-xs text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                placeholder="Label"
              />
              <input
                v-model="spec.value"
                type="text"
                class="h-9 flex-1 rounded-md border border-gray-200 bg-white px-2.5 text-xs text-gray-800 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                placeholder="Value"
              />
              <button type="button" class="rounded-lg p-1.5 text-rose-500 transition hover:bg-rose-50 dark:hover:bg-rose-950" @click="removeSpec(idx)">
                <CommonFeatherIcon name="trash-2" size="14" />
              </button>
            </div>
          </div>
          <button type="button" class="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline" @click="addSpec">
            <CommonFeatherIcon name="plus" size="13" />
            Add Information Field
          </button>
        </div>

        <!-- Assignee List -->
        <CommonFormField label="Assignee List">
          <input
            v-model="assigneesText"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="e.g. Abdul, Nurdin, Arif (comma separated)"
          />
        </CommonFormField>

        <!-- Incentive Settings -->
        <div>
          <h6 class="mb-2 text-sm font-bold text-gray-800 dark:text-gray-200">Incentive Setting</h6>
          <div class="flex flex-wrap items-center gap-3">
            <span class="text-xs text-gray-500 dark:text-gray-400">Incentive Amount (Rp)</span>
            <input
              v-model.number="incentiveAmount"
              type="number"
              class="w-36 h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
            <select
              v-model="incentiveUnit"
              class="w-32 h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option value="Job">Per Job</option>
              <option value="Qty">Per Qty</option>
              <option value="Rim">Per Rim</option>
            </select>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="settingModalVisible = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-primary-600"
            @click="saveJobSetting"
          >
            Save Changes
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
  title: 'Job Branch - Kacetak System'
})

const { data: jobBranchData } = await useFetch<JobBranchItem[]>('/api/job-branch')
const jobs = ref<JobBranchItem[]>(jobBranchData.value ?? [])
useMockSync('job-branch', jobs)

const searchQuery = ref('')
const filterBranch = ref('')

const filteredJobs = computed(() => {
  return jobs.value.filter(j => {
    const matchSearch =
      j.jobNo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      j.customer.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      j.product.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      j.flowName.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchBranch = filterBranch.value ? j.branch === filterBranch.value : true
    return matchSearch && matchBranch
  })
})

function getPriorityBadge(priority: string) {
  if (priority === 'Urgent') return 'badge bg-danger bg-opacity-10 text-danger border border-danger'
  if (priority === 'High') return 'badge bg-warning bg-opacity-10 text-warning border border-warning'
  return 'badge bg-info bg-opacity-10 text-info border border-info'
}

function getStatusBadge(status: string) {
  if (status === 'Complete') return 'badge bg-success'
  if (status === 'On Process') return 'badge bg-primary'
  return 'badge bg-secondary'
}

// History Modal
const historyModalVisible = ref(false)
const historyData = ref([
  { id: 1, date: '25/12/2026', branch: 'Dulank Karawang', customer: 'PT Makmur Abadi', flowName: 'Cetak Multilith', dateFinish: '27/12/2026' },
  { id: 2, date: '26/12/2026', branch: 'Dulank Jakarta', customer: 'PT Makmur Abadi', flowName: 'Cetak Outdoor', dateFinish: '28/12/2026' },
  { id: 3, date: '27/12/2026', branch: 'Dulank Cirebon', customer: 'PT Makmur Abadi', flowName: 'Print A3', dateFinish: '29/12/2026' }
])

// Setting Modal
const settingModalVisible = ref(false)
const selectedJob = ref<JobBranchItem | null>(null)
const assigneesText = ref('Abdul, Nurdin')
const incentiveAmount = ref(1500)
const incentiveUnit = ref('Job')

const jobSpecs = ref([
  { label: 'Jumlah Plat', value: '2' },
  { label: 'Warna Cetak', value: 'Hitam' },
  { label: 'Sisi Cetak', value: '1 Sisi' },
  { label: 'Sample Warna', value: 'Tidak Ada' }
])

function openSettingModal(job: JobBranchItem) {
  selectedJob.value = job
  settingModalVisible.value = true
}

function addSpec() {
  jobSpecs.value.push({ label: '', value: '' })
}

function removeSpec(idx: number) {
  jobSpecs.value.splice(idx, 1)
}

function saveJobSetting() {
  alert('Job branch configurations successfully updated!')
  settingModalVisible.value = false
}

function exportPdf() {
  alert('Exporting Job Branch PDF...')
}

function printTable() {
  window.print()
}

function refresh() {
  searchQuery.value = ''
  filterBranch.value = ''
}
</script>
=======
<script setup lang="ts">
import type { JobBranchItem, JobBranchUpdatePayload } from '#server/types/job-branch'
import type { DateRangeValue } from '~/composables/useDateRange'
import { useJobBranches } from '~/composables/useJobBranches'
import { salesErrorMessage, printSalesRows } from '~/utils/salesDocuments'
import JobBranchRecordsTable from '~/components/pages/job-branch/JobBranchRecordsTable.vue'
import JobBranchSettingModal from '~/components/pages/job-branch/JobBranchSettingModal.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'

useLegacyPage({ title: 'Job Branch', sweetAlert: false })

const searchQuery = ref('')
const filterBranch = ref('')
const filterPriority = ref('')
const filterDateRange = ref<DateRangeValue | null>(null)

const activeItemForSetting = ref<JobBranchItem | null>(null)
const isSettingModalOpen = ref(false)
const busy = ref(false)
const actionError = ref('')

const filterParams = computed(() => ({
  search: searchQuery.value,
  branch: filterBranch.value,
  priority: filterPriority.value,
  startDate: filterDateRange.value?.start || '',
  endDate: filterDateRange.value?.end || '',
}))

const { jobBranches, pending, error, refresh, updateRecord } = useJobBranches(filterParams)

function handleOpenSettings(item: JobBranchItem) {
  activeItemForSetting.value = item
  isSettingModalOpen.value = true
}

async function handleSettingSubmit(payload: JobBranchUpdatePayload) {
  if (!activeItemForSetting.value) return
  busy.value = true
  actionError.value = ''
  try {
    await updateRecord(activeItemForSetting.value.id, payload)
    isSettingModalOpen.value = false
    activeItemForSetting.value = null
  } catch (err) {
    actionError.value = salesErrorMessage(err)
  } finally {
    busy.value = false
  }
}

import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import { useTablePrint } from '~/composables/useTablePrint'
import JobBranchHistoryModal from '~/components/pages/job-branch/JobBranchHistoryModal.vue'

const isHistoryModalOpen = ref(false)
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const jobBranchPrintColumns = [
  { key: 'no', label: 'No' },
  { key: 'branch', label: 'Branch' },
  { key: 'customer', label: 'Customers' },
  { key: 'product', label: 'Product' },
  { key: 'flowName', label: 'Flow Name' },
  { key: 'priority', label: 'Priority', align: 'center' as const },
  { key: 'status', label: 'Status', align: 'center' as const }
]
</script>

<template>
  <div class="dulank-page dulank-page-job-branch space-y-6">
    <SalesListHeader
      title="Job Branch"
      subtitle="Manage your Job Branch"
      add-label="History Job Branch"
      :refreshing="pending"
      @add="isHistoryModalOpen = true"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="8"
      :skeleton-rows="6"
      :error="error ? 'Unable to load job branch data. Please try again.' : ''"
      @retry="refresh()"
    />

    <JobBranchRecordsTable
      v-if="!pending && !error"
      :items="jobBranches"
      :search-query="searchQuery"
      :filter-branch="filterBranch"
      :filter-priority="filterPriority"
      :filter-date-range="filterDateRange"
      @update:search-query="searchQuery = $event"
      @update:filter-branch="filterBranch = $event"
      @update:filter-priority="filterPriority = $event"
      @update:filter-date-range="filterDateRange = $event"
      @open-settings="handleOpenSettings"
    />

    <!-- Setting Detail Job Branch Modal -->
    <JobBranchSettingModal
      :open="isSettingModalOpen"
      :item="activeItemForSetting"
      :busy="busy"
      @close="isSettingModalOpen = false; activeItemForSetting = null"
      @submit="handleSettingSubmit"
    />

    <!-- History Job Branch Modal -->
    <JobBranchHistoryModal
      :open="isHistoryModalOpen"
      @close="isHistoryModalOpen = false"
    />

    <!-- Standardized Print & Export PDF Modal -->
    <DocumentPrintModal
      v-if="isPrintModalOpen"
      :open="isPrintModalOpen"
      title="Laporan Job Branch (Job Branch List)"
      :columns="jobBranchPrintColumns"
      :items="jobBranches"
      :initial-date-range="filterDateRange"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
>>>>>>> origin/eko
