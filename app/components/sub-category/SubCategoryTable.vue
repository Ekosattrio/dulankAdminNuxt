<script setup lang="ts">
import type { SubCategory } from '#server/types/sub-category'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesStatusBadge from '~/components/sales/SalesStatusBadge.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'

const props = defineProps<{
  subCategories: SubCategory[]
  categories: string[]
  searchQuery: string
  selectedCategory: string
  filterStatus: string
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void
  (e: 'update:selectedCategory', val: string): void
  (e: 'update:filterStatus', val: string): void
  (e: 'edit-sub-category', item: SubCategory): void
  (e: 'delete-sub-category', id: string): void
}>()

const columns = [
  { key: 'name', label: 'Sub Category', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'categoryCode', label: 'Category Code', sortable: true },
  { key: 'description', label: 'Description', sortable: false },
  { key: 'itemUsed', label: 'Item Used', sortable: true, align: 'center' as const },
  { key: 'createdBy', label: 'Created By', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'action', label: 'Action', align: 'center' as const },
]

const searchModel = computed({
  get: () => props.searchQuery,
  set: (val: string) => emit('update:searchQuery', val),
})

const categoryModel = computed({
  get: () => props.selectedCategory,
  set: (val: string) => emit('update:selectedCategory', val),
})

const statusModel = computed({
  get: () => props.filterStatus,
  set: (val: string) => emit('update:filterStatus', val),
})

const filteredList = computed(() => {
  return props.subCategories.filter((item) => {
    const q = searchModel.value.toLowerCase().trim()
    const matchesSearch =
      !q ||
      item.name?.toLowerCase().includes(q) ||
      item.category?.toLowerCase().includes(q) ||
      item.categoryCode?.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q)
    const matchesCat = !categoryModel.value || item.category === categoryModel.value
    const matchesStatus = !statusModel.value || item.status === statusModel.value
    return matchesSearch && matchesCat && matchesStatus
  })
})
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="filteredList"
    :search="searchModel"
    search-placeholder="Search sub-category, category, or code..."
    @update:search="searchModel = $event"
  >
    <template #filters>
      <TableFilterSelect
        v-model="categoryModel"
        :options="categories"
        placeholder="All Categories"
        aria-label="Filter kategori induk"
        width-class="w-44"
      />
      <TableFilterSelect
        v-model="statusModel"
        :options="['Active', 'Inactive']"
        placeholder="All Status"
        aria-label="Filter status sub-kategori"
        width-class="w-36"
      />
    </template>

    <template #cell(name)="{ item }">
      <div class="font-medium text-gray-900 dark:text-gray-100">
        {{ item.name }}
      </div>
    </template>

    <template #cell(category)="{ item }">
      <span class="text-sm text-gray-700 dark:text-gray-300">
        {{ item.category }}
      </span>
    </template>

    <template #cell(categoryCode)="{ item }">
      <span class="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 font-mono text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {{ item.categoryCode || '-' }}
      </span>
    </template>

    <template #cell(description)="{ item }">
      <span class="line-clamp-1 max-w-xs text-sm text-gray-500 dark:text-gray-400" :title="item.description">
        {{ item.description || '-' }}
      </span>
    </template>

    <template #cell(itemUsed)="{ item }">
      <span class="inline-flex items-center rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-950 dark:text-blue-300">
        {{ item.itemUsed ?? 0 }} items
      </span>
    </template>

    <template #cell(createdBy)="{ item }">
      <span class="text-sm text-gray-600 dark:text-gray-400">
        {{ item.createdBy || 'Admin' }}
      </span>
    </template>

    <template #cell(status)="{ item }">
      <SalesStatusBadge :status="item.status" />
    </template>

    <template #cell(action)="{ item }">
      <div class="flex items-center justify-center gap-1.5">
        <SalesActionButton
          action="edit"
          label="Edit Sub Category"
          @click="emit('edit-sub-category', item)"
        />
        <SalesActionButton
          action="delete"
          label="Delete Sub Category"
          @click="emit('delete-sub-category', item.id)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>
