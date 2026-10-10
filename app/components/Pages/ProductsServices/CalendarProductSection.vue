<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CalendarProduct } from '#server/types/calendar-setting'
import CustomProductCardsGrid, { type CustomProductCardItem } from '~/components/Pages/ProductsServices/CustomProductCardsGrid.vue'
import CustomProductModal, { type CustomProductFormModel } from '~/components/Pages/ProductsServices/CustomProductModal.vue'
import SalesConfirmDelete from '~/components/Sales/SalesConfirmDelete.vue'

const props = defineProps<{
  products: CalendarProduct[]
  busy?: boolean
}>()

const emit = defineEmits<{
  'update:products': [val: CalendarProduct[]]
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
    paper: p.paper,
    binding: p.binding,
    sheets: p.sheets,
    image: p.image,
    images: p.images?.length ? p.images : (p.image ? [p.image] : ['/assets/img/products/pos-product-10.png']),
    sizesSummary: p.defaultSize,
    papersSummary: p.paper,
    laminatesSummary: 'Tanpa Laminasi (Default), Glossy, Doff',
    printSidesSummary: 'Cetak 1 Sisi (default), Cetak Bolak Balik',
    foldsSummary: p.binding || p.sheets,
    description: `${p.name} dengan ${p.sheets} bahan ${p.paper}, finishing ${p.binding}`,
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
      { label: item.defaultSize || '210 x 150 mm (Landscape)', enabled: true, isDefault: true },
      { label: '380 x 530 mm', enabled: true, isDefault: false },
      { label: '460 x 640 mm', enabled: true, isDefault: false },
    ],
    papers: [
      { label: item.paper || 'Art Carton 230gr', enabled: true, isDefault: true },
      { label: 'Art Paper 150gr', enabled: true, isDefault: false },
      { label: 'HVS 80gr', enabled: true, isDefault: false },
    ],
    laminates: [
      { label: 'Tanpa Laminasi', enabled: true, isDefault: true },
      { label: 'Laminasi Doff Cover', enabled: true, isDefault: false },
      { label: 'Laminasi Glossy Cover', enabled: true, isDefault: false },
    ],
    printSides: [
      { label: 'Cetak 1 Sisi', enabled: true, isDefault: true },
      { label: 'Bolak Balik Sheetwise', enabled: true, isDefault: false },
    ],
    folds: [
      { label: item.binding || 'Spiral Kawat Hitam', enabled: true, isDefault: true },
      { label: 'Jepit Kaleng (Klemseng)', enabled: true, isDefault: false },
      { label: 'Mata Ikan', enabled: false, isDefault: false },
    ],
    description: item.description || '',
    images: item.images?.length ? [...item.images] : (item.image ? [item.image] : ['/assets/img/products/pos-product-10.png']),
    displayPos: item.displayPos ?? false,
    displayWebsite: item.displayWebsite ?? true,
  }
  isProductModalOpen.value = true
}

function handleProductSubmit(formData: CustomProductFormModel) {
  const targetId = formData.id || `cal-prod-${Date.now()}`
  const newProduct: CalendarProduct = {
    id: targetId,
    name: formData.name,
    defaultSize: formData.sizes.find(s => s.isDefault)?.label || formData.sizes[0]?.label || '210 x 150 mm',
    paper: formData.papers.find(p => p.isDefault)?.label || formData.papers[0]?.label || 'Art Carton 230gr',
    binding: formData.folds.find(f => f.isDefault)?.label || formData.folds[0]?.label || 'Spiral Kawat',
    sheets: '13 Lembar (1 Lembar Cover + 12 Bulan)',
    active: formData.displayWebsite,
    image: formData.images[0] || '/assets/img/products/pos-product-10.png',
    images: formData.images.length ? [...formData.images] : ['/assets/img/products/pos-product-10.png'],
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
      title="All Calender Custom"
      add-label="Add Product"
      :busy="busy"
      @add="openAddProduct"
      @edit="openEditProduct"
      @delete="deleteTargetProduct = $event"
      @toggle-display="handleToggleDisplay"
    />

    <!-- Product Modal -->
    <CustomProductModal
      :open="isProductModalOpen"
      :initial-data="editingProduct"
      :is-calender="true"
      :busy="busy"
      @close="isProductModalOpen = false"
      @submit="handleProductSubmit"
    />

    <!-- Confirm Delete Modal -->
    <SalesConfirmDelete
      :open="!!deleteTargetProduct"
      :busy="busy"
      :title="`Delete ${deleteTargetProduct?.name}?`"
      @close="deleteTargetProduct = null"
      @confirm="confirmDeleteProduct"
    />
  </div>
</template>

