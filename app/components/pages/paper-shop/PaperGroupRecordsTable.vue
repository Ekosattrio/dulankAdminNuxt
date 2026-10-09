<script setup lang="ts">
import type { PaperGroup } from '#server/types/paper-shop'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'
import SalesStatusBadge from '~/components/sales/SalesStatusBadge.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'

const props = defineProps<{
  groups: PaperGroup[]
}>()

const emit = defineEmits<{
  (e: 'view', item: PaperGroup): void
  (e: 'edit', item: PaperGroup): void
  (e: 'delete', id: string): void
}>()

const searchQuery = ref('')
const filterStatus = ref('')

const columns = [
  { key: 'name', label: "Paper's Group", sortable: true },
  { key: 'merk', label: 'Merk', sortable: true },
  { key: 'priceType', label: 'Price Type', sortable: true, align: 'center' as const },
  { key: 'update', label: 'Update', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'actions', label: 'Action', align: 'center' as const }
]

const filteredItems = computed(() => {
  return props.groups.filter((g) => {
    const matchStatus = !filterStatus.value || g.status === filterStatus.value
    const matchSearch =
      !searchQuery.value ||
      g.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      g.merk.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchStatus && matchSearch
  })
})
</script>

<template>
  <SalesDataTable
    :rows="filteredItems"
    :columns="columns"
    v-model:search="searchQuery"
    search-placeholder="Search paper group or merk..."
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

    <template #cell-merk="{ row }">
      <span class="text-gray-700 dark:text-gray-300">{{ row.merk }}</span>
    </template>

    <template #cell-priceType="{ row }">
      <span class="inline-flex rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-300">
        {{ row.priceType }}
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
          action="view"
          label="View Paper Group"
          @click="emit('view', row)"
        />
        <SalesActionButton
          action="edit"
          label="Edit Paper Group"
          @click="emit('edit', row)"
        />
        <SalesActionButton
          action="delete"
          label="Delete Paper Group"
          @click="emit('delete', row.id)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>

