<script setup lang="ts">
import type { SalesDashboardBestSeller } from '#server/types/sales-dashboard'
defineProps<{ items: SalesDashboardBestSeller[] }>()
defineEmits<{ view: [item: SalesDashboardBestSeller] }>()
</script>

<template>
  <section class="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-4">
    <header class="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800"><h2 class="app-section-title">Best Seller</h2><NuxtLink to="/product-list" class="flex items-center text-sm font-semibold text-primary">View All <FeatherIcon name="arrow-right" :size="14" class="ms-1" /></NuxtLink></header>
    <div class="space-y-2 p-4">
      <button v-for="item in items" :key="item.id" type="button" class="flex w-full items-center justify-between rounded-lg p-2 text-start hover:bg-gray-50 dark:hover:bg-gray-800" @click="$emit('view', item)">
        <span class="flex min-w-0 items-center gap-3"><span class="flex size-12 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 p-1"><img :src="item.image" :alt="item.name" class="size-10 object-contain" /></span><span class="min-w-0"><strong class="block truncate text-sm">{{ item.name }}</strong><span class="text-xs text-gray-500">${{ item.price.toLocaleString() }}</span></span></span>
        <span class="ps-3 text-end"><span class="block text-xs uppercase text-gray-500">Sales</span><strong class="text-sm">{{ item.sales.toLocaleString() }}</strong></span>
      </button>
    </div>
  </section>
</template>
