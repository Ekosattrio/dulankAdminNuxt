<script setup lang="ts">
import type { EmployeeSalaryItem } from '#server/types/employeeSalary'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'

defineProps<{
  salaries: EmployeeSalaryItem[]
  searchQuery: string
  filterSystem?: string
  filterStatus?: string
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterSystem': [value: string]
  'update:filterStatus': [value: string]
  'view': [salary: EmployeeSalaryItem]
  'edit': [salary: EmployeeSalaryItem]
  'delete': [salary: EmployeeSalaryItem]
}>()

const systemOptions = ['Monthly', 'Weekly', 'Daily']
const statusOptions = ['Active', 'Disabled']

const columns = [
  { key: 'employeeId', label: 'Employee ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'salary', label: 'Salary (IDR)', sortable: true, align: 'right' as const, class: 'text-right' },
  { key: 'system', label: 'System', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'allowanceTotal', label: 'Allowance (IDR)', sortable: true, align: 'right' as const, class: 'text-right' },
  { key: 'overtimeRate', label: 'Overtime Rate', sortable: true, align: 'right' as const, class: 'text-right' },
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
    :items="salaries"
    :search="searchQuery"
    search-placeholder="Search Employee ID or Name..."
    @update:search="emit('update:searchQuery', $event)"
  >
    <template #filters>
      <!-- System Filter -->
      <TableFilterSelect
        :model-value="filterSystem"
        label="System"
        :options="systemOptions"
        @update:model-value="emit('update:filterSystem', $event)"
      />

      <!-- Status Filter -->
      <TableFilterSelect
        :model-value="filterStatus"
        label="Status"
        :options="statusOptions"
        @update:model-value="emit('update:filterStatus', $event)"
      />
    </template>

    <!-- Employee ID -->
    <template #cell(employeeId)="{ item }">
      <span class="font-semibold text-primary dark:text-primary-400">
        {{ item.employeeId }}
      </span>
    </template>

    <!-- Name -->
    <template #cell(name)="{ item }">
      <div class="flex items-center gap-2">
        <div class="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary dark:bg-primary/20 dark:text-primary-300">
          {{ item.name.charAt(0).toUpperCase() }}
        </div>
        <span class="font-medium text-gray-900 dark:text-gray-100">
          {{ item.name }}
        </span>
      </div>
    </template>

    <!-- Salary -->
    <template #cell(salary)="{ item }">
      <div class="text-right font-medium text-gray-900 dark:text-gray-100">
        <CurrencyDisplay :value="item.salary" align="right" />
      </div>
    </template>

    <!-- System -->
    <template #cell(system)="{ item }">
      <span class="inline-flex items-center rounded-md border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs font-medium text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {{ item.system }}
      </span>
    </template>

    <!-- Allowance Total -->
    <template #cell(allowanceTotal)="{ item }">
      <div class="text-right text-xs text-gray-600 dark:text-gray-300">
        <CurrencyDisplay :value="item.allowanceTotal" align="right" />
      </div>
    </template>

    <!-- Overtime Rate -->
    <template #cell(overtimeRate)="{ item }">
      <div class="text-right text-xs text-gray-600 dark:text-gray-300">
        <CurrencyDisplay :value="item.overtimeRate" align="right" />
        <span class="text-[10px] text-gray-400">/jam</span>
      </div>
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
          icon="eye"
          tooltip="View Details"
          @click="emit('view', item)"
        />
        <SalesActionButton
          icon="edit"
          tooltip="Edit Salary"
          @click="emit('edit', item)"
        />
        <SalesActionButton
          icon="trash-2"
          tooltip="Delete Record"
          danger
          @click="emit('delete', item)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>
