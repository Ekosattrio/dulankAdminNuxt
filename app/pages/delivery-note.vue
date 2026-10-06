<script setup lang="ts">
import PagesDeliveryNoteTable from '~/components/pages/delivery-note/DeliveryNoteRecordsTable.vue'
import PagesDeliveryNoteEditor from '~/components/pages/delivery-note/DeliveryNoteEditor.vue'

useLegacyPage({ title: 'Delivery Note', sweetAlert: false })
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
} = useDeliveryNotePage()
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
  <div class="dulank-page dulank-page-delivery-note">
    <SalesListHeader
      title="Delivery Note"
      subtitle="Manage Your Delivery Note"
      add-label="Add New Delivery Note"
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
      :error="error ? 'Unable to load delivery note. Please try again.' : ''"
      :message="toastMessage"
      @retry="refresh()"
      @dismiss="toastMessage = ''"
    />
    <PagesDeliveryNoteTable
      v-if="!pending && !error"
      :delivery-notes="filteredList"
      :search-query="searchQuery"
      :filter-status="filterStatus"
      @update:search-query="searchQuery = $event"
      @update:filter-status="filterStatus = $event"
      @add-delivery-note="handleAdd"
      @edit-delivery-note="handleEdit"
      @delete-delivery-note="handleDelete"
      @export-pdf="printTable"
      @print-table="printTable"
      @refresh="refresh"
    />
    <PagesDeliveryNoteEditor
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
