<script setup lang="ts">
import type { POSCategory, POSProduct } from '#server/types/pos'
defineProps<{ categories: POSCategory[]; filteredProducts: POSProduct[] }>()
const selectedCategory = defineModel<string>('category', { required: true })
const productSearchQuery = defineModel<string>('search', { required: true })
const emit = defineEmits<{ add: [product: POSProduct] }>()
const { formatRupiah } = useFormatters()
</script>
<template>
  <div class="min-w-0 flex-1 overflow-y-auto p-4">
    <!-- Categories Bar -->
    <div class="mb-4">
      <div class="mb-2 flex items-center justify-between">
        <h5 class="text-sm font-bold text-gray-900 dark:text-white">Categories</h5>
        <div class="relative w-full max-w-64">
          <input
            v-model="productSearchQuery"
            type="text"
            placeholder="Search products..."
            class="w-full rounded-lg border border-gray-200 bg-white py-1.5 ps-8 pe-3 text-xs focus:border-primary focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
          <span class="absolute inset-y-0 start-0 flex items-center ps-2.5 text-gray-400">
            <FeatherIcon name="search" size="13" />
          </span>
        </div>
      </div>

      <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          v-for="cat in categories"
          :key="cat.id"
          type="button"
          :class="[
            'flex shrink-0 items-center gap-2.5 rounded-xl border p-2.5 transition text-start shadow-sm',
            selectedCategory === cat.id
              ? 'border-primary bg-primary/5 text-primary'
              : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 text-gray-700 dark:text-gray-300',
          ]"
          @click="selectedCategory = cat.id"
        >
          <img :src="cat.icon" :alt="cat.name" class="h-9 w-9 rounded-lg object-cover" />
          <div>
            <p class="text-xs font-bold leading-tight">{{ cat.name }}</p>
            <span class="text-[10px] text-gray-500">{{ cat.count }} Items</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="flex-1">
      <h5 class="mb-3 text-sm font-bold text-gray-900 dark:text-white">Products</h5>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4">
        <button
          type="button"
          v-for="prod in filteredProducts"
          :key="prod.id"
          class="group flex cursor-pointer flex-col justify-between rounded-xl border border-gray-200 bg-white p-3 shadow-sm transition hover:border-primary hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
          @click="emit('add', prod)"
        >
          <div
            class="relative mb-2 flex h-28 items-center justify-center overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-800"
          >
            <img
              :src="prod.image"
              :alt="prod.name"
              class="h-full w-full object-contain p-2 transition duration-300 group-hover:scale-105"
            />
            <span
              class="absolute end-1.5 top-1.5 rounded-full bg-primary/10 p-1 text-primary opacity-0 transition group-hover:opacity-100"
            >
              <FeatherIcon name="plus" size="12" />
            </span>
          </div>

          <div>
            <span class="text-[10px] font-semibold uppercase text-gray-400">{{ prod.category }}</span>
            <h6 class="line-clamp-1 text-xs font-bold text-gray-900 dark:text-white">{{ prod.name }}</h6>
            <div class="mt-2 flex items-center justify-between text-xs">
              <span class="text-[10px] text-gray-500">{{ prod.stock }} Pcs</span>
              <span class="font-bold text-primary">{{ formatRupiah(prod.price) }}</span>
            </div>
          </div>
        </button>
      </div>
      <p v-if="!filteredProducts.length" class="py-10 text-center text-sm text-gray-500">
        No products match this search.
      </p>
    </div>
  </div>
</template>
