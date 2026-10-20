<script setup lang="ts">
import type { Designation } from '#server/types/designation'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import SalesStatusBadge from '~/components/Sales/SalesStatusBadge.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'

defineProps<{
  designations: Designation[]
  searchQuery: string
  filterStatus?: string
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterStatus': [value: string]
  edit: [designation: Designation]
  delete: [id: string]
}>()

const statusOptions = ['Active', 'Inactive']

const columns = [
  { key: 'name', label: 'Designation / Jabatan', sortable: true },
  { key: 'members', label: 'Members', sortable: false },
  { key: 'totalMembers', label: 'Total Members', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'createdOn', label: 'Created On', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="designations"
    :search="searchQuery"
    search-placeholder="Cari nama jabatan..."
    @update:search="emit('update:searchQuery', $event)"
  >
    <template #filters>
      <TableFilterSelect
        :model-value="filterStatus"
        label="Status"
        :options="statusOptions"
        @update:model-value="emit('update:filterStatus', $event)"
      />
    </template>

    <!-- Designation Name -->
    <template #cell(name)="{ item }">
      <div class="flex items-center gap-2">
        <span class="font-semibold text-gray-900 dark:text-gray-100">
          {{ item.name }}
        </span>
        <span class="text-[11px] text-gray-400">({{ item.id }})</span>
      </div>
    </template>

    <!-- Members -->
    <template #cell(members)="{ item }">
      <div class="flex flex-wrap items-center gap-1.5 py-1">
        <template v-if="item.members && item.members.length > 0">
          <span
            v-for="m in item.members.slice(0, 4)"
            :key="m"
            class="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {{ m }}
          </span>
          <span
            v-if="item.members.length > 4"
            class="inline-flex items-center rounded-full bg-gray-200 px-1.5 py-0.5 text-[10px] font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          >
            +{{ item.members.length - 4 }}
          </span>
        </template>
        <span v-else class="text-xs italic text-gray-400">
          No members
        </span>
      </div>
    </template>

    <!-- Total Members -->
    <template #cell(totalMembers)="{ item }">
      <span class="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary/10 px-2 text-xs font-bold text-primary dark:bg-primary/20 dark:text-primary-300">
        {{ item.totalMembers ?? (item.members?.length || 0) }}
      </span>
    </template>

    <!-- Created On -->
    <template #cell(createdOn)="{ item }">
      <span class="text-xs text-gray-600 dark:text-gray-400">
        {{ item.createdOn || '-' }}
      </span>
    </template>

    <!-- Status -->
    <template #cell(status)="{ item }">
      <SalesStatusBadge :status="item.status" />
    </template>

    <!-- Action -->
    <template #cell(actions)="{ item }">
      <div class="flex items-center justify-center gap-1.5">
        <SalesActionButton
          action="edit"
          label="Edit Designation"
          @click="emit('edit', item)"
        />
        <SalesActionButton
          action="delete"
          danger
          label="Delete Designation"
          @click="emit('delete', item.id)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>

<style scoped>
/* Scoped styles for DesignationTable */
</style>
