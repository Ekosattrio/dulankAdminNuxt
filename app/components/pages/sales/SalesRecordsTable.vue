<script setup lang="ts">
import type { Sale } from '#server/types/sale'
import { tableFilterControlClass } from '~/utils/salesUi'
defineProps<{
  sales: Sale[]
  searchQuery: string
  filterStatus: string
  filterChannel: string
  filterTransactionCode?: string
}>()
const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterStatus': [value: string]
  'update:filterChannel': [value: string]
  'update:filterTransactionCode': [value: string]
  'edit-sale': [item: Sale]
  'delete-sale': [id: string]
  'view-sale': [item: Sale]
  'show-payments': [item: Sale]
  'add-sale': []
  'export-pdf': []
  'print-table': []
  refresh: []
}>()
const transactionCodes = [
  '01 - To Other party VAT Collector',
  '02 - To Government Intitution as VAT Colletor',
  '03 - To VAT Collector other than Governmnent Institution',
  '04 - Other Tax Base',
  '05 - Certain Value Tax Base',
  '06 - To Tourist for VAT Refund for Tourist',
  '07 - Vat Uncollected',
  '08 - VAT Exempted',
  '09 - Sale of unrekated to business asset',
  '10 - Other delivery of good/services',
]

const { formatRupiah } = useFormatters()
const columns = [
  { key: 'more', label: '' },
  { key: 'saleNo', label: 'No Sales', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'subTotal', label: 'Sub Total', sortable: true, align: 'end' as const },
  { key: 'deliveryFee', label: 'Delivery Fee', sortable: true, align: 'end' as const },
  { key: 'discount', label: 'Discount', sortable: true, align: 'end' as const },
  { key: 'tax', label: 'Tax', sortable: true, align: 'end' as const },
  { key: 'total', label: 'Total', sortable: true, align: 'end' as const },
  { key: 'delivery', label: 'Delivery', sortable: true },
  { key: 'channel', label: 'Sales Channel', sortable: true },
  { key: 'status', label: 'Payment Status', sortable: true },
  { key: 'method', label: 'Method', sortable: true },
]
function actions(sale: Sale) {
  return [
    { key: 'view', label: 'Sale Detail', icon: 'eye' },
    { key: 'edit', label: 'Edit Sale', icon: 'edit' },
    { key: 'payments', label: 'Show Payments', icon: 'credit-card' },
    {
      key: 'receipt',
      label: 'Sales Receipt',
      icon: 'printer',
      to: { path: '/sales-receipt', query: { id: sale.id } },
    },
    {
      key: 'note',
      label: 'Sales Note',
      icon: 'file-text',
      to: { path: '/sales-note', query: { id: sale.id } },
    },
    {
      key: 'invoice',
      label: 'Create Invoice',
      icon: 'file-plus',
      to: { path: '/invoice', query: { sourceSale: sale.id } },
    },
    {
      key: 'delivery',
      label: 'Create Delivery Note',
      icon: 'truck',
      to: { path: '/delivery-note', query: { sourceSale: sale.id } },
    },
    { key: 'delete', label: 'Delete Sale', icon: 'trash-2' },
  ]
}
function select(key: string, sale: Sale) {
  if (key === 'edit') emit('edit-sale', sale)
  if (key === 'delete') emit('delete-sale', sale.id)
  if (key === 'view') emit('view-sale', sale)
  if (key === 'payments') emit('show-payments', sale)
}
</script>
<template>
  <SalesDataTable
    :columns="columns"
    :items="sales"
    :search="searchQuery"
    @update:search="$emit('update:searchQuery', $event)"
  >
    <template #filters>
      <select
        :value="filterTransactionCode || ''"
        aria-label="Transaction Code"
        :class="tableFilterControlClass"
        class="w-44 max-w-full"
        @change="$emit('update:filterTransactionCode', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">Transaction Code</option>
        <option v-for="code in transactionCodes" :key="code" :value="code.slice(0, 2)">{{ code }}</option>
      </select>
      <select
        :value="filterStatus"
        aria-label="Payment Status"
        :class="tableFilterControlClass"
        class="w-40 max-w-full"
        @change="$emit('update:filterStatus', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">Payment Status</option>
        <option>Paid</option>
        <option>Partial</option>
        <option>Unpaid</option>
      </select>
      <select
        :value="filterChannel"
        aria-label="Channel"
        :class="tableFilterControlClass"
        class="w-36 max-w-full"
        @change="$emit('update:filterChannel', ($event.target as HTMLSelectElement).value)"
      >
        <option value="">Channel</option>
        <option>Website</option>
        <option>POS</option>
        <option
          v-for="channel in [...new Set(sales.map((s) => s.channel))].filter(
            (c) => !['Website', 'POS'].includes(c),
          )"
          :key="channel"
        >
          {{ channel }}
        </option>
      </select>
    </template>
    <template #cell(more)="{ item }"
      ><SalesMoreMenu
        :label="'More actions for ' + item.saleNo"
        :actions="actions(item)"
        @select="select($event, item)"
    /></template>
    <template
      v-for="key in ['subTotal', 'deliveryFee', 'discount', 'tax', 'total']"
      :key="key"
      #[`cell(${key})`]="{ item }"
      >{{ formatRupiah(item[key]) }}</template
    >
    <template #cell(status)="{ item }"><SalesStatusBadge :status="item.status" /></template>
    <template #footer="{ items }"
      ><tr>
        <td colspan="4" class="px-4 py-3">Total</td>
        <td
          v-for="key in ['subTotal', 'deliveryFee', 'discount', 'tax', 'total']"
          :key="key"
          class="px-4 py-3 text-right"
        >
          {{ formatRupiah(items.reduce((sum, item) => sum + Number(item[key]), 0)) }}
        </td>
        <td colspan="4" /></tr
    ></template>
  </SalesDataTable>
</template>
