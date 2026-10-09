<script setup lang="ts">
import type { ExpenseCategory, ExpenseCategoryFormData } from '~/types/expense-category'
import PagesExpenseCategoryModal from '~/components/expense-category/ExpenseCategoryModal.vue'
import PagesExpenseCategoryTable from '~/components/expense-category/ExpenseCategoryTable.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import { expenseCategoryPrintColumns } from '~/utils/financeUi'

definePageMeta({ layout: 'default' })
useLegacyPage({ title: 'Expense Categories - Kategori Pengeluaran', sweetAlert: true })

const { expenseCategories, pending, refresh, saveExpenseCategory, deleteExpenseCategory } = useExpenseCategories()

const searchQuery = ref('')
const filterStatus = ref('')
const feedbackMsg = ref('')

const isModalOpen = ref(false)
const isEdit = ref(false)
const editData = ref<ExpenseCategory | null>(null)

const isDeleteConfirmOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)

const filteredList = computed(() => {
  return expenseCategories.value.filter((cat) => {
    const matchesSearch = !searchQuery.value ||
      cat.categoryName?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      cat.code?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !filterStatus.value || cat.status === filterStatus.value
    return matchesSearch && matchesStatus
  })
})

const print = useTablePrint()

const handleAdd = () => { isEdit.value = false; editData.value = null; isModalOpen.value = true }
const handleEdit = (cat: ExpenseCategory) => { isEdit.value = true; editData.value = cat; isModalOpen.value = true }
const handleDelete = (id: string) => { deleteTargetId.value = id; isDeleteConfirmOpen.value = true }

const confirmDelete = async () => {
  if (!deleteTargetId.value) return
  isDeleting.value = true
  try {
    await deleteExpenseCategory(deleteTargetId.value)
    feedbackMsg.value = 'Kategori pengeluaran berhasil dihapus'
    isDeleteConfirmOpen.value = false
    deleteTargetId.value = null
  } catch (err: any) {
    feedbackMsg.value = err?.message || 'Gagal menghapus kategori pengeluaran'
  } finally {
    isDeleting.value = false
  }
}

const handleSubmit = async (formData: ExpenseCategoryFormData) => {
  try {
    const res = await saveExpenseCategory(formData)
    feedbackMsg.value = res?.message || 'Kategori pengeluaran berhasil disimpan'
    isModalOpen.value = false
  } catch (err: any) {
    feedbackMsg.value = err?.message || 'Gagal menyimpan kategori pengeluaran'
  }
}

const printTable = () => {
  print.openPrintModal({
    title: 'Expense Categories',
    subtitle: 'Daftar kategori biaya operasional dan produksi',
    columns: expenseCategoryPrintColumns,
    rows: filteredList.value,
    action: 'print'
  })
}

const exportPdf = () => {
  print.openPrintModal({
    title: 'Expense Categories',
    subtitle: 'Daftar kategori biaya operasional dan produksi',
    columns: expenseCategoryPrintColumns,
    rows: filteredList.value,
    action: 'pdf'
  })
}
</script>

<template>
  <div class="dulank-page dulank-page-expense-category space-y-4 p-4 md:p-6">
    <SalesListHeader
      title="Expense Categories / Kategori Biaya"
      subtitle="Kelola bagan pos pengeluaran operasional dan biaya produksi"
      add-label="Add Category"
      @add="handleAdd"
      @refresh="refresh"
      @print="printTable"
      @pdf="exportPdf"
    />

    <SalesFeedback :pending="pending" skeleton="table" :message="feedbackMsg" @retry="refresh" @dismiss="feedbackMsg = ''" />

    <PagesExpenseCategoryTable
      v-if="!pending"
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

    <PagesExpenseCategoryModal :is-open="isModalOpen" :is-edit="isEdit" :edit-data="editData" @close="isModalOpen = false" @submit="handleSubmit" />
    <SalesConfirmDelete :open="isDeleteConfirmOpen" title="Hapus Kategori Pengeluaran" message="Apakah Anda yakin ingin menghapus kategori pengeluaran ini? Tindakan ini tidak dapat dibatalkan." :busy="isDeleting" @cancel="isDeleteConfirmOpen = false" @confirm="confirmDelete" />
    <DocumentPrintModal :open="print.isPrintModalOpen.value" :title="print.printTitle.value" :subtitle="print.printSubtitle.value" :columns="print.printColumns.value" :rows="print.printRows.value" :default-action="print.defaultPrintAction.value" date-field="date" @close="print.closePrintModal" />
  </div>
</template>
