<script setup lang="ts">
import type { LargeFormatProduct } from '#server/types/large-format'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import SalesStatusBadge from '~/components/Sales/SalesStatusBadge.vue'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

defineProps<{
  products: LargeFormatProduct[]
  categories: Array<{ label: string; value: string }>
  categoryFilter: string
  statusFilter: string
}>()

const emit = defineEmits<{
  'update:category-filter': [value: string]
  'update:status-filter': [value: string]
  delete: [product: LargeFormatProduct]
  'update:current-page-items': [items: LargeFormatProduct[]]
}>()

const columns = [
  { key: 'code', label: 'Item Code', sortable: true },
  { key: 'name', label: 'Product & Material', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'unit', label: 'Unit' },
  { key: 'dimensions', label: 'Min Dimensions' },
  { key: 'minOrderQty', label: 'Min Order Qty', align: 'center' as const },
  { key: 'price', label: 'Price / m² (IDR)', align: 'end' as const, sortable: true },
  { key: 'minPrice', label: 'Minimal Price (IDR)', align: 'end' as const, sortable: true },
  { key: 'status', label: 'Status', align: 'center' as const, sortable: true },
  { key: 'actions', label: 'Action', align: 'center' as const },
]
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="products"
    search-placeholder="Search item code, product, or material..."
    @update:current-page-items="emit('update:current-page-items', $event)"
  >
    <template #filters>
      <TableFilterSelect
        :model-value="categoryFilter"
        :options="categories"
        placeholder="All Categories"
        @update:model-value="emit('update:category-filter', $event)"
      />
      <TableFilterSelect
        :model-value="statusFilter"
        :options="['Active', 'Inactive']"
        placeholder="All Status"
        @update:model-value="emit('update:status-filter', $event)"
      />
    </template>

    <template #cell(code)="{ item }">
      <span class="font-mono font-semibold text-gray-900 dark:text-gray-100">{{ item.code }}</span>
    </template>

    <template #cell(name)="{ item }">
      <div class="py-0.5">
        <span class="font-semibold text-gray-900 dark:text-white">{{ item.name }}</span>
        <div v-if="item.material" class="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <FeatherIcon name="layers" :size="12" class="shrink-0 text-gray-400" />
          <span class="truncate">{{ item.material }}</span>
        </div>
      </div>
    </template>

    <template #cell(category)="{ item }">
      <div>
        <span class="text-sm text-gray-900 dark:text-gray-200">{{ item.category }}</span>
        <span v-if="item.subCategory" class="block text-xs text-gray-400">
          {{ item.subCategory }}
        </span>
      </div>
    </template>

    <template #cell(unit)="{ item }">
      <span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {{ item.unit }}
      </span>
    </template>

    <template #cell(dimensions)="{ item }">
      <div v-if="item.minLength || item.minWidth" class="text-xs font-medium text-gray-700 dark:text-gray-300">
        <span>{{ item.minLength || 0 }} × {{ item.minWidth || 0 }} cm</span>
      </div>
      <span v-else class="text-xs text-gray-400">-</span>
    </template>

    <template #cell(minOrderQty)="{ item }">
      <span class="text-xs font-semibold text-gray-700 dark:text-gray-300">
        {{ item.minOrderQty }} {{ item.unit }}
      </span>
    </template>

    <template #cell(price)="{ item }">
      <CurrencyDisplay :value="item.price" />
    </template>

    <template #cell(minPrice)="{ item }">
      <CurrencyDisplay :value="item.minPrice" />
    </template>

    <template #cell(status)="{ item }">
      <SalesStatusBadge :status="item.status" />
    </template>

    <template #cell(actions)="{ item }">
      <div class="flex justify-center gap-1">
        <SalesActionButton
          action="view"
          label="View product"
          :to="{ path: '/product-details', query: { id: item.id } }"
        />
        <SalesActionButton
          action="edit"
          label="Edit product"
          :to="{ path: '/create-product', query: { id: item.id, type: 'Large Format' } }"
        />
        <SalesActionButton
          action="delete"
          label="Delete product"
          @click="emit('delete', item)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>

