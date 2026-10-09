<script setup lang="ts">
import { ref, computed } from 'vue'
import type { BlogCategory, BlogCategoryFormData } from '#server/types/blog'
import { useBlogCategories } from '~/composables/useBlogCategories'
import { useTablePrint } from '~/composables/useTablePrint'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import BlogCategoryFormModal from '~/components/blog/BlogCategoryFormModal.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
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

// Columns definition
const columns = [
  { key: 'name', label: 'Category Name', sortable: true },
  { key: 'slug', label: 'Slug', sortable: true },
  { key: 'description', label: 'Description', sortable: false },
  { key: 'postCount', label: 'Post Count', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'createdDate', label: 'Created On', sortable: true },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]

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
    <SalesDataTable
      v-if="!pending && !error"
      :columns="columns"
      :items="filteredCategories"
      :search="searchQuery"
      search-placeholder="Search category name or slug..."
      @update:search="searchQuery = $event"
      @print="openPrintModal('print')"
      @export-pdf="openPrintModal('pdf')"
      @export-excel="handleExportExcel"
    >
      <!-- Filters -->
      <template #filters>
        <TableFilterSelect
          :model-value="filterStatus"
          placeholder="All Status"
          :options="['Active', 'Inactive']"
          @update:model-value="filterStatus = $event"
        />
        <button
          type="button"
          title="Export to Excel"
          class="flex h-9 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750"
          @click="handleExportExcel"
        >
          <FeatherIcon name="download" size="14" />
          <span>Excel</span>
        </button>
      </template>

      <!-- Cell: Category Name -->
      <template #cell(name)="{ item }">
        <span class="font-semibold text-gray-900 dark:text-gray-100">
          {{ item.name }}
        </span>
      </template>

      <!-- Cell: Slug -->
      <template #cell(slug)="{ item }">
        <code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          {{ item.slug }}
        </code>
      </template>

      <!-- Cell: Description -->
      <template #cell(description)="{ item }">
        <span class="text-xs text-gray-600 line-clamp-1 max-w-sm dark:text-gray-400" :title="item.description">
          {{ item.description || '-' }}
        </span>
      </template>

      <!-- Cell: Post Count -->
      <template #cell(postCount)="{ item }">
        <span class="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
          {{ item.postCount ?? 0 }} posts
        </span>
      </template>

      <!-- Cell: Status -->
      <template #cell(status)="{ item }">
        <span
          :class="[
            'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold',
            item.status === 'Active'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
              : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
          ]"
        >
          • {{ item.status }}
        </span>
      </template>

      <!-- Cell: Created On -->
      <template #cell(createdDate)="{ item }">
        <span class="text-xs text-gray-600 dark:text-gray-400">
          {{ item.createdDate }}
        </span>
      </template>

      <!-- Cell: Actions -->
      <template #cell(actions)="{ item }">
        <div class="flex items-center justify-center gap-1.5">
          <button
            type="button"
            title="Edit Category"
            aria-label="Edit Category"
            class="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
            @click="handleEdit(item)"
          >
            <FeatherIcon name="edit" size="14" />
          </button>
          <button
            type="button"
            title="Delete Category"
            aria-label="Delete Category"
            class="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-rose-500 transition hover:border-rose-400 hover:bg-rose-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-rose-950/40"
            @click="handleDeleteRequest(item)"
          >
            <FeatherIcon name="trash-2" size="14" />
          </button>
        </div>
      </template>
    </SalesDataTable>

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

