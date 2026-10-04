<script setup lang="ts">
import type { FlowName } from '#server/types/flow-name'
import type { DateRangeValue } from '~/composables/useDateRange'
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'

const props = defineProps<{
  flowNames: FlowName[]
  searchQuery: string
  filterCategory: string
  filterFlowName?: string
  filterDateRange: DateRangeValue | null
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterCategory': [value: string]
  'update:filterFlowName': [value: string]
  'update:filterDateRange': [value: DateRangeValue | null]
  edit: [item: FlowName]
  delete: [item: FlowName]
}>()

const categories = ['Design', 'Pracetak', 'Cetak', 'Finishing']
const flowNameOptions = ['Printing', 'Cutting', 'Design', 'Proofing', 'Laminating']

const columns = [
  { key: 'no', label: 'No', sortable: true },
  { key: 'category', label: 'Flow Category', sortable: true },
  { key: 'name', label: 'Flow Name', sortable: true },
  { key: 'incentiveAmount', label: 'Incentive Amount (Rp)', sortable: true, align: 'end' as const },
  { key: 'unitIncentive', label: 'Unit Incentive', sortable: true },
  { key: 'flowAssignee', label: 'Flow Assignee', sortable: true },
  { key: 'flowType', label: 'Flow Type', sortable: true },
  { key: 'createDate', label: 'Create Date', sortable: true },
  { key: 'actions', label: 'Action', sortable: false, align: 'center', class: 'w-28 text-center min-w-[100px] whitespace-nowrap' },
]
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="flowNames"
    :search="searchQuery"
    search-placeholder="Search..."
    @update:search="$emit('update:searchQuery', $event)"
  >
    <template #filters>
      <!-- Date Range Picker -->
      <DateRangePicker
        :model-value="filterDateRange"
        aria-label="Date"
        input-class="w-44 max-w-44"
        align="end"
        placeholder="Date"
        @update:model-value="$emit('update:filterDateRange', $event)"
      />

      <!-- Flow Name Filter Dropdown (Reusable TableFilterSelect) -->
      <TableFilterSelect
        :model-value="filterFlowName || ''"
        :options="flowNameOptions"
        placeholder="Flow Name"
        aria-label="Flow Name"
        @update:model-value="$emit('update:filterFlowName', $event)"
      />

      <!-- Category Filter Dropdown (Reusable TableFilterSelect) -->
      <TableFilterSelect
        :model-value="filterCategory"
        :options="categories"
        placeholder="Flow Category"
        aria-label="Flow Category"
        @update:model-value="$emit('update:filterCategory', $event)"
      />
    </template>

    <template #cell(no)="{ item }">
      <span class="font-medium text-gray-900 dark:text-gray-100">{{ item.no }}</span>
    </template>

    <template #cell(category)="{ item }">
      <span class="text-gray-700 dark:text-gray-300">{{ item.category }}</span>
    </template>

    <template #cell(name)="{ item }">
      <span class="font-medium text-gray-900 dark:text-gray-100">{{ item.name }}</span>
    </template>

    <template #cell(incentiveAmount)="{ item }">
      <CurrencyDisplay :value="item.incentiveAmount" prefix="" align="right" class="w-full text-gray-800 dark:text-gray-200" />
    </template>

    <template #cell(unitIncentive)="{ item }">
      <span class="text-gray-700 dark:text-gray-300">{{ item.unitIncentive }}</span>
    </template>

    <template #cell(flowAssignee)="{ item }">
      <span class="text-gray-600 dark:text-gray-400">{{ item.flowAssignee }}</span>
    </template>

    <template #cell(flowType)="{ item }">
      <span
        :class="[
          'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold',
          item.flowType.toLowerCase().includes('inhouse')
            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
            : 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
        ]"
      >
        {{ item.flowType }}
      </span>
    </template>

    <template #cell(createDate)="{ item }">
      <span class="text-xs text-gray-500 dark:text-gray-400">{{ item.createDate }}</span>
    </template>

    <template #cell(actions)="{ item }">
      <div class="flex items-center justify-center gap-1.5 whitespace-nowrap flex-nowrap shrink-0">
        <SalesActionButton
          icon="edit"
          label="Edit"
          @click="$emit('edit', item)"
        />
        <SalesActionButton
          icon="trash-2"
          label="Delete"
          @click="$emit('delete', item)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>
