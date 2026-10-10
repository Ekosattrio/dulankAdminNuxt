<script setup lang="ts">
import type { DeliveryNote } from '#server/types/delivery-note'
defineProps<{ deliveryNotes: DeliveryNote[]; searchQuery: string; filterStatus: string }>()
defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterStatus': [value: string]
  'edit-delivery-note': [item: DeliveryNote]
  'delete-delivery-note': [id: string]
  'print-table': []
  'export-pdf': []
  refresh: []
  'add-delivery-note': []
}>()
const { formatRupiah } = useFormatters()
const columns = [
  { key: 'dnNo', label: 'No. DN', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'noSales', label: 'No Sales', sortable: true },
  { key: 'shippingAddress', label: 'Shipping Address', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'dateStatus', label: 'Date Status', sortable: true },
  { key: 'actions', label: 'Action' },
]
</script>
<template>
  <SalesDataTable
    :columns="columns"
    :items="deliveryNotes"
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
        <option>Complete</option>
        <option>Pending</option>
        <option>Ordered</option>
        <option>Received</option>
      </select></template
    >
    <template #cell(status)="{ item }"><SalesStatusBadge :status="item.status" /></template>

    <template #cell(actions)="{ item }"
      ><div class="flex items-center gap-1.5">
        <SalesActionButton
          icon="eye"
          label="View Details"
          :to="{ path: '/delivery-note-detail', query: { id: item.id } }"
        />
        <SalesActionButton
          icon="edit"
          label="Edit Delivery Note"
          @click="$emit('edit-delivery-note', item)"
        />
        <SalesActionButton
          icon="trash-2"
          label="Delete Delivery Note"
          @click="$emit('delete-delivery-note', item.id)"
        /></div
    ></template>
  </SalesDataTable>
</template>
