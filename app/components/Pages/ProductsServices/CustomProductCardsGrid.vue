<script setup lang="ts">
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import type { CustomProductFormModel } from './CustomProductModal.vue'

export interface CustomProductCardItem {
  id: string
  name: string
  defaultSize?: string
  paperTypes?: string
  machine?: string
  active?: boolean
  image?: string
  images?: string[]
  sheets?: string
  paper?: string
  binding?: string
  sizesSummary?: string
  papersSummary?: string
  laminatesSummary?: string
  printSidesSummary?: string
  foldsSummary?: string
  description?: string
  displayPos?: boolean
  displayWebsite?: boolean
  rawFormData?: CustomProductFormModel
}

const props = defineProps<{
  products: CustomProductCardItem[]
  title?: string
  addLabel?: string
  busy?: boolean
}>()

const emit = defineEmits<{
  add: []
  edit: [product: CustomProductCardItem]
  delete: [product: CustomProductCardItem]
  toggleDisplay: [product: CustomProductCardItem, field: 'pos' | 'website', value: boolean]
}>()

const currentImageIndices = reactive<Record<string, number>>({})

const defaultFallbackImages = [
  'https://percetakan-dulank.netlify.app/images/brosur.jpg',
  '/assets/img/products/brosur.png',
  'https://upload.wikimedia.org/wikipedia/commons/c/c9/Tri_Fold_Brochure_Mockup_01.jpg',
  '/assets/img/products/pos-product-01.png',
]

function getProductImages(product: CustomProductCardItem): string[] {
  if (product.images && product.images.length > 1) {
    return product.images
  }
  if (product.images && product.images.length === 1) {
    const first = product.images[0]
    if (first) return [first, ...defaultFallbackImages.filter(img => img !== first)]
  }
  if (product.image) {
    return [product.image, ...defaultFallbackImages.filter(img => img !== product.image)]
  }
  return defaultFallbackImages
}

function getActiveImage(product: CustomProductCardItem): string {
  const images = getProductImages(product)
  const idx = currentImageIndices[product.id] || 0
  return images[idx] || images[0] || '/assets/img/products/brosur.png'
}

function prevImage(product: CustomProductCardItem) {
  const images = getProductImages(product)
  const total = images.length
  if (total <= 1) return
  const current = currentImageIndices[product.id] || 0
  currentImageIndices[product.id] = (current - 1 + total) % total
}

function nextImage(product: CustomProductCardItem) {
  const images = getProductImages(product)
  const total = images.length
  if (total <= 1) return
  const current = currentImageIndices[product.id] || 0
  currentImageIndices[product.id] = (current + 1) % total
}
</script>

