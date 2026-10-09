<script setup lang="ts">
import type { Expense, ExpenseFormData } from '~/types/expense'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import PagesExpenseModal from '~/components/expenses/ExpenseModal.vue'
import PagesExpenseTable from '~/components/expenses/ExpenseTable.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import { expensePrintColumns } from '~/utils/financeUi'
import { tableFilterControlClass } from '~/utils/salesUi'

definePageMeta({ layout: 'default' })
useLegacyPage({ title: 'Expenses - Pengeluaran Keuangan', sweetAlert: true })

const { expenses, pending, refresh, saveExpense, deleteExpense } = useExpenses()
const { accounts: bankAccounts } = useBankAccounts()
const activeBankAccounts = computed(() => bankAccounts.value.filter((account) => account.status === 'Active'))
const { expenseCategories } = useExpenseCategories()

const searchQuery = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')
const feedbackMsg = ref('')

const isModalOpen = ref(false)
const editData = ref<Expense | null>(null)
const isViewOnly = ref(false)

const isDeleteConfirmOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)

const categoriesList = computed(() => expenseCategories.value.map((c) => c.categoryName))

const filteredExpenses = computed(() => {
  return expenses.value.filter((e) => {
    const matchesSearch = !searchQuery.value ||
      e.noExpense?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      e.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      e.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || e.status === statusFilter.value
    const matchesCategory = !categoryFilter.value || e.category === categoryFilter.value
    return matchesSearch && matchesStatus && matchesCategory
  })
})

const print = useTablePrint()

const openAddModal = () => { editData.value = null; isViewOnly.value = false; isModalOpen.value = true }
const handleView = (e: Expense) => { editData.value = e; isViewOnly.value = true; isModalOpen.value = true }
const handleEdit = (e: Expense) => { editData.value = e; isViewOnly.value = false; isModalOpen.value = true }
const handleDelete = (id: string) => { deleteTargetId.value = id; isDeleteConfirmOpen.value = true }

const confirmDelete = async () => {
  if (!deleteTargetId.value) return
  isDeleting.value = true
  try {
    await deleteExpense(deleteTargetId.value)
    feedbackMsg.value = 'Catatan pengeluaran berhasil dihapus'
    isDeleteConfirmOpen.value = false
    deleteTargetId.value = null
  } catch (error: any) {
    feedbackMsg.value = error?.message || 'Gagal menghapus pengeluaran'
  } finally {
    isDeleting.value = false
  }
}

const handleSave = async (formData: ExpenseFormData) => {
  try {
    await saveExpense(formData)
    feedbackMsg.value = 'Data pengeluaran berhasil disimpan'
    isModalOpen.value = false
  } catch (error: any) {
    feedbackMsg.value = error?.message || 'Gagal menyimpan pengeluaran'
  }
}

const printList = () => {
  print.openPrintModal({
    title: 'Expense Report',
    subtitle: 'Daftar pengeluaran operasional dan produksi',
    columns: expensePrintColumns,
    rows: filteredExpenses.value,
    action: 'print'
  })
}
</script>

<template>
  <div class="dulank-page dulank-page-expenses space-y-4 p-4 md:p-6">
    <SalesListHeader
      title="Expenses / Pengeluaran"
      subtitle="Kelola dan pantau seluruh pengeluaran operasional dan produksi"
      add-label="Add New Expense"
      @add="openAddModal"
      @refresh="refresh"
      @print="printList"
    />

    <SalesFeedback :pending="pending" skeleton="table" :message="feedbackMsg" @retry="refresh" @dismiss="feedbackMsg = ''" />

    <div v-if="!pending" class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="relative w-full max-w-sm">
          <FeatherIcon name="search" size="14" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari pengeluaran, vendor, no transaksi..."
            class="h-9 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-900 focus:border-primary-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <select v-model="categoryFilter" :class="tableFilterControlClass">
            <option value="">Semua Kategori</option>
            <option v-for="cat in categoriesList" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          <select v-model="statusFilter" :class="tableFilterControlClass">
            <option value="">Semua Status</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Partial">Partial</option>
            <option value="Canceled">Canceled</option>
          </select>
        </div>
      </div>

      <PagesExpenseTable :expenses="filteredExpenses" @view="handleView" @edit="handleEdit" @delete="handleDelete" />
    </div>

    <PagesExpenseModal :is-open="isModalOpen" :edit-data="editData" :view-only="isViewOnly" :categories="categoriesList" :accounts="activeBankAccounts" @close="isModalOpen = false" @save="handleSave" />
    <SalesConfirmDelete :open="isDeleteConfirmOpen" title="Hapus Data Pengeluaran" message="Apakah Anda yakin ingin menghapus catatan pengeluaran ini? Tindakan ini tidak dapat dibatalkan." :busy="isDeleting" @cancel="isDeleteConfirmOpen = false" @confirm="confirmDelete" />
    <DocumentPrintModal :open="print.isPrintModalOpen.value" :title="print.printTitle.value" :subtitle="print.printSubtitle.value" :columns="print.printColumns.value" :rows="print.printRows.value" :default-action="print.defaultPrintAction.value" date-field="date" @close="print.closePrintModal" />
  </div>
</template>
