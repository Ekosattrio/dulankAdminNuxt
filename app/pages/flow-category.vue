<script setup lang="ts">
import type { FlowCategory, FlowCategoryFormData } from '#server/types/flow-category'
import type { DateRangeValue } from '~/composables/useDateRange'
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'

useLegacyPage({ title: 'Flow Category', sweetAlert: false })
const searchQuery = ref(''), filterCategory = ref(''), filterDateRange = ref<DateRangeValue | null>(null)
const editingRecord = ref<FlowCategory | null>(null), deletingRecord = ref<FlowCategory | null>(null)
const isAddModalOpen = ref(false), busy = ref(false), actionError = ref('')
const filters = computed(() => ({ search: searchQuery.value, category: filterCategory.value, startDate: filterDateRange.value?.start || '', endDate: filterDateRange.value?.end || '' }))
const { flowCategories, pending, error, refresh, saveFlowCategory, deleteFlowCategory } = useFlowCategories(filters)
const print = useTablePrint()
const printColumns = [{ key: 'no', label: 'No' }, { key: 'name', label: 'Flow Process' }, { key: 'used', label: 'Used' }, { key: 'createdBy', label: 'Created By' }, { key: 'createdDate', label: 'Created Date' }]

async function submit(form: FlowCategoryFormData) {
  busy.value = true; actionError.value = ''
  try { await saveFlowCategory(form); isAddModalOpen.value = false; editingRecord.value = null }
  catch (cause) { actionError.value = salesErrorMessage(cause) }
  finally { busy.value = false }
}
async function confirmDelete() {
  if (!deletingRecord.value) return
  busy.value = true; actionError.value = ''
  try { await deleteFlowCategory(deletingRecord.value.id); deletingRecord.value = null }
  catch (cause) { actionError.value = salesErrorMessage(cause) }
  finally { busy.value = false }
}
</script>

<template>
  <div class="dulank-page dulank-page-flow-category">
    <SalesListHeader title="Flow Category" subtitle="Manage your Flow Category" add-label="Add Flow Category" :refreshing="pending" @add="isAddModalOpen = true" @refresh="refresh()" @print="print.openPrintModal('print')" @pdf="print.openPrintModal('pdf')" />
    <SalesFeedback :pending="pending" skeleton="table" :skeleton-cols="6" :skeleton-rows="6" :error="error ? 'Unable to load flow categories. Please try again.' : actionError" @retry="refresh()" />
    <FlowCategoryRecordsTable v-if="!pending && !error" :flow-categories="flowCategories" :search-query="searchQuery" :filter-category="filterCategory" :filter-date-range="filterDateRange" @update:search-query="searchQuery = $event" @update:filter-category="filterCategory = $event" @update:filter-date-range="filterDateRange = $event" @edit="editingRecord = $event" @delete="deletingRecord = $event" />
    <FlowCategoryModal :open="isAddModalOpen || !!editingRecord" :record="editingRecord" :busy="busy" :error="actionError" @close="isAddModalOpen = false; editingRecord = null; actionError = ''" @submit="submit" />
    <SalesConfirmDelete :open="!!deletingRecord" :busy="busy" :error="actionError" @close="deletingRecord = null" @confirm="confirmDelete" />
    <DocumentPrintModal :open="print.isPrintModalOpen.value" title="Flow Category List" :columns="printColumns" :items="flowCategories" :default-action="print.defaultPrintAction.value" date-field="createdDate" :initial-date-range="filterDateRange" @close="print.closePrintModal" />
  </div>
</template>
