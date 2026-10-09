<script setup lang="ts">
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'

export interface JobProgressItem {
  id: number
  progressCode: string
  product: string
  description: string
  process: string
  completedBy: string
  time: string
  note: string
  isCompleted: boolean
}

defineProps<{
  items: JobProgressItem[]
  searchQuery: string
  filterProcess: string
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void
  (e: 'update:filterProcess', val: string): void
  (e: 'toggleComplete', item: JobProgressItem): void
}>()

const columns = [
  { key: 'progressCode', label: '# Progress' },
  { key: 'product', label: 'Product' },
  { key: 'description', label: 'Product Description' },
  { key: 'process', label: 'Job Process' },
  { key: 'completedBy', label: 'Completed By' },
  { key: 'time', label: 'Time Completed' },
  { key: 'note', label: 'Note' },
  { key: 'action', label: 'Action', align: 'center' as const, sortable: false },
]

const processOptions = [
  { value: '', label: 'All Processes' },
  { value: 'Printing', label: 'Printing' },
  { value: 'Cutting', label: 'Cutting' },
  { value: 'Finishing', label: 'Finishing' },
  { value: 'Laminating', label: 'Laminating' },
]
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :rows="items"
    :search-query="searchQuery"
    search-placeholder="Search progress code, product, or operator..."
    @update:search-query="emit('update:searchQuery', $event)"
  >
    <template #filters>
      <TableFilterSelect
        :model-value="filterProcess"
        :options="processOptions"
        @update:model-value="emit('update:filterProcess', $event)"
      />
    </template>

    <template #cell-progressCode="{ row }">
      <span class="font-bold text-primary">{{ row.progressCode }}</span>
    </template>

    <template #cell-product="{ row }">
      <span class="font-semibold text-gray-900 dark:text-white">{{ row.product }}</span>
    </template>

    <template #cell-description="{ row }">
      <span class="block max-w-xs text-xs text-gray-500 truncate dark:text-gray-400" :title="row.description">
        {{ row.description }}
      </span>
    </template>

    <template #cell-process="{ row }">
      <span class="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
        {{ row.process }}
      </span>
    </template>

    <template #cell-completedBy="{ row }">
      <span class="text-xs text-gray-700 dark:text-gray-300">{{ row.completedBy || '-' }}</span>
    </template>

    <template #cell-time="{ row }">
      <span class="text-xs text-gray-500 dark:text-gray-400">{{ row.time || '-' }}</span>
    </template>

    <template #cell-note="{ row }">
      <span class="text-xs italic text-gray-500 dark:text-gray-400">{{ row.note || '-' }}</span>
    </template>

    <template #cell-action="{ row }">
      <div class="flex justify-center">
        <button
          type="button"
          class="inline-flex h-8 w-8 items-center justify-center rounded-lg border transition"
          :class="
            row.isCompleted
              ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
              : 'border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600 dark:border-gray-600 dark:hover:text-gray-300'
          "
          :title="row.isCompleted ? 'Completed' : 'Mark as Completed'"
          @click="emit('toggleComplete', row)"
        >
          <i :class="row.isCompleted ? 'feather-check-circle' : 'feather-circle'"></i>
        </button>
      </div>
    </template>
  </SalesDataTable>
</template>

