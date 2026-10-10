<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Blog, BlogFormData } from '#server/types/blog'
import { useBlogs } from '~/composables/useBlogs'
import { useBlogCategories } from '~/composables/useBlogCategories'
import { useTablePrint } from '~/composables/useTablePrint'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import BlogFormModal from '~/components/Blog/BlogFormModal.vue'
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

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
let toastTimer: any = null

function showToast(msg: string) {
  toastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

const categoryNames = computed(() => categories.value.map(c => c.name))

function formatBlogDate(dateStr?: string) {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(d)
  } catch {
    return dateStr
  }
}

// In-memory instant client-side filtering & sorting (0ms delay, ZERO skeleton flicker)
const filteredBlogs = computed(() => {
  let list = [...blogs.value]

  // Search filter
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

  // Category filter
  if (filterCategory.value && filterCategory.value !== 'All') {
    list = list.filter(b => b.category === filterCategory.value)
  }

  // Status filter
  if (filterStatus.value && filterStatus.value !== 'All') {
    list = list.filter(b => b.status.toLowerCase() === filterStatus.value.toLowerCase())
  }

  // Sort by
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
    <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <!-- Search Input with Icon -->
        <div class="relative w-full sm:max-w-xs">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search"
            class="w-full rounded-lg border border-gray-200 bg-white py-2 ps-3 pe-9 text-xs text-gray-800 placeholder-gray-400 focus:border-[#FE9F43] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          />
          <span class="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3 text-gray-400">
            <FeatherIcon name="search" size="14" />
          </span>
        </div>

        <!-- Filter Dropdowns -->
        <div class="flex flex-wrap items-center gap-2.5">
          <!-- Status Dropdown -->
          <div class="relative">
            <select
              v-model="filterStatus"
              class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 focus:border-[#FE9F43] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 cursor-pointer pe-7"
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <!-- Sort Dropdown -->
          <div class="relative">
            <select
              v-model="sortBy"
              class="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 focus:border-[#FE9F43] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 cursor-pointer pe-7"
            >
              <option value="newest">Sort By : Last 7 Days</option>
              <option value="oldest">Sort By : Oldest</option>
              <option value="popular">Sort By : Most Popular</option>
              <option value="title">Sort By : Title</option>
            </select>
          </div>

          <!-- Excel Export Button -->
          <button
            type="button"
            title="Export Excel (CSV)"
            class="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            @click="handleExportExcel"
          >
            <FeatherIcon name="download" size="13" />
            <span class="hidden sm:inline">Excel</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Skeleton Loader for Large Image Card Grid -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="i in 4"
        :key="i"
        class="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden dark:border-gray-800 dark:bg-gray-900 animate-pulse"
      >
        <!-- Big Image Placeholder -->
        <div class="w-full aspect-[16/10] sm:aspect-[16/9] bg-gray-200 dark:bg-gray-800 relative">
          <div class="absolute top-3 left-3 h-6 w-20 rounded bg-gray-300 dark:bg-gray-700" />
          <div class="absolute top-3 right-3 h-6 w-16 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>
        <!-- Card Body Placeholder -->
        <div class="p-5 space-y-3">
          <div class="flex items-center justify-between">
            <div class="h-4 w-40 rounded bg-gray-200 dark:bg-gray-800" />
            <div class="flex gap-2">
              <div class="h-4 w-4 rounded bg-gray-200 dark:bg-gray-800" />
              <div class="h-4 w-4 rounded bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>
          <div class="h-6 w-3/4 rounded bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
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

    <!-- Empty State -->
    <div
      v-else-if="filteredBlogs.length === 0"
      class="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div class="mx-auto flex size-14 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800">
        <FeatherIcon name="file-text" size="24" />
      </div>
      <h3 class="mt-3 text-sm font-bold text-gray-900 dark:text-white">No blog posts found</h3>
      <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {{ searchQuery ? `No articles matching "${searchQuery}". Try adjusting your filters.` : 'Start by creating your first blog article.' }}
      </p>
      <button
        v-if="searchQuery || filterStatus || filterCategory"
        type="button"
        class="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300"
        @click="searchQuery = ''; filterStatus = ''; filterCategory = ''"
      >
        <FeatherIcon name="x" size="13" />
        <span>Clear Filters</span>
      </button>
      <button
        v-else
        type="button"
        class="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#FE9F43] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#e08933]"
        @click="handleAdd"
      >
        <FeatherIcon name="plus" size="14" />
        <span>Add Blog</span>
      </button>
    </div>

    <!-- Large Preview Image Card Grid (2 Columns as in Screenshot) -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <article
        v-for="blog in filteredBlogs"
        :key="blog.id"
        class="group relative flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 overflow-hidden"
      >
        <!-- Big Image Preview Area -->
        <div class="relative w-full aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            :src="blog.image || 'https://images.unsplash.com/photo-1556742049-0a67e55722ee?w=800&auto=format&fit=crop&q=60'"
            :alt="blog.title"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          <!-- Category Badge (Top Left) -->
          <div class="absolute top-3.5 left-3.5">
            <span class="inline-flex items-center rounded-md bg-[#00A389] px-3 py-1 text-xs font-semibold text-white shadow-md tracking-wide">
              {{ blog.category || 'General' }}
            </span>
          </div>

          <!-- Status Badge (Top Right) -->
          <div class="absolute top-3.5 right-3.5">
            <span
              :class="[
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-md backdrop-blur-md',
                blog.status === 'Active'
                  ? 'bg-emerald-500/90 text-white'
                  : 'bg-rose-500/90 text-white'
              ]"
            >
              <span class="size-1.5 rounded-full bg-white animate-pulse" />
              <span>{{ blog.status }}</span>
            </span>
          </div>
        </div>

        <!-- Card Body Content -->
        <div class="flex flex-1 flex-col justify-between p-5">
          <div class="space-y-3">
            <!-- Meta Row: Date, Author & Actions -->
            <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div class="flex items-center gap-4">
                <!-- Date -->
                <div class="flex items-center gap-1.5">
                  <FeatherIcon name="calendar" size="14" class="text-gray-400" />
                  <span>{{ formatBlogDate(blog.publishedAt) }}</span>
                </div>
                <!-- Author -->
                <div class="flex items-center gap-1.5">
                  <FeatherIcon name="user" size="14" class="text-gray-400" />
                  <span>{{ blog.author || 'Admin' }}</span>
                </div>
              </div>

              <!-- Action Buttons (Edit & Delete) -->
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  title="Edit Blog"
                  aria-label="Edit Blog"
                  class="rounded p-1 text-gray-400 transition hover:bg-gray-100 hover:text-[#FE9F43] dark:hover:bg-gray-800"
                  @click="handleEdit(blog)"
                >
                  <FeatherIcon name="edit" size="15" />
                </button>
                <button
                  type="button"
                  title="Delete Blog"
                  aria-label="Delete Blog"
                  class="rounded p-1 text-gray-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                  @click="handleDeleteRequest(blog)"
                >
                  <FeatherIcon name="trash-2" size="15" />
                </button>
              </div>
            </div>

            <!-- Blog Title -->
            <h3
              class="text-base sm:text-lg font-bold text-gray-900 transition-colors line-clamp-2 hover:text-[#FE9F43] dark:text-white cursor-pointer"
              :title="blog.title"
              @click="handleEdit(blog)"
            >
              {{ blog.title }}
            </h3>

            <!-- Short Excerpt (Optional) -->
            <p v-if="blog.excerpt" class="text-xs text-gray-500 line-clamp-2 dark:text-gray-400">
              {{ blog.excerpt }}
            </p>
          </div>

          <!-- Bottom Tags & Engagement info -->
          <div v-if="blog.tags && blog.tags.length" class="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-gray-100 dark:border-gray-800">
            <span
              v-for="tag in (Array.isArray(blog.tags) ? blog.tags : [blog.tags])"
              :key="tag"
              class="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            >
              #{{ tag }}
            </span>
            <div class="ms-auto flex items-center gap-3 text-[11px] text-gray-400">
              <span class="inline-flex items-center gap-1" title="Views">
                <FeatherIcon name="eye" size="12" />
                {{ blog.viewsCount ?? 0 }}
              </span>
              <span class="inline-flex items-center gap-1" title="Comments">
                <FeatherIcon name="message-square" size="12" />
                {{ blog.commentsCount ?? 0 }}
              </span>
            </div>
          </div>
        </div>
      </article>
    </div>

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

