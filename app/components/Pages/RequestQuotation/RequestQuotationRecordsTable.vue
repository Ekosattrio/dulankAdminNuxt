<script setup lang="ts">
import type { RFQItem } from '#server/types/request-quotation'
defineProps<{ filteredRFQs: RFQItem[]; statusFilter: string }>()
defineEmits<{
  'update:statusFilter': [value: string]
  duplicate: [item: RFQItem]
  delete: [item: RFQItem]
  print: []
}>()
const columns = [
  { key: 'noRequest', label: 'No Request', sortable: true },
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'telp', label: 'Telp', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'actions', label: 'Action' },
]
</script>
<template>
  <SalesDataTable :columns="columns" :items="filteredRFQs">
    <template #filters><TableFilterSelect :model-value="statusFilter === 'All' ? '' : statusFilter" placeholder="Status" aria-label="Status" :options="['Ordered', 'Complete', 'Pending', 'Received', 'Unavailable']" @update:model-value="$emit('update:statusFilter', $event || 'All')" /></template>
    <template #cell(status)="{ item }"><SalesStatusBadge :status="item.status" /></template>
    <template #cell(actions)="{ item }"
      ><div class="flex items-center gap-1.5">
        <SalesActionButton
          icon="eye"
          label="View Details"
          :to="{ path: '/request-quotation-detail', query: { id: item.id } }"
        />
        <SalesActionButton
          icon="edit"
          label="Edit Request Quotation"
          :to="{ path: '/edit-request-quotation', query: { id: item.id } }"
        />
        <SalesActionButton icon="trash-2" label="Delete Request Quotation" @click="$emit('delete', item)" />
        <SalesActionButton
          icon="copy"
          label="Duplicate Request Quotation"
          @click="$emit('duplicate', item)"
        /></div
    ></template>
    <template #footer="{ items }"
      ><tr>
        <td colspan="6" class="px-4 py-3">Total</td>
        <td class="px-4 py-3">{{ items.length }} entries</td>
      </tr></template
    >
  </SalesDataTable>
</template>
