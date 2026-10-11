<script setup lang="ts">
import type { SubCategory, SubCategoryFormData } from '~/types/sub-category'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import PagesSubCategoryModal from '~/components/SubCategory/SubCategoryModal.vue'
import PagesSubCategoryTable from '~/components/SubCategory/SubCategoryTable.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Sub Categories - Sub Kategori Produk',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

const { subCategories, pending, refresh, saveSubCategory, deleteSubCategory } = useSubCategories()
const { categories } = useCategories()

const searchQuery = ref('')
const selectedCategory = ref('')
const filterStatus = ref('')

const isModalOpen = ref(false)
const isEdit = ref(false)
const editData = ref<SubCategory | null>(null)
const toastMessage = ref('')

const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const categoryNames = computed(() => categories.value.map((c) => c.name))

const filteredList = computed(() => {
  return subCategories.value.filter((sc) => {
    const matchesSearch =
      !searchQuery.value ||
      sc.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      sc.categoryCode?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCat = !selectedCategory.value || sc.category === selectedCategory.value
    const matchesStatus = !filterStatus.value || sc.status === filterStatus.value
    return matchesSearch && matchesCat && matchesStatus
  })
})

const print = useTablePrint()
const printColumns = [
  { key: 'name', label: 'Sub Category' },
  { key: 'category', label: 'Category' },
  { key: 'categoryCode', label: 'Category Code' },
  { key: 'description', label: 'Description' },
  { key: 'itemUsed', label: 'Item Used', align: 'right' as const },
  { key: 'status', label: 'Status' }
]

import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'

const isDeleteConfirmOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)

const handleAdd = () => {
  isEdit.value = false
  editData.value = null
  isModalOpen.value = true
}

const handleEdit = (sc: SubCategory) => {
  isEdit.value = true
  editData.value = sc
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
    showToast(err?.message || 'Failed to delete sub category')
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
    subtitle: 'Daftar subkategori produk percetakan',
    columns: printColumns,
    rows: filteredList.value,
    action: 'print'
  })
}

const exportPdf = () => {
  print.openPrintModal({
    title: 'Product Sub Category',
    subtitle: 'Daftar subkategori produk percetakan',
    columns: printColumns,
    rows: filteredList.value,
    action: 'pdf'
  })
}
</script>

<template>
  <div class="page-wrapper mt-3">
    <div class="content container-fluid">
      <SalesListHeader title="Sub Categories / Sub Kategori" subtitle="Kelola sub kelompok jenis spesifikasi produk" add-label="Add Sub Category" :refreshing="pending" @add="handleAdd" @refresh="refresh()" @print="printTable" @pdf="exportPdf" />
      <SalesFeedback :pending="pending" :message="toastMessage" skeleton="table" :skeleton-cols="8" @dismiss="toastMessage = ''" />

      <PagesSubCategoryTable
        v-if="!pending"
        :sub-categories="filteredList"
        :categories="categoryNames"
        :search-query="searchQuery"
        :selected-category="selectedCategory"
        :filter-status="filterStatus"
        @update:search-query="searchQuery = $event"
        @update:selected-category="selectedCategory = $event"
        @update:filter-status="filterStatus = $event"
        @add-sub-category="handleAdd"
        @edit-sub-category="handleEdit"
        @delete-sub-category="handleDelete"
        @export-pdf="exportPdf"
        @print-table="printTable"
        @refresh="refresh"
      />
    </div>

    <PagesSubCategoryModal
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
      title="Hapus Sub Kategori"
      message="Apakah Anda yakin ingin menghapus sub kategori ini? Tindakan ini tidak dapat dibatalkan."
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
