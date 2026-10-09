<script setup lang="ts">
import type { FlowName, FlowNameFormData } from '#server/types/flow-name'
import type { DateRangeValue } from '~/composables/useDateRange'
import FlowNameModal from '~/components/pages/flow-name/FlowNameModal.vue'
import FlowNameRecordsTable from '~/components/pages/flow-name/FlowNameRecordsTable.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'

definePageMeta({
  layout: 'default',
  alias: ['/flow-name.html'],
})

useLegacyPage({ title: 'Flow Name List', sweetAlert: false })

const searchQuery = ref('')
const filterCategory = ref('')
const filterFlowName = ref('')
const filterDateRange = ref<DateRangeValue | null>(null)

const editingRecord = ref<FlowName | null>(null)
const isAddModalOpen = ref(false)
const deletingRecord = ref<FlowName | null>(null)
const busy = ref(false)
const actionError = ref('')

const filterParams = computed(() => ({
  search: searchQuery.value,
  category: filterCategory.value,
  flowName: filterFlowName.value,
  startDate: filterDateRange.value?.start || '',
  endDate: filterDateRange.value?.end || '',
}))

const { flowNames, pending, error, refresh, saveFlowName, deleteFlowName } = useFlowNames(filterParams)

async function handleSubmit(form: FlowNameFormData) {
  busy.value = true
  actionError.value = ''
  try {
    await saveFlowName(form)
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
    await deleteFlowName(deletingRecord.value.id)
    deletingRecord.value = null
  } catch (err) {
    actionError.value = salesErrorMessage(err)
  } finally {
    busy.value = false
  }
}

function printTable() {
  printSalesRows(
    'Flow Name List',
    ['No', 'Flow Category', 'Flow Name', 'Incentive Amount', 'Unit Incentive', 'Assignee', 'Type', 'Date'],
    flowNames.value.map((item) => [
      item.no,
      item.category,
      item.name,
      String(item.incentiveAmount),
      item.unitIncentive,
      item.flowAssignee,
      item.flowType,
      item.createDate,
    ]),
  )
}
</script>

<template>
  <div class="dulank-page dulank-page-flow-name">
    <SalesListHeader
      title="Flow Name List"
      subtitle="Manage your Flow Name"
      add-label="Add New Flow Name"
      :refreshing="pending"
      @add="isAddModalOpen = true"
      @refresh="refresh()"
      @print="printTable"
    />

    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="9"
      :skeleton-rows="6"
      :error="error ? 'Unable to load flow names. Please try again.' : ''"
      @retry="refresh()"
    />

    <FlowNameRecordsTable
      v-if="!pending && !error"
      :flow-names="flowNames"
      :search-query="searchQuery"
      :filter-category="filterCategory"
      :filter-flow-name="filterFlowName"
      :filter-date-range="filterDateRange"
      @update:search-query="searchQuery = $event"
      @update:filter-category="filterCategory = $event"
      @update:filter-flow-name="filterFlowName = $event"
      @update:filter-date-range="filterDateRange = $event"
      @edit="editingRecord = $event"
      @delete="deletingRecord = $event"
    />

    <!-- Add/Edit Modal -->
    <FlowNameModal
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
