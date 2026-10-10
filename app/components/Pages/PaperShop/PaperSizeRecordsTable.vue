<script setup lang="ts">
import type { PaperSize } from '#server/types/paper-shop'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import SalesStatusBadge from '~/components/Sales/SalesStatusBadge.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'

const props = defineProps<{
  sizes: PaperSize[]
}>()

const emit = defineEmits<{
  (e: 'edit', item: PaperSize): void
  (e: 'delete', id: string): void
}>()

const searchQuery = ref('')
const filterStatus = ref('')

const columns = [
  { key: 'name', label: 'Size Name', sortable: true },
  { key: 'dimension', label: 'Size', sortable: true },
  { key: 'unit', label: 'Unit', sortable: true, align: 'center' as const },
  { key: 'update', label: 'Update', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'actions', label: 'Action', align: 'center' as const }
]

const filteredItems = computed(() => {
  return props.sizes.filter((s) => {
    const matchStatus = !filterStatus.value || s.status === filterStatus.value
    const matchSearch =
      !searchQuery.value ||
      s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      s.dimension.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchStatus && matchSearch
  })
})
</script>

<template>
  <SalesDataTable
    :rows="filteredItems"
    :columns="columns"
    v-model:search="searchQuery"
    search-placeholder="Search paper size..."
  >
    <template #filters>
      <TableFilterSelect
        v-model="filterStatus"
        :options="[
          { label: 'All Status', value: '' },
          { label: 'Active', value: 'Active' },
          { label: 'Deactive', value: 'Deactive' }
        ]"
        placeholder="Status"
      />
    </template>

    <template #cell-name="{ row }">
      <span class="font-semibold text-gray-900 dark:text-gray-100">{{ row.name }}</span>
    </template>

    <template #cell-dimension="{ row }">
      <span class="font-mono text-sm text-gray-700 dark:text-gray-300">{{ row.dimension }}</span>
    </template>

    <template #cell-unit="{ row }">
      <span class="inline-flex rounded bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-400">
        {{ row.unit }}
      </span>
    </template>

    <template #cell-update="{ row }">
      <span class="text-xs text-gray-500 dark:text-gray-400 font-mono">{{ row.update }}</span>
    </template>

    <template #cell-status="{ row }">
      <SalesStatusBadge :status="row.status" />
    </template>

    <template #cell-actions="{ row }">
      <div class="inline-flex items-center gap-1.5 justify-center">
        <SalesActionButton
          action="edit"
          label="Edit Paper Size"
          @click="emit('edit', row)"
        />
        <SalesActionButton
          action="delete"
          label="Delete Paper Size"
          @click="emit('delete', row.id)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>

