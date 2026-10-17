<script setup lang="ts">
import type { LargeFormatProduct } from '#server/types/large-format'
import LargeFormatRecordsTable from '~/components/Pages/LargeFormat/LargeFormatRecordsTable.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'
import { useTablePrint } from '~/composables/useTablePrint'

definePageMeta({ layout: 'default' })
useLegacyPage({ title: 'Large Format', sweetAlert: false })

const { products, pending, error, refresh, deleteProduct, categories } = useLargeFormatProducts()

const categoryFilter = ref('')
const statusFilter = ref('')
const deleteTarget = ref<LargeFormatProduct | null>(null)
const busy = ref(false)
const actionError = ref('')
const message = ref('')
const currentPageItems = ref<LargeFormatProduct[]>([])
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    if (categoryFilter.value && product.category !== categoryFilter.value) return false
    if (statusFilter.value && product.status !== statusFilter.value) return false
    return true
  })
})

const printColumns = [
  { key: 'code', label: 'Item Code' },
  { key: 'name', label: 'Product Name' },
  { key: 'category', label: 'Category' },
  { key: 'subCategory', label: 'Sub Category' },
  { key: 'unit', label: 'Unit' },
  { key: 'price', label: 'Price / m² (IDR)', align: 'right' as const },
  { key: 'minPrice', label: 'Min Price (IDR)', align: 'right' as const },
  { key: 'status', label: 'Status' },
]

function notify(val: string) {
  message.value = val
  window.setTimeout(() => {
    if (message.value === val) message.value = ''
  }, 3500)
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  busy.value = true
  actionError.value = ''
  try {
    const res = await deleteProduct(deleteTarget.value.id)
    notify(res.message || 'Large format product deleted successfully')
    deleteTarget.value = null
  } catch (cause: any) {
    actionError.value = cause?.data?.message || cause?.message || 'Gagal menghapus produk'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-large-format space-y-6">
    <SalesListHeader
      title="Large Format"
      subtitle="Manage your large format printing products & services"
      add-label="Add New Product"
      add-to="/create-product?type=Large+Format"
      :refreshing="pending"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :error="error ? 'Unable to load large format products.' : ''"
      :message="message"
      @retry="refresh()"
      @dismiss="message = ''"
    />

    <LargeFormatRecordsTable
      v-if="!pending && !error"
      :products="filteredProducts"
      :categories="categories"
      :category-filter="categoryFilter"
      :status-filter="statusFilter"
      @update:category-filter="categoryFilter = $event"
      @update:status-filter="statusFilter = $event"
      @update:current-page-items="currentPageItems = $event"
      @delete="deleteTarget = $event"
    />

    <SalesConfirmDelete
      :open="!!deleteTarget"
      :busy="busy"
      :error="actionError"
      @close="deleteTarget = null"
      @confirm="confirmDelete"
    />

    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Large Format Products Report"
      subtitle="Catalog of large format digital printing items"
      :columns="printColumns"
      :items="filteredProducts"
      :current-page-items="currentPageItems"
      date-field="created"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>

