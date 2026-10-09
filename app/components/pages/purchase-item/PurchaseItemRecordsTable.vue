<script setup lang="ts">
import type { PurchaseItem } from '#server/types/purchase-item'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'
import { formatNumber } from '~/composables/useFormatters'

defineProps<{
  items: PurchaseItem[]
  categoryOptions: string[]
  searchQuery: string
  filterCategory?: string
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterCategory': [value: string]
  'edit': [item: PurchaseItem]
  'delete': [item: PurchaseItem]
}>()

const columns = [
  { key: 'product', label: 'Item Name', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'merk', label: 'Merk', sortable: true },
  { key: 'unit', label: 'Unit', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'price', label: 'Price (IDR)', sortable: true, align: 'right' as const, class: 'text-right font-medium' },
  { key: 'created', label: 'Created', sortable: true },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="items"
    :search="searchQuery"
    search-placeholder="Search purchase item or merk..."
    @update:search="emit('update:searchQuery', $event)"
  >
    <template #filters>
      <!-- Category Filter -->
      <TableFilterSelect
        :model-value="filterCategory"
        label="Category"
        :options="categoryOptions"
        @update:model-value="emit('update:filterCategory', $event)"
      />
    </template>

    <!-- Item / Product Name -->
    <template #cell(product)="{ item }">
      <div>
        <div class="flex items-center gap-2">
          <span class="font-semibold text-gray-900 dark:text-gray-100">
            {{ item.product }}
          </span>
          <span class="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-mono text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            {{ item.id }}
          </span>
        </div>
        <p v-if="item.description" class="text-xs text-gray-500 line-clamp-1 mt-0.5 dark:text-gray-400">
          {{ item.description }}
        </p>
      </div>
    </template>

    <!-- Category -->
    <template #cell(category)="{ item }">
      <span class="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-400">
        {{ item.category }}
      </span>
    </template>

    <!-- Merk -->
    <template #cell(merk)="{ item }">
      <span class="text-xs text-gray-700 dark:text-gray-300">
        {{ item.merk || '-' }}
      </span>
    </template>

    <!-- Unit -->
    <template #cell(unit)="{ item }">
      <span class="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {{ item.unit }}
      </span>
    </template>

    <!-- Price -->
    <template #cell(price)="{ item }">
      <span class="font-semibold text-gray-900 dark:text-gray-100">
        Rp {{ formatNumber(item.price) }}
      </span>
    </template>

    <!-- Created -->
    <template #cell(created)="{ item }">
      <span class="text-xs text-gray-500 dark:text-gray-400">
        {{ item.created || '-' }}
      </span>
    </template>

    <!-- Actions -->
    <template #cell(actions)="{ item }">
      <div class="flex items-center justify-center gap-1">
        <SalesActionButton
          icon="edit-2"
          label="Edit"
          variant="ghost"
          @click="emit('edit', item)"
        />
        <SalesActionButton
          icon="trash-2"
          label="Delete"
          variant="danger"
          @click="emit('delete', item)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>
