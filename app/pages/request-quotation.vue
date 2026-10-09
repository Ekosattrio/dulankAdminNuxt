<script setup lang="ts">
import RequestQuotationRecordsTable from '~/components/pages/request-quotation/RequestQuotationRecordsTable.vue'
import RequestQuotationDuplicate from '~/components/pages/request-quotation/RequestQuotationDuplicate.vue'
useLegacyPage({ title: 'Request Quotation List', sweetAlert: false })
const {
  pending,
  error,
  refresh,
  statusFilter,
  filteredRFQs,
  duplicateRFQ,
  duplicating,
  confirmDuplicate,
  printTable,
  deleting,
  busy,
  actionError,
  toastMessage,
  confirmDelete,
} = useRequestQuotations()
</script>

<template>
  <div class="dulank-page dulank-page-request-quotation">
    <SalesListHeader
      title="Request Quotation List"
      subtitle="Manage Your Request Quotation"
      add-label="Add New Request Quotation"
      add-to="/add-request-quotation"
      :refreshing="pending"
      @refresh="refresh()"
      @print="printTable"
    />
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="7"
      :skeleton-rows="6"
      :error="error ? 'Unable to load request quotations.' : actionError"
      :message="toastMessage"
      @retry="refresh()"
      @dismiss="toastMessage = ''"
    />
    <RequestQuotationRecordsTable
      v-if="!pending && !error"
      v-model:status-filter="statusFilter"
      :filteredRFQs="filteredRFQs"
      @duplicate="duplicateRFQ"
      @delete="deleting = $event"
      @print="printTable"
    />
    <SalesConfirmDelete
      :open="!!deleting"
      :busy="busy"
      :error="actionError"
      @close="deleting = null"
      @confirm="confirmDelete"
    />
    <RequestQuotationDuplicate
      :record="duplicating"
      :busy="busy"
      :error="actionError"
      @close="duplicating = null"
      @submit="confirmDuplicate"
    />
  </div>
</template>
