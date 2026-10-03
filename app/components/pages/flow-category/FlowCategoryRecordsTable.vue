<script setup lang="ts">
import type { FlowCategory } from '#server/types/flow-category'
import type { DateRangeValue } from '~/composables/useDateRange'
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'

const props = defineProps<{
  flowCategories: FlowCategory[]
  searchQuery: string
  filterCategory: string
  filterDateRange: DateRangeValue | null
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterCategory': [value: string]
  'update:filterDateRange': [value: DateRangeValue | null]
  edit: [item: FlowCategory]
  delete: [item: FlowCategory]
}>()

const categories = ['Design', 'Pracetak', 'Cetak', 'Finishing']

const columns = [
  { key: 'no', label: 'No', sortable: true },
  { key: 'name', label: 'Flow Process', sortable: true },
  { key: 'used', label: 'Used', sortable: true },
  { key: 'createdBy', label: 'Created By', sortable: true },
  { key: 'createdDate', label: 'Created Date', sortable: true },
  { key: 'actions', label: 'Action', sortable: false, align: 'center', class: 'w-28 text-center min-w-[100px] whitespace-nowrap' },
]
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="flowCategories"
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

      <!-- Flow Category Filter Dropdown (Reusable TableFilterSelect) -->
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

    <template #cell(name)="{ item }">
      <span class="font-medium text-gray-900 dark:text-gray-100">{{ item.name }}</span>
    </template>

    <template #cell(used)="{ item }">
      <span class="text-gray-700 dark:text-gray-300">{{ item.used }}</span>
    </template>

    <template #cell(createdBy)="{ item }">
      <span class="text-gray-600 dark:text-gray-400">{{ item.createdBy }}</span>
    </template>

    <template #cell(createdDate)="{ item }">
      <span class="text-gray-600 dark:text-gray-400">{{ item.createdDate }}</span>
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
