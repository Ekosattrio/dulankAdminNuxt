<script setup lang="ts">
import type { Quotation } from '#server/types/quotation'
defineProps<{ quotations: Quotation[]; searchQuery: string; filterStatus: string }>()
defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterStatus': [value: string]
  'edit-quotation': [item: Quotation]
  'delete-quotation': [id: string]
  'print-table': []
  'export-pdf': []
  refresh: []
  'add-quotation': []
}>()
const { formatRupiah } = useFormatters()
const columns = [
  { key: 'noQuotation', label: 'No Quotation', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'dateStatus', label: 'Date Status', sortable: true },
  { key: 'total', label: 'Total (IDR)', sortable: true, align: 'end' as const },
  { key: 'channel', label: 'Quotation Channel', sortable: true },
  { key: 'dueDate', label: 'Due Date', sortable: true },
  { key: 'actions', label: 'Action' },
]
</script>
<template>
  <SalesDataTable
    :columns="columns"
    :items="quotations"
    :search="searchQuery"
    @update:search="$emit('update:searchQuery', $event)"
  >
    <template #filters
      ><select
        :value="filterStatus"
        aria-label="Status"
        :class="salesField"
        class="!w-auto"
        @change="$emit('update:filterStatus', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">Status</option>
        <option>Send</option>
        <option>Ordered</option>
        <option>Rejected</option>
        <option>Complete</option>
        <option>Pending</option>
      </select></template
    >
    <template #cell(status)="{ item }"><SalesStatusBadge :status="item.status" /></template>
    <template #cell(total)="{ item }">{{ formatRupiah(item.total) }}</template>
    <template #cell(actions)="{ item }"
      ><div class="flex items-center gap-1.5">
        <SalesActionButton
          icon="eye"
          label="View Details"
          :to="{ path: '/quotation-detail', query: { id: item.id } }"
        />
        <SalesActionButton
          icon="edit"
          label="Edit Quotation"
          :to="{ path: '/edit-quotation', query: { id: item.id } }"
        />
        <SalesActionButton
          icon="trash-2"
          label="Delete Quotation"
          @click="$emit('delete-quotation', item.id)"
        /></div
    ></template>
    <template #footer="{ items }"
      ><tr>
        <td colspan="6" class="px-4 py-3">Total</td>
        <td class="px-4 py-3 text-right">
          {{ formatRupiah(items.reduce((sum, item) => sum + item.total, 0)) }}
        </td>
        <td colspan="3" /></tr
    ></template>
  </SalesDataTable>
</template>
