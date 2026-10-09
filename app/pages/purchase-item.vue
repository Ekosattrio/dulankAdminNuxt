<script setup lang="ts">
import type { PurchaseItem, PurchaseItemFormData } from '#server/types/purchase-item'
import { usePurchaseItems } from '~/composables/usePurchaseItems'
import { usePurchaseCategories } from '~/composables/usePurchaseCategories'
import { useTablePrint } from '~/composables/useTablePrint'
import { formatNumber } from '~/composables/useFormatters'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import PurchaseItemStatsWidgets from '~/components/pages/purchase-item/PurchaseItemStatsWidgets.vue'
import PurchaseItemRecordsTable from '~/components/pages/purchase-item/PurchaseItemRecordsTable.vue'
import PurchaseItemFormModal from '~/components/pages/purchase-item/PurchaseItemFormModal.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Purchase Item - Katalog Barang Pembelian',
  sweetAlert: false
})

// Filter states
const searchQuery = ref('')
const filterCategory = ref('')

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

// Toast feedback
const toastMessage = ref('')

function showToast(msg: string) {
  toastMessage.value = msg
}

// Handlers
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
  try {
    const res = await saveItem(formData)
    isFormModalOpen.value = false
    showToast(res.message || (isEditMode.value ? 'Purchase item updated successfully' : 'Purchase item created successfully'))
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to save purchase item')
  } finally {
    isBusy.value = false
  }
}

async function confirmDelete() {
  if (!itemToDelete.value) return
  isBusy.value = true
  try {
    await deleteItem(itemToDelete.value.id)
    showToast(`Purchase item '${itemToDelete.value.product}' deleted successfully`)
    itemToDelete.value = null
  } catch (err: any) {
    showToast(err?.data?.message || err?.message || 'Failed to delete purchase item')
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

function handleExportExcel() {
  const header = ['ID', 'Item Name', 'Category', 'Merk', 'Unit', 'Price', 'Description', 'Created']
  const rows = items.value.map(i => [
    `"${i.id}"`,
    `"${i.product}"`,
    `"${i.category}"`,
    `"${i.merk || ''}"`,
    `"${i.unit}"`,
    `"${i.price}"`,
    `"${(i.description || '').replace(/"/g, '""')}"`,
    `"${i.created || ''}"`,
  ])

  const csvContent = 'data:text/csv;charset=utf-8,' + [header.join(','), ...rows.map(r => r.join(','))].join('\n')
  const encodedUri = encodeURI(csvContent)
  const link = document.createElement('a')
  link.setAttribute('href', encodedUri)
  link.setAttribute('download', `purchase_items_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  showToast('Purchase item catalog exported to CSV successfully')
}
</script>

<template>
  <div class="space-y-4 p-4 md:p-6">
    <!-- Header -->
    <SalesListHeader
      title="Purchase Item"
      subtitle="Manage your purchase catalog items"
      add-label="Add Purchase Item"
      @add="handleAdd"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @export-pdf="openPrintModal('pdf')"
      @export-excel="handleExportExcel"
    />

    <!-- KPI Stats Widgets -->
    <PurchaseItemStatsWidgets :stats="stats" />

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
      :skeleton-cols="7"
      :skeleton-rows="6"
      :error="error ? (error.message || 'Failed to load purchase items. Please try again.') : ''"
      @retry="refresh"
    />

    <!-- Records Table -->
    <PurchaseItemRecordsTable
      v-if="!pending && !error"
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
