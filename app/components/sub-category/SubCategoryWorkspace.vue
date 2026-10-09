<script setup lang="ts">
import type { SubCategory, SubCategoryFormData } from '#server/types/sub-category'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import SubCategoryTable from '~/components/sub-category/SubCategoryTable.vue'
import SubCategoryModal from '~/components/sub-category/SubCategoryModal.vue'
import { useTablePrint } from '~/composables/useTablePrint'

const { subCategories, pending, refresh, saveSubCategory, deleteSubCategory } = useSubCategories()
const { categories } = useCategories()

const categoryNames = computed(() => categories.value.map((c) => c.name))

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')

const isModalOpen = ref(false)
const isEdit = ref(false)
const editData = ref<SubCategory | null>(null)
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
  { key: 'name', label: 'Sub Category' },
  { key: 'category', label: 'Category' },
  { key: 'categoryCode', label: 'Category Code' },
  { key: 'itemUsed', label: 'Item Used' },
  { key: 'createdBy', label: 'Created By' },
  { key: 'status', label: 'Status' },
]

const openAddModal = () => {
  isEdit.value = false
  editData.value = null
  isModalOpen.value = true
}

const handleEdit = (item: SubCategory) => {
  isEdit.value = true
  editData.value = item
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
    await deleteSubCategory(deleteTargetId.value)
    showToast('Sub category deleted successfully')
    isDeleteConfirmOpen.value = false
    deleteTargetId.value = null
  } catch (err: any) {
    console.error('Failed to delete sub category:', err)
    actionError.value = err?.message || 'Failed to delete sub category'
  } finally {
    isDeleting.value = false
  }
}

const handleSubmit = async (formData: SubCategoryFormData) => {
  try {
    const res = await saveSubCategory(formData)
    showToast(res?.message || 'Sub category saved successfully')
    isModalOpen.value = false
  } catch (err: any) {
    console.error('Failed to save sub category:', err)
    showToast(err?.message || 'Failed to save sub category')
  }
}

const printTable = () => {
  print.openPrintModal({
    title: 'Product Sub Category',
    subtitle: 'Daftar sub-kategori produk percetakan',
    columns: printColumns,
    rows: subCategories.value,
    action: 'print',
  })
}

const exportPdf = () => {
  print.openPrintModal({
    title: 'Product Sub Category',
    subtitle: 'Daftar sub-kategori produk percetakan',
    columns: printColumns,
    rows: subCategories.value,
    action: 'pdf',
  })
}
</script>

<template>
  <div class="space-y-4">
    <!-- Standard Header -->
    <SalesListHeader
      title="Sub Categories"
      subtitle="Kelola dan atur sub-kategori produk percetakan"
      add-label="Add Sub Category"
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
      :skeleton-cols="8"
      :skeleton-rows="6"
      :message="toastMessage"
      :error="actionError"
      @dismiss="toastMessage = ''; actionError = ''"
    />

    <!-- Data Table -->
    <SubCategoryTable
      v-if="!pending"
      :sub-categories="subCategories"
      :categories="categoryNames"
      :search-query="searchQuery"
      :selected-category="selectedCategory"
      :filter-status="selectedStatus"
      @update:search-query="searchQuery = $event"
      @update:selected-category="selectedCategory = $event"
      @update:filter-status="selectedStatus = $event"
      @edit-sub-category="handleEdit"
      @delete-sub-category="handleDelete"
    />

    <!-- Add/Edit Modal -->
    <SubCategoryModal
      :is-open="isModalOpen"
      :is-edit="isEdit"
      :edit-data="editData"
      :categories="categoryNames"
      @close="isModalOpen = false"
      @submit="handleSubmit"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteConfirmOpen"
      title="Delete Sub Category"
      message="Are you sure you want to delete this sub-category? This action cannot be undone."
      :busy="isDeleting"
      @close="isDeleteConfirmOpen = false"
      @confirm="confirmDelete"
    />

    <!-- Document Print/PDF Modal -->
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
