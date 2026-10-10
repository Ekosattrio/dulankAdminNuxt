<script setup lang="ts">
import type { PurchaseCategory, PurchaseCategoryFormData } from '#server/types/purchase-category'
import { usePurchaseCategories } from '~/composables/usePurchaseCategories'
import { usePurchaseItems } from '~/composables/usePurchaseItems'
import { useTablePrint } from '~/composables/useTablePrint'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'
import PurchaseCategoryStatsWidgets from '~/components/Pages/PurchaseCategory/PurchaseCategoryStatsWidgets.vue'
import PurchaseCategoryRecordsTable from '~/components/Pages/PurchaseCategory/PurchaseCategoryRecordsTable.vue'
import PurchaseCategoryFormModal from '~/components/Pages/PurchaseCategory/PurchaseCategoryFormModal.vue'

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
