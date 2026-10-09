<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Income" subtitle="Manage your income">
      <template #actions>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Export PDF"
            @click="exportPdf"
          >
            <CommonFeatherIcon name="file-text" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Print"
            @click="printTable"
          >
            <CommonFeatherIcon name="printer" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Refresh"
            @click="refresh"
          >
            <CommonFeatherIcon name="rotate-ccw" size="18" />
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
            @click="openAddModal"
          >
            <CommonFeatherIcon name="plus" size="18" />
            <span>Add Income</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Income List Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search by name, no income, notes..." />
        <CommonFilterSelect
          v-model="filterCategory"
          allLabel="All Categories"
          :options="categoryList.map((c) => ({ value: c, label: c }))"
        />
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">Date</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">No Income</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Name</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Category</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Notes</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Amount (IDR)</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredIncomes" :key="item.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap">{{ item.date }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-semibold text-primary">{{ item.no }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100">{{ item.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span class="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  {{ item.category }}
                </span>
              </td>
              <td class="max-w-[250px] truncate px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ item.notes }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-semibold">{{ formatNumber(item.amount) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end">
                <CommonRowActions :item="item" show-view @view="openViewModal(item)" @edit="openEditModal(item)" @delete="deleteItem(item.id)" />
              </td>
            </tr>
            <tr v-if="filteredIncomes.length === 0">
              <td colspan="7" class="p-8 text-center text-gray-400">No income records found.</td>
            </tr>
          </tbody>
          <tfoot class="border-t-2 border-gray-200 bg-gray-50/75 font-semibold text-gray-800 dark:border-gray-700 dark:bg-gray-800/60 dark:text-white">
            <tr>
              <td class="px-4 py-3 text-start">Total</td>
              <td class="px-4 py-3" colspan="4"></td>
              <td class="px-4 py-3 text-end font-bold text-emerald-600 dark:text-emerald-400">{{ formatNumber(totalAmount) }}</td>
              <td class="px-4 py-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Add Income Modal -->
    <CommonBaseModal v-model="showAddModal" title="Add New Income" maxWidth="md">
      <form @submit.prevent="saveIncome" class="space-y-4">
        <CommonFormField label="Income Category" required>
          <select v-model="formData.category" class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" required>
            <option value="">Choose</option>
            <option v-for="cat in categoryList" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </CommonFormField>
        <CommonFormField label="Date" required>
          <input
            v-model="formData.date"
            type="date"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
          />
        </CommonFormField>
        <CommonFormField label="Name / Payer" required>
          <input
            v-model="formData.name"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="Enter name"
            required
          />
        </CommonFormField>
        <CommonFormField label="Amount (IDR)" required>
          <input
            v-model.number="formData.amount"
            type="number"
            min="0"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="Enter amount"
            required
          />
        </CommonFormField>
        <CommonFormField label="Payment Method">
          <select
            v-model="formData.paymentMethod"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="Transfer Bank">Transfer Bank</option>
            <option value="Tunai / Cash">Tunai / Cash</option>
            <option value="QRIS">QRIS</option>
          </select>
        </CommonFormField>
        <CommonFormField label="Bank Account">
          <input
            v-model="formData.bankAccount"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="e.g. Mandiri 1320009982282"
          />
        </CommonFormField>
        <CommonFormField label="Notes / Description">
          <textarea
            v-model="formData.notes"
            rows="3"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            placeholder="Enter note here..."
          ></textarea>
        </CommonFormField>
        <CommonModalFooter @cancel="closeModal" />
      </form>
    </CommonBaseModal>

    <!-- Edit Income Modal -->
    <CommonBaseModal v-model="showEditModal" title="Edit Income" maxWidth="md">
      <form @submit.prevent="updateIncome" class="space-y-4">
        <CommonFormField label="Income Category" required>
          <select v-model="formData.category" class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200" required>
            <option v-for="cat in categoryList" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </CommonFormField>
        <CommonFormField label="Date" required>
          <input
            v-model="formData.date"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
          />
        </CommonFormField>
        <CommonFormField label="Name" required>
          <input
            v-model="formData.name"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
          />
        </CommonFormField>
        <CommonFormField label="Amount (IDR)" required>
          <input
            v-model.number="formData.amount"
            type="number"
            min="0"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
          />
        </CommonFormField>
        <CommonFormField label="Notes">
          <textarea
            v-model="formData.notes"
            rows="3"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          ></textarea>
        </CommonFormField>
        <div class="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-800">
          <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">Cancel Transaction</span>
          <button
            type="button"
            :class="[
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
              formData.isCancelled ? 'bg-rose-500' : 'bg-gray-300 dark:bg-gray-700',
            ]"
            @click="formData.isCancelled = !formData.isCancelled"
          >
            <span :class="['pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out', formData.isCancelled ? 'translate-x-5' : 'translate-x-0']" />
          </button>
        </div>
        <CommonModalFooter @cancel="closeModal" />
      </form>
    </CommonBaseModal>

    <!-- View Income Modal -->
    <CommonBaseModal v-model="showViewModal" :title="`View Income - ${viewingItem?.no ?? ''}`" maxWidth="md">
      <div v-if="viewingItem" class="divide-y divide-gray-100 dark:divide-gray-800">
        <div class="flex items-center justify-between py-2.5">
          <span class="font-semibold text-gray-800 dark:text-gray-200">Income Category</span>
          <span class="text-gray-700 dark:text-gray-300">{{ viewingItem.category }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="font-semibold text-gray-800 dark:text-gray-200">Date</span>
          <span class="text-gray-700 dark:text-gray-300">{{ viewingItem.date }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="font-semibold text-gray-800 dark:text-gray-200">Amount</span>
          <span class="font-bold text-emerald-600 dark:text-emerald-400">Rp {{ formatNumber(viewingItem.amount) }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="font-semibold text-gray-800 dark:text-gray-200">Payment Method</span>
          <span class="text-gray-700 dark:text-gray-300">{{ viewingItem.paymentMethod || 'Transfer Bank' }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="font-semibold text-gray-800 dark:text-gray-200">Bank Account</span>
          <span class="text-gray-700 dark:text-gray-300">{{ viewingItem.bankAccount || 'BCA 8830129841' }}</span>
        </div>
        <div class="py-2.5">
          <span class="font-semibold text-gray-800 dark:text-gray-200">Notes</span>
          <div class="mt-1 rounded-lg bg-gray-50 p-2 text-sm text-gray-500 dark:bg-gray-800/40 dark:text-gray-400">{{ viewingItem.notes || '-' }}</div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="closeModal"
          >
            Close
          </button>
        </div>
      </template>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">import { ref, computed } from 'vue'

useHead({
  title: 'Income - Kacetak System'
})

const categoryList = [
  'Penjualan Jasa Cetak',
  'Biaya Pengiriman',
  'Jasa Desain',
  'Penjualan Limbah Kertas',
  'Penjualan Plat Offset Bekas'
]

const { data: incomeData } = await useFetch<IncomeRecord[]>('/api/income')
const incomes = ref<IncomeRecord[]>(incomeData.value ?? [])
useMockSync('income', incomes)

const searchQuery = ref('')
const filterCategory = ref('')

const filteredIncomes = computed(() => {
  return incomes.value.filter(item => {
    const q = searchQuery.value.toLowerCase()
    const matchSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.no.toLowerCase().includes(q) ||
      item.notes.toLowerCase().includes(q)
    const matchCat = !filterCategory.value || item.category === filterCategory.value
    return matchSearch && matchCat
  })
})

const totalAmount = computed(() => {
  return filteredIncomes.value.reduce((acc, curr) => acc + (curr.amount || 0), 0)
})

const formatNumber = (val: number) => {
  return new Intl.NumberFormat('id-ID').format(val || 0)
}

const showAddModal = ref(false)
const showEditModal = ref(false)
const showViewModal = ref(false)
const editingId = ref<number | null>(null)
const viewingItem = ref<IncomeRecord | null>(null)

const defaultFormData = () => ({
  date: new Date().toISOString().split('T')[0],
  name: '',
  category: 'Penjualan Jasa Cetak',
  notes: '',
  amount: 0,
  paymentMethod: 'Transfer Bank',
  bankAccount: '',
  isCancelled: false
})

const formData = ref(defaultFormData())

const openAddModal = () => {
  formData.value = defaultFormData()
  showAddModal.value = true
}

const openEditModal = (item: IncomeRecord) => {
  editingId.value = item.id
  formData.value = {
    date: item.date,
    name: item.name,
    category: item.category,
    notes: item.notes,
    amount: item.amount,
    paymentMethod: item.paymentMethod || 'Transfer Bank',
    bankAccount: item.bankAccount || '',
    isCancelled: !!item.isCancelled
  }
  showEditModal.value = true
}

const openViewModal = (item: IncomeRecord) => {
  viewingItem.value = item
  showViewModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  showViewModal.value = false
  editingId.value = null
  viewingItem.value = null
}

const saveIncome = () => {
  const newId = Math.max(0, ...incomes.value.map(i => i.id)) + 1
  const count = incomes.value.length + 1
  const no = `IN${String(count).padStart(6, '0')}`
  incomes.value.unshift({
    id: newId,
    no,
    date: formData.value.date,
    name: formData.value.name,
    category: formData.value.category,
    notes: formData.value.notes,
    amount: formData.value.amount,
    paymentMethod: formData.value.paymentMethod,
    bankAccount: formData.value.bankAccount
  })
  closeModal()
}

const updateIncome = () => {
  if (editingId.value === null) return
  const idx = incomes.value.findIndex(i => i.id === editingId.value)
  if (idx !== -1) {
    incomes.value[idx] = {
      ...incomes.value[idx],
      date: formData.value.date,
      name: formData.value.name,
      category: formData.value.category,
      notes: formData.value.notes,
      amount: formData.value.amount,
      isCancelled: formData.value.isCancelled
    }
  }
  closeModal()
}

const deleteItem = (id: number) => {
  if (confirm('Are you sure you want to delete this income record?')) {
    incomes.value = incomes.value.filter(i => i.id !== id)
  }
}

const exportPdf = () => {
  window.print()
}

const printTable = () => {
  window.print()
}

const refresh = () => {
  searchQuery.value = ''
  filterCategory.value = ''
}

const toggleCollapse = () => {
  // collapsible header
}</script>
=======
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
>>>>>>> origin/eko
