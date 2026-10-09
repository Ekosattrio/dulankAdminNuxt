<script setup lang="ts">
import type { Expense, ExpenseFormData } from '~/types/expense'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import PagesExpenseModal from '~/components/expenses/ExpenseModal.vue'
import PagesExpenseTable from '~/components/expenses/ExpenseTable.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Expenses - Pengeluaran Keuangan',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

const { expenses, pending, refresh, saveExpense, deleteExpense } = useExpenses()
const { expenseCategories } = useExpenseCategories()

const searchQuery = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')

const isModalOpen = ref(false)
const editData = ref<Expense | null>(null)
const isViewOnly = ref(false)

const categoriesList = computed(() => expenseCategories.value.map((c) => c.categoryName))

const filteredExpenses = computed(() => {
  return expenses.value.filter((e) => {
    const matchesSearch =
      !searchQuery.value ||
      e.noExpense?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      e.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      e.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || e.status === statusFilter.value
    const matchesCategory = !categoryFilter.value || e.category === categoryFilter.value
    return matchesSearch && matchesStatus && matchesCategory
  })
})

const openAddModal = () => {
  editData.value = null
  isViewOnly.value = false
  isModalOpen.value = true
}

import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'

const isDeleteConfirmOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)

const handleView = (e: Expense) => {
  editData.value = e
  isViewOnly.value = true
  isModalOpen.value = true
}

const handleEdit = (e: Expense) => {
  editData.value = e
  isViewOnly.value = false
  isModalOpen.value = true
}

const handleDelete = (id: string) => {
  deleteTargetId.value = id
  isDeleteConfirmOpen.value = true
}

const confirmDelete = async () => {
  if (!deleteTargetId.value) return
  isDeleting.value = true
  try {
    await deleteExpense(deleteTargetId.value)
    isDeleteConfirmOpen.value = false
    deleteTargetId.value = null
  } catch (error) {
    console.error('Failed to delete expense:', error)
  } finally {
    isDeleting.value = false
  }
}

const handleSave = async (formData: ExpenseFormData) => {
  try {
    await saveExpense(formData)
    isModalOpen.value = false
  } catch (error) {
    console.error('Failed to save expense:', error)
  }
}

const printList = () => {
  window.print()
}
</script>

<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div class="page-title">
          <h4 class="fw-bold mb-1">Expenses / Pengeluaran</h4>
          <h6 class="text-muted mb-0">Kelola dan pantau seluruh pengeluaran operasional dan produksi</h6>
        </div>
        <div class="d-flex align-items-center gap-2">
          <ul class="table-top-head d-flex align-items-center list-unstyled gap-2 mb-0">
            <li>
              <button type="button" class="btn btn-outline-secondary btn-sm" title="Print" @click="printList">
                <FeatherIcon name="printer" size="16" />
              </button>
            </li>
            <li>
              <button type="button" class="btn btn-outline-secondary btn-sm" title="Refresh" @click="refresh">
                <FeatherIcon name="rotate-cw" size="16" />
              </button>
            </li>
          </ul>
          <button type="button" class="btn btn-primary d-flex align-items-center gap-2" @click="openAddModal">
            <FeatherIcon name="plus-circle" size="18" />
            <span>Add New Expense</span>
          </button>
        </div>
      </div>

      <div class="card border-0 shadow-sm rounded-3">
        <div class="card-body p-4">
          <div class="row g-3 justify-content-between align-items-center mb-4">
            <div class="col-md-4">
              <div class="input-group">
                <span class="input-group-text bg-white border-end-0">
                  <FeatherIcon name="search" size="14" />
                </span>
                <input
                  v-model="searchQuery"
                  type="text"
                  class="form-control border-start-0 ps-0"
                  placeholder="Cari pengeluaran, vendor, no transaksi..."
                />
              </div>
            </div>
            <div class="col-md-6 d-flex justify-content-md-end gap-2 flex-wrap">
              <select v-model="categoryFilter" class="form-select form-select-sm" style="width: auto">
                <option value="">Semua Kategori</option>
                <option v-for="cat in categoriesList" :key="cat" :value="cat">{{ cat }}</option>
              </select>

              <select v-model="statusFilter" class="form-select form-select-sm" style="width: auto">
                <option value="">Semua Status</option>
                <option value="Paid">Paid</option>
                <option value="Unpaid">Unpaid</option>
                <option value="Partial">Partial</option>
                <option value="Canceled">Canceled</option>
              </select>
            </div>
          </div>

          <div v-if="pending" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <PagesExpenseTable
            v-else
            :expenses="filteredExpenses"
            @view="handleView"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>
      </div>
    </div>

    <PagesExpenseModal
      :is-open="isModalOpen"
      :edit-data="editData"
      :view-only="isViewOnly"
      :categories="categoriesList"
      @close="isModalOpen = false"
      @save="handleSave"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteConfirmOpen"
      title="Hapus Data Pengeluaran"
      message="Apakah Anda yakin ingin menghapus catatan pengeluaran ini? Tindakan ini tidak dapat dibatalkan."
      :busy="isDeleting"
      @cancel="isDeleteConfirmOpen = false"
      @confirm="confirmDelete"
    />
  </div>
</template>
