<script setup lang="ts">
import type { JobOrder, JobOrderFormData } from '#server/types/job-order'
import { useJobOrders } from '~/composables/useJobOrders'
import { salesErrorMessage, printSalesRows } from '~/utils/salesDocuments'
import JobOrderEditModal from '~/components/pages/job-order/JobOrderEditModal.vue'
import JobOrderRecordsTable from '~/components/pages/job-order/JobOrderRecordsTable.vue'
import JobOrderStatsWidgets from '~/components/pages/job-order/JobOrderStatsWidgets.vue'
import JobOrderViewFlowModal from '~/components/pages/job-order/JobOrderViewFlowModal.vue'
import JobOrderWorkflowSidebar from '~/components/pages/job-order/JobOrderWorkflowSidebar.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'

useLegacyPage({ title: 'Job Orders', sweetAlert: false })

const searchQuery = ref('')
const filterCategory = ref('')
const activeWorkflowType = ref('design')
const activeWorkflowLabel = ref('Design')

const activeOrderForEdit = ref<JobOrder | null>(null)
const activeOrderForView = ref<JobOrder | null>(null)
const deletingRecord = ref<JobOrder | null>(null)
const isEditModalOpen = ref(false)
const isViewModalOpen = ref(false)
const busy = ref(false)
const actionError = ref('')

const filterParams = computed(() => ({
  search: searchQuery.value,
  workflowCategory: filterCategory.value,
  workflowType: activeWorkflowType.value,
}))

const { jobOrders, pending, error, refresh, saveJobOrder, deleteJobOrder } = useJobOrders(filterParams)

function handleSelectType(typeId: string, label: string) {
  activeWorkflowType.value = typeId
  activeWorkflowLabel.value = label
}

function handleOpenEdit(order: JobOrder) {
  activeOrderForEdit.value = order
  isEditModalOpen.value = true
}

function handleOpenView(order: JobOrder) {
  activeOrderForView.value = order
  isViewModalOpen.value = true
}

async function handleEditSubmit(formData: JobOrderFormData) {
  busy.value = true
  actionError.value = ''
  try {
    await saveJobOrder(formData)
    isEditModalOpen.value = false
    activeOrderForEdit.value = null
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
    await deleteJobOrder(deletingRecord.value.id)
    deletingRecord.value = null
  } catch (err) {
    actionError.value = salesErrorMessage(err)
  } finally {
    busy.value = false
  }
}

import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import { useTablePrint } from '~/composables/useTablePrint'

const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const jobOrderPrintColumns = [
  { key: 'no', label: 'No' },
  { key: 'dueDate', label: 'Due Date' },
  { key: 'customer', label: 'Customer' },
  { key: 'product', label: 'Product' },
  { key: 'jobTitle', label: 'Job Title' },
  { key: 'priority', label: 'Priority', align: 'center' as const },
  { key: 'status', label: 'Status', align: 'center' as const }
]
</script>

<template>
  <div class="dulank-page dulank-page-job-order space-y-6">
    <SalesListHeader
      title="Job Orders"
      subtitle="Manage your Job Orders"
      :refreshing="pending"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <!-- KPI Widgets -->
    <JobOrderStatsWidgets :orders="jobOrders" />

    <SalesFeedback
      :pending="pending"
      :error="error ? 'Unable to load job orders. Please try again.' : ''"
      @retry="refresh()"
    />

    <!-- 2-Column Main Content -->
    <div v-if="!pending && !error" class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left: All Work Flow Panel -->
      <div class="lg:col-span-4 xl:col-span-3">
        <JobOrderWorkflowSidebar
          :active-type="activeWorkflowType"
          @select-type="handleSelectType"
        />
      </div>

      <!-- Right: Job Order Table -->
      <div class="lg:col-span-8 xl:col-span-9">
        <JobOrderRecordsTable
          :orders="jobOrders"
          :search-query="searchQuery"
          :filter-category="filterCategory"
          :flow-title="activeWorkflowLabel"
          @update:search-query="searchQuery = $event"
          @update:filter-category="filterCategory = $event"
          @view-flow="handleOpenView"
          @edit="handleOpenEdit"
          @delete="deletingRecord = $event"
        />
      </div>
    </div>

    <!-- Edit Job Order Modal -->
    <JobOrderEditModal
      :open="isEditModalOpen"
      :order="activeOrderForEdit"
      :busy="busy"
      @close="isEditModalOpen = false; activeOrderForEdit = null"
      @submit="handleEditSubmit"
    />

    <!-- View Flow Modal -->
    <JobOrderViewFlowModal
      :open="isViewModalOpen"
      :order="activeOrderForView"
      @close="isViewModalOpen = false; activeOrderForView = null"
    />

    <!-- Delete Confirmation Modal -->
    <SalesConfirmDelete
      :open="!!deletingRecord"
      :busy="busy"
      :error="actionError"
      @close="deletingRecord = null"
      @confirm="handleConfirmDelete"
    />

    <!-- Standardized Print & Export PDF Modal -->
    <DocumentPrintModal
      v-if="isPrintModalOpen"
      :open="isPrintModalOpen"
      title="Laporan Job Orders (Job Orders List)"
      :columns="jobOrderPrintColumns"
      :items="jobOrders"
      date-field="dueDate"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
