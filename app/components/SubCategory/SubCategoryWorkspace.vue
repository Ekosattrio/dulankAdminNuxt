<script setup lang="ts">
import type { SubCategory, SubCategoryFormData } from '~/types/sub-category'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
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
      <div v-if="toastMessage" class="alert alert-success position-fixed top-0 end-0 m-4 shadow-lg z-3 d-flex align-items-center gap-2" role="alert">
        <FeatherIcon name="check-circle" size="18" />
        <div>{{ toastMessage }}</div>
      </div>

      <div class="page-header d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div class="page-title">
          <h4 class="fw-bold mb-1">Sub Categories / Sub Kategori</h4>
          <h6 class="text-muted mb-0">Kelola sub kelompok jenis spesifikasi produk</h6>
        </div>
        <div class="d-flex align-items-center gap-2">
          <ul class="table-top-head d-flex align-items-center list-unstyled gap-2 mb-0">
            <li>
              <button type="button" class="btn btn-outline-secondary btn-sm" title="Print" @click="printTable">
                <FeatherIcon name="printer" size="16" />
              </button>
            </li>
            <li>
              <button type="button" class="btn btn-outline-secondary btn-sm" title="Refresh" @click="refresh()">
                <FeatherIcon name="rotate-cw" size="16" />
              </button>
            </li>
          </ul>
          <button type="button" class="btn btn-primary d-flex align-items-center gap-2" @click="handleAdd">
            <FeatherIcon name="plus-circle" size="18" />
            <span>Add Sub Category</span>
          </button>
        </div>
      </div>

      <div v-if="pending" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <PagesSubCategoryTable
        v-else
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
