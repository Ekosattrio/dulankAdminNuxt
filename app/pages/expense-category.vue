<script setup lang="ts">
import type { ExpenseCategory, ExpenseCategoryFormData } from '~/types/expense-category'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Expense Categories - Kategori Pengeluaran',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

const { expenseCategories, pending, refresh, saveExpenseCategory, deleteExpenseCategory } = useExpenseCategories()

const searchQuery = ref('')
const filterStatus = ref('')

const isModalOpen = ref(false)
const isEdit = ref(false)
const editData = ref<ExpenseCategory | null>(null)
const toastMessage = ref('')

const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const filteredList = computed(() => {
  return expenseCategories.value.filter((cat) => {
    const matchesSearch =
      !searchQuery.value ||
      cat.categoryName?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      cat.code?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !filterStatus.value || cat.status === filterStatus.value
    return matchesSearch && matchesStatus
  })
})

const handleAdd = () => {
  isEdit.value = false
  editData.value = null
  isModalOpen.value = true
}

const handleEdit = (cat: ExpenseCategory) => {
  isEdit.value = true
  editData.value = cat
  isModalOpen.value = true
}

const handleDelete = async (id: string) => {
  if (confirm('Apakah Anda yakin ingin menghapus kategori pengeluaran ini?')) {
    try {
      await deleteExpenseCategory(id)
      showToast('Expense category deleted successfully')
    } catch (err) {
      console.error('Failed to delete expense category:', err)
      alert('Failed to delete expense category')
    }
  }
}

const handleSubmit = async (formData: ExpenseCategoryFormData) => {
  try {
    const res = await saveExpenseCategory(formData)
    showToast(res?.message || 'Expense category saved successfully')
    isModalOpen.value = false
  } catch (err) {
    console.error('Failed to save expense category:', err)
    alert('Failed to save expense category')
  }
}

const printTable = () => {
  window.print()
}

const exportPdf = () => {
  showToast('Exporting Expense Categories to PDF...')
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
          <h4 class="fw-bold mb-1">Expense Categories / Kategori Biaya</h4>
          <h6 class="text-muted mb-0">Kelola bagan pos pengeluaran operasional dan biaya produksi</h6>
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
          <button type="button" class="btn btn-primary d-flex align-items-center gap-2" @click="handleAdd">
            <FeatherIcon name="plus-circle" size="18" />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      <div v-if="pending" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <PagesExpenseCategoryTable
        v-else
        :expense-categories="filteredList"
        :search-query="searchQuery"
        :filter-status="filterStatus"
        @update:search-query="searchQuery = $event"
        @update:filter-status="filterStatus = $event"
        @add-category="handleAdd"
        @edit-category="handleEdit"
        @delete-category="handleDelete"
        @export-pdf="exportPdf"
        @print-table="printTable"
        @refresh="refresh"
      />
    </div>

    <PagesExpenseCategoryModal
      :is-open="isModalOpen"
      :is-edit="isEdit"
      :edit-data="editData"
      @close="isModalOpen = false"
      @submit="handleSubmit"
    />
  </div>
</template>
