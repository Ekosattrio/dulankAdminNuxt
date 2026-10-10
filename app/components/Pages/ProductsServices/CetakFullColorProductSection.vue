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

// Product Cards Mapping
const productCards = computed<CustomProductCardItem[]>(() => {
  if (!props.products) return []
  return props.products.map(p => ({
    id: p.id,
    name: p.name,
    defaultSize: p.defaultSize,
    paperTypes: p.paperTypes,
    machine: p.machine,
    image: p.image,
    images: p.images?.length ? p.images : (p.image ? [p.image] : ['/assets/img/products/brosur.png']),
    sizesSummary: p.defaultSize,
    papersSummary: p.paperTypes,
    laminatesSummary: 'Tanpa Laminasi (Default), Glossy, Doff, UV Vernish, Spot UV',
    printSidesSummary: 'Cetak 1 Sisi (default), Cetak Bolak Balik',
    foldsSummary: 'Tanpa Lipatan (default), 1 Lipatan, 2 Lipatan',
    description: `Ini text ${p.name} cetak full color berkualitas tinggi dengan mesin offset prima.`,
    displayPos: true,
    displayWebsite: p.active,
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
    sizes: [
      { label: item.defaultSize || 'A4 (297x210mm)', enabled: true, isDefault: true },
      { label: 'A5 (210x149mm)', enabled: true, isDefault: false },
      { label: 'A3 (297x420mm)', enabled: false, isDefault: false },
    ],
    papers: [
      { label: item.paperTypes || 'Art Paper', enabled: true, isDefault: true },
      { label: 'Art Carton', enabled: true, isDefault: false },
      { label: 'HVS', enabled: true, isDefault: false },
    ],
    laminates: [
      { label: 'Glossy', enabled: true, isDefault: true },
      { label: 'Doff', enabled: true, isDefault: false },
      { label: 'UV Vernish', enabled: false, isDefault: false },
      { label: 'Spot UV', enabled: false, isDefault: false },
    ],
    printSides: [
      { label: 'Cetak 1 Sisi', enabled: true, isDefault: true },
      { label: 'Cetak Bolak Balik', enabled: true, isDefault: false },
    ],
    folds: [
      { label: 'Tanpa Lipatan', enabled: true, isDefault: true },
      { label: '1 Lipatan', enabled: true, isDefault: false },
      { label: '2 Lipatan', enabled: true, isDefault: false },
    ],
    description: item.description || '',
    images: item.images?.length ? [...item.images] : (item.image ? [item.image] : ['/assets/img/products/brosur.png']),
    displayPos: item.displayPos ?? false,
    displayWebsite: item.displayWebsite ?? true,
  }
  isProductModalOpen.value = true
}

function handleProductSubmit(formData: CustomProductFormModel) {
  const targetId = formData.id || `custom-product-${Date.now()}`
  const newProduct: ProductCustom = {
    id: targetId,
    name: formData.name,
    defaultSize: formData.sizes.find(s => s.isDefault)?.label || formData.sizes[0]?.label || 'A4 (297x210mm)',
    paperTypes: formData.papers.find(p => p.isDefault)?.label || formData.papers[0]?.label || 'Art Paper',
    machine: 'Heidelberg SM52',
    active: formData.displayWebsite,
    image: formData.images[0] || '/assets/img/products/brosur.png',
    images: formData.images.length ? [...formData.images] : ['/assets/img/products/brosur.png'],
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
    if (p.id === item.id && field === 'website') {
      return { ...p, active: val }
    }
    return p
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
      title="All Product Cetak Full Color"
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

