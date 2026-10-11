<script setup lang="ts">
import type { VoucherMeta, VoucherRecord } from '#server/types/voucher'
import type { DateRangeValue } from '~/composables/useDateRange'
import { formatVoucherDate, formatVoucherDiscount } from '~/utils/voucher'

const props = defineProps<{ items: VoucherRecord[]; meta: VoucherMeta; search: string; name: string; type: string; storeId: string; productId: string; dateRange: DateRangeValue | null }>()
const emit = defineEmits<{
  'update:search': [value: string]; 'update:name': [value: string]; 'update:type': [value: string]; 'update:storeId': [value: string]; 'update:productId': [value: string]; 'update:dateRange': [value: DateRangeValue | null]
  report: []; edit: [item: VoucherRecord]; delete: [item: VoucherRecord]
}>()
const columns = [
  { key: 'name', label: 'Name', sortable: true }, { key: 'code', label: 'Code', sortable: true },
  { key: 'type', label: 'Type', sortable: true }, { key: 'discount', label: 'Discount', sortable: true, align: 'right' as const },
  { key: 'limit', label: 'Limit', sortable: true, align: 'right' as const }, { key: 'used', label: 'Used', sortable: true, align: 'right' as const },
  { key: 'endDate', label: 'Valid', sortable: true }, { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'actions', label: 'Action', align: 'center' as const },
]
const storeOptions = computed(() => props.meta.stores.map(item => ({ label: item.name, value: item.id })))
const productOptions = computed(() => props.meta.filterProducts.map(item => ({ label: item.name, value: item.id })))
</script>

<template>
  <SalesDataTable :columns="columns" :items="items" :search="search" search-placeholder="Search..." @update:search="emit('update:search', $event)">
    <template #filters>
      <DateRangePicker :model-value="dateRange" aria-label="Date" placeholder="Date" align="end" @update:model-value="emit('update:dateRange', $event)" />
      <TableFilterSelect :model-value="storeId" :options="storeOptions" placeholder="Store" @update:model-value="emit('update:storeId', $event)" />
      <TableFilterSelect :model-value="productId" :options="productOptions" placeholder="Product" @update:model-value="emit('update:productId', $event)" />
      <TableFilterSelect :model-value="name" :options="meta.names" placeholder="Choose Name" @update:model-value="emit('update:name', $event)" />
      <TableFilterSelect :model-value="type" :options="['Fixed', 'Percentage']" placeholder="Choose Type" @update:model-value="emit('update:type', $event)" />
      <button type="button" class="h-9 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-primary/90" @click="emit('report')">Report</button>
    </template>
    <template #cell(name)="{ item }"><span class="font-semibold text-gray-900 dark:text-white">{{ item.name }}</span></template>
    <template #cell(code)="{ item }"><span class="inline-flex rounded border border-cyan-200 bg-cyan-50 px-2 py-1 text-xs font-semibold text-cyan-700 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-300">{{ item.code }}</span></template>
    <template #cell(discount)="{ item }"><span class="font-mono tabular-nums">{{ formatVoucherDiscount(item) }}</span></template>
    <template #cell(limit)="{ item }">{{ item.limit === 0 ? 'Unlimited' : String(item.limit).padStart(2, '0') }}</template>
    <template #cell(used)="{ item }">{{ String(item.used).padStart(2, '0') }}</template>
    <template #cell(endDate)="{ item }">{{ formatVoucherDate(item.endDate) }}</template>
    <template #cell(status)="{ item }"><SalesStatusBadge :status="item.status" /></template>
    <template #cell(actions)="{ item }"><div class="flex items-center justify-center gap-1.5"><SalesActionButton action="edit" label="Edit Coupon" @click="emit('edit', item)" /><SalesActionButton action="delete" label="Delete Coupon" danger @click="emit('delete', item)" /></div></template>
  </SalesDataTable>
</template>
