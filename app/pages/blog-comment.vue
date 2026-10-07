<script setup lang="ts">
import type { BlogComment, BlogCommentFormData } from '#server/types/blog'
import { useBlogComments } from '~/composables/useBlogComments'
import { useTablePrint } from '~/composables/useTablePrint'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import BlogCommentModal from '~/components/blog/BlogCommentModal.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

useLegacyPage({ title: 'Blog Comments', sweetAlert: false })

const { comments, pending, error, refresh, saveComment, deleteComment } = useBlogComments()

// Filter states
const searchQuery = ref('')
const filterStatus = ref('')

// Modal states
const isFormModalOpen = ref(false)
const isEditMode = ref(false)
const activeCommentForEdit = ref<BlogComment | null>(null)
const commentToDelete = ref<BlogComment | null>(null)
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

const filteredComments = computed(() => {
  return comments.value.filter((item) => {
    if (filterStatus.value && filterStatus.value !== 'All' && item.status.toLowerCase() !== filterStatus.value.toLowerCase()) {
      return false
    }
    return true
  })
})

function handleAdd() {
  isEditMode.value = false
  activeCommentForEdit.value = null
  isFormModalOpen.value = true
}

function handleEdit(item: BlogComment) {
  isEditMode.value = true
  activeCommentForEdit.value = item
  isFormModalOpen.value = true
}

async function handleStatusChange(item: BlogComment, newStatus: 'Approved' | 'Pending' | 'Spam') {
  if (item.status === newStatus) return
  isBusy.value = true
  try {
    await saveComment({
      id: item.id,
      blogTitle: item.blogTitle,
      commenterName: item.commenterName,
      email: item.email,
      commentBody: item.commentBody,
      rating: item.rating,
      status: newStatus,
    })
    showToast(`Comment status updated to ${newStatus}`)
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to update comment status')
  } finally {
    isBusy.value = false
  }
}

function handleDeleteRequest(item: BlogComment) {
  commentToDelete.value = item
}

async function confirmDelete() {
  if (!commentToDelete.value) return
  isBusy.value = true
  try {
    const res = await deleteComment(commentToDelete.value.id)
    showToast(res?.message || 'Comment deleted successfully')
    commentToDelete.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to delete comment')
  } finally {
    isBusy.value = false
  }
}

async function handleFormSubmit(formData: BlogCommentFormData) {
  isBusy.value = true
  try {
    const res = await saveComment(formData)
    showToast(res?.message || (formData.id ? 'Comment updated successfully' : 'Comment created successfully'))
    isFormModalOpen.value = false
    activeCommentForEdit.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to save comment')
  } finally {
    isBusy.value = false
  }
}

