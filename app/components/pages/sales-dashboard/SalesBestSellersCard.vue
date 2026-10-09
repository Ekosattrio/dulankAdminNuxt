<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'

export interface BestSellerItem {
  id: number
  name: string
  price: number
  sales: number
  image: string
  category: string
  stock: number
}

withDefaults(
  defineProps<{
    products?: BestSellerItem[]
  }>(),
  {
    products: () => [
      {
        id: 1,
        name: 'Lenovo 3rd Generation',
        price: 4420,
        sales: 6547,
        image: '/assets/img/products/stock-img-01.png',
        category: 'Laptops & Computers',
        stock: 120
      },
      {
        id: 2,
        name: 'Bold V3.2',
        price: 1474,
        sales: 3474,
        image: '/assets/img/products/stock-img-06.png',
        category: 'Accessories',
        stock: 450
      },
      {
        id: 3,
        name: 'Nike Jordan',
        price: 8784,
        sales: 1478,
        image: '/assets/img/products/stock-img-02.png',
        category: 'Footwear & Fashion',
        stock: 85
      },
      {
        id: 4,
        name: 'Apple Series 5 Watch',
        price: 3240,
        sales: 987,
        image: '/assets/img/products/stock-img-03.png',
        category: 'Smartwatches',
        stock: 64
      },
      {
        id: 5,
        name: 'Amazon Echo Dot',
        price: 597,
        sales: 784,
        image: '/assets/img/products/stock-img-04.png',
        category: 'Smart Home',
        stock: 210
      }
    ]
  }
)

const emit = defineEmits<{
  (e: 'viewProduct', product: BestSellerItem): void
}>()
</script>

<template>
  <div class="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-4">
    <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800">
      <h4 class="text-sm font-bold text-gray-900 sm:text-base dark:text-white">Best Seller</h4>
      <NuxtLink
        to="/product-list"
        class="view-all flex items-center text-xs font-semibold text-primary transition hover:text-primary-hover"
      >
        View All
        <span class="flex items-center ps-1.5"><FeatherIcon name="arrow-right" size="14" /></span>
      </NuxtLink>
    </div>
    <div class="flex-1 p-4">
      <div class="space-y-4">
        <div
          v-for="item in products"
          :key="item.id"
          class="group flex cursor-pointer items-center justify-between rounded-lg p-2 transition hover:bg-gray-50 dark:hover:bg-gray-800/60"
          @click="emit('viewProduct', item)"
        >
          <div class="flex min-w-0 items-center gap-3">
            <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">
              <img :src="item.image" :alt="item.name" class="h-10 w-10 object-contain" />
            </div>
            <div class="min-w-0">
              <h5 class="truncate text-xs font-bold text-gray-900 transition group-hover:text-primary sm:text-sm dark:text-gray-100">
                {{ item.name }}
              </h5>
              <p class="text-xs font-medium text-gray-400">${{ item.price.toLocaleString() }}</p>
            </div>
          </div>

          <div class="flex-shrink-0 ps-3 text-end">
            <p class="text-[11px] font-medium uppercase text-gray-400">Sales</p>
            <p class="text-xs font-bold text-gray-900 sm:text-sm dark:text-white">{{ item.sales.toLocaleString() }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

