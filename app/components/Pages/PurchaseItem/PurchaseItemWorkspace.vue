<script setup lang="ts">
import type { PurchaseItem, PurchaseItemFormData } from '#server/types/purchase-item'
import { formatNumber } from '~/composables/useFormatters'

// Filter states
const searchQuery = ref('')
const filterCategory = ref('')
const collapsed = ref(false)

const filterParams = computed(() => ({
  search: searchQuery.value,
  category: filterCategory.value,
}))

const { items, pending, error, refresh, saveItem, deleteItem } = usePurchaseItems(filterParams)
const { categories } = usePurchaseCategories()

// Categories list for dropdown
const categoryOptions = computed(() => categories.value.map(c => c.name))

// KPI stats calculation
const stats = computed(() => {
  const all = items.value
  const totalItems = all.length
  const uniqueCategories = new Set(all.map(i => i.category)).size
  const avgPrice = totalItems > 0 ? Math.round(all.reduce((acc, i) => acc + (Number(i.price) || 0), 0) / totalItems) : 0
  const highestPrice = all.reduce((max, i) => Math.max(max, Number(i.price) || 0), 0)

  return {
    totalItems,
    totalCategories: uniqueCategories,
    avgPrice,
    highestPrice,
  }
})

// Modal states
const isFormModalOpen = ref(false)
const isEditMode = ref(false)
const activeItemForEdit = ref<PurchaseItem | null>(null)
const itemToDelete = ref<PurchaseItem | null>(null)
const isBusy = ref(false)
const toastMessage = ref('')
const actionError = ref('')

function handleAdd() {
  isEditMode.value = false
  activeItemForEdit.value = null
  isFormModalOpen.value = true
}

function handleEdit(item: PurchaseItem) {
  isEditMode.value = true
  activeItemForEdit.value = item
  isFormModalOpen.value = true
}

function handleDeleteRequest(item: PurchaseItem) {
  itemToDelete.value = item
}

async function handleFormSubmit(formData: PurchaseItemFormData) {
  isBusy.value = true
  actionError.value = ''
  try {
    const res = await saveItem(formData)
    isFormModalOpen.value = false
    toastMessage.value = res.message || (isEditMode.value ? 'Purchase item updated successfully' : 'Purchase item created successfully')
  } catch (err: any) {
    actionError.value = err?.data?.message || err?.message || 'Failed to save purchase item'
  } finally {
    isBusy.value = false
  }
}

async function confirmDelete() {
  if (!itemToDelete.value) return
  isBusy.value = true
  actionError.value = ''
  try {
    await deleteItem(itemToDelete.value.id)
    toastMessage.value = `Purchase item '${itemToDelete.value.product}' deleted successfully`
    itemToDelete.value = null
  } catch (err: any) {
    actionError.value = err?.data?.message || err?.message || 'Failed to delete purchase item'
  } finally {
    isBusy.value = false
  }
}

// Print & Export
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const printColumns = [
  { key: 'id', label: 'ID' },
  { key: 'product', label: 'Item Name' },
  { key: 'category', label: 'Category' },
  { key: 'merk', label: 'Merk' },
  { key: 'unit', label: 'Unit', align: 'center' as const },
  { key: 'priceFormatted', label: 'Price (IDR)', align: 'right' as const },
  { key: 'created', label: 'Created' },
]

const printableItems = computed(() =>
  items.value.map(i => ({
    ...i,
    priceFormatted: `Rp ${formatNumber(i.price)}`,
  }))
)
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <SalesListHeader
      title="Purchase Item"
      subtitle="Manage your purchase catalog items"
      add-label="Add Purchase Item"
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
    <PurchaseItemStatsWidgets v-if="!collapsed" :stats="stats" />

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
      :skeleton-cols="7"
      :skeleton-rows="6"
      :error="error ? (error.message || 'Failed to load purchase items. Please try again.') : ''"
      @retry="refresh"
    />

    <!-- Records Table -->
    <PurchaseItemRecordsTable
      v-if="!collapsed && !pending && !error"
      :items="items"
      :category-options="categoryOptions"
      :search-query="searchQuery"
      :filter-category="filterCategory"
      @update:search-query="searchQuery = $event"
      @update:filter-category="filterCategory = $event"
      @edit="handleEdit"
      @delete="handleDeleteRequest"
    />

    <!-- Add / Edit Modal -->
    <PurchaseItemFormModal
      :open="isFormModalOpen"
      :is-edit="isEditMode"
      :item-data="activeItemForEdit"
      :category-options="categoryOptions"
      :busy="isBusy"
      @close="isFormModalOpen = false"
      @submit="handleFormSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <SalesConfirmDelete
      :open="!!itemToDelete"
      title="Delete Purchase Item"
      :message="`Are you sure you want to delete '${itemToDelete?.product}'? This action cannot be undone.`"
      :busy="isBusy"
      :error="actionError"
      @close="itemToDelete = null"
      @confirm="confirmDelete"
    />

    <!-- Table Print / PDF Preview Modal -->
    <DocumentPrintModal
      v-if="isPrintModalOpen"
      :open="isPrintModalOpen"
      title="Katalog Barang Pembelian (Purchase Item List)"
      :columns="printColumns"
      :items="printableItems"
      date-field="created"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>

