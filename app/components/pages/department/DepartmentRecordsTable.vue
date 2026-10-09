<script setup lang="ts">
import type { Department } from '#server/types/department'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'

defineProps<{
  departments: Department[]
  searchQuery: string
  filterStatus?: string
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterStatus': [value: string]
  'edit': [department: Department]
  'delete': [department: Department]
}>()

const statusOptions = ['Active', 'Disable']

const columns = [
  { key: 'name', label: 'Department', sortable: true },
  { key: 'members', label: 'Member', sortable: false },
  { key: 'totalMembers', label: 'Total Member', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'createdDate', label: 'Created', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]

function getStatusBadgeClass(status: string) {
  if (status === 'Active') {
    return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
  }
  return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
}
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="departments"
    :search="searchQuery"
    search-placeholder="Search Department or member..."
    @update:search="emit('update:searchQuery', $event)"
  >
    <template #filters>
      <!-- Status Filter -->
      <TableFilterSelect
        :model-value="filterStatus"
        label="Status"
        :options="statusOptions"
        @update:model-value="emit('update:filterStatus', $event)"
      />
    </template>

    <!-- Department Name -->
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
            v-for="m in item.members"
            :key="m"
            class="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
          >
            {{ m }}
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

    <!-- Created Date -->
    <template #cell(createdDate)="{ item }">
      <span class="text-xs text-gray-500 dark:text-gray-400">
        {{ item.createdDate || '-' }}
      </span>
    </template>

    <!-- Status -->
    <template #cell(status)="{ item }">
      <span
        :class="[
          'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold',
          getStatusBadgeClass(item.status)
        ]"
      >
        {{ item.status }}
      </span>
    </template>

    <!-- Action -->
    <template #cell(actions)="{ item }">
      <div class="flex items-center justify-center gap-1.5">
        <SalesActionButton
          icon="edit"
          tooltip="Edit Department"
          @click="emit('edit', item)"
        />
        <SalesActionButton
          icon="trash-2"
          tooltip="Delete Department"
          danger
          @click="emit('delete', item)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>
