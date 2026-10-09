<script setup lang="ts">
import type { Category } from '#server/types/category'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesStatusBadge from '~/components/sales/SalesStatusBadge.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'

const props = defineProps<{
  categories: Category[]
  searchQuery: string
  filterStatus: string
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void
  (e: 'update:filterStatus', val: string): void
  (e: 'edit-category', item: Category): void
  (e: 'delete-category', id: string): void
}>()

const columns = [
  { key: 'name', label: 'Product Category', sortable: true },
  { key: 'code', label: 'Category Slug', sortable: true },
  { key: 'createdBy', label: 'Created By', sortable: true },
  { key: 'createdDate', label: 'Created On', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'action', label: 'Action', align: 'center' as const },
]

const statusModel = computed({
  get: () => props.filterStatus,
  set: (val: string) => emit('update:filterStatus', val),
})

const searchModel = computed({
  get: () => props.searchQuery,
  set: (val: string) => emit('update:searchQuery', val),
})

const filteredList = computed(() => {
  return props.categories.filter((c) => {
    const q = searchModel.value.toLowerCase().trim()
    const matchesSearch =
      !q ||
      c.name?.toLowerCase().includes(q) ||
      c.code?.toLowerCase().includes(q) ||
      c.createdBy?.toLowerCase().includes(q)
    const matchesStatus = !statusModel.value || c.status === statusModel.value
    return matchesSearch && matchesStatus
  })
})
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="filteredList"
    :search="searchModel"
    search-placeholder="Search category name or slug..."
    @update:search="searchModel = $event"
  >
    <template #filters>
      <TableFilterSelect
        v-model="statusModel"
        :options="['Active', 'Inactive']"
        placeholder="All Status"
        aria-label="Filter status kategori"
        width-class="w-36"
      />
    </template>

    <template #cell(name)="{ item }">
      <div class="font-medium text-gray-900 dark:text-gray-100">
        {{ item.name }}
      </div>
    </template>

    <template #cell(code)="{ item }">
      <span class="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 font-mono text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {{ item.code || '-' }}
      </span>
    </template>

    <template #cell(createdBy)="{ item }">
      <span class="text-sm text-gray-600 dark:text-gray-400">
        {{ item.createdBy || 'Admin' }}
      </span>
    </template>

    <template #cell(createdDate)="{ item }">
      <span class="text-sm text-gray-600 dark:text-gray-400">
        {{ item.createdDate || '-' }}
      </span>
    </template>

    <template #cell(status)="{ item }">
      <SalesStatusBadge :status="item.status" />
    </template>

    <template #cell(action)="{ item }">
      <div class="flex items-center justify-center gap-1.5">
        <SalesActionButton
          action="edit"
          label="Edit Category"
          @click="emit('edit-category', item)"
        />
        <SalesActionButton
          action="delete"
          label="Delete Category"
          @click="emit('delete-category', item.id)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>
