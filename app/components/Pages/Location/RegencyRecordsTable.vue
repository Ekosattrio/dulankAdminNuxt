<script setup lang="ts">
import type { Regency } from '#server/types/location'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'

defineProps<{
  items: Regency[]
  search: string
  filterProvince: string
  filterStatus: string
  sortOrder: 'newest' | 'oldest' | 'name-asc' | 'name-desc'
  provinceOptions: string[]
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:filterProvince': [value: string]
  'update:filterStatus': [value: string]
  'update:sortOrder': [value: 'newest' | 'oldest' | 'name-asc' | 'name-desc']
  edit: [item: Regency]
  delete: [item: Regency]
}>()

const statusOptions = ['Active', 'Inactive']

const columns = [
  { key: 'province', label: 'Province', sortable: true },
  { key: 'name', label: 'Regency / City', sortable: true },
  { key: 'added', label: 'Added', sortable: true },
  { key: 'createdBy', label: 'Created by', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="items"
    :search="search"
    search-placeholder="Search Regency, Province..."
    @update:search="emit('update:search', $event)"
  >
    <!-- Filters slot -->
    <template #filters>
      <TableFilterSelect
        :model-value="filterProvince"
        :options="provinceOptions"
        placeholder="All Provinces"
        aria-label="Filter province"
        @update:model-value="emit('update:filterProvince', $event)"
      />

      <TableFilterSelect
        :model-value="filterStatus"
        :options="statusOptions"
        placeholder="All Status"
        aria-label="Filter status"
        @update:model-value="emit('update:filterStatus', $event)"
      />

      <select
        :value="sortOrder"
        aria-label="Sort order"
        class="rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
        @change="emit('update:sortOrder', ($event.target as HTMLSelectElement).value as any)"
      >
        <option value="newest">Sort: Newest</option>
        <option value="oldest">Sort: Oldest</option>
        <option value="name-asc">Name: A to Z</option>
        <option value="name-desc">Name: Z to A</option>
      </select>
    </template>

    <!-- Custom Cells -->
    <template #cell(province)="{ item }">
      <span class="inline-flex items-center gap-1.5 font-medium text-gray-800 dark:text-gray-200">
        <FeatherIcon name="map-pin" :size="13" class="text-primary/70" />
        {{ item.province }}
      </span>
    </template>

    <template #cell(name)="{ item }">
      <div class="flex items-center gap-2">
        <span class="font-semibold text-gray-900 dark:text-white">{{ item.name }}</span>
        <span
          class="rounded px-1.5 py-0.5 text-[10px] font-semibold"
          :class="item.type === 'Kabupaten' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300' : 'bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300'"
        >
          {{ item.type || 'Kota' }}
        </span>
      </div>
    </template>

    <template #cell(added)="{ item }">
      <span class="text-xs text-gray-600 dark:text-gray-400">{{ item.added }}</span>
    </template>

    <template #cell(createdBy)="{ item }">
      <div class="flex items-center gap-2">
        <img
          :src="item.avatar || '/assets/img/users/user-30.jpg'"
          :alt="item.createdBy"
          class="size-7 rounded-full object-cover border border-gray-200 dark:border-gray-700"
          @error="($event.target as HTMLImageElement).src = '/assets/img/users/user-30.jpg'"
        />
        <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ item.createdBy }}</span>
      </div>
    </template>

    <template #cell(status)="{ item }">
      <span
        class="inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium"
        :class="item.status === 'Inactive' ? 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400'"
      >
        {{ item.status || 'Active' }}
      </span>
    </template>

    <template #cell(actions)="{ item }">
      <div class="flex items-center justify-center gap-1.5">
        <SalesActionButton
          action="edit"
          label="Edit Regency"
          @click="emit('edit', item)"
        />
        <SalesActionButton
          action="delete"
          label="Delete Regency"
          @click="emit('delete', item)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>

