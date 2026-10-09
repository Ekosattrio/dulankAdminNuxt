<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Expense Category" subtitle="Manage your expense categories">
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
            class="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:bg-gray-50 hover:text-primary dark:border-gray-700 dark:hover:bg-gray-800"
            title="Refresh"
            @click="refreshList"
          >
            <CommonFeatherIcon name="rotate-ccw" size="18" />
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
            @click="openAddModal"
          >
            <CommonFeatherIcon name="plus" size="18" />
            <span>Add Expense Category</span>
          </button>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Category List Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <!-- Toolbar -->
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-3">
          <CommonSearchFilter v-model="searchQuery" placeholder="Search category..." />

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
              <div class="cursor-pointer rounded px-2.5 py-1.5 text-xs text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" @click="setDateRange('semua')">Semua</div>
            </div>
          </div>
        </div>

        <CommonFilterSelect
          v-model="statusFilter"
          allLabel="Status: All"
          :options="[
            { value: 'Active', label: 'Active' },
            { value: 'Deactive', label: 'Deactive' },
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
              <th class="px-4 py-3 text-start whitespace-nowrap">No Category</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Category Name</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Description</th>
              <th class="px-4 py-3 text-center whitespace-nowrap">Used</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Created</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredCategories" :key="item.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">{{ item.code }}</td>
              <td class="px-4 py-3 whitespace-nowrap font-semibold text-gray-900 dark:text-gray-100">{{ item.name }}</td>
              <td class="max-w-[240px] truncate px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ item.description }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-center font-bold">{{ item.used }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="item.status" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ item.created }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-end">
                <CommonRowActions :item="item" @edit="openEditModal(item)" @delete="deleteCategory(item)" />
              </td>
            </tr>
            <tr v-if="filteredCategories.length === 0">
              <td colspan="7" class="p-8 text-center text-gray-400">No expense categories found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Category Modal -->
    <CommonBaseModal v-model="showModal" :title="isEdit ? 'Edit Expense Category' : 'Add Expense Category'" maxWidth="md">
      <form @submit.prevent="saveCategory" class="space-y-4">
        <CommonFormField label="Category Name" required>
          <input
            v-model="formData.name"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
          />
        </CommonFormField>
        <CommonFormField label="Description">
          <textarea
            v-model="formData.description"
            rows="3"
            class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          ></textarea>
        </CommonFormField>
        <CommonFormField label="Status">
          <select
            v-model="formData.status"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="Active">Active</option>
            <option value="Deactive">Deactive</option>
          </select>
        </CommonFormField>
        <CommonModalFooter :submit-label="isEdit ? 'Save Changes' : 'Submit'" @cancel="showModal = false" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const { data: expenseCategoryData } = await useFetch<any[]>('/api/expense-category')
const categories = ref(expenseCategoryData.value ?? []);

const searchQuery = ref("");
const statusFilter = ref("");
const selectedDateRangeLabel = ref("");
const showDateDropdown = ref(false);

const setDateRange = (range: string) => {
  if (range === "kemarin") selectedDateRangeLabel.value = "Kemarin";
  else if (range === "7hari") selectedDateRangeLabel.value = "7 Hari Terakhir";
  else if (range === "bulanIni") selectedDateRangeLabel.value = "Bulan Ini";
  else if (range === "bulanLalu") selectedDateRangeLabel.value = "Bulan Lalu";
  else selectedDateRangeLabel.value = "";
  showDateDropdown.value = false;
};

const filteredCategories = computed(() => {
  return categories.value.filter((c) => {
    const q = searchQuery.value.toLowerCase();
    const matchesSearch =
      !q || c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);

    const matchesStatus = !statusFilter.value || c.status.toLowerCase() === statusFilter.value.toLowerCase();
    return matchesSearch && matchesStatus;
  });
});

const showModal = ref(false);
const isEdit = ref(false);
const formData = ref<any>({});

const openAddModal = () => {
  isEdit.value = false;
  formData.value = {
    code: `EXC00${categories.value.length + 1}`,
    name: "",
    description: "",
    status: "Active",
    used: 0,
  };
  showModal.value = true;
};

const openEditModal = (item: any) => {
  isEdit.value = true;
  formData.value = { ...item };
  showModal.value = true;
};

const saveCategory = () => {
  if (isEdit.value) {
    const idx = categories.value.findIndex((c) => c.id === formData.value.id);
    if (idx !== -1) {
      categories.value[idx] = { ...formData.value };
    }
  } else {
    categories.value.unshift({
      id: Date.now(),
      ...formData.value,
      created: new Date().toLocaleDateString("id-ID"),
    });
  }
  showModal.value = false;
};

const deleteCategory = (item: any) => {
  if (confirm(`Are you sure you want to delete ${item.name}?`)) {
    categories.value = categories.value.filter((c) => c.id !== item.id);
  }
};

const printList = () => {
  window.print();
};

const refreshList = () => {
  searchQuery.value = "";
  statusFilter.value = "";
};

const toggleHeader = () => {
  // toggle header
};
</script>
=======
<script setup lang="ts">
import type { ExpenseCategory, ExpenseCategoryFormData } from '~/types/expense-category'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import PagesExpenseCategoryModal from '~/components/expense-category/ExpenseCategoryModal.vue'
import PagesExpenseCategoryTable from '~/components/expense-category/ExpenseCategoryTable.vue'

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

const print = useTablePrint()
const printColumns = [
  { key: 'categoryName', label: 'Category Name' },
  { key: 'description', label: 'Description' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status' }
]

import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'

const isDeleteConfirmOpen = ref(false)
const deleteTargetId = ref<string | null>(null)
const isDeleting = ref(false)

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

const handleDelete = (id: string) => {
  deleteTargetId.value = id
  isDeleteConfirmOpen.value = true
}

const confirmDelete = async () => {
  if (!deleteTargetId.value) return
  isDeleting.value = true
  try {
    await deleteExpenseCategory(deleteTargetId.value)
    showToast('Expense category deleted successfully')
    isDeleteConfirmOpen.value = false
    deleteTargetId.value = null
  } catch (err: any) {
    console.error('Failed to delete expense category:', err)
    showToast(err?.message || 'Failed to delete expense category')
  } finally {
    isDeleting.value = false
  }
}

const handleSubmit = async (formData: ExpenseCategoryFormData) => {
  try {
    const res = await saveExpenseCategory(formData)
    showToast(res?.message || 'Expense category saved successfully')
    isModalOpen.value = false
  } catch (err: any) {
    console.error('Failed to save expense category:', err)
    showToast(err?.message || 'Failed to save expense category')
  }
}

const printTable = () => {
  print.openPrintModal({
    title: 'Expense Categories',
    subtitle: 'Daftar kategori biaya operasional dan produksi',
    columns: printColumns,
    rows: filteredList.value,
    action: 'print'
  })
}

const exportPdf = () => {
  print.openPrintModal({
    title: 'Expense Categories',
    subtitle: 'Daftar kategori biaya operasional dan produksi',
    columns: printColumns,
    rows: filteredList.value,
    action: 'pdf'
  })
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

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="isDeleteConfirmOpen"
      title="Hapus Kategori Pengeluaran"
      message="Apakah Anda yakin ingin menghapus kategori pengeluaran ini? Tindakan ini tidak dapat dibatalkan."
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
