<script setup lang="ts">
import type { SubCategory } from '~/types/sub-category'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import SalesStatusBadge from '~/components/Sales/SalesStatusBadge.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import AppBadge from '~/components/Common/AppBadge.vue'

defineProps<{ subCategories: SubCategory[]; categories: string[]; searchQuery: string; selectedCategory: string; filterStatus: string }>()
const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:selectedCategory': [value: string]
  'update:filterStatus': [value: string]
  'add-sub-category': []
  'edit-sub-category': [item: SubCategory]
  'delete-sub-category': [id: string]
}>()
const columns = [
  { key: 'name', label: 'Sub Category', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'categoryCode', label: 'Category Code', sortable: true },
  { key: 'description', label: 'Description' },
  { key: 'itemUsed', label: 'Item Used', sortable: true, align: 'center' as const },
  { key: 'createdBy', label: 'Created By', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'actions', label: 'Action', align: 'center' as const },
]
</script>

<template>
  <SalesDataTable :columns="columns" :items="subCategories" :search="searchQuery" search-placeholder="Search sub category or description..." @update:search="emit('update:searchQuery', $event)">
    <template #filters>
      <TableFilterSelect :model-value="selectedCategory" label="Category" :options="categories" @update:model-value="emit('update:selectedCategory', $event)" />
      <TableFilterSelect :model-value="filterStatus" label="Status" :options="['Active', 'Inactive']" @update:model-value="emit('update:filterStatus', $event)" />
    </template>
    <template #cell(name)="{ item }"><strong class="text-sm text-gray-900 dark:text-white">{{ item.name }}</strong></template>
    <template #cell(categoryCode)="{ item }"><span class="font-mono text-sm font-semibold text-primary">{{ item.categoryCode }}</span></template>
    <template #cell(description)="{ item }"><span class="block max-w-64 truncate" :title="item.description">{{ item.description }}</span></template>
    <template #cell(itemUsed)="{ item }"><AppBadge :label="String(item.itemUsed)" tone="neutral" /></template>
    <template #cell(createdBy)="{ item }">{{ item.createdBy || 'Admin' }}</template>
    <template #cell(status)="{ item }"><SalesStatusBadge :status="item.status" /></template>
    <template #cell(actions)="{ item }"><div class="flex justify-center gap-1"><SalesActionButton action="edit" label="Edit Sub Category" @click="emit('edit-sub-category', item)" /><SalesActionButton action="delete" danger label="Delete Sub Category" @click="emit('delete-sub-category', item.id)" /></div></template>
  </SalesDataTable>
</template>
