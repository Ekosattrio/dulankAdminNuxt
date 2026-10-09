<script setup lang="ts">
import PagesQuotationTable from '~/components/pages/quotation/QuotationRecordsTable.vue'
import PagesQuotationEditor from '~/components/pages/quotation/QuotationEditor.vue'

useLegacyPage({ title: 'Quotation List', sweetAlert: false })
const {
  pending,
  error,
  refresh,
  searchQuery,
  filterStatus,
  filteredList,
  isModalOpen,
  isEdit,
  editData,
  deleting,
  busy,
  actionError,
  toastMessage,
  handleAdd,
  handleEdit,
  handleDelete,
  handleSubmit,
  confirmDelete,
  printTable,
} = useQuotationPage()
</script>

<template>
  <div class="dulank-page dulank-page-quotation">
    <SalesListHeader
      title="Quotation List"
      subtitle="Manage Your Quotation"
      add-label="Add New Quotation"
      add-to="/add-quotation"
      :refreshing="pending"
      @add="handleAdd"
      @refresh="refresh()"
      @print="printTable"
    />
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="10"
      :skeleton-rows="6"
      :error="error ? 'Unable to load quotation list. Please try again.' : ''"
      :message="toastMessage"
      @retry="refresh()"
      @dismiss="toastMessage = ''"
    />
    <PagesQuotationTable
      v-if="!pending && !error"
      :quotations="filteredList"
      :search-query="searchQuery"
      :filter-status="filterStatus"
      @update:search-query="searchQuery = $event"
      @update:filter-status="filterStatus = $event"
      @add-quotation="handleAdd"
      @edit-quotation="handleEdit"
      @delete-quotation="handleDelete"
      @export-pdf="printTable"
      @print-table="printTable"
      @refresh="refresh"
    />
    <PagesQuotationEditor
      :is-open="isModalOpen"
      :is-edit="isEdit"
      :edit-data="editData"
      :busy="busy"
      :error="actionError"
      @close="!busy && (isModalOpen = false)"
      @submit="handleSubmit"
    />
    <SalesConfirmDelete
      :open="!!deleting"
      :busy="busy"
      :error="actionError"
      @close="deleting = null"
      @confirm="confirmDelete"
    />
  </div>
</template>
