<script setup lang="ts">
import type { SalesReportItem } from '#server/types/reports-sales'
import type { DateRangeValue } from '~/composables/useDateRange'
import DateRangePicker from '~/components/Common/DateRangePicker.vue'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'

defineProps<{ items: SalesReportItem[]; search: string; dateRange: DateRangeValue | null }>()
const emit = defineEmits<{
  'update:search': [value: string]
  'update:dateRange': [value: DateRangeValue | null]
  view: [item: SalesReportItem]
}>()
const columns = [
  { key: 'category', label: 'Product Category', sortable: true },
  { key: 'soldQty', label: 'Sold Qty', sortable: true, align: 'center' as const },
  { key: 'unit', label: 'Unit', sortable: true },
  { key: 'totalSales', label: 'Total Sales', sortable: true, align: 'end' as const },
  { key: 'totalDue', label: 'Total Sales Due', sortable: true, align: 'end' as const },
  { key: 'totalAmount', label: 'Total Sales Amount', sortable: true, align: 'end' as const },
  { key: 'percentage', label: 'Percentage', sortable: true, align: 'end' as const },
  { key: 'action', label: 'Action', align: 'center' as const },
]
</script>

<template>
  <SalesDataTable :columns="columns" :items="items" :search="search" search-placeholder="Search" @update:search="emit('update:search', $event)">
    <template #filters>
      <DateRangePicker :model-value="dateRange" input-class="w-60" @update:model-value="emit('update:dateRange', $event)" />
    </template>
    <template #cell(category)="{ item }"><span class="font-medium text-gray-900 dark:text-white">{{ item.category }}</span></template>
    <template #cell(soldQty)="{ item }"><span class="font-mono">{{ item.soldQty.toLocaleString('id-ID') }}</span></template>
    <template #cell(totalSales)="{ item }"><CurrencyDisplay :value="item.totalSales" /></template>
    <template #cell(totalDue)="{ item }"><span v-if="item.totalDue === 0">-</span><CurrencyDisplay v-else :value="item.totalDue" /></template>
    <template #cell(totalAmount)="{ item }"><CurrencyDisplay :value="item.totalAmount" /></template>
    <template #cell(percentage)="{ item }"><span class="font-semibold">{{ Number(item.percentage).toFixed(2) }}%</span></template>
    <template #cell(action)="{ item }"><SalesActionButton action="view" label="View Details" @click="emit('view', item)" /></template>
  </SalesDataTable>
</template>
