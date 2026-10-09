<<<<<<< HEAD
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Purchase Category" subtitle="Manage your purchase categories">
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
            <span>Add Purchase Product</span>
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
              <th class="px-4 py-3 text-start whitespace-nowrap">Product (Category Name)</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Created</th>
              <th class="px-4 py-3 text-start whitespace-nowrap">Status</th>
              <th class="px-4 py-3 text-end whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="item in filteredCategories" :key="item.id" class="transition-colors hover:bg-gray-50/75 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 whitespace-nowrap font-bold text-gray-900 dark:text-gray-100">{{ item.name }}</td>
              <td class="px-4 py-3 whitespace-nowrap text-gray-500 dark:text-gray-400">{{ item.created }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                <CommonStatusPill :status="item.status" />
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-end">
                <CommonRowActions :item="item" @edit="openEditModal(item)" @delete="deleteCategory(item)" />
              </td>
            </tr>
            <tr v-if="filteredCategories.length === 0">
              <td colspan="4" class="p-8 text-center text-gray-400">No categories found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Category Modal -->
    <CommonBaseModal v-model="showModal" :title="isEdit ? 'Edit Purchase Category' : 'Add Purchase Category'" maxWidth="md">
      <form @submit.prevent="saveCategory" class="space-y-4">
        <CommonFormField label="Category Name" required>
          <input
            v-model="formData.name"
            type="text"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 transition focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            required
          />
        </CommonFormField>
        <CommonFormField label="Status">
          <select
            v-model="formData.status"
            class="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          >
            <option>Active</option>
            <option>Deactive</option>
          </select>
        </CommonFormField>
        <CommonModalFooter @cancel="showModal = false" />
      </form>
    </CommonBaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const { data: purchaseCategoryData } = await useFetch<any[]>('/api/purchase-category')
const categories = ref(purchaseCategoryData.value ?? []);

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
    const matchesSearch = !q || c.name.toLowerCase().includes(q);
    const matchesStatus = !statusFilter.value || c.status.toLowerCase() === statusFilter.value.toLowerCase();
    return matchesSearch && matchesStatus;
  });
});

const showModal = ref(false);
const isEdit = ref(false);
const formData = ref<any>({ name: "", status: "Active" });

const openAddModal = () => {
  isEdit.value = false;
  formData.value = { name: "", status: "Active" };
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
      name: formData.value.name,
      created: `Admin, ${new Date().toLocaleDateString("id-ID")}`,
      status: formData.value.status,
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
  // header toggle
};
useMockSync('purchase-category', categories);
</script>
=======
<script setup lang="ts">
import type { PurchaseCategory, PurchaseCategoryFormData } from '#server/types/purchase-category'
import { usePurchaseCategories } from '~/composables/usePurchaseCategories'
import { usePurchaseItems } from '~/composables/usePurchaseItems'
import { useTablePrint } from '~/composables/useTablePrint'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import PurchaseCategoryStatsWidgets from '~/components/pages/purchase-category/PurchaseCategoryStatsWidgets.vue'
import PurchaseCategoryRecordsTable from '~/components/pages/purchase-category/PurchaseCategoryRecordsTable.vue'
import PurchaseCategoryFormModal from '~/components/pages/purchase-category/PurchaseCategoryFormModal.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Purchase Category - Kategori Pembelian',
  sweetAlert: false
})

// Filter states
const searchQuery = ref('')
const filterStatus = ref('')

const filterParams = computed(() => ({
  search: searchQuery.value,
  status: filterStatus.value,
}))

const { categories, pending, error, refresh, saveCategory, deleteCategory } = usePurchaseCategories(filterParams)
const { items: allItems } = usePurchaseItems()

// KPI stats calculation
const stats = computed(() => {
  const all = categories.value
  const totalCategories = all.length
  const activeCategories = all.filter(c => c.status === 'Active').length
  const deactiveCategories = all.filter(c => c.status === 'Deactive').length
  const totalItems = allItems.value.length

  return {
    totalCategories,
    activeCategories,
    deactiveCategories,
    totalItems,
  }
})

