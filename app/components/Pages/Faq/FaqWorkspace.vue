<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FaqItem, FaqFormData } from '#server/types/faq'
import { useFaqs } from '~/composables/useFaqs'
import { useTablePrint } from '~/composables/useTablePrint'
import FaqRecordsTable from '~/components/Pages/Faq/FaqRecordsTable.vue'
import FaqFormModal from '~/components/Pages/Faq/FaqFormModal.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

const { faqs, pending, error, refresh, saveFaq, deleteFaq } = useFaqs()

// Client-side instant filtering (Zero flicker)
const searchQuery = ref('')
const filterCategory = ref('')
const filterStatus = ref('')

const availableCategories = computed(() => {
  const cats = new Set(faqs.value.map(f => f.category).filter(Boolean))
  return Array.from(cats)
})

const filteredFaqs = computed(() => {
  return faqs.value.filter((item) => {
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.trim().toLowerCase()
      const match =
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      if (!match) return false
    }
    if (filterCategory.value && item.category !== filterCategory.value) {
      return false
    }
    if (filterStatus.value && item.status !== filterStatus.value) {
      return false
    }
    return true
  })
})

// Modal states
const isFormModalOpen = ref(false)
const isEditMode = ref(false)
const activeFaqForEdit = ref<FaqItem | null>(null)
const faqToDelete = ref<FaqItem | null>(null)
const isBusy = ref(false)
const toastMessage = ref('')

function showToast(msg: string) {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

function handleAdd() {
  isEditMode.value = false
  activeFaqForEdit.value = null
  isFormModalOpen.value = true
}

function handleEdit(faq: FaqItem) {
  isEditMode.value = true
  activeFaqForEdit.value = faq
  isFormModalOpen.value = true
}

async function handleFormSubmit(formData: FaqFormData) {
  isBusy.value = true
  try {
    const res = await saveFaq(formData)
    isFormModalOpen.value = false
    showToast(res?.message || (isEditMode.value ? 'FAQ updated successfully' : 'FAQ created successfully'))
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to save FAQ')
  } finally {
    isBusy.value = false
  }
}

async function handleConfirmDelete() {
  if (!faqToDelete.value) return
  isBusy.value = true
  try {
    await deleteFaq(faqToDelete.value.id)
    showToast(`FAQ '${faqToDelete.value.question}' deleted successfully`)
    faqToDelete.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to delete FAQ')
  } finally {
    isBusy.value = false
  }
}

// Print, PDF & Excel export
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const printColumns = [
  { key: 'order', label: 'Order', align: 'center' as const },
  { key: 'category', label: 'Category' },
  { key: 'question', label: 'Question' },
  { key: 'answer', label: 'Answer' },
  { key: 'status', label: 'Status', align: 'center' as const },
]

function handleExportExcel() {
  const header = ['Order', 'Category', 'Question', 'Answer', 'Status']
  const rows = filteredFaqs.value.map((f) => [
    `"${f.order || ''}"`,
    `"${(f.category || '').replace(/"/g, '""')}"`,
    `"${(f.question || '').replace(/"/g, '""')}"`,
    `"${(f.answer || '').replace(/"/g, '""')}"`,
    `"${f.status || ''}"`,
  ])

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [header.join(','), ...rows.map((r) => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `faq_export_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('FAQs exported to Excel/CSV successfully')
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <SalesListHeader
      title="FAQ"
      subtitle="Manage your FAQ"
      add-label="Add FAQ"
      :refreshing="pending"
      @add="handleAdd"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    >
      <template #actions>
        <button
          type="button"
          title="Export Excel / CSV"
          aria-label="Export Excel"
          class="flex size-9 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
          @click="handleExportExcel"
        >
          <FeatherIcon name="download" :size="16" />
        </button>
      </template>
    </SalesListHeader>

    <!-- Feedback Toast -->
    <SalesFeedback
      v-if="toastMessage"
      :message="toastMessage"
      @dismiss="toastMessage = ''"
    />

    <!-- Skeleton Loader & Error -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="6"
      :skeleton-rows="5"
      :error="error ? (error.message || 'Failed to load FAQs') : ''"
      @retry="refresh"
    />

    <!-- Table -->
    <FaqRecordsTable
      v-if="!pending && !error"
      :faqs="filteredFaqs"
      :search-query="searchQuery"
      :filter-category="filterCategory"
      :filter-status="filterStatus"
      :categories="availableCategories"
      @update:search-query="searchQuery = $event"
      @update:filter-category="filterCategory = $event"
      @update:filter-status="filterStatus = $event"
      @edit="handleEdit"
      @delete="faqToDelete = $event"
    />

    <!-- Add / Edit Modal -->
    <FaqFormModal
      :open="isFormModalOpen"
      :is-edit="isEditMode"
      :faq-data="activeFaqForEdit"
      :busy="isBusy"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <SalesConfirmDelete
      :open="!!faqToDelete"
      :busy="isBusy"
      title="Delete FAQ"
      :message="`Are you sure you want to delete FAQ '${faqToDelete?.question}'?`"
      @close="faqToDelete = null"
      @confirm="handleConfirmDelete"
    />

    <!-- Print / PDF Modal -->
    <DocumentPrintModal
      v-if="isPrintModalOpen"
      :open="isPrintModalOpen"
      title="Daftar FAQ (Pertanyaan Umum)"
      :columns="printColumns"
      :items="filteredFaqs"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>

