<script setup lang="ts">
import type { JobProgress } from '#server/types/job-progress'
import type { DateRangeValue } from '~/composables/useDateRange'
import DateRangePicker from '~/components/Common/DateRangePicker.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'

defineProps<{ items: JobProgress[]; searchQuery: string; process?: string; dateRange?: DateRangeValue | null; busyId?: string }>()
defineEmits<{
  'update:searchQuery': [value: string]
  'update:process': [value: string]
  'update:dateRange': [value: DateRangeValue | null]
  toggle: [item: JobProgress]
}>()
const columns = [
  { key: 'progressCode', label: '# Progress', sortable: true }, { key: 'product', label: 'Product', sortable: true },
  { key: 'description', label: 'Product Description' }, { key: 'process', label: 'Job Process', sortable: true },
  { key: 'completedBy', label: 'Complete by', sortable: true }, { key: 'completedAt', label: 'Time', sortable: true },
  { key: 'note', label: 'Note' }, { key: 'actions', label: 'Action', align: 'center' as const },
]
</script>

<template>
  <SalesDataTable :columns="columns" :items="items" :search="searchQuery" search-placeholder="Search..." @update:search="$emit('update:searchQuery', $event)">
    <template #filters>
      <DateRangePicker :model-value="dateRange" placeholder="Date" aria-label="Date" input-class="w-44 max-w-44" @update:model-value="$emit('update:dateRange', $event)" />
      <TableFilterSelect :model-value="process || ''" :options="['Printing', 'Cutting']" placeholder="Job Proses" aria-label="Job Proses" @update:model-value="$emit('update:process', $event)" />
    </template>
    <template #cell(progressCode)="{ item }"><span class="font-bold text-primary">{{ item.progressCode }}</span></template>
    <template #cell(product)="{ item }"><span class="font-semibold text-gray-900 dark:text-gray-100">{{ item.product }}</span></template>
    <template #cell(description)="{ item }"><span class="block max-w-72 whitespace-normal text-gray-600 dark:text-gray-400">{{ item.description }}</span></template>
    <template #cell(process)="{ item }"><span class="rounded border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-semibold dark:border-gray-700 dark:bg-gray-800">{{ item.process }}</span></template>
    <template #cell(completedBy)="{ item }">{{ item.completedBy || '-' }}</template>
    <template #cell(completedAt)="{ item }">{{ item.completedAt || '-' }}</template>
    <template #cell(note)="{ item }"><span class="italic">{{ item.note || '-' }}</span></template>
    <template #cell(actions)="{ item }"><div class="flex justify-center"><SalesActionButton :icon="item.isCompleted ? 'check-circle' : 'crosshair'" :label="item.isCompleted ? 'Mark as Pending' : 'Mark as Completed'" :disabled="busyId === item.id" @click="$emit('toggle', item)" /></div></template>
  </SalesDataTable>
</template>
