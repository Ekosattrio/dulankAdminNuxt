<script setup lang="ts">
import type { KomponenFiksItem } from '#server/types/calculator-components'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'
import SalesStatusBadge from '~/components/sales/SalesStatusBadge.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'

const props = defineProps<{
  items: KomponenFiksItem[]
}>()

const emit = defineEmits<{
  (e: 'edit', item: KomponenFiksItem): void
  (e: 'delete', id: string): void
}>()

const searchQuery = ref('')
const filterStatus = ref('')

const columns = [
  { key: 'name', label: 'Nama Komponen Fiks', sortable: true },
  { key: 'value', label: 'Nilai / Kapasitas', sortable: true, align: 'right' as const },
  { key: 'unit', label: 'Satuan', sortable: true, align: 'center' as const },
  { key: 'used', label: 'Formula Usage', sortable: true, align: 'center' as const },
  { key: 'update', label: 'Last Update', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'actions', label: 'Action', align: 'center' as const }
]

function formatNumber(val: number): string {
  return new Intl.NumberFormat('id-ID').format(val)
}

const filteredItems = computed(() => {
  return props.items.filter((item) => {
    const matchStatus = !filterStatus.value || item.status === filterStatus.value
    const matchSearch =
      !searchQuery.value ||
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.unit.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchStatus && matchSearch
  })
})
</script>

<template>
  <SalesDataTable
    :rows="filteredItems"
    :columns="columns"
    v-model:search="searchQuery"
    search-placeholder="Search component name..."
  >
    <template #filters>
      <TableFilterSelect
        v-model="filterStatus"
        :options="[
          { label: 'Semua Status', value: '' },
          { label: 'Active', value: 'Active' },
          { label: 'Deactive', value: 'Deactive' }
        ]"
        placeholder="Status"
      />
    </template>

    <template #cell-name="{ row }">
      <span class="font-semibold text-gray-900 dark:text-gray-100">{{ row.name }}</span>
    </template>

    <template #cell-value="{ row }">
      <span class="font-semibold text-gray-900 dark:text-gray-100">{{ formatNumber(row.value) }}</span>
    </template>

    <template #cell-unit="{ row }">
      <span class="inline-flex rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300">
        {{ row.unit }}
      </span>
    </template>

    <template #cell-used="{ row }">
      <span class="inline-flex rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 text-xs font-semibold">
        {{ row.used }} calculations
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
          label="Edit Component"
          @click="emit('edit', row)"
        />
        <SalesActionButton
          action="delete"
          label="Delete Component"
          @click="emit('delete', row.id)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>