// Modal states
const isFormModalOpen = ref(false)
const isEditMode = ref(false)
const activeCategoryForEdit = ref<PurchaseCategory | null>(null)
const categoryToDelete = ref<PurchaseCategory | null>(null)
const isBusy = ref(false)

// Toast feedback
const toastMessage = ref('')

function showToast(msg: string) {
  toastMessage.value = msg
}

// Handlers
function handleAdd() {
  isEditMode.value = false
  activeCategoryForEdit.value = null
  isFormModalOpen.value = true
}

function handleEdit(category: PurchaseCategory) {
  isEditMode.value = true
  activeCategoryForEdit.value = category
  isFormModalOpen.value = true
}

function handleDeleteRequest(category: PurchaseCategory) {
  categoryToDelete.value = category
}

async function handleFormSubmit(formData: PurchaseCategoryFormData) {
  isBusy.value = true
  try {
    const res = await saveCategory(formData)
    isFormModalOpen.value = false
    showToast(res.message || (isEditMode.value ? 'Purchase category updated successfully' : 'Purchase category created successfully'))
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to save purchase category')
  } finally {
    isBusy.value = false
  }
}

async function confirmDelete() {
  if (!categoryToDelete.value) return
  isBusy.value = true
  try {
    await deleteCategory(categoryToDelete.value.id)
    showToast(`Category '${categoryToDelete.value.name}' deleted successfully`)
    categoryToDelete.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to delete purchase category')
  } finally {
    isBusy.value = false
  }
}

// Print & Export
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const printColumns = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Category Name' },
  { key: 'itemCount', label: 'Total Items', align: 'center' as const },
  { key: 'created', label: 'Created' },
  { key: 'status', label: 'Status', align: 'center' as const },
]

function handleExportExcel() {
  const header = ['ID', 'Category Name', 'Total Items', 'Created', 'Status']
  const rows = categories.value.map(c => [
    `"${c.id}"`,
    `"${c.name}"`,
    `"${c.itemCount ?? 0}"`,
    `"${c.created || ''}"`,
    `"${c.status}"`,
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map(r => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `purchase_categories_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('Purchase category list exported to CSV successfully')
}
</script>

<template>
  <div class="space-y-4 p-4 md:p-6">
    <!-- Header -->
    <SalesListHeader
      title="Purchase Category"
      subtitle="Manage your purchase categories"
      add-label="Add Purchase Category"
      @add="handleAdd"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @export-pdf="openPrintModal('pdf')"
      @export-excel="handleExportExcel"
    />

    <!-- KPI Stats Widgets -->
    <PurchaseCategoryStatsWidgets :stats="stats" />

    <!-- Feedback Toast -->
    <SalesFeedback
      v-if="toastMessage"
      :message="toastMessage"
      @dismiss="toastMessage = ''"
    />

    <!-- Skeleton & Error Feedback -->
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="5"
      :skeleton-rows="6"
      :error="error ? (error.message || 'Failed to load purchase categories. Please try again.') : ''"
      @retry="refresh"
    />

    <!-- Records Table -->
    <PurchaseCategoryRecordsTable
      v-if="!pending && !error"
      :categories="categories"
      :search-query="searchQuery"
      :filter-status="filterStatus"
      @update:search-query="searchQuery = $event"
      @update:filter-status="filterStatus = $event"
      @edit="handleEdit"
      @delete="handleDeleteRequest"
    />

    <!-- Add / Edit Modal -->
    <PurchaseCategoryFormModal
      :open="isFormModalOpen"
      :is-edit="isEditMode"
      :category-data="activeCategoryForEdit"
      :busy="isBusy"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <SalesConfirmDelete
      :open="!!categoryToDelete"
      title="Delete Purchase Category"
      :message="`Are you sure you want to delete purchase category '${categoryToDelete?.name}'? Items under this category may be affected.`"
      :busy="isBusy"
      @close="categoryToDelete = null"
      @confirm="confirmDelete"
    />

    <!-- Table Print / PDF Preview Modal -->
    <DocumentPrintModal
      v-if="isPrintModalOpen"
      :open="isPrintModalOpen"
      title="Laporan Kategori Pembelian (Purchase Category List)"
      :columns="printColumns"
      :items="categories"
      date-field="created"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
>>>>>>> origin/eko
