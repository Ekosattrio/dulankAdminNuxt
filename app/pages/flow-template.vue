<script setup lang="ts">
import type { FlowTemplate, FlowTemplateFormData } from '#server/types/flow-template'
import type { DateRangeValue } from '~/composables/useDateRange'
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'

useLegacyPage({ title: 'Flow Template', sweetAlert: false })
const searchQuery = ref(''), filterTemplate = ref(''), filterDateRange = ref<DateRangeValue | null>(null)
const editingRecord = ref<FlowTemplate | null>(null), deletingRecord = ref<FlowTemplate | null>(null)
const isAddModalOpen = ref(false), busy = ref(false), actionError = ref('')
const filters = computed(() => ({ search: searchQuery.value, template: filterTemplate.value, startDate: filterDateRange.value?.start || '', endDate: filterDateRange.value?.end || '' }))
const { flowTemplates, pending, error, refresh, saveFlowTemplate, deleteFlowTemplate } = useFlowTemplates(filters)
const print = useTablePrint()
const printColumns = [{ key: 'no', label: 'No' }, { key: 'name', label: 'Flow Template' }, { key: 'information', label: 'Information' }]
async function submit(form: FlowTemplateFormData) { busy.value = true; actionError.value = ''; try { await saveFlowTemplate(form); isAddModalOpen.value = false; editingRecord.value = null } catch (cause) { actionError.value = salesErrorMessage(cause) } finally { busy.value = false } }
async function confirmDelete() { if (!deletingRecord.value) return; busy.value = true; actionError.value = ''; try { await deleteFlowTemplate(deletingRecord.value.id); deletingRecord.value = null } catch (cause) { actionError.value = salesErrorMessage(cause) } finally { busy.value = false } }
</script>

<template>
  <div class="dulank-page dulank-page-flow-template">
    <SalesListHeader title="Flow Template" subtitle="Manage your Flow Template" add-label="Add Flow Template" :refreshing="pending" @add="isAddModalOpen = true" @refresh="refresh()" @print="print.openPrintModal('print')" @pdf="print.openPrintModal('pdf')" />
    <SalesFeedback :pending="pending" skeleton="table" :skeleton-cols="4" :skeleton-rows="6" :error="error ? 'Unable to load flow templates. Please try again.' : actionError" @retry="refresh()" />
    <FlowTemplateRecordsTable v-if="!pending && !error" :flow-templates="flowTemplates" :search-query="searchQuery" :filter-template="filterTemplate" :filter-date-range="filterDateRange" @update:search-query="searchQuery = $event" @update:filter-template="filterTemplate = $event" @update:filter-date-range="filterDateRange = $event" @edit="editingRecord = $event" @delete="deletingRecord = $event" />
    <FlowTemplateModal :open="isAddModalOpen || !!editingRecord" :record="editingRecord" :busy="busy" :error="actionError" @close="isAddModalOpen = false; editingRecord = null; actionError = ''" @submit="submit" />
    <SalesConfirmDelete :open="!!deletingRecord" :busy="busy" :error="actionError" @close="deletingRecord = null" @confirm="confirmDelete" />
    <DocumentPrintModal :open="print.isPrintModalOpen.value" title="Flow Template List" :columns="printColumns" :items="flowTemplates" :default-action="print.defaultPrintAction.value" date-field="createdAt" :initial-date-range="filterDateRange" @close="print.closePrintModal" />
  </div>
</template>
