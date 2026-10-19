<script setup lang="ts">
import type { VariableProductItem } from '#server/types/variable-product'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import SalesStatusBadge from '~/components/Sales/SalesStatusBadge.vue'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

defineProps<{
  products: VariableProductItem[]
  categories: Array<{ label: string; value: string }>
  attributes: Array<{ label: string; value: string }>
  categoryFilter: string
  attributeFilter: string
  statusFilter: string
}>()

const emit = defineEmits<{
  'update:category-filter': [value: string]
  'update:attribute-filter': [value: string]
  'update:status-filter': [value: string]
  delete: [product: VariableProductItem]
  'view-variants': [product: VariableProductItem]
  'update:current-page-items': [items: VariableProductItem[]]
}>()

const columns = [
  { key: 'code', label: 'Item Code', sortable: true },
  { key: 'name', label: 'Product Name', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'attributeName', label: 'Variant Attribute' },
  { key: 'variants', label: 'Options & Variants', align: 'center' as const },
  { key: 'priceRange', label: 'Price Range (IDR)', align: 'end' as const, sortable: true },
  { key: 'totalStock', label: 'Total Stock', align: 'center' as const, sortable: true },
  { key: 'status', label: 'Status', align: 'center' as const, sortable: true },
  { key: 'actions', label: 'Action', align: 'center' as const },
]
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="products"
    search-placeholder="Search item code, variable product, or attribute..."
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
        :model-value="attributeFilter"
        :options="attributes"
        placeholder="All Attributes"
        @update:model-value="emit('update:attribute-filter', $event)"
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
        <span v-if="item.subCategory" class="block text-xs text-gray-400">
          {{ item.subCategory }}
        </span>
      </div>
    </template>

    <template #cell(category)="{ item }">
      <span class="text-sm text-gray-900 dark:text-gray-200">{{ item.category }}</span>
    </template>

    <template #cell(attributeName)="{ item }">
      <span class="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200/60 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50">
        <FeatherIcon name="tag" :size="11" />
        {{ item.attributeName }}
      </span>
    </template>

    <template #cell(variants)="{ item }">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200 transition hover:bg-amber-100 hover:border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/60 cursor-pointer"
        title="Click to view all variant values and prices"
        @click="emit('view-variants', item)"
      >
        <FeatherIcon name="layers" :size="12" />
        <span>{{ item.variants.length }} Variants</span>
      </button>
    </template>

    <template #cell(priceRange)="{ item }">
      <div v-if="item.priceMin === item.priceMax">
        <CurrencyDisplay :value="item.priceMin" />
      </div>
      <div v-else class="text-right">
        <span class="font-semibold text-gray-900 dark:text-white">
          <CurrencyDisplay :value="item.priceMin" />
        </span>
        <span class="mx-1 text-xs text-gray-400">-</span>
        <span class="font-semibold text-gray-900 dark:text-white">
          <CurrencyDisplay :value="item.priceMax" />
        </span>
      </div>
    </template>

    <template #cell(totalStock)="{ item }">
      <span class="inline-flex items-center gap-1 font-semibold text-xs text-gray-800 dark:text-gray-200">
        {{ item.totalStock.toLocaleString('id-ID') }}
        <span class="font-normal text-gray-500">{{ item.unit }}</span>
      </span>
    </template>

    <template #cell(status)="{ item }">
      <SalesStatusBadge :status="item.status" />
    </template>

    <template #cell(actions)="{ item }">
      <div class="flex justify-center gap-1">
        <SalesActionButton
          action="view"
          label="View variant details"
          @click="emit('view-variants', item)"
        />
        <SalesActionButton
          action="edit"
          label="Edit product"
          :to="{ path: '/create-product', query: { id: item.id, type: 'Variable Product' } }"
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

