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
const filterUnit = ref('')

const unitOptions = computed(() => {
  const units = Array.from(new Set(props.items.map((i) => i.unit).filter(Boolean)))
  return [
    { label: 'Semua Satuan', value: '' },
    ...units.map((u) => ({ label: u, value: u }))
  ]
})

const columns = [
  { key: 'name', label: 'Nama', sortable: true },
  { key: 'value', label: 'Qty', sortable: true, align: 'right' as const },
  { key: 'unit', label: 'Satuan', sortable: true, align: 'center' as const },
  { key: 'used', label: 'Used', sortable: true, align: 'center' as const },
  { key: 'update', label: 'Update', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'actions', label: 'Action', align: 'center' as const }
]

function formatNumber(val: number): string {
  return new Intl.NumberFormat('id-ID').format(val)
}

const filteredItems = computed(() => {
  return props.items.filter((item) => {
    const matchStatus = !filterStatus.value || item.status === filterStatus.value
    const matchUnit = !filterUnit.value || item.unit.toLowerCase() === filterUnit.value.toLowerCase()
    const matchSearch =
      !searchQuery.value ||
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.unit.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchStatus && matchUnit && matchSearch
  })
})
</script>

<template>
  <SalesDataTable
    :rows="filteredItems"
    :columns="columns"
    v-model:search="searchQuery"
    search-placeholder="Search komponen..."
  >
    <template #filters>
      <TableFilterSelect
        v-model="filterUnit"
        :options="unitOptions"
        placeholder="Satuan"
      />
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
        {{ row.used }}
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
          label="Edit Komponen"
          @click="emit('edit', row)"
        />
        <SalesActionButton
          action="delete"
          label="Delete Komponen"
          @click="emit('delete', row.id)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>
