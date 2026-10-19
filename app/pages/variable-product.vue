<script setup lang="ts">
import type { VariableProductItem } from '#server/types/variable-product'
import VariableProductRecordsTable from '~/components/Pages/VariableProduct/VariableProductRecordsTable.vue'
import VariableProductVariantsModal from '~/components/Pages/VariableProduct/VariableProductVariantsModal.vue'
import SalesListHeader from '~/components/Sales/SalesListHeader.vue'
import SalesFeedback from '~/components/Sales/SalesFeedback.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'
import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'
import { useTablePrint } from '~/composables/useTablePrint'

definePageMeta({ layout: 'default' })
useLegacyPage({ title: 'Variable Product', sweetAlert: false })

const { products, pending, error, refresh, deleteProduct, categories, attributes } = useVariableProducts()

const categoryFilter = ref('')
const attributeFilter = ref('')
const statusFilter = ref('')
const deleteTarget = ref<VariableProductItem | null>(null)
const selectedProductVariants = ref<VariableProductItem | null>(null)
const busy = ref(false)
const actionError = ref('')
const message = ref('')
const currentPageItems = ref<VariableProductItem[]>([])
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    if (categoryFilter.value && product.category !== categoryFilter.value) return false
    if (attributeFilter.value && product.attributeName !== attributeFilter.value) return false
    if (statusFilter.value && product.status !== statusFilter.value) return false
    return true
  })
})

const printColumns = [
  { key: 'code', label: 'Item Code' },
  { key: 'name', label: 'Product Name' },
  { key: 'category', label: 'Category' },
  { key: 'attributeName', label: 'Attribute' },
  { key: 'unit', label: 'Unit' },
  { key: 'totalStock', label: 'Total Stock', align: 'center' as const },
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
    notify(res.message || 'Variable product deleted successfully')
    deleteTarget.value = null
  } catch (cause: any) {
    actionError.value = cause?.data?.message || cause?.message || 'Gagal menghapus produk'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="dulank-page dulank-page-variable-product space-y-6">
    <SalesListHeader
      title="Variable Product"
      subtitle="Manage your products with variations and attributes"
      add-label="Add New Product"
      add-to="/create-product?type=Variable+Product"
      :refreshing="pending"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :error="error ? 'Unable to load variable products.' : ''"
      :message="message"
      @retry="refresh()"
      @dismiss="message = ''"
    />

    <VariableProductRecordsTable
      v-if="!pending && !error"
      :products="filteredProducts"
      :categories="categories"
      :attributes="attributes"
      :category-filter="categoryFilter"
      :attribute-filter="attributeFilter"
      :status-filter="statusFilter"
      @update:category-filter="categoryFilter = $event"
      @update:attribute-filter="attributeFilter = $event"
      @update:status-filter="statusFilter = $event"
      @update:current-page-items="currentPageItems = $event"
      @view-variants="selectedProductVariants = $event"
      @delete="deleteTarget = $event"
    />

    <!-- Variants Details Modal -->
    <VariableProductVariantsModal
      :open="!!selectedProductVariants"
      :product="selectedProductVariants"
      @close="selectedProductVariants = null"
    />

    <!-- Delete Confirmation Modal -->
    <SalesConfirmDelete
      :open="!!deleteTarget"
      :busy="busy"
      :error="actionError"
      @close="deleteTarget = null"
      @confirm="confirmDelete"
    />

    <!-- Print Report Modal -->
    <DocumentPrintModal
      :open="isPrintModalOpen"
      title="Variable Products Report"
      subtitle="Catalog of variable products and options"
      :columns="printColumns"
      :items="filteredProducts"
      :current-page-items="currentPageItems"
      date-field="created"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>

