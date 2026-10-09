<script setup lang="ts">
import type { IncomeRecord, IncomeFormData } from '~/types/income'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import PagesIncomeModal from '~/components/income/IncomeModal.vue'
import PagesIncomeTable from '~/components/income/IncomeTable.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import { incomePrintColumns } from '~/utils/financeUi'
import { tableFilterControlClass } from '~/utils/salesUi'

definePageMeta({ layout: 'default' })
useLegacyPage({ title: 'Income - Pemasukan Keuangan', sweetAlert: true })

const { incomes, pending, refresh, saveIncome, deleteIncome } = useIncomes()
const { accounts: bankAccounts } = useBankAccounts()
const activeBankAccounts = computed(() => bankAccounts.value.filter((account) => account.status === 'Active'))

const searchQuery = ref('')
const categoryFilter = ref('')
const feedbackMsg = ref('')

const isModalOpen = ref(false)
const editData = ref<IncomeRecord | null>(null)
const isViewOnly = ref(false)

const isDeleteConfirmOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)

const categoriesList = computed(() => {
  const cats = new Set<string>(['Penjualan Jasa Cetak', 'Pendapatan Lain-lain', 'DP Cetak Offset', 'Pelunasan Invoice'])
  incomes.value.forEach((inc) => { if (inc.category) cats.add(inc.category) })
  return Array.from(cats)
})

const filteredIncomes = computed(() => {
  return incomes.value.filter((inc) => {
    const matchesSearch = !searchQuery.value ||
      inc.no?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      inc.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      inc.notes?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !categoryFilter.value || inc.category === categoryFilter.value
    return matchesSearch && matchesCategory
  })
})

const print = useTablePrint()

const openAddModal = () => { editData.value = null; isViewOnly.value = false; isModalOpen.value = true }
const handleView = (item: IncomeRecord) => { editData.value = item; isViewOnly.value = true; isModalOpen.value = true }
const handleEdit = (item: IncomeRecord) => { editData.value = item; isViewOnly.value = false; isModalOpen.value = true }
const handleDelete = (id: string) => { deleteTargetId.value = id; isDeleteConfirmOpen.value = true }

const confirmDelete = async () => {
  if (!deleteTargetId.value) return
  isDeleting.value = true
  try {
    await deleteIncome(deleteTargetId.value)
    feedbackMsg.value = 'Catatan pemasukan berhasil dihapus'
    isDeleteConfirmOpen.value = false
    deleteTargetId.value = null
  } catch (error: any) {
    feedbackMsg.value = error?.message || 'Gagal menghapus pemasukan'
  } finally {
    isDeleting.value = false
  }
}

const handleSave = async (formData: IncomeFormData) => {
  try {
    await saveIncome(formData)
    feedbackMsg.value = 'Catatan pemasukan berhasil disimpan'
    isModalOpen.value = false
  } catch (error: any) {
    feedbackMsg.value = error?.message || 'Gagal menyimpan pemasukan'
  }
}

const printTable = () => {
  print.openPrintModal({
    title: 'Income Report',
    subtitle: 'Daftar arus kas masuk dan pendapatan',
    columns: incomePrintColumns,
    rows: filteredIncomes.value,
    action: 'print'
  })
}
</script>

<template>
  <div class="dulank-page dulank-page-income space-y-4 p-4 md:p-6">
    <SalesListHeader
      title="Income / Pemasukan"
      subtitle="Kelola dan pantau seluruh arus kas masuk dari penjualan & transaksi"
      add-label="Add Income"
      @add="openAddModal"
      @refresh="refresh"
      @print="printTable"
    />

    <SalesFeedback :pending="pending" skeleton="table" :message="feedbackMsg" @retry="refresh" @dismiss="feedbackMsg = ''" />

    <div v-if="!pending" class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="relative w-full max-w-sm">
          <FeatherIcon name="search" size="14" class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari sumber pemasukan, no transaksi, catatan..."
            class="h-9 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm text-gray-900 focus:border-primary-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>
        <div class="flex items-center gap-2">
          <select v-model="categoryFilter" :class="tableFilterControlClass">
            <option value="">Semua Kategori</option>
            <option v-for="cat in categoriesList" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
      </div>

      <PagesIncomeTable :incomes="filteredIncomes" @view="handleView" @edit="handleEdit" @delete="handleDelete" />
    </div>

    <PagesIncomeModal :is-open="isModalOpen" :edit-data="editData" :view-only="isViewOnly" :categories="categoriesList" :accounts="activeBankAccounts" @close="isModalOpen = false" @save="handleSave" />
    <SalesConfirmDelete :open="isDeleteConfirmOpen" title="Hapus Catatan Pemasukan" message="Apakah Anda yakin ingin menghapus catatan pemasukan ini? Tindakan ini tidak dapat dibatalkan." :busy="isDeleting" @cancel="isDeleteConfirmOpen = false" @confirm="confirmDelete" />
    <DocumentPrintModal :open="print.isPrintModalOpen.value" :title="print.printTitle.value" :subtitle="print.printSubtitle.value" :columns="print.printColumns.value" :rows="print.printRows.value" :default-action="print.defaultPrintAction.value" date-field="date" @close="print.closePrintModal" />
  </div>
</template>
