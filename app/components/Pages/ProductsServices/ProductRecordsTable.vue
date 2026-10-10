<script setup lang="ts">
import type { Product } from '#server/types/product'

defineProps<{
  products: Product[]
  categories: Array<{ label: string; value: string }>
  categoryFilter: string
  statusFilter: string
}>()
const emit = defineEmits<{
  'update:category-filter': [value: string]
  'update:status-filter': [value: string]
  delete: [product: Product]
  'update:current-page-items': [items: Product[]]
}>()

const columns = [
  { key: 'code', label: 'Item Code', sortable: true },
  { key: 'name', label: 'Product', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'subCategory', label: 'Sub Category' },
  { key: 'unit', label: 'Unit' },
  { key: 'price', label: 'Price (IDR)', align: 'end' as const, sortable: true },
  { key: 'priceType', label: 'Price Type' },
  { key: 'created', label: 'Created', sortable: true },
  { key: 'actions', label: 'Action', align: 'center' as const },
]
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="products"
    search-placeholder="Search item code or product..."
    @update:current-page-items="emit('update:current-page-items', $event)"
  >
    <template #filters>
      <TableFilterSelect :model-value="categoryFilter" :options="categories" placeholder="All Categories" @update:model-value="emit('update:category-filter', $event)" />
      <TableFilterSelect :model-value="statusFilter" :options="['Active', 'Inactive']" placeholder="All Status" @update:model-value="emit('update:status-filter', $event)" />
    </template>
    <template #cell(code)="{ item }"><span class="font-mono font-semibold">{{ item.code }}</span></template>
    <template #cell(name)="{ item }"><span class="font-semibold text-gray-900 dark:text-white">{{ item.name }}</span></template>
    <template #cell(price)="{ item }"><CurrencyDisplay :value="item.price" /></template>
    <template #cell(actions)="{ item }">
      <div class="flex justify-center gap-1">
        <SalesActionButton action="view" label="View product" :to="{ path: '/product-details', query: { id: item.id } }" />
        <SalesActionButton action="edit" label="Edit product" :to="{ path: '/create-product', query: { id: item.id } }" />
        <SalesActionButton action="delete" label="Delete product" @click="emit('delete', item)" />
      </div>
    </template>
  </SalesDataTable>
</template>
