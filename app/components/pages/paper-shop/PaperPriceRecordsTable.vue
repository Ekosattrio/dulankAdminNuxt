<script setup lang="ts">
import type { PaperPrice, PaperGroup } from '#server/types/paper-shop'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'
import SalesStatusBadge from '~/components/sales/SalesStatusBadge.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'

const props = defineProps<{
  prices: PaperPrice[]
  groups?: PaperGroup[]
}>()

const emit = defineEmits<{
  (e: 'edit', item: PaperPrice): void
  (e: 'delete', id: string): void
}>()

const searchQuery = ref('')
const filterStatus = ref('')
const filterGroup = ref('')

const groupOptions = computed(() => {
  const set = new Set<string>()
  props.prices.forEach((p) => {
    if (p.group) set.add(p.group)
  })
  return [
    { label: 'All Groups', value: '' },
    ...Array.from(set).map((g) => ({ label: g, value: g }))
  ]
})

const columns = [
  { key: 'nama', label: 'Nama Kertas', sortable: true },
  { key: 'group', label: 'Group Kertas', sortable: true },
  { key: 'merk', label: 'Merk', sortable: true },
  { key: 'ukuran', label: 'Ukuran', sortable: true },
  { key: 'satuan', label: 'Satuan', sortable: true, align: 'center' as const },
  { key: 'gramatur', label: 'Gramatur', sortable: true, align: 'center' as const },
  { key: 'minOrder', label: 'Min Order', sortable: true, align: 'center' as const },
  { key: 'kelipatan', label: 'Kelipatan', sortable: true, align: 'center' as const },
  { key: 'harga', label: 'Harga Kertas', sortable: true, align: 'right' as const },
  { key: 'update', label: 'Update', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'actions', label: 'Action', align: 'center' as const }
]

const filteredItems = computed(() => {
  return props.prices.filter((p) => {
    const matchStatus = !filterStatus.value || p.status === filterStatus.value
    const matchGroup = !filterGroup.value || p.group.toLowerCase() === filterGroup.value.toLowerCase()
    const matchSearch =
      !searchQuery.value ||
      p.nama.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.group.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.merk.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      String(p.gramatur).includes(searchQuery.value)
    return matchStatus && matchGroup && matchSearch
  })
})
</script>

<template>
  <SalesDataTable
    :rows="filteredItems"
    :columns="columns"
    v-model:search="searchQuery"
    search-placeholder="Search nama kertas, group, merk..."
  >
    <template #filters>
      <TableFilterSelect
        v-model="filterGroup"
        :options="groupOptions"
        placeholder="Group Kertas"
      />
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

    <template #cell-nama="{ row }">
      <span class="font-semibold text-gray-900 dark:text-gray-100">{{ row.nama }}</span>
    </template>

    <template #cell-group="{ row }">
      <span class="text-gray-700 dark:text-gray-300">{{ row.group }}</span>
    </template>

    <template #cell-merk="{ row }">
      <span class="text-gray-600 dark:text-gray-400">{{ row.merk }}</span>
    </template>

    <template #cell-ukuran="{ row }">
      <span class="font-mono text-xs text-gray-700 dark:text-gray-300">{{ row.ukuran }}</span>
    </template>

    <template #cell-satuan="{ row }">
      <span class="text-xs text-gray-600 dark:text-gray-400">{{ row.satuan }}</span>
    </template>

    <template #cell-gramatur="{ row }">
      <span class="font-bold text-gray-800 dark:text-gray-200">{{ row.gramatur }}</span>
    </template>

    <template #cell-minOrder="{ row }">
      <span class="text-xs text-gray-600 dark:text-gray-400">{{ row.minOrder }}</span>
    </template>

    <template #cell-kelipatan="{ row }">
      <span class="text-xs text-gray-600 dark:text-gray-400">{{ row.kelipatan }}</span>
    </template>

    <template #cell-harga="{ row }">
      <div>
        <CurrencyDisplay :value="row.harga" align="right" class="font-bold text-gray-900 dark:text-gray-100" />
        <span class="text-xs text-gray-500">/ {{ row.satuan }}</span>
      </div>
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
          label="Edit Harga Kertas"
          @click="emit('edit', row)"
        />
        <SalesActionButton
          action="delete"
          label="Delete Harga Kertas"
          @click="emit('delete', row.id)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>

