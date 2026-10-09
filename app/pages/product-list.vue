<<<<<<< HEAD
<script setup lang="ts">import { formatRupiah } from "~/composables/useFormatters";

const { data: productListData } = await useFetch<ProductListRecord[]>('/api/product-list')
const products = ref<ProductListRecord[]>(productListData.value ?? [])
useMockSync('product-list', products);

const searchQuery = ref("");
const selectedCategory = ref("");

const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    const matchSearch =
      !searchQuery.value ||
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.subCategory.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchCat = !selectedCategory.value || p.category === selectedCategory.value;
    return matchSearch && matchCat;
  });
});

const columns = [
  { key: "code", label: "Item Code" },
  { key: "name", label: "Product" },
  { key: "category", label: "Category" },
  { key: "subCategory", label: "Sub Category" },
  { key: "unit", label: "Unit" },
  { key: "price", label: "Price (IDR)" },
  { key: "priceType", label: "Price Type" },
  { key: "created", label: "Created" },
  { key: "action", label: "Action", class: "text-end no-sort" },
];

// Modal Import
const isImportModalOpen = ref(false);

const deleteProduct = (id: string) => {
  if (confirm("Are you sure you want to delete this product?")) {
    products.value = products.value.filter((p) => p.id !== id);
  }
};</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <CommonPageHeader title="Product List" subtitle="Manage your products">
      <template #actions>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-gray-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-700"
            @click="isImportModalOpen = true"
          >
            <CommonFeatherIcon name="download" size="18" />
            <span>Import Product</span>
          </button>
          <NuxtLink
            to="/create-product"
            class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-600 focus:outline-none"
          >
            <CommonFeatherIcon name="plus-circle" size="18" />
            <span>Add New Product</span>
          </NuxtLink>
        </div>
      </template>
    </CommonPageHeader>

    <!-- Table Card -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <CommonSearchFilter v-model="searchQuery" placeholder="Search product..." />

        <CommonFilterSelect v-model="selectedCategory" :options="[{ value: 'Large Format', label: 'Large Format' }, { value: 'Digital Print', label: 'Digital Print' }, { value: 'Offset Print', label: 'Offset Print' }, { value: 'Finishing & Merchandise', label: 'Finishing & Merchandise' }, { value: 'Merchandise', label: 'Merchandise' }, { value: 'Display Promo', label: 'Display Promo' }, { value: 'Sablon & Tekstil', label: 'Sablon & Tekstil' }]" />
      </div>

      <TablesDataTable :columns="columns" :items="filteredProducts">
        <template #cell(code)="{ item }">
          <span class="font-mono font-semibold text-primary">{{ item.code }}</span>
        </template>

        <template #cell(name)="{ item }">
          <span class="font-semibold text-gray-900 dark:text-gray-100">{{ item.name }}</span>
        </template>

        <template #cell(category)="{ item }">
          <span
            class="inline-flex rounded-full bg-orange-50 px-2.5 py-0.5 text-xs font-medium text-primary dark:bg-orange-950/40 dark:text-primary"
          >
            {{ item.category }}
          </span>
        </template>

        <template #cell(subCategory)="{ item }">
          <span class="text-xs text-gray-600 dark:text-gray-400">{{ item.subCategory }}</span>
        </template>

        <template #cell(unit)="{ item }">
          <span class="inline-flex rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {{ item.unit }}
          </span>
        </template>

        <template #cell(price)="{ item }">
          <span class="font-mono font-medium text-gray-900 dark:text-gray-100">{{ formatRupiah(item.price) }}</span>
        </template>

        <template #cell(priceType)="{ item }">
          <span class="text-xs text-gray-500">{{ item.priceType }}</span>
        </template>

        <template #cell(created)="{ item }">
          <span class="text-[11px] text-gray-500">{{ item.created }}</span>
        </template>

        <template #cell(action)="{ item }">
          <div class="flex items-center justify-end gap-2">
            <NuxtLink
              :to="`/product-details?id=${item.id}`"
              class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-primary dark:hover:bg-gray-800"
              title="View"
            >
              <CommonFeatherIcon name="eye" size="16" />
            </NuxtLink>
            <NuxtLink
              :to="`/create-product?id=${item.id}`"
              class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-amber-500 dark:hover:bg-gray-800"
              title="Edit"
            >
              <CommonFeatherIcon name="edit" size="16" />
            </NuxtLink>
            <button
              type="button"
              class="rounded-lg p-1.5 text-gray-500 transition hover:bg-gray-100 hover:text-rose-600 dark:hover:bg-gray-800"
              title="Delete"
              @click="deleteProduct(item.id)"
            >
              <CommonFeatherIcon name="trash-2" size="16" />
            </button>
          </div>
        </template>
      </TablesDataTable>
    </div>

    <!-- Modal Import Product -->
    <CommonBaseModal v-model="isImportModalOpen" title="Import Product" maxWidth="md">
      <div class="space-y-4">
        <p class="text-xs text-gray-600 dark:text-gray-400">Upload an Excel (.xlsx) or CSV file containing product list.</p>

        <div
          class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 p-8 text-center hover:border-primary transition dark:border-gray-700"
        >
          <CommonFeatherIcon name="upload-cloud" size="32" class="text-gray-400 mb-2" />
          <p class="text-xs font-semibold text-gray-700 dark:text-gray-200">Drag & drop files or click to browse</p>
          <input type="file" accept=".xlsx,.csv" class="hidden" />
        </div>

        <div class="flex justify-end gap-3 pt-3 border-t border-gray-200 dark:border-gray-800">
          <button
            type="button"
            class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
            @click="isImportModalOpen = false"
          >
            Cancel
          </button>
          <button
            type="button"
            class="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white shadow hover:bg-primary-600 transition"
            @click="isImportModalOpen = false"
          >
            Upload
          </button>
        </div>
      </div>
    </CommonBaseModal>
=======
<script setup lang="ts">
import type { Product, ProductImportRow } from '#server/types/product'
import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import ProductImportModal from '~/components/pages/products-services/ProductImportModal.vue'
import ProductRecordsTable from '~/components/pages/products-services/ProductRecordsTable.vue'
import SalesConfirmDelete from '~/components/sales/SalesConfirmDelete.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import { useTablePrint } from '~/composables/useTablePrint'

definePageMeta({ layout: 'default' })
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
>>>>>>> origin/eko
  </div>
</template>
