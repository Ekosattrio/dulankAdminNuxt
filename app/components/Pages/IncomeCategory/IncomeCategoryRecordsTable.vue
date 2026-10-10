<script setup lang="ts">
import type { IncomeCategoryItem } from '#server/types/income-category'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import SalesStatusBadge from '~/components/Sales/SalesStatusBadge.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'

const props = defineProps<{
  items: IncomeCategoryItem[]
}>()

const emit = defineEmits<{
  (e: 'edit', item: IncomeCategoryItem): void
  (e: 'delete', id: string): void
}>()

const searchQuery = ref('')
const filterStatus = ref('')

const columns = [
  { key: 'no', label: 'No Category', sortable: true },
  { key: 'name', label: 'Category Name', sortable: true },
  { key: 'description', label: 'Description', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'created', label: 'Created', sortable: true },
  { key: 'actions', label: 'Action', align: 'center' as const }
]

const filteredItems = computed(() => {
  return props.items.filter((item) => {
    const matchStatus = !filterStatus.value || item.status === filterStatus.value
    const matchSearch =
      !searchQuery.value ||
      item.no.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchStatus && matchSearch
  })
})
</script>

<template>
  <SalesDataTable
    :rows="filteredItems"
    :columns="columns"
    v-model:search="searchQuery"
    search-placeholder="Search income category..."
  >
    <template #filters>
      <TableFilterSelect
        v-model="filterStatus"
        :options="[
          { label: 'All Statuses', value: '' },
          { label: 'Active', value: 'Active' },
          { label: 'Inactive', value: 'Inactive' }
        ]"
        placeholder="Status"
      />
    </template>

    <template #cell-no="{ row }">
      <span class="font-bold text-primary-600 dark:text-primary-400 font-mono text-xs">{{ row.no }}</span>
    </template>

    <template #cell-name="{ row }">
      <span class="font-semibold text-gray-900 dark:text-gray-100">{{ row.name }}</span>
    </template>

    <template #cell-description="{ row }">
      <span class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{{ row.description }}</span>
    </template>

    <template #cell-status="{ row }">
      <SalesStatusBadge :status="row.status" />
    </template>

    <template #cell-created="{ row }">
      <span class="text-xs text-gray-500 dark:text-gray-400 font-mono">{{ row.created }}</span>
    </template>

    <template #cell-actions="{ row }">
      <div class="inline-flex items-center gap-1.5 justify-center">
        <SalesActionButton
          action="edit"
          label="Edit Category"
          @click="emit('edit', row)"
        />
        <SalesActionButton
          action="delete"
          label="Delete Category"
          @click="emit('delete', row.id)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>

