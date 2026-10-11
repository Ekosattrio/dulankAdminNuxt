<script setup lang="ts">
import type { JobProgress } from '#server/types/job-progress'
import type { DateRangeValue } from '~/composables/useDateRange'
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'
import JobProgressRecordsTable from '~/components/Pages/JobProgress/JobProgressRecordsTable.vue'
import JobProgressStats from '~/components/Pages/JobProgress/JobProgressStats.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'

useLegacyPage({ title: 'Job Progress List', sweetAlert: false })
const searchQuery = ref('')
const process = ref('')
const dateRange = ref<DateRangeValue | null>(null)
const busyId = ref('')
const actionError = ref('')
const filters = computed(() => ({ search: searchQuery.value, process: process.value, startDate: dateRange.value?.start || '', endDate: dateRange.value?.end || '' }))
const { items, stats, pending, error, refresh, update } = useJobProgress(filters)
const print = useTablePrint()
const printColumns = [
  { key: 'progressCode', label: '# Progress' }, { key: 'product', label: 'Product' }, { key: 'description', label: 'Product Description' },
  { key: 'process', label: 'Job Process' }, { key: 'completedBy', label: 'Complete by' }, { key: 'completedAt', label: 'Time' }, { key: 'note', label: 'Note' },
]

async function toggle(item: JobProgress) {
  busyId.value = item.id
  actionError.value = ''
  try { await update(item.id, { isCompleted: !item.isCompleted, completedBy: item.isCompleted ? '' : 'Admin' }) }
  catch (err) { actionError.value = salesErrorMessage(err) }
  finally { busyId.value = '' }
}
</script>

<template>
  <div class="dulank-page dulank-page-job-progress space-y-5">
    <SalesListHeader title="Job Progress List" subtitle="Manage your Job Progress" :refreshing="pending" @refresh="refresh()" @print="print.openPrintModal('print')" @pdf="print.openPrintModal('pdf')" />
    <JobProgressStats :stats="stats" />
    <SalesFeedback :pending="pending" skeleton="table" :skeleton-cols="8" :error="error ? 'Unable to load job progress.' : actionError" @retry="refresh()" />
    <JobProgressRecordsTable v-if="!pending && !error" :items="items" :search-query="searchQuery" :process="process" :date-range="dateRange" :busy-id="busyId" @update:search-query="searchQuery = $event" @update:process="process = $event" @update:date-range="dateRange = $event" @toggle="toggle" />
    <DocumentPrintModal :open="print.isPrintModalOpen.value" title="Job Progress List" :columns="printColumns" :items="items" :default-action="print.defaultPrintAction.value" date-field="completedAt" :initial-date-range="dateRange" @close="print.closePrintModal" />
  </div>
</template>
