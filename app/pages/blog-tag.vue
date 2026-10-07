<script setup lang="ts">
import type { BlogTag, BlogTagFormData } from '#server/types/blog'
import { useBlogTags } from '~/composables/useBlogTags'
import { useTablePrint } from '~/composables/useTablePrint'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import BlogTagFormModal from '~/components/blog/BlogTagFormModal.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

useLegacyPage({ title: 'Blog Tags', sweetAlert: false })

const { tags, pending, error, refresh, saveTag, deleteTag } = useBlogTags()

// Filter states
const searchQuery = ref('')

// Modal states
const isFormModalOpen = ref(false)
const isEditMode = ref(false)
const activeTagForEdit = ref<BlogTag | null>(null)
const tagToDelete = ref<BlogTag | null>(null)
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

function handleAdd() {
  isEditMode.value = false
  activeTagForEdit.value = null
  isFormModalOpen.value = true
}

function handleEdit(item: BlogTag) {
  isEditMode.value = true
  activeTagForEdit.value = item
  isFormModalOpen.value = true
}

function handleDeleteRequest(item: BlogTag) {
  tagToDelete.value = item
}

async function confirmDelete() {
  if (!tagToDelete.value) return
  isBusy.value = true
  try {
    const res = await deleteTag(tagToDelete.value.id)
    showToast(res?.message || `Tag '${tagToDelete.value.name}' deleted successfully`)
    tagToDelete.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to delete tag')
  } finally {
    isBusy.value = false
  }
}

async function handleFormSubmit(formData: BlogTagFormData) {
  isBusy.value = true
  try {
    const res = await saveTag(formData)
    showToast(res?.message || (formData.id ? 'Tag updated successfully' : 'Tag created successfully'))
    isFormModalOpen.value = false
    activeTagForEdit.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to save tag')
  } finally {
    isBusy.value = false
  }
}

// Columns definition
const columns = [
  { key: 'name', label: 'Tag Name', sortable: true },
  { key: 'slug', label: 'Slug', sortable: true },
  { key: 'description', label: 'Description', sortable: false },
  { key: 'taggedPosts', label: 'Tagged Posts', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'createdDate', label: 'Created On', sortable: true },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]

// Print & PDF Export
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const printColumns = [
  { key: 'name', label: 'Tag Name' },
  { key: 'slug', label: 'Slug' },
  { key: 'description', label: 'Description' },
  { key: 'taggedPosts', label: 'Tagged Posts', align: 'center' as const },
  { key: 'createdDate', label: 'Created On' },
]

function handleExportExcel() {
  const header = ['ID', 'Tag Name', 'Slug', 'Description', 'Tagged Posts', 'Created On']
  const rows = tags.value.map(t => [
    `"${t.id}"`,
    `"${(t.name || '').replace(/"/g, '""')}"`,
    `"${(t.slug || '').replace(/"/g, '""')}"`,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    `"${t.taggedPosts ?? 0}"`,
    `"${t.createdDate || ''}"`,
  ])

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [header.join(','), ...rows.map(r => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `blog_tags_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('Blog tags exported to Excel (CSV) successfully')
}
</script>

<template>
  <div class="dulank-page dulank-page-blog-tag space-y-6">
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
      title="Blog Tags"
      subtitle="Manage your blog tags and topic indexing"
      add-label="Add Tag"
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
      :skeleton-cols="6"
      :error="error ? 'Unable to load blog tags. Please try again.' : ''"
      @retry="refresh()"
    />

    <!-- Main Data Table -->
    <SalesDataTable
      v-if="!pending && !error"
      :columns="columns"
      :items="tags"
      :search="searchQuery"
      search-placeholder="Search tag name, slug, or description..."
      @update:search="searchQuery = $event"
      @print="openPrintModal('print')"
      @export-pdf="openPrintModal('pdf')"
      @export-excel="handleExportExcel"
    >
      <!-- Filters -->
      <template #filters>
        <button
          type="button"
          title="Export to Excel"
          class="flex h-9 items-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-750"
          @click="handleExportExcel"
        >
          <FeatherIcon name="download" size="14" />
          <span>Excel</span>
        </button>
      </template>

      <!-- Cell: Tag Name -->
      <template #cell(name)="{ item }">
        <span class="inline-flex items-center gap-1.5 font-semibold text-gray-900 dark:text-gray-100">
          <FeatherIcon name="tag" size="13" class="text-primary" />
          {{ item.name }}
        </span>
      </template>

      <!-- Cell: Slug -->
      <template #cell(slug)="{ item }">
        <code class="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
          #{{ item.slug }}
        </code>
      </template>

      <!-- Cell: Description -->
      <template #cell(description)="{ item }">
        <span class="text-xs text-gray-600 line-clamp-1 max-w-sm dark:text-gray-400" :title="item.description">
          {{ item.description || '-' }}
        </span>
      </template>

      <!-- Cell: Tagged Posts -->
      <template #cell(taggedPosts)="{ item }">
        <span class="inline-flex items-center rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
          {{ item.taggedPosts ?? 0 }} posts
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
            title="Edit Tag"
            aria-label="Edit Tag"
            class="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
            @click="handleEdit(item)"
          >
            <FeatherIcon name="edit" size="14" />
          </button>
          <button
            type="button"
            title="Delete Tag"
            aria-label="Delete Tag"
            class="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-rose-500 transition hover:border-rose-400 hover:bg-rose-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-rose-950/40"
            @click="handleDeleteRequest(item)"
          >
            <FeatherIcon name="trash-2" size="14" />
          </button>
        </div>
      </template>
    </SalesDataTable>

    <!-- Add / Edit Modal -->
    <BlogTagFormModal
      :open="isFormModalOpen"
      :is-edit="isEditMode"
      :tag-data="activeTagForEdit"
      :busy="isBusy"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <SalesConfirmDelete
      :open="!!tagToDelete"
      :busy="isBusy"
      @confirm="confirmDelete"
      @close="tagToDelete = null"
    />

    <!-- Document Print / PDF Modal -->
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Blog Tags Report"
      :columns="printColumns"
      :items="tags"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
