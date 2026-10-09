<script setup lang="ts">
import type { Category, CategoryFormData } from '#server/types/category'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import CategoryTable from '~/components/category/CategoryTable.vue'
import CategoryModal from '~/components/category/CategoryModal.vue'
import { useTablePrint } from '~/composables/useTablePrint'

const { categories, pending, refresh, saveCategory, deleteCategory } = useCategories()

const searchQuery = ref('')
const selectedStatus = ref('')

const isModalOpen = ref(false)
const isEdit = ref(false)
const editData = ref<Category | null>(null)
const toastMessage = ref('')
const actionError = ref('')

const isDeleteConfirmOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)

const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const print = useTablePrint()
const printColumns = [
  { key: 'name', label: 'Category Name' },
  { key: 'code', label: 'Category Slug' },
  { key: 'createdBy', label: 'Created By' },
  { key: 'createdDate', label: 'Created Date' },
  { key: 'status', label: 'Status' },
]

const openAddModal = () => {
  isEdit.value = false
  editData.value = null
  isModalOpen.value = true
}

const handleEdit = (c: Category) => {
  isEdit.value = true
  editData.value = c
  isModalOpen.value = true
}

const handleDelete = (id: string) => {
  deleteTargetId.value = id
  isDeleteConfirmOpen.value = true
}

const confirmDelete = async () => {
  if (!deleteTargetId.value) return
  isDeleting.value = true
  try {
    await deleteCategory(deleteTargetId.value)
    showToast('Category deleted successfully')
    isDeleteConfirmOpen.value = false
    deleteTargetId.value = null
  } catch (err: any) {
    console.error('Failed to delete category:', err)
    actionError.value = err?.message || 'Failed to delete category'
  } finally {
    isDeleting.value = false
  }
}

const handleSubmit = async (formData: CategoryFormData) => {
  try {
    const res = await saveCategory(formData)
    showToast(res?.message || 'Category saved successfully')
    isModalOpen.value = false
  } catch (err: any) {
    console.error('Failed to save category:', err)
    showToast(err?.message || 'Failed to save category')
  }
}

const printTable = () => {
  print.openPrintModal({
    title: 'Product Category',
    subtitle: 'Daftar kategori produk percetakan',
    columns: printColumns,
    rows: categories.value,
    action: 'print',
  })
}

const exportPdf = () => {
  print.openPrintModal({
    title: 'Product Category',
    subtitle: 'Daftar kategori produk percetakan',
    columns: printColumns,
    rows: categories.value,
    action: 'pdf',
  })
}
</script>

<template>
  <div class="space-y-4">
    <!-- Standard Header -->
    <SalesListHeader
      title="Product Category"
      subtitle="Kelola dan atur kategori produk percetakan"
      add-label="Add New Category"
      :refreshing="pending"
      @add="openAddModal"
      @refresh="refresh"
      @print="printTable"
      @pdf="exportPdf"
    />

    <!-- Feedback / Skeleton -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="6"
      :skeleton-rows="6"
      :message="toastMessage"
      :error="actionError"
      @dismiss="toastMessage = ''; actionError = ''"
    />

    <!-- Data Table -->
    <CategoryTable
      v-if="!pending"
      :categories="categories"
      :search-query="searchQuery"
      :filter-status="selectedStatus"
      @update:search-query="searchQuery = $event"
      @update:filter-status="selectedStatus = $event"
      @edit-category="handleEdit"
      @delete-category="handleDelete"
    />

    <!-- Add/Edit Modal -->
    <CategoryModal
      :is-open="isModalOpen"
      :is-edit="isEdit"
      :edit-data="editData"
      @close="isModalOpen = false"
      @submit="handleSubmit"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteConfirmOpen"
      title="Delete Category"
      message="Are you sure you want to delete this category? This action cannot be undone."
      :busy="isDeleting"
      @close="isDeleteConfirmOpen = false"
      @confirm="confirmDelete"
    />

    <!-- Standard Document Print/PDF Modal -->
    <DocumentPrintModal
      :open="print.isPrintModalOpen.value"
      :title="print.printTitle.value"
      :subtitle="print.printSubtitle.value"
      :columns="print.printColumns.value"
      :rows="print.printRows.value"
      :default-action="print.defaultPrintAction.value"
      :show-date-range="false"
      @close="print.closePrintModal"
    />
  </div>
</template>
