<script setup lang="ts">
import type { Invoice } from '#server/types/invoice'
defineProps<{ invoices: Invoice[]; searchQuery: string; filterStatus: string }>()
defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterStatus': [value: string]
  'edit-invoice': [item: Invoice]
  'delete-invoice': [id: string]
  'print-table': []
  'export-pdf': []
  refresh: []
  'add-invoice': []
}>()
const { formatRupiah } = useFormatters()
const columns = [
  { key: 'invoiceNo', label: 'Invoice No', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'dueDate', label: 'Due Date', sortable: true },
  { key: 'amount', label: 'Amount (IDR)', sortable: true, align: 'end' as const },
  { key: 'paid', label: 'Paid (IDR)', sortable: true, align: 'end' as const },
  { key: 'amountDue', label: 'Amount Due (IDR)', sortable: true, align: 'end' as const },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Action' },
]
</script>
<template>
  <SalesDataTable
    :columns="columns"
    :items="invoices"
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
        <option>Paid</option>
        <option>Overdue</option>
        <option>Unpaid</option>
        <option>Partial</option>
      </select></template
    >
    <template #cell(status)="{ item }"><SalesStatusBadge :status="item.status" /></template>
    <template #cell(amount)="{ item }">{{ formatRupiah(item.amount) }}</template>
    <template #cell(paid)="{ item }">{{ formatRupiah(item.paid) }}</template>
    <template #cell(amountDue)="{ item }">{{ formatRupiah(item.amountDue) }}</template>
    <template #cell(actions)="{ item }"
      ><div class="flex items-center gap-1.5">
        <SalesActionButton
          icon="eye"
          label="View Details"
          :to="{ path: '/invoice-details', query: { id: item.id } }"
        />

        <SalesActionButton
          icon="trash-2"
          label="Delete Invoice"
          @click="$emit('delete-invoice', item.id)"
        /></div
    ></template>
    <template #footer="{ items }"
      ><tr>
        <td colspan="3" class="px-4 py-3">Total</td>
        <td v-for="key in ['amount', 'paid', 'amountDue']" :key="key" class="px-4 py-3 text-right">
          {{ formatRupiah(items.reduce((sum, item) => sum + Number(item[key]), 0)) }}
        </td>
        <td colspan="2" /></tr
    ></template>
  </SalesDataTable>
</template>
