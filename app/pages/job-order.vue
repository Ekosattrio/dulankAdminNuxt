<script setup lang="ts">
import JobOrderEditModal from '~/components/Pages/JobOrder/JobOrderEditModal.vue'
import JobOrderRecordsTable from '~/components/Pages/JobOrder/JobOrderRecordsTable.vue'
import JobOrderStatsWidgets from '~/components/Pages/JobOrder/JobOrderStatsWidgets.vue'
import JobOrderViewFlowModal from '~/components/Pages/JobOrder/JobOrderViewFlowModal.vue'
import JobOrderWorkflowSidebar from '~/components/Pages/JobOrder/JobOrderWorkflowSidebar.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'

useLegacyPage({ title: 'Job Orders', sweetAlert: false })

import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'

const {
  searchQuery, filterCategory, activeWorkflowType, activeWorkflowLabel, activeOrderForEdit,
  activeOrderForView, deletingRecord, isEditModalOpen, isViewModalOpen, busy, actionError,
  jobOrders, workflowCounts, pending, error, refresh, isPrintModalOpen, defaultPrintAction,
  openPrintModal, closePrintModal, jobOrderPrintColumns, selectWorkflow, openEdit, closeEdit,
  openView, closeView, save, confirmDelete,
} = useJobOrderPage()
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
      skeleton="table"
      :skeleton-cols="8"
      :skeleton-rows="6"
      :error="error ? 'Unable to load job orders. Please try again.' : ''"
      @retry="refresh()"
    />

    <SalesFeedback v-if="actionError" :error="actionError" @retry="actionError = ''" />

    <!-- 2-Column Main Content -->
    <div v-if="!pending && !error" class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left: All Work Flow Panel -->
      <div class="lg:col-span-4 xl:col-span-3">
        <JobOrderWorkflowSidebar
          :active-type="activeWorkflowType"
          :counts="workflowCounts"
          @select-type="selectWorkflow"
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
          @view-flow="openView"
          @edit="openEdit"
          @delete="deletingRecord = $event"
        />
      </div>
    </div>

    <!-- Edit Job Order Modal -->
    <JobOrderEditModal
      :open="isEditModalOpen"
      :order="activeOrderForEdit"
      :busy="busy"
      @close="closeEdit"
      @submit="save"
    />

    <!-- View Flow Modal -->
    <JobOrderViewFlowModal
      :open="isViewModalOpen"
      :order="activeOrderForView"
      @close="closeView"
    />

    <!-- Delete Confirmation Modal -->
    <SalesConfirmDelete
      :open="!!deletingRecord"
      :busy="busy"
      :error="actionError"
      @close="deletingRecord = null"
      @confirm="confirmDelete"
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
