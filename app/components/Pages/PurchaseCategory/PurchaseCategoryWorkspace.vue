<script setup lang="ts">
import type { PurchaseCategory, PurchaseCategoryFormData } from '#server/types/purchase-category'

// Filter states
const searchQuery = ref('')
const filterStatus = ref('')
const collapsed = ref(false)

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
const toastMessage = ref('')
const actionError = ref('')

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
  actionError.value = ''
  try {
    const res = await saveCategory(formData)
    isFormModalOpen.value = false
    toastMessage.value = res.message || (isEditMode.value ? 'Purchase category updated successfully' : 'Purchase category created successfully')
  } catch (err: any) {
    actionError.value = err?.data?.message || err?.message || 'Failed to save purchase category'
  } finally {
    isBusy.value = false
  }
}

async function confirmDelete() {
  if (!categoryToDelete.value) return
  isBusy.value = true
  actionError.value = ''
  try {
    await deleteCategory(categoryToDelete.value.id)
    toastMessage.value = `Category '${categoryToDelete.value.name}' deleted successfully`
    categoryToDelete.value = null
  } catch (err: any) {
    actionError.value = err?.data?.message || err?.message || 'Failed to delete purchase category'
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
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <SalesListHeader
      title="Purchase Category"
      subtitle="Manage your purchase categories"
      add-label="Add Purchase Category"
      :refreshing="pending"
      @add="handleAdd"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    >
      <template #actions>
        <button
          type="button"
          title="Collapse"
          aria-label="Collapse"
          class="flex size-9 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
          @click="collapsed = !collapsed"
        >
          <FeatherIcon :name="collapsed ? 'chevron-down' : 'chevron-up'" :size="14" />
        </button>
      </template>
    </SalesListHeader>

    <!-- KPI Stats Widgets -->
    <PurchaseCategoryStatsWidgets v-if="!collapsed" :stats="stats" />

    <!-- Feedback Toast -->
    <SalesFeedback
      :message="toastMessage"
      :error="actionError"
      @dismiss="toastMessage = ''"
      @retry="actionError = ''"
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
      v-if="!collapsed && !pending && !error"
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
      :error="actionError"
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

