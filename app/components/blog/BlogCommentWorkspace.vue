<script setup lang="ts">
import { ref, computed } from 'vue'
import type { BlogComment, BlogCommentFormData } from '#server/types/blog'
import { useBlogComments } from '~/composables/useBlogComments'
import { useTablePrint } from '~/composables/useTablePrint'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import BlogCommentModal from '~/components/blog/BlogCommentModal.vue'
import BlogCommentTable from '~/components/blog/BlogCommentTable.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

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
let toastTimer: ReturnType<typeof setTimeout> | null = null

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

    <!-- Main Data Table Component -->
    <BlogCommentTable
      v-if="!pending && !error"
      :items="filteredComments"
      :search="searchQuery"
      :filter-status="filterStatus"
      :is-busy="isBusy"
      @update:search="searchQuery = $event"
      @update:filter-status="filterStatus = $event"
      @edit="handleEdit"
      @delete="handleDeleteRequest"
      @status-change="handleStatusChange"
      @print="openPrintModal('print')"
      @export-pdf="openPrintModal('pdf')"
      @export-excel="handleExportExcel"
    />

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
