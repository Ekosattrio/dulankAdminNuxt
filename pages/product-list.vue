<script setup lang="ts">
import type { Product, ProductFormData } from '~/types/product'
import FeatherIcon from '~/components/common/FeatherIcon.vue'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Products - Daftar Produk Cetak',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
})

const { products, pending, refresh, saveProduct, deleteProduct } = useProducts()
const { categories } = useCategories()
const { units } = useUnits()

const searchQuery = ref('')
const selectedCategory = ref('')
const filterStatus = ref('')

const isModalOpen = ref(false)
const isEdit = ref(false)
const editData = ref<Product | null>(null)
const toastMessage = ref('')

const showToast = (msg: string) => {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

const categoryNames = computed(() => categories.value.map((c) => c.name))
const unitNames = computed(() => units.value.map((u) => u.name))

const filteredProducts = computed(() => {
  return products.value.filter((p) => {
    const matchesSearch =
      !searchQuery.value ||
      p.name?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.code?.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCat = !selectedCategory.value || p.category === selectedCategory.value
    const matchesStatus = !filterStatus.value || p.status === filterStatus.value
    return matchesSearch && matchesCat && matchesStatus
  })
})

const handleAdd = () => {
  isEdit.value = false
  editData.value = null
  isModalOpen.value = true
}

const handleEdit = (p: Product) => {
  isEdit.value = true
  editData.value = p
  isModalOpen.value = true
}

const handleDelete = async (id: string) => {
  if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
    try {
      await deleteProduct(id)
      showToast('Product deleted successfully')
    } catch (err) {
      console.error('Failed to delete product:', err)
      alert('Failed to delete product')
    }
  }
}

const handleSubmit = async (formData: ProductFormData) => {
  try {
    const res = await saveProduct(formData)
    showToast(res?.message || 'Product saved successfully')
    isModalOpen.value = false
  } catch (err) {
    console.error('Failed to save product:', err)
    alert('Failed to save product')
  }
}

const printTable = () => {
  window.print()
}

const exportPdf = () => {
  showToast('Exporting Products to PDF...')
}
</script>

<template>
  <div class="page-wrapper mt-3">
    <div class="content container-fluid">
      <div v-if="toastMessage" class="alert alert-success position-fixed top-0 end-0 m-4 shadow-lg z-3 d-flex align-items-center gap-2" role="alert">
        <FeatherIcon name="check-circle" size="18" />
        <div>{{ toastMessage }}</div>
      </div>

      <div class="page-header d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div class="page-title">
          <h4 class="fw-bold mb-1">Product List / Daftar Produk</h4>
          <h6 class="text-muted mb-0">Kelola katalog master barang, item cetak dan stok</h6>
        </div>
        <div class="d-flex align-items-center gap-2">
          <ul class="table-top-head d-flex align-items-center list-unstyled gap-2 mb-0">
            <li>
              <button type="button" class="btn btn-outline-secondary btn-sm" title="Print" @click="printTable">
                <FeatherIcon name="printer" size="16" />
              </button>
            </li>
            <li>
              <button type="button" class="btn btn-outline-secondary btn-sm" title="Refresh" @click="refresh">
                <FeatherIcon name="rotate-cw" size="16" />
              </button>
            </li>
          </ul>
          <button type="button" class="btn btn-primary d-flex align-items-center gap-2" @click="handleAdd">
            <FeatherIcon name="plus-circle" size="18" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      <div v-if="pending" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <PagesProductTable
        v-else
        :products="filteredProducts"
        :categories="categoryNames"
        :search-query="searchQuery"
        :selected-category="selectedCategory"
        :filter-status="filterStatus"
        @update:search-query="searchQuery = $event"
        @update:selected-category="selectedCategory = $event"
        @update:filter-status="filterStatus = $event"
        @add-product="handleAdd"
        @edit-product="handleEdit"
        @delete-product="handleDelete"
        @export-pdf="exportPdf"
        @print-table="printTable"
        @refresh="refresh"
      />
    </div>

    <PagesProductModal
      :is-open="isModalOpen"
      :is-edit="isEdit"
      :edit-data="editData"
      :categories="categoryNames"
      :units="unitNames"
      @close="isModalOpen = false"
      @submit="handleSubmit"
    />
  </div>
</template>
