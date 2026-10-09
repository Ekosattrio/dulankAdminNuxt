<script setup lang="ts">
import type { Category, CategoryFormData } from '~/types/category'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import PagesCategoryModal from '~/components/category/CategoryModal.vue'
import PagesCategoryTable from '~/components/category/CategoryTable.vue'

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

import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'

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
  window.print()
}

const exportPdf = () => {
  showToast('Exporting Categories to PDF...')
}
</script>

<template>
  <div class="page-wrapper mt-3">
    <div class="content container-fluid">
      <!-- Toast Alert -->
      <div
        v-if="toastMessage"
        class="alert alert-success position-fixed top-0 end-0 m-4 shadow-lg z-3 d-flex align-items-center gap-2"
        role="alert"
      >
        <FeatherIcon name="check-circle" size="18" />
        <div>{{ toastMessage }}</div>
      </div>

      <!-- Page Header -->
      <div class="page-header d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div class="page-title">
          <h4 class="fw-bold mb-1">Product Category</h4>
          <h6 class="text-muted mb-0">Kelola dan atur kategori produk percetakan</h6>
        </div>
        <div class="d-flex align-items-center gap-2">
          <ul class="table-top-head d-flex align-items-center list-unstyled gap-2 mb-0">
            <li>
              <button type="button" class="btn btn-outline-secondary btn-sm" title="Print" @click="printTable">
                <FeatherIcon name="printer" size="16" />
              </button>
            </li>
            <li>
              <button type="button" class="btn btn-outline-secondary btn-sm" title="Refresh" @click="refresh">
                <FeatherIcon name="rotate-cw" size="16" />
              </button>
            </li>
          </ul>
          <button type="button" class="btn btn-primary d-flex align-items-center gap-2" @click="openAddModal">
            <FeatherIcon name="plus-circle" size="18" />
            <span>Add New Category</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Table Component -->
      <PagesCategoryTable
        v-else
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
    </div>

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
  </div>
</template>
