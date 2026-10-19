<script setup lang="ts">
import type { Category, CategoryFormData } from '~/types/category'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import PagesCategoryModal from '~/components/Category/CategoryModal.vue'
import PagesCategoryTable from '~/components/Category/CategoryTable.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Category',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

const { categories, pending, refresh, saveCategory, deleteCategory } = useCategories()

const searchQuery = ref('')
const selectedStatus = ref('')

const isModalOpen = ref(false)
const isEdit = ref(false)
const editData = ref<Category | null>(null)
const toastMessage = ref('')

const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const filteredCategories = computed(() => {
  return categories.value.filter((c) => {
    const matchesSearch =
      !searchQuery.value ||
      c.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.code?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !selectedStatus.value || c.status === selectedStatus.value
    return matchesSearch && matchesStatus
  })
})

const print = useTablePrint()
const printColumns = [
  { key: 'code', label: 'Category Code' },
  { key: 'name', label: 'Category Name' },
  { key: 'createdDate', label: 'Created Date' },
  { key: 'createdBy', label: 'Created By' },
  { key: 'status', label: 'Status' }
]

import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'

const isDeleteConfirmOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)

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
    showToast(err?.message || 'Failed to delete category')
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
    rows: filteredCategories.value,
    action: 'print'
  })
}

const exportPdf = () => {
  print.openPrintModal({
    title: 'Product Category',
    subtitle: 'Daftar kategori produk percetakan',
    columns: printColumns,
    rows: filteredCategories.value,
    action: 'pdf'
  })
}
</script>

<template>
  <div class="space-y-6">
    <SalesListHeader title="Product Category" subtitle="Kelola dan atur kategori produk percetakan" add-label="Add New Category" :refreshing="pending" @add="openAddModal" @refresh="refresh()" @print="printTable" @pdf="exportPdf" />
    <SalesFeedback :pending="pending" :message="toastMessage" skeleton="table" :skeleton-cols="6" @dismiss="toastMessage = ''" />

    <!-- Table Component -->
    <PagesCategoryTable
      v-if="!pending"
      :categories="filteredCategories"
      :search-query="searchQuery"
      :filter-status="selectedStatus"
      @update:search-query="searchQuery = $event"
      @update:filter-status="selectedStatus = $event"
      @add-category="openAddModal"
      @edit-category="handleEdit"
      @delete-category="handleDelete"
      @export-pdf="exportPdf"
      @print-table="printTable"
      @refresh="refresh"
    />

    <!-- Modal Component -->
    <PagesCategoryModal
      :is-open="isModalOpen"
      :is-edit="isEdit"
      :edit-data="editData"
      @close="isModalOpen = false"
      @submit="handleSubmit"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteConfirmOpen"
      title="Hapus Kategori"
      message="Apakah Anda yakin ingin menghapus kategori produk ini? Tindakan ini tidak dapat dibatalkan."
      :busy="isDeleting"
      @cancel="isDeleteConfirmOpen = false"
      @confirm="confirmDelete"
    />

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
