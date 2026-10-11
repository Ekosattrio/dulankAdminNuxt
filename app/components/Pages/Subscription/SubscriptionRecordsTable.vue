<script setup lang="ts">
import type { SubscriptionRecord } from '#server/types/subscription'
import type { DateRangeValue } from '~/composables/useDateRange'
import { formatSubscriptionDate } from '~/utils/subscription'

defineProps<{
  items: SubscriptionRecord[]
  search: string
  plan: string
  paymentMethod: string
  status: string
  dateRange: DateRangeValue | null
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:plan': [value: string]
  'update:paymentMethod': [value: string]
  'update:status': [value: string]
  'update:dateRange': [value: DateRangeValue | null]
  'update:currentPageItems': [value: SubscriptionRecord[]]
  view: [item: SubscriptionRecord]
  edit: [item: SubscriptionRecord]
  delete: [item: SubscriptionRecord]
}>()

const columns = [
  { key: 'subscriber', label: 'Subscriber', sortable: true },
  { key: 'plan', label: 'Plan', sortable: true },
  { key: 'billingCycle', label: 'Billing Cycle', sortable: true },
  { key: 'paymentMethod', label: 'Payment Method', sortable: true },
  { key: 'amount', label: 'Amount', sortable: true, align: 'right' as const },
  { key: 'createdDate', label: 'Created Date', sortable: true },
  { key: 'expiringOn', label: 'Expiring On', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'actions', label: 'Action', align: 'center' as const },
]

function totalAmount(items: SubscriptionRecord[]) {
  return items.reduce((total, item) => total + item.amount, 0)
}
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="items"
    :search="search"
    search-placeholder="Search subscriptions..."
    @update:search="emit('update:search', $event)"
    @update:current-page-items="emit('update:currentPageItems', $event)"
  >
    <template #filters>
      <DateRangePicker
        :model-value="dateRange"
        aria-label="Filter created date"
        align="end"
        @update:model-value="emit('update:dateRange', $event)"
      />
      <TableFilterSelect
        :model-value="plan"
        placeholder="Plan"
        :options="['Basic', 'Advanced', 'Enterprise']"
        @update:model-value="emit('update:plan', $event)"
      />
      <TableFilterSelect
        :model-value="paymentMethod"
        placeholder="Payment"
        :options="['Credit Card', 'Paypal', 'Debit Card']"
        @update:model-value="emit('update:paymentMethod', $event)"
      />
      <TableFilterSelect
        :model-value="status"
        placeholder="Status"
        :options="['Paid', 'Unpaid']"
        @update:model-value="emit('update:status', $event)"
      />
    </template>

    <template #cell(subscriber)="{ item }">
      <button type="button" class="font-semibold text-primary hover:underline" @click="emit('view', item)">{{ item.subscriber }}</button>
    </template>
    <template #cell(amount)="{ item }"><CurrencyDisplay :value="item.amount" align="right" /></template>
    <template #cell(createdDate)="{ item }">{{ formatSubscriptionDate(item.createdDate) }}</template>
    <template #cell(expiringOn)="{ item }">{{ formatSubscriptionDate(item.expiringOn) }}</template>
    <template #cell(status)="{ item }"><SalesStatusBadge :status="item.status" /></template>
    <template #cell(actions)="{ item }">
      <div class="flex items-center justify-center gap-1.5">
        <SalesActionButton action="view" label="View Subscription" @click="emit('view', item)" />
        <SalesActionButton action="edit" label="Edit Subscription" @click="emit('edit', item)" />
        <SalesActionButton action="delete" label="Delete Subscription" danger @click="emit('delete', item)" />
      </div>
    </template>

    <template #footer="{ items: filteredItems }">
      <tr>
        <td class="px-4 py-3 text-start font-bold">Total</td>
        <td colspan="3" />
        <td class="px-4 py-3 text-end"><CurrencyDisplay :value="totalAmount(filteredItems)" align="right" /></td>
        <td colspan="4" />
      </tr>
    </template>
  </SalesDataTable>
</template>
