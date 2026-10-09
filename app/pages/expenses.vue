<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Expenses" subtitle="Manage your expenses">
      <template #actions>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Export PDF"
            @click="printList"
          >
            <CommonFeatherIcon name="file-text" size="18" />
          </button>
          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Print"
            @click="printList"
          >
            <CommonFeatherIcon name="printer" size="18" />
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
            @click="openAddModal"
          >
            <CommonFeatherIcon name="plus" size="18" />
            <span>Add New Expense</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-3">
          <CommonSearchFilter v-model="searchQuery" placeholder="Search expense..." />

          <!-- Date Range Picker (custom) -->
          <div class="relative">
            <input
              type="text"
              readonly
              placeholder="Date"
              :value="selectedDateRangeLabel"
              class="w-full h-10 cursor-pointer rounded-lg border border-gray-200 bg-white px-3 pe-4 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              @click="showDateDropdown = !showDateDropdown"
            />
            <div
              v-if="showDateDropdown"
              class="absolute z-20 mt-1 w-48 rounded-lg border border-gray-200 bg-white p-1.5 shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <div class="cursor-pointer rounded px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700" @click="setDateRange('kemarin')">Kemarin</div>
              <div class="cursor-pointer rounded px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700" @click="setDateRange('7hari')">7 Hari Terakhir</div>
              <div class="cursor-pointer rounded px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700" @click="setDateRange('bulanIni')">Bulan Ini</div>
              <div class="cursor-pointer rounded px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700" @click="setDateRange('bulanLalu')">Bulan Lalu</div>
              <div class="cursor-pointer rounded px-2.5 py-1.5 text-xs text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700" @click="setDateRange('tahunLalu')">Tahun Lalu</div>
              <div class="cursor-pointer rounded px-2.5 py-1.5 text-xs text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" @click="setDateRange('semua')">Semua</div>
            </div>
          </div>
        </div>

        <CommonFilterSelect
          v-model="statusFilter"
          allLabel="Status: All"
          :options="[
            { value: 'Paid', label: 'Paid' },
            { value: 'Unpaid', label: 'Unpaid' },
            { value: 'Partial', label: 'Partial' },
            { value: 'Canceled', label: 'Canceled' },
          ]"
        />
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs text-gray-700 dark:text-gray-300">
          <thead
            class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 border-b border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400"
          >
            <tr>
              <th class="px-4 py-3 text-start whitespace-nowrap">No Expense</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Date</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Category</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Name</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Amount (IDR)</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Paid (IDR)</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Due (IDR)</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Description</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredExpenses" :key="item.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">{{ item.noExpense }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.date }}</td>
              <td class="px-4 py-3 whitespace-nowrap">{{ item.category }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-medium">{{ item.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="item.status" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-end font-semibold">{{ formatNumber(item.amount) }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end text-emerald-600 dark:text-emerald-400">{{ formatNumber(item.paid) }}</td>
              <td :class="item.due > 0 ? 'px-4 py-3 whitespace-nowrap text-end text-rose-600 dark:text-rose-400' : 'px-4 py-3 whitespace-nowrap text-end text-gray-400'">
                {{ formatNumber(item.due) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400 max-w-[220px] truncate">{{ item.description }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end">
                <CommonRowActions :item="item" show-view @view="viewExpense(item)" @edit="openEditModal(item)" @delete="deleteExpense(item)" />
              </td>
            </tr>
            <tr v-if="filteredExpenses.length === 0">
              <td colspan="10" class="p-8 text-center text-gray-400">No expenses found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- View Expense Modal -->
    <CommonBaseModal v-model="showViewModal" title="Expense Details" maxWidth="md">
      <div v-if="selectedExpense" class="divide-y divide-gray-100 dark:divide-gray-800">
        <div class="flex items-center justify-between py-2.5">
          <span class="font-semibold text-gray-800 dark:text-gray-200">No Expense</span>
          <span class="text-gray-700 dark:text-gray-300">{{ selectedExpense.noExpense }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="font-semibold text-gray-800 dark:text-gray-200">Category</span>
          <span class="text-gray-700 dark:text-gray-300">{{ selectedExpense.category }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="font-semibold text-gray-800 dark:text-gray-200">Date</span>
          <span class="text-gray-700 dark:text-gray-300">{{ selectedExpense.date }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="font-semibold text-gray-800 dark:text-gray-200">Name / Vendor</span>
          <span class="text-gray-700 dark:text-gray-300">{{ selectedExpense.name }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="font-semibold text-gray-800 dark:text-gray-200">Amount</span>
          <span class="font-bold text-gray-800 dark:text-gray-200">Rp {{ formatNumber(selectedExpense.amount) }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="font-semibold text-gray-800 dark:text-gray-200">Paid</span>
          <span class="text-emerald-600 dark:text-emerald-400">Rp {{ formatNumber(selectedExpense.paid) }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="font-semibold text-gray-800 dark:text-gray-200">Due</span>
          <span class="text-rose-600 dark:text-rose-400">Rp {{ formatNumber(selectedExpense.due) }}</span>
        </div>
        <div class="flex items-center justify-between py-2.5">
          <span class="font-semibold text-gray-800 dark:text-gray-200">Status</span>
          <CommonStatusPill :status="selectedExpense.status" />
        </div>
        <div class="py-2.5">
          <span class="font-semibold text-gray-800 dark:text-gray-200">Description</span>
          <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ selectedExpense.description }}</div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="showViewModal = false"
          >
            Close
          </button>
        </div>
      </template>
    </CommonBaseModal>

    <!-- Add/Edit Expense Modal -->
    <CommonBaseModal v-model="showModal" :title="isEdit ? 'Edit Expense' : 'Add New Expense'" maxWidth="lg">
      <form @submit.prevent="saveExpense" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Expense Category" required>
            <select
              v-model="formData.category"
              required
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option>Biaya Gaji & Upah</option>
              <option>Bahan Baku Utama</option>
              <option>Perawatan Mesin</option>
              <option>Biaya Listrik & Air</option>
              <option>Sewa & Properti</option>
              <option>Biaya Pemasaran</option>
              <option>Transportasi & Kurir</option>
              <option>Alat Tulis Kantor (ATK)</option>
              <option>Biaya Lain-lain</option>
            </select>
          </CommonFormField>
          <CommonFormField label="Expense Date" required>
            <input
              type="date"
              v-model="formData.date"
              required
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <CommonFormField label="Name / Vendor" required>
            <input
              type="text"
              v-model="formData.name"
              required
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </CommonFormField>
          <CommonFormField label="Status">
            <select
              v-model="formData.status"
              @change="recalcDue"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <option>Paid</option>
              <option>Unpaid</option>
              <option>Partial</option>
              <option>Canceled</option>
            </select>
          </CommonFormField>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <CommonFormField label="Amount (IDR)" required>
            <input
              type="number"
              v-model.number="formData.amount"
              @input="recalcDue"
              required
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </CommonFormField>
          <CommonFormField label="Paid (IDR)">
            <input
              type="number"
              v-model.number="formData.paid"
              @input="recalcDue"
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </CommonFormField>
          <CommonFormField label="Due (IDR)">
            <input
              type="number"
              v-model.number="formData.due"
              readonly
              class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            />
          </CommonFormField>
        </div>
        <CommonFormField label="Description">
          <textarea
            rows="3"
            v-model="formData.description"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          ></textarea>
        </CommonFormField>
        <CommonModalFooter @cancel="showModal = false" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { formatNumber } from "~/composables/useFormatters";

const { data: expensesData } = await useFetch<any[]>('/api/expenses')
const expenses = ref<any[]>(expensesData.value ?? [])
useMockSync('expenses', expenses)

const searchQuery = ref("");
const statusFilter = ref("");
const selectedDateRangeLabel = ref("");
const showDateDropdown = ref(false);

const setDateRange = (range: string) => {
  if (range === "kemarin") selectedDateRangeLabel.value = "Kemarin";
  else if (range === "7hari") selectedDateRangeLabel.value = "7 Hari Terakhir";
  else if (range === "bulanIni") selectedDateRangeLabel.value = "Bulan Ini";
  else if (range === "bulanLalu") selectedDateRangeLabel.value = "Bulan Lalu";
  else if (range === "tahunLalu") selectedDateRangeLabel.value = "Tahun Lalu";
  else selectedDateRangeLabel.value = "";
  showDateDropdown.value = false;
};

const filteredExpenses = computed(() => {
  return expenses.value.filter((exp) => {
    const q = searchQuery.value.toLowerCase();
    const matchesSearch =
      !q ||
      exp.noExpense.toLowerCase().includes(q) ||
      exp.category.toLowerCase().includes(q) ||
      exp.name.toLowerCase().includes(q) ||
      exp.description.toLowerCase().includes(q);

    const matchesStatus = !statusFilter.value || exp.status.toLowerCase() === statusFilter.value.toLowerCase();
    return matchesSearch && matchesStatus;
  });
});

const showModal = ref(false);
const isEdit = ref(false);
const formData = ref<any>({});

const showViewModal = ref(false);
const selectedExpense = ref<any>(null);

const recalcDue = () => {
  if (formData.value.status === "Paid") {
    formData.value.paid = formData.value.amount;
    formData.value.due = 0;
  } else if (formData.value.status === "Unpaid") {
    formData.value.paid = 0;
    formData.value.due = formData.value.amount;
  } else {
    formData.value.due = Math.max(0, (formData.value.amount || 0) - (formData.value.paid || 0));
  }
};

const openAddModal = () => {
  isEdit.value = false;
  formData.value = {
    noExpense: `EX${String(expenses.value.length + 1).padStart(6, "0")}`,
    date: new Date().toISOString().slice(0, 10),
    category: "Biaya Gaji & Upah",
    name: "",
    status: "Paid",
    amount: 0,
    paid: 0,
    due: 0,
    description: "",
  };
  showModal.value = true;
};

const openEditModal = (item: any) => {
  isEdit.value = true;
  formData.value = { ...item };
  showModal.value = true;
};

const viewExpense = (item: any) => {
  selectedExpense.value = item;
  showViewModal.value = true;
};

const saveExpense = () => {
  recalcDue();
  if (isEdit.value) {
    const idx = expenses.value.findIndex((e) => e.id === formData.value.id);
    if (idx !== -1) {
      expenses.value[idx] = { ...formData.value };
    }
  } else {
    expenses.value.unshift({
      id: Date.now(),
      ...formData.value,
    });
  }
  showModal.value = false;
};

const deleteExpense = (item: any) => {
  if (confirm(`Are you sure you want to delete ${item.noExpense}?`)) {
    expenses.value = expenses.value.filter((e) => e.id !== item.id);
  }
};

const printList = () => {
  window.print();
};
</script>
=======
<script setup lang="ts">
import type { Expense, ExpenseFormData } from '~/types/expense'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import PagesExpenseModal from '~/components/expenses/ExpenseModal.vue'
import PagesExpenseTable from '~/components/expenses/ExpenseTable.vue'
import { formatIDR } from '~/utils/currency'

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
const { accounts: bankAccounts } = useBankAccounts()
const activeBankAccounts = computed(() => bankAccounts.value.filter((account) => account.status === 'Active'))
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

const print = useTablePrint()
const printColumns = [
  { key: 'noExpense', label: 'No Expense' },
  { key: 'date', label: 'Date' },
  { key: 'name', label: 'Expense' },
  { key: 'category', label: 'Category' },
  { key: 'amount', label: 'Amount (IDR)', align: 'right' as const, format: (value: number) => formatIDR(value) },
  { key: 'paid', label: 'Paid (IDR)', align: 'right' as const, format: (value: number) => formatIDR(value) },
  { key: 'due', label: 'Due (IDR)', align: 'right' as const, format: (value: number) => formatIDR(value) },
  { key: 'status', label: 'Status' }
]

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
  print.openPrintModal({
    title: 'Expense Report',
    subtitle: 'Daftar pengeluaran operasional dan produksi',
    columns: printColumns,
    rows: filteredExpenses.value,
    action: 'print'
  })
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
      :accounts="activeBankAccounts"
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
