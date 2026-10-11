<script setup lang="ts">
import type { BillingRecord } from '#server/types/billing'
import type { DateRangeValue } from '~/composables/useDateRange'

defineProps<{ items: BillingRecord[]; search: string; paymentMethod: string; status: string; dateRange: DateRangeValue | null }>()
const emit = defineEmits<{
  'update:search': [value: string]
  'update:paymentMethod': [value: string]
  'update:status': [value: string]
  'update:dateRange': [value: DateRangeValue | null]
}>()
const columns = [
  { key: 'billingId', label: 'ID Billing', sortable: true },
  { key: 'transactionNo', label: 'ID Transaksi', sortable: true },
  { key: 'userEmail', label: 'ID Pengguna', sortable: true },
  { key: 'billingDate', label: 'Tanggal Billing', sortable: true },
  { key: 'subtotal', label: 'Jumlah Tagihan', sortable: true, align: 'right' as const },
  { key: 'discount', label: 'Diskon', sortable: true, align: 'right' as const },
  { key: 'tax', label: 'Pajak', sortable: true, align: 'right' as const },
  { key: 'shipping', label: 'Biaya Pengiriman', sortable: true, align: 'right' as const },
  { key: 'total', label: 'Total Pembayaran', sortable: true, align: 'right' as const },
  { key: 'status', label: 'Status Pembayaran', sortable: true, align: 'center' as const },
  { key: 'paymentMethod', label: 'Metode Pembayaran', sortable: true },
]
const methodOptions = [
  { label: 'Kartu Kredit', value: 'Kartu Kredit' },
  { label: 'E Wallet', value: 'E-Wallet' },
  { label: 'Virtual Account', value: 'Virtual Account' },
]
const statusOptions = [{ label: 'Success', value: 'Berhasil' }, { label: 'Failed', value: 'Gagal' }]
function totals(items: BillingRecord[]) {
  return items.reduce((result, item) => ({ subtotal: result.subtotal + item.subtotal, discount: result.discount + item.discount, tax: result.tax + item.tax, shipping: result.shipping + item.shipping, total: result.total + item.total }), { subtotal: 0, discount: 0, tax: 0, shipping: 0, total: 0 })
}
</script>

<template>
  <SalesDataTable :columns="columns" :items="items" :search="search" search-placeholder="Search..." @update:search="emit('update:search', $event)">
    <template #filters>
      <DateRangePicker :model-value="dateRange" aria-label="Date" align="end" placeholder="Date" @update:model-value="emit('update:dateRange', $event)" />
      <TableFilterSelect :model-value="paymentMethod" :options="methodOptions" placeholder="Metode" aria-label="Metode" @update:model-value="emit('update:paymentMethod', $event)" />
      <TableFilterSelect :model-value="status" :options="statusOptions" placeholder="Status" aria-label="Status" @update:model-value="emit('update:status', $event)" />
    </template>
    <template #cell(billingId)="{ item }"><span class="font-semibold text-primary">{{ item.billingId }}</span></template>
    <template #cell(subtotal)="{ item }"><CurrencyDisplay :value="item.subtotal" prefix="" align="right" /></template>
    <template #cell(discount)="{ item }"><CurrencyDisplay :value="item.discount" prefix="" align="right" /></template>
    <template #cell(tax)="{ item }"><CurrencyDisplay :value="item.tax" prefix="" align="right" /></template>
    <template #cell(shipping)="{ item }"><CurrencyDisplay :value="item.shipping" prefix="" align="right" /></template>
    <template #cell(total)="{ item }"><CurrencyDisplay :value="item.total" prefix="" align="right" bold /></template>
    <template #cell(status)="{ item }">
      <span :class="['inline-flex rounded px-2 py-1 text-xs font-medium ring-1 ring-inset', item.status === 'Berhasil' ? 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-800' : 'bg-red-50 text-red-700 ring-red-200 dark:bg-red-950 dark:text-red-300 dark:ring-red-800']">{{ item.status }}</span>
    </template>
    <template #footer="{ items: filteredItems }">
      <tr>
        <td colspan="4" class="px-4 py-3 text-start font-bold">Total</td>
        <td class="px-4 py-3 text-end"><CurrencyDisplay :value="totals(filteredItems).subtotal" prefix="" align="right" bold /></td>
        <td class="px-4 py-3 text-end"><CurrencyDisplay :value="totals(filteredItems).discount" prefix="" align="right" bold /></td>
        <td class="px-4 py-3 text-end"><CurrencyDisplay :value="totals(filteredItems).tax" prefix="" align="right" bold /></td>
        <td class="px-4 py-3 text-end"><CurrencyDisplay :value="totals(filteredItems).shipping" prefix="" align="right" bold /></td>
        <td class="px-4 py-3 text-end"><CurrencyDisplay :value="totals(filteredItems).total" prefix="" align="right" bold /></td>
        <td colspan="2" />
      </tr>
    </template>
  </SalesDataTable>
</template>
