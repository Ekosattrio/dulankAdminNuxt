<script setup lang="ts">
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
import SalesFeedback from '~/components/sales/SalesFeedback.vue'
import { printDocument } from '~/utils/documentPrinter'

definePageMeta({
  layout: 'default',
  alias: ['/product-details.html'],
})
useLegacyPage({ title: 'Product Details', sweetAlert: false })

const route = useRoute()
const id = computed(() => typeof route.query.id === 'string' ? route.query.id : '')
const { products, pending, error, refresh } = useProducts()
const product = computed(() => products.value.find((item) => item.id === id.value))

function printProduct() {
  if (!product.value) return
  printDocument({
    title: 'Product Details',
    subtitle: product.value.name,
    columns: [
      { key: 'code', label: 'Item Code' }, { key: 'name', label: 'Product' }, { key: 'category', label: 'Category' },
      { key: 'subCategory', label: 'Sub Category' }, { key: 'unit', label: 'Unit' }, { key: 'price', label: 'Price', align: 'right' },
      { key: 'priceType', label: 'Price Type' }, { key: 'status', label: 'Status' },
    ],
    rows: [product.value],
    orientation: 'portrait',
    includeLetterhead: true,
    includeSignatures: false,
    includeTimestamp: true,
  })
}
</script>

<template>
  <div class="dulank-page dulank-page-product-details space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div><h1 class="text-xl font-bold text-gray-900 dark:text-white">Product Details</h1><p class="mt-1 text-sm text-gray-500">Full details of a product</p></div>
      <div class="flex gap-2">
        <button type="button" class="inline-flex h-9 items-center gap-2 rounded-md border border-gray-200 bg-white px-3 text-sm font-semibold" :disabled="!product" @click="printProduct"><FeatherIcon name="printer" :size="15" />Print</button>
        <NuxtLink to="/product-list" class="inline-flex h-9 items-center gap-2 rounded-md bg-gray-800 px-3 text-sm font-semibold text-white"><FeatherIcon name="arrow-left" :size="15" />Back</NuxtLink>
        <NuxtLink v-if="product" :to="{ path: '/create-product', query: { id: product.id } }" class="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-white"><FeatherIcon name="edit-2" :size="15" />Edit Product</NuxtLink>
      </div>
    </div>

    <SalesFeedback :pending="pending" skeleton="card" :error="error ? 'Unable to load product detail.' : ''" @retry="refresh()" />
    <div v-if="product && !pending && !error" class="grid grid-cols-1 gap-5 lg:grid-cols-3">
      <section class="lg:col-span-2 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="mb-5 flex items-center justify-between border-b border-gray-100 pb-4 dark:border-gray-800">
          <div><p class="font-mono text-base font-bold text-gray-900 dark:text-white">{{ product.code }}</p><p class="text-xs text-gray-500">Item Code</p></div>
          <span :class="['rounded px-2 py-1 text-xs font-semibold', product.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600']">{{ product.status }}</span>
        </div>
        <dl class="divide-y divide-gray-100 text-sm dark:divide-gray-800">
          <div v-for="item in [
            ['Product', product.name], ['Category', product.category], ['Sub Category', product.subCategory],
            ['Price Type', product.priceType], ['Unit', product.unit], ['Store', product.store || '-'],
            ['Minimum Qty', product.minOrderQty || 1], ['Quantity', product.quantity || 0],
            ['Tax Type', product.taxType || '-'], ['Discount Type', product.discountType || '-'],
          ]" :key="String(item[0])" class="grid grid-cols-3 gap-3 py-3">
            <dt class="font-semibold text-gray-500">{{ item[0] }}</dt><dd class="col-span-2 text-gray-900 dark:text-white">{{ item[1] }}</dd>
          </div>
          <div class="grid grid-cols-3 gap-3 py-3"><dt class="font-semibold text-gray-500">Price</dt><dd class="col-span-2"><CurrencyDisplay :value="product.price" align="left" bold /></dd></div>
          <div class="grid grid-cols-3 gap-3 py-3"><dt class="font-semibold text-gray-500">Description</dt><dd class="col-span-2 whitespace-pre-wrap text-gray-700 dark:text-gray-300">{{ product.description || '-' }}</dd></div>
        </dl>
      </section>
      <aside class="rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <h2 class="mb-4 text-sm font-bold text-gray-900 dark:text-white">Product Image</h2>
        <div class="flex aspect-square items-center justify-center overflow-hidden rounded-md bg-gray-50 dark:bg-gray-800">
          <img v-if="product.images?.[0]" :src="product.images[0]" :alt="product.name" class="h-full w-full object-contain" />
          <FeatherIcon v-else name="image" :size="40" class="text-gray-300" />
        </div>
        <p class="mt-3 truncate text-center text-xs font-semibold">{{ product.name }}</p>
      </aside>
    </div>
  </div>
</template>
