<script setup lang="ts">
import PagesInvoiceTable from '~/components/pages/invoice/InvoiceRecordsTable.vue'
import PagesInvoiceEditor from '~/components/pages/invoice/InvoiceEditor.vue'

useLegacyPage({ title: 'Invoice', sweetAlert: false })
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
} = useInvoicePage()
const route = useRoute()
const { sales } = useSales()
const sourceSale = computed(() => sales.value.find((sale) => sale.id === route.query.sourceSale) || null)
watch(
  sourceSale,
  (sale) => {
    if (sale) handleAdd()
  },
  { immediate: true },
)
</script>

<template>
  <div class="dulank-page dulank-page-invoice">
    <SalesListHeader
      title="Invoice"
      subtitle="Manage Your Invoice"
      :refreshing="pending"
      @add="handleAdd"
      @refresh="refresh()"
      @print="printTable"
    />
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="8"
      :skeleton-rows="6"
      :error="error ? 'Unable to load invoice. Please try again.' : ''"
      :message="toastMessage"
      @retry="refresh()"
      @dismiss="toastMessage = ''"
    />
    <PagesInvoiceTable
      v-if="!pending && !error"
      :invoices="filteredList"
      :search-query="searchQuery"
      :filter-status="filterStatus"
      @update:search-query="searchQuery = $event"
      @update:filter-status="filterStatus = $event"
      @add-invoice="handleAdd"
      @edit-invoice="handleEdit"
      @delete-invoice="handleDelete"
      @export-pdf="printTable"
      @print-table="printTable"
      @refresh="refresh"
    />
    <PagesInvoiceEditor
      :source-sale="sourceSale"
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
