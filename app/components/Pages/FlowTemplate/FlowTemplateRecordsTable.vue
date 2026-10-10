<script setup lang="ts">
import type { FlowTemplate } from '#server/types/flow-template'
import type { DateRangeValue } from '~/composables/useDateRange'
import DateRangePicker from '~/components/Common/DateRangePicker.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'

const props = defineProps<{
  flowTemplates: FlowTemplate[]
  searchQuery: string
  filterTemplate?: string
  filterDateRange?: DateRangeValue | null
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterTemplate': [value: string]
  'update:filterDateRange': [value: DateRangeValue | null]
  edit: [item: FlowTemplate]
  delete: [item: FlowTemplate]
}>()

const templateOptions = ['Design', 'Pracetak', 'Cetak', 'Finishing']

const columns = [
  { key: 'no', label: 'No', sortable: true },
  { key: 'name', label: 'Flow Template', sortable: true },
  { key: 'information', label: 'Information', sortable: false, class: '!whitespace-normal min-w-[280px]' },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'w-28 text-center min-w-[100px] whitespace-nowrap' },
]
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="flowTemplates"
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

      <!-- Flow Template Filter Dropdown (Reusable TableFilterSelect) -->
      <TableFilterSelect
        :model-value="filterTemplate || ''"
        :options="templateOptions"
        placeholder="Flow Template"
        aria-label="Flow Template"
        @update:model-value="$emit('update:filterTemplate', $event)"
      />
    </template>

    <template #cell(no)="{ item }">
      <span class="font-medium text-gray-900 dark:text-gray-100">{{ item.no }}</span>
    </template>

    <template #cell(name)="{ item }">
      <span class="font-semibold text-gray-900 dark:text-gray-100">{{ item.name }}</span>
    </template>

    <template #cell(information)="{ item }">
      <div class="min-w-[280px] max-w-xl break-words text-xs leading-relaxed text-gray-600 dark:text-gray-400">
        {{ item.information }}
      </div>
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
