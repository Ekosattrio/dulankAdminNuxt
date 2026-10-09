<script setup lang="ts">
import type { EmployeeItem } from '#server/types/employee'
import type { DateRangeValue } from '~/composables/useDateRange'
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'

defineProps<{
  employees: EmployeeItem[]
  searchQuery: string
  filterDepartment?: string
  filterStatus?: string
  filterDateRange?: DateRangeValue | null
  departmentOptions: string[]
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterDepartment': [value: string]
  'update:filterStatus': [value: string]
  'update:filterDateRange': [value: DateRangeValue | null]
  'view': [employee: EmployeeItem]
  'edit': [employee: EmployeeItem]
  'delete': [employee: EmployeeItem]
}>()

const statusOptions = ['Active', 'Resign', 'Inactive']

const columns = [
  { key: 'id', label: 'Employee ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'department', label: 'Department', sortable: true },
  { key: 'address', label: 'Alamat', sortable: true },
  { key: 'phone', label: 'Phone', sortable: true },
  { key: 'joinDate', label: 'Join', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]

function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'Active':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
    case 'Resign':
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
  }
}
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="employees"
    :search="searchQuery"
    search-placeholder="Search Employee ID, Name, Phone, Email..."
    @update:search="emit('update:searchQuery', $event)"
  >
    <template #filters>
      <!-- Date Range Filter -->
      <DateRangePicker
        :model-value="filterDateRange"
        input-class="h-9"
        @update:model-value="emit('update:filterDateRange', $event)"
      />

      <!-- Department Filter -->
      <TableFilterSelect
        :model-value="filterDepartment"
        label="Department"
        :options="departmentOptions"
        @update:model-value="emit('update:filterDepartment', $event)"
      />

      <!-- Status Filter -->
      <TableFilterSelect
        :model-value="filterStatus"
        label="Status"
        :options="statusOptions"
        @update:model-value="emit('update:filterStatus', $event)"
      />
    </template>

    <template #cell(id)="{ item }">
      <span class="font-semibold text-primary dark:text-primary-400">
        {{ item.id }}
      </span>
    </template>

    <template #cell(name)="{ item }">
      <div class="flex items-center gap-2.5">
        <div v-if="item.avatar" class="h-8 w-8 overflow-hidden rounded-full border border-gray-200 dark:border-gray-700">
          <img :src="item.avatar" :alt="item.name" class="h-full w-full object-cover">
        </div>
        <div v-else class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary dark:bg-primary/20 dark:text-primary-300">
          {{ item.name.charAt(0).toUpperCase() }}
        </div>
        <div class="flex flex-col">
          <span class="font-medium text-gray-900 dark:text-gray-100">{{ item.name }}</span>
          <span v-if="item.email" class="text-[11px] text-gray-500 dark:text-gray-400">{{ item.email }}</span>
        </div>
      </div>
    </template>

    <template #cell(department)="{ item }">
      <span class="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {{ item.department }}
      </span>
    </template>

    <template #cell(address)="{ item }">
      <span class="text-xs text-gray-600 dark:text-gray-300 line-clamp-1" :title="item.detailAddress ? `${item.address}, ${item.detailAddress}` : item.address">
        {{ item.address }}{{ item.detailAddress ? `, ${item.detailAddress}` : '' }}
      </span>
    </template>

    <template #cell(phone)="{ item }">
      <span class="text-xs text-gray-600 dark:text-gray-300">{{ item.phone || '-' }}</span>
    </template>

    <template #cell(joinDate)="{ item }">
      <span class="text-xs text-gray-500 dark:text-gray-400">{{ item.joinDate || '-' }}</span>
    </template>

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

    <template #cell(actions)="{ item }">
      <div class="flex items-center justify-center gap-1.5">
        <SalesActionButton
          icon="eye"
          tooltip="View Employee Details"
          @click="emit('view', item)"
        />
        <SalesActionButton
          icon="edit"
          tooltip="Edit Employee"
          @click="emit('edit', item)"
        />
        <SalesActionButton
          icon="trash-2"
          tooltip="Delete Employee"
          danger
          @click="emit('delete', item)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>
