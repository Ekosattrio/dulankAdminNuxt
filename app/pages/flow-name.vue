<script setup lang="ts">
import type { FlowName, FlowNameFormData } from '#server/types/flow-name'
import type { DateRangeValue } from '~/composables/useDateRange'
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'

useLegacyPage({ title: 'Flow Name List', sweetAlert: false })
const searchQuery = ref(''), filterCategory = ref(''), filterFlowName = ref(''), filterDateRange = ref<DateRangeValue | null>(null)
const editingRecord = ref<FlowName | null>(null), deletingRecord = ref<FlowName | null>(null)
const isAddModalOpen = ref(false), busy = ref(false), actionError = ref('')
const filters = computed(() => ({ search: searchQuery.value, category: filterCategory.value, flowName: filterFlowName.value, startDate: filterDateRange.value?.start || '', endDate: filterDateRange.value?.end || '' }))
const { flowNames, pending, error, refresh, saveFlowName, deleteFlowName } = useFlowNames(filters)
const print = useTablePrint()
const printColumns = [{ key: 'no', label: 'No' }, { key: 'category', label: 'Flow Category' }, { key: 'name', label: 'Flow Name' }, { key: 'incentiveAmount', label: 'Incentive Amount (Rp)' }, { key: 'unitIncentive', label: 'Unit Incentive' }, { key: 'flowAssignee', label: 'Flow Assignee' }, { key: 'flowType', label: 'Flow Type' }, { key: 'createDate', label: 'Create Date' }]
async function submit(form: FlowNameFormData) { busy.value = true; actionError.value = ''; try { await saveFlowName(form); isAddModalOpen.value = false; editingRecord.value = null } catch (cause) { actionError.value = salesErrorMessage(cause) } finally { busy.value = false } }
async function confirmDelete() { if (!deletingRecord.value) return; busy.value = true; actionError.value = ''; try { await deleteFlowName(deletingRecord.value.id); deletingRecord.value = null } catch (cause) { actionError.value = salesErrorMessage(cause) } finally { busy.value = false } }
</script>

<template>
  <div class="dulank-page dulank-page-flow-name">
    <SalesListHeader title="Flow Name List" subtitle="Manage your Flow Name" add-label="Add New Flow Name" :refreshing="pending" @add="isAddModalOpen = true" @refresh="refresh()" @print="print.openPrintModal('print')" @pdf="print.openPrintModal('pdf')" />
    <SalesFeedback :pending="pending" skeleton="table" :skeleton-cols="9" :skeleton-rows="6" :error="error ? 'Unable to load flow names. Please try again.' : actionError" @retry="refresh()" />
    <FlowNameRecordsTable v-if="!pending && !error" :flow-names="flowNames" :search-query="searchQuery" :filter-category="filterCategory" :filter-flow-name="filterFlowName" :filter-date-range="filterDateRange" @update:search-query="searchQuery = $event" @update:filter-category="filterCategory = $event" @update:filter-flow-name="filterFlowName = $event" @update:filter-date-range="filterDateRange = $event" @edit="editingRecord = $event" @delete="deletingRecord = $event" />
    <FlowNameModal :open="isAddModalOpen || !!editingRecord" :record="editingRecord" :busy="busy" :error="actionError" @close="isAddModalOpen = false; editingRecord = null; actionError = ''" @submit="submit" />
    <SalesConfirmDelete :open="!!deletingRecord" :busy="busy" :error="actionError" @close="deletingRecord = null" @confirm="confirmDelete" />
    <DocumentPrintModal :open="print.isPrintModalOpen.value" title="Flow Name List" :columns="printColumns" :items="flowNames" :default-action="print.defaultPrintAction.value" date-field="createDate" :initial-date-range="filterDateRange" @close="print.closePrintModal" />
  </div>
</template>
