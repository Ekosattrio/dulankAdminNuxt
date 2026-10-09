<script setup lang="ts">
import type { Product, ProductImportRow } from '#server/types/product'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import ProductImportModal from '~/components/pages/products-services/ProductImportModal.vue'
import ProductRecordsTable from '~/components/pages/products-services/ProductRecordsTable.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import { useTablePrint } from '~/composables/useTablePrint'

definePageMeta({
  layout: 'default',
  alias: ['/product-list.html'],
})
useLegacyPage({ title: 'Product List', sweetAlert: false })

const { products, pending, error, refresh, deleteProduct, importProducts } = useProducts()
const { categories } = useCategories()
const categoryFilter = ref('')
const statusFilter = ref('')
const deleteTarget = ref<Product | null>(null)
const importOpen = ref(false)
const busy = ref(false)
const actionError = ref('')
const message = ref('')
const currentPageItems = ref<Product[]>([])
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const categoryOptions = computed(() => categories.value.map(item => ({ label: item.name, value: item.id })))
const filteredProducts = computed(() => products.value.filter((product) => {
  if (categoryFilter.value && product.categoryId !== categoryFilter.value) return false
  if (statusFilter.value && product.status !== statusFilter.value) return false
  return true
}))
const printColumns = [
  { key: 'code', label: 'Item Code' }, { key: 'name', label: 'Product' }, { key: 'category', label: 'Category' },
  { key: 'subCategory', label: 'Sub Category' }, { key: 'unit', label: 'Unit' },
  { key: 'price', label: 'Price (IDR)', align: 'right' as const }, { key: 'priceType', label: 'Price Type' }, { key: 'created', label: 'Created' },
]

function notify(value: string) {
  message.value = value
  window.setTimeout(() => { if (message.value === value) message.value = '' }, 3500)
}
async function confirmDelete() {
  if (!deleteTarget.value) return
  busy.value = true
  actionError.value = ''
  try {
    const response = await deleteProduct(deleteTarget.value.id)
    notify(response.message || 'Product deleted successfully')
    deleteTarget.value = null
  } catch (cause: any) { actionError.value = cause?.data?.statusMessage || cause?.message || 'Product gagal dihapus' }
  finally { busy.value = false }
}
async function submitImport(rows: ProductImportRow[]) {
  busy.value = true
  actionError.value = ''
  try {
    const response = await importProducts(rows)
    notify(response.message || 'Products imported successfully')
    importOpen.value = false
  } catch (cause: any) { actionError.value = cause?.data?.statusMessage || cause?.message || 'Import product gagal' }
  finally { busy.value = false }
}
</script>

<template>
  <div class="dulank-page dulank-page-product-list space-y-6">
    <SalesListHeader
      title="Product List"
      subtitle="Manage your products"
      add-label="Add New Product"
      add-to="/create-product"
      :refreshing="pending"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    >
      <template #actions>
        <button type="button" class="inline-flex h-9 items-center gap-2 rounded-md bg-gray-800 px-4 text-sm font-semibold text-white hover:bg-gray-700" @click="importOpen = true">
          <FeatherIcon name="download" :size="15" />Import Product
        </button>
      </template>
    </SalesListHeader>
    <SalesFeedback :pending="pending" skeleton="table" :error="error ? 'Unable to load products.' : ''" :message="message" @retry="refresh()" @dismiss="message = ''" />
    <ProductRecordsTable
      v-if="!pending && !error"
      :products="filteredProducts"
      :categories="categoryOptions"
      :category-filter="categoryFilter"
      :status-filter="statusFilter"
      @update:category-filter="categoryFilter = $event"
      @update:status-filter="statusFilter = $event"
      @update:current-page-items="currentPageItems = $event"
      @delete="deleteTarget = $event"
    />
    <ProductImportModal :open="importOpen" :busy="busy" :error="actionError" @close="importOpen = false" @submit="submitImport" />
    <SalesConfirmDelete :open="!!deleteTarget" :busy="busy" :error="actionError" @close="deleteTarget = null" @confirm="confirmDelete" />
    <DocumentPrintModal :open="isPrintModalOpen" title="Product List Report" subtitle="Master products and service catalog" :columns="printColumns" :items="filteredProducts" :current-page-items="currentPageItems" date-field="createdAt" :default-action="defaultPrintAction" @close="closePrintModal" />
  </div>
</template>
