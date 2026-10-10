<script setup lang="ts">
import type { Customer } from '#server/types/customer'
import type { DateRangeValue } from '~/composables/useDateRange'
import DateRangePicker from '~/components/Common/DateRangePicker.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'
import FeatherIcon from '~/components/Common/FeatherIcon.vue'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'

const props = defineProps<{
  customers: Customer[]
  searchQuery: string
  filterType?: string
  filterDateRange?: DateRangeValue | null
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterType': [value: string]
  'update:filterDateRange': [value: DateRangeValue | null]
  'add-address': [customer: Customer]
  'view': [customer: Customer]
  'edit': [customer: Customer]
  'delete': [customer: Customer]
}>()

const customerTypeOptions = [
  'Standard',
  'Premium',
  'Free Shipping',
  'Corporate',
  'VIP',
  'Reseller',
  'General',
]

const columns = [
  { key: 'customerId', label: 'Customer ID', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'type', label: 'Customer Type', sortable: true },
  { key: 'balance', label: 'Balance', sortable: true, align: 'right' as const },
  { key: 'phone', label: 'Contact No', sortable: true },
  { key: 'channel', label: 'Join Channel', sortable: true },
  { key: 'dateJoin', label: 'Date Join', sortable: true },
  { key: 'lastSeen', label: 'Last Seen', sortable: true },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]

function getTypeBadgeClass(type: string) {
  switch (type?.toLowerCase()) {
    case 'corporate':
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800'
    case 'vip':
      return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
    case 'premium':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800'
    case 'reseller':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
    case 'free shipping':
      return 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-800'
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
  }
}
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="customers"
    :search="searchQuery"
    search-placeholder="Search Customer or Email..."
    @update:search="emit('update:searchQuery', $event)"
  >
    <template #filters>
      <DateRangePicker
        :model-value="filterDateRange"
        placeholder="Date"
        @update:model-value="emit('update:filterDateRange', $event)"
      />
      <TableFilterSelect
        :model-value="filterType"
        label="Customer Type"
        :options="customerTypeOptions"
        @update:model-value="emit('update:filterType', $event)"
      />
    </template>

    <template #cell(customerId)="{ item }">
      <span class="font-semibold text-primary dark:text-primary-400">
        {{ item.customerId }}
      </span>
    </template>

    <template #cell(name)="{ item }">
      <div class="flex items-center gap-2">
        <div class="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary dark:bg-primary-900/30 dark:text-primary-400">
          {{ item.name?.charAt(0) || 'C' }}
        </div>
        <span class="font-medium text-gray-900 dark:text-gray-100">{{ item.name }}</span>
      </div>
    </template>

    <template #cell(email)="{ item }">
      <span class="text-gray-600 dark:text-gray-300">{{ item.email }}</span>
    </template>

    <template #cell(type)="{ item }">
      <span
        :class="[
          'inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold',
          getTypeBadgeClass(item.type)
        ]"
      >
        {{ item.type }}
      </span>
    </template>

    <template #cell(balance)="{ item }">
      <CurrencyDisplay :value="item.balance" align="right" class="font-semibold" />
    </template>

    <template #cell(phone)="{ item }">
      <span class="text-gray-600 dark:text-gray-300">{{ item.phone }}</span>
    </template>

    <template #cell(channel)="{ item }">
      <span class="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {{ item.channel }}
      </span>
    </template>

    <template #cell(dateJoin)="{ item }">
      <span class="text-gray-500 dark:text-gray-400">{{ item.dateJoin }}</span>
    </template>

    <template #cell(lastSeen)="{ item }">
      <span class="text-gray-500 dark:text-gray-400">{{ item.lastSeen }}</span>
    </template>

    <template #cell(actions)="{ item }">
      <div class="flex items-center justify-center gap-1.5">
        <button
          type="button"
          class="inline-flex items-center gap-1 rounded border border-primary/30 bg-primary/5 px-2 py-1 text-[11px] font-medium text-primary hover:bg-primary/10 transition-colors"
          title="Add Address"
          @click="emit('add-address', item)"
        >
          <FeatherIcon name="plus" size="12" />
          <span>Address</span>
        </button>
        <SalesActionButton
          icon="eye"
          tooltip="View Customer"
          @click="emit('view', item)"
        />
        <SalesActionButton
          icon="edit"
          tooltip="Edit Customer"
          @click="emit('edit', item)"
        />
        <SalesActionButton
          icon="trash-2"
          tooltip="Delete Customer"
          danger
          @click="emit('delete', item)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>
