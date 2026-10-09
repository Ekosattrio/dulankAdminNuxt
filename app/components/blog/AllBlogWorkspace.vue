<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Blog, BlogFormData } from '#server/types/blog'
import { useBlogs } from '~/composables/useBlogs'
import { useBlogCategories } from '~/composables/useBlogCategories'
import { useTablePrint } from '~/composables/useTablePrint'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import BlogFormModal from '~/components/blog/BlogFormModal.vue'
import BlogFilterBar from '~/components/blog/BlogFilterBar.vue'
import BlogCardGrid from '~/components/blog/BlogCardGrid.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

const { blogs, pending, error, refresh, saveBlog, deleteBlog } = useBlogs()
const { categories } = useBlogCategories()

// Filter states
const searchQuery = ref('')
const filterStatus = ref('')
const filterCategory = ref('')
const sortBy = ref('newest')

// Modal state
const isFormModalOpen = ref(false)
const isEditMode = ref(false)
const activeBlogForEdit = ref<Blog | null>(null)
const blogToDelete = ref<Blog | null>(null)
const isBusy = ref(false)

// Toast notification
const toastMessage = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null

function showToast(msg: string) {
  toastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

const categoryNames = computed(() => categories.value.map(c => c.name))

const filteredBlogs = computed(() => {
  let list = [...blogs.value]

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase()
    list = list.filter((b) =>
      b.title.toLowerCase().includes(q) ||
      (b.author && b.author.toLowerCase().includes(q)) ||
      (b.category && b.category.toLowerCase().includes(q)) ||
      (b.excerpt && b.excerpt.toLowerCase().includes(q)) ||
      (Array.isArray(b.tags) && b.tags.some(t => t.toLowerCase().includes(q)))
    )
  }

  if (filterCategory.value && filterCategory.value !== 'All') {
    list = list.filter(b => b.category === filterCategory.value)
  }

  if (filterStatus.value && filterStatus.value !== 'All') {
    list = list.filter(b => b.status.toLowerCase() === filterStatus.value.toLowerCase())
  }

  if (sortBy.value === 'newest') {
    list.sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''))
  } else if (sortBy.value === 'oldest') {
    list.sort((a, b) => (a.publishedAt || '').localeCompare(b.publishedAt || ''))
  } else if (sortBy.value === 'popular') {
    list.sort((a, b) => (b.viewsCount ?? 0) - (a.viewsCount ?? 0))
  } else if (sortBy.value === 'title') {
    list.sort((a, b) => a.title.localeCompare(b.title))
  }

  return list
})

function handleAdd() {
  isEditMode.value = false
  activeBlogForEdit.value = null
  isFormModalOpen.value = true
}

function handleEdit(blog: Blog) {
  isEditMode.value = true
  activeBlogForEdit.value = blog
  isFormModalOpen.value = true
}

function handleDeleteRequest(blog: Blog) {
  blogToDelete.value = blog
}

async function confirmDelete() {
  if (!blogToDelete.value) return
  isBusy.value = true
  try {
    const res = await deleteBlog(blogToDelete.value.id)
    showToast(res?.message || `Blog '${blogToDelete.value.title}' deleted successfully`)
    blogToDelete.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to delete blog')
  } finally {
    isBusy.value = false
  }
}

async function handleFormSubmit(payload: BlogFormData) {
  isBusy.value = true
  try {
    const res = await saveBlog(payload, isEditMode.value ? activeBlogForEdit.value?.id : undefined)
    showToast(res?.message || (isEditMode.value ? 'Blog updated successfully' : 'Blog created successfully'))
    isFormModalOpen.value = false
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to save blog')
  } finally {
    isBusy.value = false
  }
}

// Print & PDF via reusable composable
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const printColumns = [
  { key: 'title', label: 'Blog Title' },
  { key: 'category', label: 'Category' },
  { key: 'author', label: 'Author' },
  { key: 'publishedAt', label: 'Published Date' },
  { key: 'status', label: 'Status' },
]

function handleExportExcel() {
  const header = ['Title', 'Category', 'Author', 'Published Date', 'Status', 'Views', 'Comments']
  const rows = filteredBlogs.value.map((b) => [
    `"${b.title.replace(/"/g, '""')}"`,
    `"${b.category || ''}"`,
    `"${b.author || ''}"`,
    `"${b.publishedAt || ''}"`,
    `"${b.status}"`,
    b.viewsCount ?? 0,
    b.commentsCount ?? 0,
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `blogs_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('Blogs list exported to Excel (CSV) successfully')
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
      title="Blogs"
      subtitle="Manage your blogs"
      add-label="Add Blog"
      :refreshing="pending"
      @add="handleAdd"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <!-- Filter Control Card -->
    <BlogFilterBar
      :search-query="searchQuery"
      :filter-status="filterStatus"
      :sort-by="sortBy"
      @update:search-query="searchQuery = $event"
      @update:filter-status="filterStatus = $event"
      @update:sort-by="sortBy = $event"
      @export-excel="handleExportExcel"
    />

    <!-- Error State -->
    <div
      v-if="error"
      class="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-900/40 dark:bg-rose-950/20"
    >
      <FeatherIcon name="alert-triangle" size="24" class="mx-auto mb-2 text-rose-500" />
      <p class="text-sm font-semibold text-rose-800 dark:text-rose-300">
        {{ error?.message || 'Failed to load blog posts. Please try again.' }}
      </p>
      <button
        type="button"
        class="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
        @click="refresh()"
      >
        <FeatherIcon name="rotate-cw" size="13" />
        <span>Retry</span>
      </button>
    </div>

    <!-- Card Grid View -->
    <BlogCardGrid
      v-else
      :blogs="filteredBlogs"
      :pending="pending"
      :search-query="searchQuery"
      :has-active-filters="Boolean(searchQuery || filterStatus || filterCategory)"
      @add="handleAdd"
      @edit="handleEdit"
      @delete="handleDeleteRequest"
      @clear-filters="searchQuery = ''; filterStatus = ''; filterCategory = ''"
    />

    <!-- Add / Edit Modal -->
    <BlogFormModal
      :open="isFormModalOpen"
      :is-edit="isEditMode"
      :blog-data="activeBlogForEdit"
      :categories="categoryNames"
      :busy="isBusy"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <SalesConfirmDelete
      :open="!!blogToDelete"
      :busy="isBusy"
      title="Delete Blog"
      :description="`Are you sure you want to delete blog '${blogToDelete?.title}'? This action cannot be undone.`"
      @confirm="confirmDelete"
      @close="blogToDelete = null"
    />

    <!-- Document Print / PDF Modal -->
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Blogs List Report"
      :columns="printColumns"
      :items="filteredBlogs"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
