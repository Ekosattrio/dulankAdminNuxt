<script setup lang="ts">
import type { FlowCategory, FlowCategoryFormData } from '#server/types/flow-category'
import type { DateRangeValue } from '~/composables/useDateRange'
import FlowCategoryModal from '~/components/Pages/FlowCategory/FlowCategoryModal.vue'
import FlowCategoryRecordsTable from '~/components/Pages/FlowCategory/FlowCategoryRecordsTable.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'

useLegacyPage({ title: 'Flow Category', sweetAlert: false })

const searchQuery = ref('')
const filterCategory = ref('')
const filterDateRange = ref<DateRangeValue | null>(null)

const editingRecord = ref<FlowCategory | null>(null)
const isAddModalOpen = ref(false)
const deletingRecord = ref<FlowCategory | null>(null)
const busy = ref(false)
const actionError = ref('')

const filterParams = computed(() => ({
  search: searchQuery.value,
  category: filterCategory.value,
  startDate: filterDateRange.value?.start || '',
  endDate: filterDateRange.value?.end || '',
}))

const { flowCategories, pending, error, refresh, saveFlowCategory, deleteFlowCategory } = useFlowCategories(filterParams)

async function handleSubmit(form: FlowCategoryFormData) {
  busy.value = true
  actionError.value = ''
  try {
    await saveFlowCategory(form)
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
    await deleteFlowCategory(deletingRecord.value.id)
    deletingRecord.value = null
  } catch (err) {
    actionError.value = salesErrorMessage(err)
  } finally {
    busy.value = false
  }
}

function printTable() {
  printSalesRows(
    'Flow Category List',
    ['No', 'Flow Process', 'Used', 'Created By', 'Created Date'],
    flowCategories.value.map((item) => [
      item.no,
      item.name,
      String(item.used),
      item.createdBy,
      item.createdDate,
    ]),
  )
}
</script>

<template>
  <div class="dulank-page dulank-page-flow-category">
    <SalesListHeader
      title="Flow Category"
      subtitle="Manage your Flow Category"
      add-label="Add Flow Category"
      :refreshing="pending"
      @add="isAddModalOpen = true"
      @refresh="refresh()"
      @print="printTable"
    />

    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="6"
      :skeleton-rows="6"
      :error="error ? 'Unable to load flow categories. Please try again.' : ''"
      @retry="refresh()"
    />

    <FlowCategoryRecordsTable
      v-if="!pending && !error"
      :flow-categories="flowCategories"
      :search-query="searchQuery"
      :filter-category="filterCategory"
      :filter-date-range="filterDateRange"
      @update:search-query="searchQuery = $event"
      @update:filter-category="filterCategory = $event"
      @update:filter-date-range="filterDateRange = $event"
      @edit="editingRecord = $event"
      @delete="deletingRecord = $event"
    />

    <!-- Add/Edit Modal -->
    <FlowCategoryModal
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
