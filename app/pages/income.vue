<script setup lang="ts">
import type { IncomeRecord, IncomeFormData } from '~/types/income'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import PagesIncomeModal from '~/components/income/IncomeModal.vue'
import PagesIncomeTable from '~/components/income/IncomeTable.vue'
import { formatIDR } from '~/utils/currency'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Income - Pemasukan Keuangan',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

const { incomes, pending, refresh, saveIncome, deleteIncome } = useIncomes()
const { accounts: bankAccounts } = useBankAccounts()
const activeBankAccounts = computed(() => bankAccounts.value.filter((account) => account.status === 'Active'))

const searchQuery = ref('')
const categoryFilter = ref('')

const isModalOpen = ref(false)
const editData = ref<IncomeRecord | null>(null)
const isViewOnly = ref(false)

const categoriesList = computed(() => {
  const cats = new Set<string>()
  cats.add('Penjualan Jasa Cetak')
  cats.add('Pendapatan Lain-lain')
  cats.add('DP Cetak Offset')
  cats.add('Pelunasan Invoice')
  incomes.value.forEach((inc) => {
    if (inc.category) cats.add(inc.category)
  })
  return Array.from(cats)
})

const filteredIncomes = computed(() => {
  return incomes.value.filter((inc) => {
    const matchesSearch =
      !searchQuery.value ||
      inc.no?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      inc.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      inc.notes?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !categoryFilter.value || inc.category === categoryFilter.value
    return matchesSearch && matchesCategory
  })
})

const print = useTablePrint()
const printColumns = [
  { key: 'no', label: 'No Income' },
  { key: 'date', label: 'Date' },
  { key: 'name', label: 'Income' },
  { key: 'category', label: 'Category' },
  { key: 'bankAccount', label: 'Bank Account' },
  { key: 'amount', label: 'Amount (IDR)', align: 'right' as const, format: (value: number) => formatIDR(value) },
  { key: 'notes', label: 'Notes' }
]

import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'

const isDeleteConfirmOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)

const openAddModal = () => {
  editData.value = null
  isViewOnly.value = false
  isModalOpen.value = true
}

const handleView = (item: IncomeRecord) => {
  editData.value = item
  isViewOnly.value = true
  isModalOpen.value = true
}

const handleEdit = (item: IncomeRecord) => {
  editData.value = item
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
    await deleteIncome(deleteTargetId.value)
    isDeleteConfirmOpen.value = false
    deleteTargetId.value = null
  } catch (error) {
    console.error('Failed to delete income:', error)
  } finally {
    isDeleting.value = false
  }
}

const handleSave = async (formData: IncomeFormData) => {
  try {
    await saveIncome(formData)
    isModalOpen.value = false
  } catch (error) {
    console.error('Failed to save income:', error)
  }
}

const printTable = () => {
  print.openPrintModal({
    title: 'Income Report',
    subtitle: 'Daftar arus kas masuk dan pendapatan',
    columns: printColumns,
    rows: filteredIncomes.value,
    action: 'print'
  })
}
</script>

<template>
  <div class="page-wrapper mt-3">
    <div class="content">
      <div class="page-header d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div class="page-title">
          <h4 class="fw-bold mb-1">Income / Pemasukan</h4>
          <h6 class="text-muted mb-0">Kelola dan pantau seluruh arus kas masuk dari penjualan & transaksi</h6>
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
          <button type="button" class="btn btn-primary d-flex align-items-center gap-2" @click="openAddModal">
            <FeatherIcon name="plus-circle" size="18" />
            <span>Add Income</span>
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
                  placeholder="Cari sumber pemasukan, no transaksi, catatan..."
                />
              </div>
            </div>
            <div class="col-md-4 d-flex justify-content-md-end gap-2">
              <select v-model="categoryFilter" class="form-select form-select-sm" style="width: auto">
                <option value="">Semua Kategori</option>
                <option v-for="cat in categoriesList" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
          </div>

          <div v-if="pending" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <PagesIncomeTable
            v-else
            :incomes="filteredIncomes"
            @view="handleView"
            @edit="handleEdit"
            @delete="handleDelete"
          />
        </div>
      </div>
    </div>

    <PagesIncomeModal
      :is-open="isModalOpen"
      :edit-data="editData"
      :view-only="isViewOnly"
      :categories="categoriesList"
      :accounts="activeBankAccounts"
      @close="isModalOpen = false"
      @save="handleSave"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteConfirmOpen"
      title="Hapus Catatan Pemasukan"
      message="Apakah Anda yakin ingin menghapus catatan pemasukan ini? Tindakan ini tidak dapat dibatalkan."
      :busy="isDeleting"
      @cancel="isDeleteConfirmOpen = false"
      @confirm="confirmDelete"
    />

    <DocumentPrintModal
      :open="print.isPrintModalOpen.value"
      :title="print.printTitle.value"
      :subtitle="print.printSubtitle.value"
      :columns="print.printColumns.value"
      :rows="print.printRows.value"
      :default-action="print.defaultPrintAction.value"
      date-field="date"
      @close="print.closePrintModal"
    />
  </div>
</template>
