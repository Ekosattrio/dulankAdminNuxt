<script setup lang="ts">
import type { PurchaseCategory, PurchaseCategoryFormData } from '#server/types/purchase-category'
import { usePurchaseCategories } from '~/composables/usePurchaseCategories'
import { usePurchaseItems } from '~/composables/usePurchaseItems'
import { useTablePrint } from '~/composables/useTablePrint'
import { purchaseCategoryPrintColumns } from '~/utils/purchaseUi'
import { exportToCsv } from '~/utils/exportCsv'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import PurchaseCategoryStatsWidgets from '~/components/pages/purchase-category/PurchaseCategoryStatsWidgets.vue'
import PurchaseCategoryRecordsTable from '~/components/pages/purchase-category/PurchaseCategoryRecordsTable.vue'
import PurchaseCategoryFormModal from '~/components/pages/purchase-category/PurchaseCategoryFormModal.vue'

definePageMeta({
  layout: 'default',
  alias: ['/purchase-category.html']
})
useLegacyPage({ title: 'Purchase Category - Kategori Pembelian', sweetAlert: false })

const searchQuery = ref('')
const filterStatus = ref('')
const filterParams = computed(() => ({ search: searchQuery.value, status: filterStatus.value }))

const { categories, pending, error, refresh, saveCategory, deleteCategory } = usePurchaseCategories(filterParams)
const { items: allItems } = usePurchaseItems()

const isFormModalOpen = ref(false)
const isEditMode = ref(false)
const activeCategoryForEdit = ref<PurchaseCategory | null>(null)
const categoryToDelete = ref<PurchaseCategory | null>(null)
const isBusy = ref(false)
const toastMessage = ref('')

function handleAdd() { isEditMode.value = false; activeCategoryForEdit.value = null; isFormModalOpen.value = true }
function handleEdit(category: PurchaseCategory) { isEditMode.value = true; activeCategoryForEdit.value = category; isFormModalOpen.value = true }

async function handleFormSubmit(formData: PurchaseCategoryFormData) {
  isBusy.value = true
  try {
    const res = await saveCategory(formData)
    isFormModalOpen.value = false
    toastMessage.value = res.message || 'Purchase category saved successfully'
  } catch (err: any) {
    toastMessage.value = err?.data?.message || err?.message || 'Failed to save purchase category'
  } finally {
    isBusy.value = false
  }
}

async function confirmDelete() {
  if (!categoryToDelete.value) return
  isBusy.value = true
  try {
    await deleteCategory(categoryToDelete.value.id)
    toastMessage.value = `Category '${categoryToDelete.value.name}' deleted successfully`
    categoryToDelete.value = null
  } catch (err: any) {
    toastMessage.value = err?.data?.message || err?.message || 'Failed to delete purchase category'
  } finally {
    isBusy.value = false
  }
}

const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

function handleExportCsv() {
  exportToCsv({
    filename: 'purchase-categories.csv',
    columns: [{ key: 'name', label: 'Category Name' }, { key: 'status', label: 'Status' }],
    rows: categories.value
  })
}
</script>

<template>
  <div class="dulank-page dulank-page-purchase-category space-y-4 p-4 md:p-6">
    <SalesListHeader
      title="Purchase Category"
      subtitle="Manage your Purchase Categories"
      add-label="Add Purchase Category"
      @add="handleAdd"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <PurchaseCategoryStatsWidgets :categories="categories" />

    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :error="error ? (error.message || 'Failed to load purchase categories') : ''"
      :message="toastMessage"
      @retry="refresh"
      @dismiss="toastMessage = ''"
    />

    <PurchaseCategoryRecordsTable
      v-if="!pending && !error"
      :categories="categories"
      :all-items="allItems"
      :search-query="searchQuery"
      :filter-status="filterStatus"
      @update:search-query="searchQuery = $event"
      @update:filter-status="filterStatus = $event"
      @edit="handleEdit"
      @delete="categoryToDelete = $event"
      @export-csv="handleExportCsv"
    />

    <PurchaseCategoryFormModal :open="isFormModalOpen" :is-edit="isEditMode" :category-data="activeCategoryForEdit" :busy="isBusy" @close="isFormModalOpen = false" @submit="handleFormSubmit" />
    <SalesConfirmDelete :open="!!categoryToDelete" title="Delete Purchase Category" :message="`Are you sure you want to delete '${categoryToDelete?.name}'? This action cannot be undone.`" :busy="isBusy" @cancel="categoryToDelete = null" @confirm="confirmDelete" />
    <DocumentPrintModal v-if="isPrintModalOpen" :open="isPrintModalOpen" title="Laporan Kategori Pembelian" :columns="purchaseCategoryPrintColumns" :items="categories" date-field="createdAt" :default-action="defaultPrintAction" @close="closePrintModal" />
  </div>
</template>
