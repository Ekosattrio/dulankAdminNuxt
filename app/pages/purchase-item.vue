<script setup lang="ts">
import type { PurchaseItem, PurchaseItemFormData } from '#server/types/purchase-item'
import { usePurchaseItems } from '~/composables/usePurchaseItems'
import { usePurchaseCategories } from '~/composables/usePurchaseCategories'
import { useTablePrint } from '~/composables/useTablePrint'
import { purchaseItemPrintColumns } from '~/utils/purchaseUi'
import { exportToCsv } from '~/utils/exportCsv'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import PurchaseItemStatsWidgets from '~/components/pages/purchase-item/PurchaseItemStatsWidgets.vue'
import PurchaseItemRecordsTable from '~/components/pages/purchase-item/PurchaseItemRecordsTable.vue'
import PurchaseItemFormModal from '~/components/pages/purchase-item/PurchaseItemFormModal.vue'

definePageMeta({
  layout: 'default',
  alias: ['/purchase-item.html']
})
useLegacyPage({ title: 'Purchase Item - Katalog Barang Pembelian', sweetAlert: false })

const searchQuery = ref('')
const filterCategory = ref('')
const filterParams = computed(() => ({ search: searchQuery.value, category: filterCategory.value }))

const { items, pending, error, refresh, saveItem, deleteItem } = usePurchaseItems(filterParams)
const { categories } = usePurchaseCategories()
const categoryOptions = computed(() => categories.value.map(c => c.name))
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const isFormModalOpen = ref(false)
const isEditMode = ref(false)
const activeItemForEdit = ref<PurchaseItem | null>(null)
const itemToDelete = ref<PurchaseItem | null>(null)
const isBusy = ref(false)
const toastMessage = ref('')

function handleAdd() { isEditMode.value = false; activeItemForEdit.value = null; isFormModalOpen.value = true }
function handleEdit(item: PurchaseItem) { isEditMode.value = true; activeItemForEdit.value = item; isFormModalOpen.value = true }

async function handleFormSubmit(formData: PurchaseItemFormData) {
  isBusy.value = true
  try {
    const res = await saveItem(formData)
    isFormModalOpen.value = false
    toastMessage.value = res.message || 'Purchase item saved successfully'
  } catch (err: any) {
    toastMessage.value = err?.data?.message || err?.message || 'Failed to save purchase item'
  } finally {
    isBusy.value = false
  }
}

async function confirmDelete() {
  if (!itemToDelete.value) return
  isBusy.value = true
  try {
    await deleteItem(itemToDelete.value.id)
    toastMessage.value = `Purchase item '${itemToDelete.value.product}' deleted successfully`
    itemToDelete.value = null
  } catch (err: any) {
    toastMessage.value = err?.data?.message || err?.message || 'Failed to delete purchase item'
  } finally {
    isBusy.value = false
  }
}

function handleExportCsv() {
  exportToCsv({
    filename: 'purchase-items.csv',
    columns: [{ key: 'product', label: 'Item Name' }, { key: 'purchasedPrice', label: 'Purchased Price' }, { key: 'sellingPrice', label: 'Selling Price' }, { key: 'qty', label: 'Stock Qty' }, { key: 'status', label: 'Status' }],
    rows: items.value
  })
}
</script>

<template>
  <div class="dulank-page dulank-page-purchase-item space-y-4 p-4 md:p-6">
    <SalesListHeader
      title="Purchase Item"
      subtitle="Manage your Purchase Item Catalog"
      add-label="Add Purchase Item"
      @add="handleAdd"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <PurchaseItemStatsWidgets :items="items" />

    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :error="error ? (error.message || 'Failed to load purchase items') : ''"
      :message="toastMessage"
      @retry="refresh"
      @dismiss="toastMessage = ''"
    />

    <PurchaseItemRecordsTable
      v-if="!pending && !error"
      :items="items"
      :search-query="searchQuery"
      :filter-category="filterCategory"
      :categories="categoryOptions"
      @update:search-query="searchQuery = $event"
      @update:filter-category="filterCategory = $event"
      @edit="handleEdit"
      @delete="itemToDelete = $event"
      @export-csv="handleExportCsv"
    />

    <PurchaseItemFormModal :open="isFormModalOpen" :is-edit="isEditMode" :item-data="activeItemForEdit" :categories="categoryOptions" :busy="isBusy" @close="isFormModalOpen = false" @submit="handleFormSubmit" />
    <SalesConfirmDelete :open="!!itemToDelete" title="Delete Purchase Item" :message="`Are you sure you want to delete '${itemToDelete?.product}'? This action cannot be undone.`" :busy="isBusy" @cancel="itemToDelete = null" @confirm="confirmDelete" />
    <DocumentPrintModal v-if="isPrintModalOpen" :open="isPrintModalOpen" title="Laporan Katalog Barang Pembelian" :columns="purchaseItemPrintColumns" :items="items" date-field="createdAt" :default-action="defaultPrintAction" @close="closePrintModal" />
  </div>
</template>
