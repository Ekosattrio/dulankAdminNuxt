<script setup lang="ts">
import type { Unit } from '#server/types/unit'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesStatusBadge from '~/components/sales/SalesStatusBadge.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'

const props = defineProps<{
  units: Unit[]
  searchQuery: string
  filterStatus: string
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', val: string): void
  (e: 'update:filterStatus', val: string): void
  (e: 'edit-unit', item: Unit): void
  (e: 'delete-unit', id: string): void
}>()

const columns = [
  { key: 'name', label: 'Unit', sortable: true },
  { key: 'shortName', label: 'Short Name', sortable: true },
  { key: 'itemUsed', label: 'Item Used', sortable: true, align: 'center' as const },
  { key: 'createdOn', label: 'Created On', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'action', label: 'Action', align: 'center' as const },
]

const searchModel = computed({
  get: () => props.searchQuery,
  set: (val: string) => emit('update:searchQuery', val),
})

const statusModel = computed({
  get: () => props.filterStatus,
  set: (val: string) => emit('update:filterStatus', val),
})

const filteredList = computed(() => {
  return props.units.filter((u) => {
    const q = searchModel.value.toLowerCase().trim()
    const matchesSearch =
      !q ||
      u.name?.toLowerCase().includes(q) ||
      u.shortName?.toLowerCase().includes(q)
    const matchesStatus = !statusModel.value || u.status === statusModel.value
    return matchesSearch && matchesStatus
  })
})
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="filteredList"
    :search="searchModel"
    search-placeholder="Search unit name or short name..."
    @update:search="searchModel = $event"
  >
    <template #filters>
      <TableFilterSelect
        v-model="statusModel"
        :options="['Active', 'Inactive']"
        placeholder="All Status"
        aria-label="Filter status unit"
        width-class="w-36"
      />
    </template>

    <template #cell(name)="{ item }">
      <div class="font-medium text-gray-900 dark:text-gray-100">
        {{ item.name }}
      </div>
    </template>

    <template #cell(shortName)="{ item }">
      <span class="inline-flex items-center rounded bg-gray-100 px-2.5 py-0.5 font-mono text-xs font-semibold text-gray-800 dark:bg-gray-800 dark:text-gray-200">
        {{ item.shortName }}
      </span>
    </template>

    <template #cell(itemUsed)="{ item }">
      <span class="inline-flex items-center rounded bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-950 dark:text-blue-300">
        {{ item.itemUsed ?? 0 }} items
      </span>
    </template>

    <template #cell(createdOn)="{ item }">
      <span class="text-sm text-gray-600 dark:text-gray-400">
        {{ item.createdOn || '-' }}
      </span>
    </template>

    <template #cell(status)="{ item }">
      <SalesStatusBadge :status="item.status" />
    </template>

    <template #cell(action)="{ item }">
      <div class="flex items-center justify-center gap-1.5">
        <SalesActionButton
          action="edit"
          label="Edit Unit"
          @click="emit('edit-unit', item)"
        />
        <SalesActionButton
          action="delete"
          label="Delete Unit"
          @click="emit('delete-unit', item.id)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>
