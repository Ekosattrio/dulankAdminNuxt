<script setup lang="ts">
import type { FlowTemplate, FlowTemplateFormData } from '#server/types/flow-template'
import type { DateRangeValue } from '~/composables/useDateRange'
import FlowTemplateModal from '~/components/pages/flow-template/FlowTemplateModal.vue'
import FlowTemplateRecordsTable from '~/components/pages/flow-template/FlowTemplateRecordsTable.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'

useLegacyPage({ title: 'Flow Template', sweetAlert: false })

const searchQuery = ref('')
const filterTemplate = ref('')
const filterDateRange = ref<DateRangeValue | null>(null)
const editingRecord = ref<FlowTemplate | null>(null)
const isAddModalOpen = ref(false)
const deletingRecord = ref<FlowTemplate | null>(null)
const busy = ref(false)
const actionError = ref('')

const filterParams = computed(() => ({
  search: searchQuery.value,
  template: filterTemplate.value,
  startDate: filterDateRange.value?.start || '',
  endDate: filterDateRange.value?.end || '',
}))

const { flowTemplates, pending, error, refresh, saveFlowTemplate, deleteFlowTemplate } = useFlowTemplates(filterParams)

async function handleSubmit(form: FlowTemplateFormData) {
  busy.value = true
  actionError.value = ''
  try {
    await saveFlowTemplate(form)
    isAddModalOpen.value = false
    editingRecord.value = null
  } catch (err) {
    actionError.value = salesErrorMessage(err)
  } finally {
    busy.value = false
  }
}

async function handleConfirmDelete() {
  if (!deletingRecord.value) return
  busy.value = true
  actionError.value = ''
  try {
    await deleteFlowTemplate(deletingRecord.value.id)
    deletingRecord.value = null
  } catch (err) {
    actionError.value = salesErrorMessage(err)
  } finally {
    busy.value = false
  }
}

function printTable() {
  printSalesRows(
    'Flow Template List',
    ['No', 'Flow Template', 'Information'],
    flowTemplates.value.map((item) => [
      item.no,
      item.name,
      item.information,
    ]),
  )
}
</script>

<template>
  <div class="dulank-page dulank-page-flow-template">
    <SalesListHeader
      title="Flow Template"
      subtitle="Manage your Flow Template"
      add-label="Add Flow Template"
      :refreshing="pending"
      @add="isAddModalOpen = true"
      @refresh="refresh()"
      @print="printTable"
    />

    <SalesFeedback
      :pending="pending"
      :error="error ? 'Unable to load flow templates. Please try again.' : ''"
      @retry="refresh()"
    />

    <FlowTemplateRecordsTable
      v-if="!pending && !error"
      :flow-templates="flowTemplates"
      :search-query="searchQuery"
      :filter-template="filterTemplate"
      :filter-date-range="filterDateRange"
      @update:search-query="searchQuery = $event"
      @update:filter-template="filterTemplate = $event"
      @update:filter-date-range="filterDateRange = $event"
      @edit="editingRecord = $event"
      @delete="deletingRecord = $event"
    />

    <!-- Add/Edit Modal -->
    <FlowTemplateModal
      :open="isAddModalOpen || !!editingRecord"
      :record="editingRecord"
      :busy="busy"
      :error="actionError"
      @close="() => { isAddModalOpen = false; editingRecord = null; actionError = '' }"
      @submit="handleSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <SalesConfirmDelete
      :open="!!deletingRecord"
      :busy="busy"
      :error="actionError"
      @close="deletingRecord = null"
      @confirm="handleConfirmDelete"
    />
  </div>
</template>