<template>
  <!-- Card Container Matching Netlify reference .card.shadow-sm -->
  <div class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 space-y-5">
    <!-- Header with Title and Add Button -->
    <div class="flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
      <h4 class="text-base font-bold text-gray-900 dark:text-white">
        {{ title || 'All Product Custom' }}
      </h4>
      <button
        type="button"
        class="inline-flex h-9 items-center gap-2 rounded-md bg-[#ff9f43] px-4 text-sm font-semibold text-white shadow-sm hover:bg-[#e08a36] disabled:opacity-50 transition"
        :disabled="busy"
        @click="emit('add')"
      >
        <FeatherIcon name="plus" :size="15" />
        {{ addLabel || 'Add Product' }}
      </button>
    </div>

    <!-- Product Card Grid: .product-card-grid with minmax(270px, 1fr) and horizontal scroll -->
    <div
      v-if="products.length"
      class="grid grid-cols-[repeat(4,minmax(270px,1fr))] gap-6 overflow-x-auto pb-3"
    >
      <div
        v-for="product in products"
        :key="product.id"
        class="flex flex-col justify-between rounded-lg border border-gray-200 bg-white shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900 min-w-[270px]"
      >
        <!-- Image Frame with Aspect Ratio 1.28/1 and Prev/Next slider buttons -->
        <div class="group relative m-2 flex aspect-[1.28/1] items-center justify-center overflow-hidden rounded bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-800">
          <button
            type="button"
            class="product-slide-btn prev absolute left-2.5 top-1/2 z-10 flex size-6 -translate-y-1/2 items-center justify-center rounded-full border border-gray-400 bg-white/95 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-white hover:scale-110 active:scale-95 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            title="Previous image"
            aria-label="Previous image"
            @click.stop.prevent="prevImage(product)"
          >
            &lt;
          </button>
          <img
            :src="getActiveImage(product)"
            :alt="product.name"
            class="size-full object-cover transition duration-300 group-hover:scale-105 select-none"
            @error="($event.target as HTMLImageElement).src = '/assets/img/products/brosur.png'"
          />
          <button
            type="button"
            class="product-slide-btn next absolute right-2.5 top-1/2 z-10 flex size-6 -translate-y-1/2 items-center justify-center rounded-full border border-gray-400 bg-white/95 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-white hover:scale-110 active:scale-95 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
            title="Next image"
            aria-label="Next image"
            @click.stop.prevent="nextImage(product)"
          >
            &gt;
          </button>

          <!-- Slide Dots Indicator at bottom -->
          <div
            v-if="getProductImages(product).length > 1"
            class="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 backdrop-blur-xs"
          >
            <span
              v-for="(_, dotIdx) in getProductImages(product)"
              :key="dotIdx"
              :class="[
                'size-1.5 rounded-full transition-all duration-200',
                (currentImageIndices[product.id] || 0) === dotIdx ? 'bg-white w-3' : 'bg-white/50'
              ]"
            />
          </div>
        </div>

        <!-- Card Content Body -->
        <div class="flex flex-1 flex-col justify-between p-4">
          <div class="space-y-3.5 text-xs text-gray-700 dark:text-gray-200">
            <!-- Product Name -->
            <div class="product-spec-row">
              <div class="font-medium text-gray-500 dark:text-gray-400 mb-1">Product Name</div>
              <div class="text-sm font-bold text-gray-900 dark:text-white">{{ product.name }}</div>
            </div>

            <!-- Ukuran -->
            <div class="product-spec-row">
              <div class="font-medium text-gray-500 dark:text-gray-400 mb-1">Ukuran {{ product.name }}</div>
              <div class="text-xs text-gray-700 dark:text-gray-200 leading-snug">
                {{ product.sizesSummary || product.defaultSize || 'A4 (297x210mm) (Default), A5 (210x149mm)' }}
              </div>
            </div>

            <!-- Jenis Kertas -->
            <div class="product-spec-row">
              <div class="font-medium text-gray-500 dark:text-gray-400 mb-1">Jenis Kertas</div>
              <div class="text-xs text-gray-700 dark:text-gray-200 leading-snug">
                {{ product.papersSummary || product.paperTypes || product.paper || 'Art Paper (default), Art Carton, HVS, Carton BC' }}
              </div>
            </div>

            <!-- Laminasi -->
            <div class="product-spec-row">
              <div class="font-medium text-gray-500 dark:text-gray-400 mb-1">Laminasi</div>
              <div class="text-xs text-gray-700 dark:text-gray-200 leading-snug">
                {{ product.laminatesSummary || 'Tanpa Laminasi (Default), Glossy, Doff, UV Vernish, Spot UV' }}
              </div>
            </div>

            <!-- Sisi Cetak -->
            <div class="product-spec-row">
              <div class="font-medium text-gray-500 dark:text-gray-400 mb-1">Sisi Cetak</div>
              <div class="text-xs text-gray-700 dark:text-gray-200 leading-snug">
                {{ product.printSidesSummary || 'Cetak 1 Sisi (default), Cetak Bolak Balik' }}
              </div>
            </div>

            <!-- Lipatan / Binding -->
            <div class="product-spec-row">
              <div class="font-medium text-gray-500 dark:text-gray-400 mb-1">{{ product.binding ? 'Binding / Hanger' : 'Lipatan' }}</div>
              <div class="text-xs text-gray-700 dark:text-gray-200 leading-snug">
                {{ product.binding || product.foldsSummary || 'Tanpa Lipatan (default), 1 Lipatan, 2 Lipatan' }}
              </div>
            </div>

            <!-- Content Article -->
            <div v-if="product.description" class="product-spec-row">
              <div class="font-medium text-gray-500 dark:text-gray-400 mb-1">Content Article</div>
              <div class="text-xs italic text-gray-500 dark:text-gray-400 leading-snug line-clamp-3">
                {{ product.description }}
              </div>
            </div>
          </div>

          <!-- Bottom Footer: Display Row and Standardized Action Buttons -->
          <div class="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 space-y-3">
            <!-- Display Row -->
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-gray-700 dark:text-gray-300">Display</span>
              <div class="flex items-center gap-4">
                <label class="flex items-center gap-1.5 cursor-pointer text-xs select-none">
                  <input
                    type="checkbox"
                    :checked="product.displayPos"
                    class="size-3.5 rounded border-gray-300 text-primary focus:ring-primary/20"
                    @change="emit('toggleDisplay', product, 'pos', ($event.target as HTMLInputElement).checked)"
                  />
                  <span class="text-gray-700 dark:text-gray-300">POS</span>
                </label>
                <label class="flex items-center gap-1.5 cursor-pointer text-xs select-none">
                  <input
                    type="checkbox"
                    :checked="product.displayWebsite ?? true"
                    class="size-3.5 rounded border-gray-300 text-primary focus:ring-primary/20"
                    @change="emit('toggleDisplay', product, 'website', ($event.target as HTMLInputElement).checked)"
                  />
                  <span class="text-gray-700 dark:text-gray-300">Website</span>
                </label>
              </div>
            </div>

            <!-- Standardized Action Buttons (Feather 14px size-8 with tooltips) -->
            <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
              <SalesActionButton
                action="edit"
                label="Edit Product"
                @click="emit('edit', product)"
              />
              <SalesActionButton
                action="delete"
                label="Hapus Product"
                @click="emit('delete', product)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="rounded-lg border border-dashed border-gray-300 p-8 text-center dark:border-gray-700">
      <p class="text-sm text-gray-500">Belum ada produk custom. Klik tombol "Add Product" untuk menambahkan.</p>
    </div>
  </div>
</template>

