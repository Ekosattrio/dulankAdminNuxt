<script setup lang="ts">
import { ref, computed } from 'vue'
import type { BlogCategory, BlogCategoryFormData } from '#server/types/blog'
import { useBlogCategories } from '~/composables/useBlogCategories'
import { useTablePrint } from '~/composables/useTablePrint'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import BlogCategoryFormModal from '~/components/blog/BlogCategoryFormModal.vue'
import BlogCategoryTable from '~/components/blog/BlogCategoryTable.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const { categories, pending, error, refresh, saveCategory, deleteCategory } = useBlogCategories()

// Filter states
const searchQuery = ref('')
const filterStatus = ref('')

// Modal states
const isFormModalOpen = ref(false)
const isEditMode = ref(false)
const activeCategoryForEdit = ref<BlogCategory | null>(null)
const categoryToDelete = ref<BlogCategory | null>(null)
const isBusy = ref(false)

// Toast notification
const toastMessage = ref('')
let toastTimer: any = null

function showToast(msg: string) {
  toastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

const filteredCategories = computed(() => {
  return categories.value.filter((item) => {
    if (filterStatus.value && filterStatus.value !== 'All' && item.status.toLowerCase() !== filterStatus.value.toLowerCase()) {
      return false
    }
    return true
  })
})

function handleAdd() {
  isEditMode.value = false
  activeCategoryForEdit.value = null
  isFormModalOpen.value = true
}

function handleEdit(item: BlogCategory) {
  isEditMode.value = true
  activeCategoryForEdit.value = item
  isFormModalOpen.value = true
}

function handleDeleteRequest(item: BlogCategory) {
  categoryToDelete.value = item
}

async function confirmDelete() {
  if (!categoryToDelete.value) return
  isBusy.value = true
  try {
    const res = await deleteCategory(categoryToDelete.value.id)
    showToast(res?.message || `Category '${categoryToDelete.value.name}' deleted successfully`)
    categoryToDelete.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to delete category')
  } finally {
    isBusy.value = false
  }
}

async function handleFormSubmit(formData: BlogCategoryFormData) {
  isBusy.value = true
  try {
    const res = await saveCategory(formData)
    showToast(res?.message || (formData.id ? 'Category updated successfully' : 'Category created successfully'))
    isFormModalOpen.value = false
    activeCategoryForEdit.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to save category')
  } finally {
    isBusy.value = false
  }
}

// Print & PDF Export
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const printColumns = [
  { key: 'name', label: 'Category Name' },
  { key: 'slug', label: 'Slug' },
  { key: 'description', label: 'Description' },
  { key: 'postCount', label: 'Post Count', align: 'center' as const },
  { key: 'status', label: 'Status', align: 'center' as const },
  { key: 'createdDate', label: 'Created On' },
]

function handleExportExcel() {
  const header = ['ID', 'Category Name', 'Slug', 'Description', 'Post Count', 'Status', 'Created On']
  const rows = filteredCategories.value.map(c => [
    `"${c.id}"`,
    `"${(c.name || '').replace(/"/g, '""')}"`,
    `"${(c.slug || '').replace(/"/g, '""')}"`,
    `"${(c.description || '').replace(/"/g, '""')}"`,
    `"${c.postCount ?? 0}"`,
    `"${c.status}"`,
    `"${c.createdDate || ''}"`,
  ])

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [header.join(','), ...rows.map(r => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `blog_categories_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('Blog categories exported to Excel (CSV) successfully')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Success Toast Notification -->
    <div
      v-if="toastMessage"
      class="fixed top-5 right-5 z-50 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-xs font-semibold text-white shadow-xl transition-all"
    >
      <FeatherIcon name="check-circle" size="16" />
      <span>{{ toastMessage }}</span>
    </div>

    <!-- Header Toolbar -->
    <SalesListHeader
      title="Blog Categories"
      subtitle="Manage your blog categories and content taxonomy"
      add-label="Add Category"
      :refreshing="pending"
      @add="handleAdd"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <!-- Loading Feedback -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="7"
      :error="error ? 'Unable to load blog categories. Please try again.' : ''"
      @retry="refresh()"
    />

    <!-- Main Data Table -->
    <BlogCategoryTable
      v-if="!pending && !error"
      :categories="filteredCategories"
      :search-query="searchQuery"
      :filter-status="filterStatus"
      @update:search-query="searchQuery = $event"
      @update:filter-status="filterStatus = $event"
      @edit="handleEdit"
      @delete="handleDeleteRequest"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
      @export-excel="handleExportExcel"
    />

    <!-- Add / Edit Modal -->
    <BlogCategoryFormModal
      :open="isFormModalOpen"
      :is-edit="isEditMode"
      :category-data="activeCategoryForEdit"
      :busy="isBusy"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <SalesConfirmDelete
      :open="!!categoryToDelete"
      :busy="isBusy"
      @confirm="confirmDelete"
      @close="categoryToDelete = null"
    />

    <!-- Document Print / PDF Modal -->
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Blog Categories Report"
      :columns="printColumns"
      :items="filteredCategories"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
