<script setup lang="ts">
import type { CustomerSubscriptionItem } from '#server/types/customer-subscription'
import { formatMoney } from '~/utils/currency'

const props = defineProps<{
  items: CustomerSubscriptionItem[]
  search: string
  status: string
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:status': [value: string]
  edit: [item: CustomerSubscriptionItem]
  subscribe: []
}>()

const columns = [
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'plan', label: 'Plan', sortable: true },
  { key: 'billingCycle', label: 'Billing Cycle', sortable: true },
  { key: 'amount', label: 'Amount (IDR)', sortable: true, align: 'right' as const },
  { key: 'expiringOn', label: 'Expiring On', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'actions', label: 'Action', align: 'center' as const },
]
</script>

<template>
  <SalesDataTable :columns="columns" :items="items" :search="search" search-placeholder="Search customer, email..." @update:search="emit('update:search', $event)">
    <template #filters>
      <TableFilterSelect :model-value="status" :options="['Aktif', 'Kadaluarsa', 'Belum']" placeholder="Status" @update:model-value="emit('update:status', $event)" />
      <button
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg border border-primary-200 bg-primary-50 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary-100 dark:border-primary-900 dark:bg-primary-950/40 dark:text-primary-300"
        @click="emit('subscribe')"
      >
        <FeatherIcon name="plus-circle" :size="14" /> Berlanggankan
      </button>
    </template>
    <template #cell(customer)="{ item }"><span class="font-semibold text-gray-900 dark:text-white">{{ item.customer }}</span></template>
    <template #cell(email)="{ item }"><span class="text-gray-500 dark:text-gray-400">{{ item.email }}</span></template>
    <template #cell(plan)="{ item }"><span class="text-gray-600 dark:text-gray-300">{{ item.plan || '—' }} <em v-if="item.planTier" class="text-[10px] text-gray-400">({{ item.planTier }})</em></span></template>
    <template #cell(billingCycle)="{ item }"><span class="text-gray-500 dark:text-gray-400">{{ item.billingCycle || '—' }}</span></template>
    <template #cell(amount)="{ item }"><span class="font-medium text-gray-800 dark:text-gray-200">{{ formatMoney(item.amount, { prefix: 'Rp ' }) }}</span></template>
    <template #cell(expiringOn)="{ item }"><span class="text-gray-500 dark:text-gray-400">{{ item.expiringOn || '—' }}</span></template>
    <template #cell(status)="{ item }">
      <div class="flex items-center justify-center gap-1.5">
        <SalesStatusBadge :status="item.status || 'Unpaid'" />
        <span v-if="item.active" class="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">Aktif</span>
        <span v-else-if="item.status" class="rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-600">Nonaktif</span>
      </div>
    </template>
    <template #cell(actions)="{ item }">
      <div class="flex items-center justify-center gap-1.5">
        <SalesActionButton v-if="item.id" action="edit" label="Edit Subscription" @click="emit('edit', item)" />
      </div>
    </template>
  </SalesDataTable>
</template>