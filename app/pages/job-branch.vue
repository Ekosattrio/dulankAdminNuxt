<script setup lang="ts">
import type { JobBranchItem, JobBranchUpdatePayload } from '#server/types/job-branch'
import type { DateRangeValue } from '~/composables/useDateRange'
import { useJobBranches } from '~/composables/useJobBranches'
import { salesErrorMessage } from '~/utils/salesDocuments'
import JobBranchRecordsTable from '~/components/pages/job-branch/JobBranchRecordsTable.vue'
import JobBranchSettingModal from '~/components/pages/job-branch/JobBranchSettingModal.vue'
import JobBranchHistoryModal from '~/components/pages/job-branch/JobBranchHistoryModal.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import { useTablePrint } from '~/composables/useTablePrint'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'

definePageMeta({
  layout: 'default',
  alias: ['/job-branch.html']
})

useLegacyPage({ title: 'Job Branch', sweetAlert: false })

const searchQuery = ref('')
const filterBranch = ref('')
const filterPriority = ref('')
const filterDateRange = ref<DateRangeValue | null>(null)

const activeItemForSetting = ref<JobBranchItem | null>(null)
const isSettingModalOpen = ref(false)
const isHistoryModalOpen = ref(false)
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
</script>

<template>
  <div class="dulank-page dulank-page-job-branch space-y-6">
    <SalesListHeader
      title="Job Branch"
      subtitle="Manage your Job Branch"
      add-label="History Job Branch"
      :refreshing="pending"
      :show-print="true"
      :show-pdf="true"
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
