<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ProductCustom } from '~/types/cetak-full-color'
import CustomProductCardsGrid, { type CustomProductCardItem } from '~/components/Pages/ProductsServices/CustomProductCardsGrid.vue'
import CustomProductModal, { type CustomProductFormModel } from '~/components/Pages/ProductsServices/CustomProductModal.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'

const props = defineProps<{
  products: ProductCustom[]
  busy?: boolean
}>()

const emit = defineEmits<{
  'update:products': [val: ProductCustom[]]
  save: []
}>()

const isProductModalOpen = ref(false)
const editingProduct = ref<CustomProductFormModel | null>(null)
const deleteTargetProduct = ref<CustomProductCardItem | null>(null)

function summaryOptions(summary: string | null | undefined, fallback: string[]): CustomProductFormModel['sizes'] {
  const values = summary?.split(',').map(value => value.trim()).filter(Boolean) || fallback
  return values.map((value, index) => ({
    label: value.replace(/\s*\(default\)/i, ''),
    enabled: true,
    isDefault: /\(default\)/i.test(value) || index === 0,
  }))
}

function optionSummary(options: CustomProductFormModel['sizes']): string {
  return options
    .filter(option => option.enabled)
    .map(option => `${option.label}${option.isDefault ? ' (Default)' : ''}`)
    .join(', ')
}

// Product Cards Mapping
const productCards = computed<CustomProductCardItem[]>(() => {
  if (!props.products) return []
  return props.products.map(p => ({
    id: p.id,
    name: p.name,
    defaultSize: p.defaultSize,
    paperTypes: p.paperTypes,
    image: p.image,
    images: p.images?.length ? p.images : (p.image ? [p.image] : ['/assets/img/products/brosur.png']),
    sizesSummary: p.defaultSize,
    papersSummary: p.paperTypes,
    laminatesSummary: p.laminates,
    printSidesSummary: p.printSides,
    foldsSummary: p.folds,
    description: p.description,
    displayPos: p.displayPos,
    displayWebsite: p.displayWebsite,
  }))
})

function openAddProduct() {
  editingProduct.value = null
  isProductModalOpen.value = true
}

function openEditProduct(item: CustomProductCardItem) {
  editingProduct.value = {
    id: item.id,
    name: item.name,
    sizes: summaryOptions(item.defaultSize, ['A4 (297x210mm)', 'A5 (210x149mm)']),
    papers: summaryOptions(item.paperTypes, ['Art Paper', 'Art Carton', 'HVS', 'Carton BC']),
    laminates: summaryOptions(item.laminatesSummary, ['Tanpa Laminasi', 'Glossy', 'Doff', 'UV Vernish', 'Spot UV']),
    printSides: summaryOptions(item.printSidesSummary, ['Cetak 1 Sisi', 'Cetak Bolak Balik']),
    folds: summaryOptions(item.foldsSummary, ['Tanpa Lipatan', '1 Lipatan', '2 Lipatan']),
    description: item.description || '',
    images: item.images?.length ? [...item.images] : (item.image ? [item.image] : ['/assets/img/products/brosur.png']),
    displayPos: item.displayPos ?? false,
    displayWebsite: item.displayWebsite ?? true,
  }
  isProductModalOpen.value = true
}

function handleProductSubmit(formData: CustomProductFormModel) {
  const targetId = formData.id || `custom-product-${Date.now()}`
  const existing = props.products.find(product => product.id === targetId)
  const now = new Date().toISOString()
  const newProduct: ProductCustom = {
    id: targetId,
    name: formData.name,
    defaultSize: optionSummary(formData.sizes),
    paperTypes: optionSummary(formData.papers),
    laminates: optionSummary(formData.laminates) || null,
    printSides: optionSummary(formData.printSides),
    folds: optionSummary(formData.folds) || null,
    description: formData.description,
    displayPos: formData.displayPos,
    displayWebsite: formData.displayWebsite,
    active: formData.displayWebsite,
    image: formData.images[0] || '/assets/img/products/brosur.png',
    images: formData.images.length ? [...formData.images] : ['/assets/img/products/brosur.png'],
    createdAt: existing?.createdAt || now,
    updatedAt: now,
  }

  const updated = [...props.products]
  const existingIdx = updated.findIndex(p => p.id === targetId)
  if (existingIdx >= 0) {
    updated[existingIdx] = newProduct
  } else {
    updated.unshift(newProduct)
  }

  emit('update:products', updated)
  isProductModalOpen.value = false
  emit('save')
}

function handleToggleDisplay(item: CustomProductCardItem, field: 'pos' | 'website', val: boolean) {
  const updated = props.products.map(p => {
    if (p.id !== item.id) return p
    if (field === 'website') return { ...p, active: val, displayWebsite: val, updatedAt: new Date().toISOString() }
    return { ...p, displayPos: val, updatedAt: new Date().toISOString() }
  })
  emit('update:products', updated)
  emit('save')
}

function confirmDeleteProduct() {
  if (!deleteTargetProduct.value) return
  const updated = props.products.filter(p => p.id !== deleteTargetProduct.value?.id)
  emit('update:products', updated)
  deleteTargetProduct.value = null
  emit('save')
}
</script>

<template>
  <div>
    <CustomProductCardsGrid
      :products="productCards"
      title="All Product Custom"
      add-label="Add Product"
      :busy="busy"
      @add="openAddProduct"
      @edit="openEditProduct"
      @delete="deleteTargetProduct = $event"
      @toggle-display="handleToggleDisplay"
    />

    <!-- Modals -->
    <CustomProductModal
      :open="isProductModalOpen"
      :initial-data="editingProduct"
      :busy="busy"
      @close="isProductModalOpen = false"
      @submit="handleProductSubmit"
    />

    <SalesConfirmDelete
      :open="!!deleteTargetProduct"
      :busy="busy"
      :title="`Delete ${deleteTargetProduct?.name}?`"
      @close="deleteTargetProduct = null"
      @confirm="confirmDeleteProduct"
    />
  </div>
</template>

