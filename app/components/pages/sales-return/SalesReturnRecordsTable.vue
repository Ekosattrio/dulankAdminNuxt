<script setup lang="ts">
import type { SalesReturn } from '#server/types/sales-return'
defineProps<{ items: SalesReturn[]; search: string; paymentStatus: string }>()
defineEmits<{
  'update:search': [value: string]
  'update:paymentStatus': [value: string]
  view: [item: SalesReturn]
  edit: [item: SalesReturn]
  payment: [item: SalesReturn]
  delete: [item: SalesReturn]
  print: []
}>()
const { formatRupiah } = useFormatters()
const columns = [
  { key: 'returnNo', label: 'No Return', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'salesNo', label: 'No Sales', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'paymentStatus', label: 'Payment Status', sortable: true },
  { key: 'paymentDate', label: 'Payment Date' },
  { key: 'paymentMethod', label: 'Payment Method' },
  { key: 'total', label: 'Total', sortable: true, align: 'end' as const },
  { key: 'actions', label: 'Action' },
]
</script>
<template>
  <SalesDataTable
    :columns="columns"
    :items="items"
    :search="search"
    @update:search="$emit('update:search', $event)"
  >
    <template #filters
      ><select
        :value="paymentStatus"
        aria-label="Payment Status"
        :class="salesField"
        class="!w-auto"
        @change="$emit('update:paymentStatus', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">Payment Status</option>
        <option>Paid</option>
        <option>Unpaid</option>
      </select></template
    >
    <template #cell(paymentStatus)="{ item }"><SalesStatusBadge :status="item.paymentStatus" /></template>
    <template #cell(total)="{ item }">{{ formatRupiah(item.total) }}</template>
    <template #cell(actions)="{ item }"
      ><div class="flex items-center gap-1.5">
        <SalesActionButton icon="eye" label="View return details" @click="$emit('view', item)" />
        <SalesActionButton
          v-if="item.paymentStatus === 'Unpaid'"
          icon="credit-card"
          label="Payment-OUT"
          @click="$emit('payment', item)"
        />
        <SalesActionButton icon="edit" label="Edit return" @click="$emit('edit', item)" />
        <SalesActionButton icon="trash-2" label="Delete return" @click="$emit('delete', item)" /></div
    ></template>
    <template #footer="{ items }"
      ><tr>
        <td colspan="7" class="px-4 py-3">Total</td>
        <td class="px-4 py-3 text-right">
          {{ formatRupiah(items.reduce((sum, item) => sum + item.total, 0)) }}
        </td>
        <td /></tr
    ></template>
  </SalesDataTable>
</template>
