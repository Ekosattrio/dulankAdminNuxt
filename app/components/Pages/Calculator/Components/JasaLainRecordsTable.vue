<script setup lang="ts">
import type { JasaLainItem } from '#server/types/calculator-components'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import SalesStatusBadge from '~/components/Sales/SalesStatusBadge.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'

const props = defineProps<{
  items: JasaLainItem[]
}>()

const emit = defineEmits<{
  (e: 'view', item: JasaLainItem): void
  (e: 'edit', item: JasaLainItem): void
  (e: 'delete', id: string): void
}>()

const searchQuery = ref('')
const filterUnit = ref('')
const filterStatus = ref('')

const columns = [
  { key: 'name', label: 'Nama Jasa', sortable: true },
  { key: 'harga', label: 'Harga Satuan', sortable: true, align: 'right' as const },
  { key: 'minimHarga', label: 'Minim Harga (Floor)', sortable: true, align: 'right' as const },
  { key: 'satuan', label: 'Satuan', sortable: true, align: 'center' as const },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'actions', label: 'Action', align: 'center' as const }
]

const unitOptions = computed(() => {
  const units = Array.from(new Set(props.items.map((i) => i.satuan).filter(Boolean)))
  return [
    { label: 'Semua Satuan', value: '' },
    ...units.map((u) => ({ label: u, value: u }))
  ]
})

const filteredItems = computed(() => {
  return props.items.filter((item) => {
    const matchStatus = !filterStatus.value || item.status === filterStatus.value
    const matchUnit = !filterUnit.value || item.satuan === filterUnit.value
    const matchSearch =
      !searchQuery.value ||
      item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.satuan.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchStatus && matchUnit && matchSearch
  })
})
</script>

<template>
  <SalesDataTable
    :rows="filteredItems"
    :columns="columns"
    v-model:search="searchQuery"
    search-placeholder="Search jasa atau satuan..."
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

    <template #cell-harga="{ row }">
      <CurrencyDisplay :value="row.harga" align="right" />
    </template>

    <template #cell-minimHarga="{ row }">
      <CurrencyDisplay :value="row.minimHarga" align="right" />
    </template>

    <template #cell-satuan="{ row }">
      <span class="inline-flex rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300">
        {{ row.satuan }}
      </span>
    </template>

    <template #cell-status="{ row }">
      <SalesStatusBadge :status="row.status" />
    </template>

    <template #cell-actions="{ row }">
      <div class="inline-flex items-center gap-1.5 justify-center">
        <SalesActionButton
          action="view"
          label="View Detail Jasa"
          @click="emit('view', row)"
        />
        <SalesActionButton
          action="edit"
          label="Edit Jasa"
          @click="emit('edit', row)"
        />
        <SalesActionButton
          action="delete"
          label="Delete Jasa"
          @click="emit('delete', row.id)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>