// Columns definition
const columns = [
  { key: 'comment', label: 'Comment', sortable: false },
  { key: 'blogTitle', label: 'Blog Title', sortable: true },
  { key: 'commenter', label: 'Commenter', sortable: true },
  { key: 'rating', label: 'Rating', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'createdDate', label: 'Date', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]

// Print & PDF Export
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const printColumns = [
  { key: 'blogTitle', label: 'Blog' },
  { key: 'commenterName', label: 'Commenter' },
  { key: 'email', label: 'Email' },
  { key: 'commentBody', label: 'Comment' },
  { key: 'createdDate', label: 'Date' },
  { key: 'status', label: 'Status', align: 'center' as const },
]

function handleExportExcel() {
  const header = ['ID', 'Blog Title', 'Commenter Name', 'Email', 'Comment Body', 'Rating', 'Date', 'Status']
  const rows = filteredComments.value.map(c => [
    `"${c.id}"`,
    `"${(c.blogTitle || '').replace(/"/g, '""')}"`,
    `"${(c.commenterName || '').replace(/"/g, '""')}"`,
    `"${(c.email || '').replace(/"/g, '""')}"`,
    `"${(c.commentBody || '').replace(/"/g, '""')}"`,
    `"${c.rating ?? 5}"`,
    `"${c.createdDate || ''}"`,
    `"${c.status}"`,
  ])

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [header.join(','), ...rows.map(r => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `blog_comments_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('Blog comments exported to Excel (CSV) successfully')
}
</script>

<template>
  <div class="dulank-page dulank-page-blog-comment space-y-6">
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
      title="Blog Comments"
      subtitle="Manage, moderate, and approve user discussions and reviews"
      add-label="Add Comment"
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
      :error="error ? 'Unable to load blog comments. Please try again.' : ''"
      @retry="refresh()"
    />

    <!-- Main Data Table -->
    <SalesDataTable
      v-if="!pending && !error"
      :columns="columns"
      :items="filteredComments"
      :search="searchQuery"
      search-placeholder="Search comment message, blog title, or author..."
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
          :options="['Approved', 'Pending', 'Spam']"
          @update:model-value="filterStatus = $event"
        />
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

      <!-- Cell: Comment -->
      <template #cell(comment)="{ item }">
        <div class="max-w-md">
          <p class="text-xs text-gray-800 line-clamp-2 dark:text-gray-200" :title="item.commentBody">
            "{{ item.commentBody }}"
          </p>
        </div>
      </template>

      <!-- Cell: Blog Title -->
      <template #cell(blogTitle)="{ item }">
        <span class="text-xs font-semibold text-gray-900 line-clamp-1 max-w-xs dark:text-gray-100" :title="item.blogTitle">
          {{ item.blogTitle }}
        </span>
      </template>

      <!-- Cell: Commenter -->
      <template #cell(commenter)="{ item }">
        <div>
          <div class="font-medium text-xs text-gray-900 dark:text-white">
            {{ item.commenterName }}
          </div>
          <div v-if="item.email" class="text-[11px] text-gray-500 dark:text-gray-400">
            {{ item.email }}
          </div>
        </div>
      </template>

      <!-- Cell: Rating -->
      <template #cell(rating)="{ item }">
        <div class="flex items-center justify-center gap-0.5 text-amber-400">
          <FeatherIcon
            v-for="i in 5"
            :key="i"
            name="star"
            size="11"
            :class="(item.rating || 5) >= i ? 'fill-current text-amber-400' : 'text-gray-300 dark:text-gray-600'"
          />
        </div>
      </template>

      <!-- Cell: Date -->
      <template #cell(createdDate)="{ item }">
        <span class="text-xs text-gray-600 dark:text-gray-400">
          {{ item.createdDate }}
        </span>
      </template>

      <!-- Cell: Status with Quick Toggle Dropdown -->
      <template #cell(status)="{ item }">
        <select
          :value="item.status"
          :class="[
            'cursor-pointer rounded-md border px-2 py-1 text-[11px] font-semibold transition focus:outline-none',
            item.status === 'Approved'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
              : item.status === 'Pending'
                ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
                : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
          ]"
          :disabled="isBusy"
          @change="handleStatusChange(item, ($event.target as HTMLSelectElement).value as any)"
        >
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Spam">Spam</option>
        </select>
      </template>

      <!-- Cell: Actions -->
      <template #cell(actions)="{ item }">
        <div class="flex items-center justify-center gap-1.5">
          <button
            type="button"
            title="Edit Comment"
            aria-label="Edit Comment"
            class="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
            @click="handleEdit(item)"
          >
            <FeatherIcon name="edit" size="14" />
          </button>
          <button
            type="button"
            title="Delete Comment"
            aria-label="Delete Comment"
            class="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-rose-500 transition hover:border-rose-400 hover:bg-rose-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-rose-950/40"
            @click="handleDeleteRequest(item)"
          >
            <FeatherIcon name="trash-2" size="14" />
          </button>
        </div>
      </template>
    </SalesDataTable>

    <!-- Add / Edit Modal -->
    <BlogCommentModal
      :open="isFormModalOpen"
      :is-edit="isEditMode"
      :comment-data="activeCommentForEdit"
      :busy="isBusy"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <SalesConfirmDelete
      :open="!!commentToDelete"
      :busy="isBusy"
      @confirm="confirmDelete"
      @close="commentToDelete = null"
    />

    <!-- Document Print / PDF Modal -->
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Blog Comments Report"
      :columns="printColumns"
      :items="filteredComments"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
