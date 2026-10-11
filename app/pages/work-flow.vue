<script setup lang="ts">
import type { WorkFlow } from '#server/types/work-flow'
import type { DateRangeValue } from '~/composables/useDateRange'
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'
import WorkFlowRecordsTable from '~/components/Pages/WorkFlow/WorkFlowRecordsTable.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'

useLegacyPage({ title: 'Work Flow List', sweetAlert: false })
const router = useRouter()
const searchQuery = ref('')
const filterDateRange = ref<DateRangeValue | null>(null)
const deletingRecord = ref<WorkFlow | null>(null)
const busy = ref(false)
const actionError = ref('')
const filters = computed(() => ({ search: searchQuery.value, startDate: filterDateRange.value?.start || '', endDate: filterDateRange.value?.end || '' }))
const { workFlows, pending, error, refresh, deleteWorkFlow } = useWorkFlows(filters)
const print = useTablePrint()
const printColumns = [
  { key: 'no', label: 'No' }, { key: 'category', label: 'Product Category' },
  { key: 'product', label: 'Product' }, { key: 'workflowSteps', label: 'Work Flow' },
]

async function confirmDelete() {
  if (!deletingRecord.value) return
  busy.value = true
  actionError.value = ''
  try { await deleteWorkFlow(deletingRecord.value.id); deletingRecord.value = null }
  catch (cause) { actionError.value = salesErrorMessage(cause) }
  finally { busy.value = false }
}
</script>

<template>
  <div class="dulank-page dulank-page-work-flow">
    <SalesListHeader title="Work Flow List" subtitle="Manage your Work Flow" add-label="Add New Work Flow" :refreshing="pending" @add="router.push('/add-work-flow')" @refresh="refresh()" @print="print.openPrintModal('print')" @pdf="print.openPrintModal('pdf')" />
    <SalesFeedback :pending="pending" skeleton="table" :skeleton-cols="6" :skeleton-rows="6" :error="error ? 'Unable to load workflows. Please try again.' : actionError" @retry="refresh()" />
    <WorkFlowRecordsTable v-if="!pending && !error" :work-flows="workFlows" :search-query="searchQuery" :filter-date-range="filterDateRange" @update:search-query="searchQuery = $event" @update:filter-date-range="filterDateRange = $event" @delete="deletingRecord = $event" />
    <SalesConfirmDelete :open="!!deletingRecord" :busy="busy" :error="actionError" @close="deletingRecord = null" @confirm="confirmDelete" />
    <DocumentPrintModal :open="print.isPrintModalOpen.value" title="Work Flow List" :columns="printColumns" :items="workFlows" :default-action="print.defaultPrintAction.value" date-field="date" :initial-date-range="filterDateRange" @close="print.closePrintModal" />
  </div>
</template>
