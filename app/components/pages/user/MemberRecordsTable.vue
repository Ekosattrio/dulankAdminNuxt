<script setup lang="ts">
import type { MemberUser } from '#server/types/user-management'
import type { DateRangeValue } from '~/composables/useDateRange'
import DateRangePicker from '~/components/common/DateRangePicker.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesActionButton from '~/components/sales/SalesActionButton.vue'

defineProps<{
  members: MemberUser[]
  searchQuery: string
  selectedStatus: string
  dateRange: DateRangeValue | null
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:selectedStatus': [value: string]
  'update:dateRange': [value: DateRangeValue | null]
  'status-change': [member: MemberUser, newStatus: 'Active Member' | 'Suspended']
  edit: [member: MemberUser]
  delete: [member: MemberUser]
}>()

const statusOptions = ['Active Member', 'Suspended']

const columns = [
  { key: 'customerId', label: 'Customer Id', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'name', label: 'Customer Name', sortable: true },
  { key: 'verifiedEmail', label: 'Verified Email', sortable: true, align: 'center' as const },
  { key: 'subscription', label: 'Subscription', sortable: true, align: 'center' as const },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'createdAt', label: 'Join Date', sortable: true },
  { key: 'actions', label: 'Action', sortable: false, align: 'end' as const },
]
</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="members"
    :search="searchQuery"
    search-placeholder="Search Customer, Email, or ID..."
    @update:search="emit('update:searchQuery', $event)"
  >
    <!-- Filter Toolbar Slots -->
    <template #filters>
      <!-- Date Range Filter -->
      <DateRangePicker
        :model-value="dateRange"
        placeholder="Filter Date"
        @update:model-value="emit('update:dateRange', $event)"
      />

      <!-- Status Filter -->
      <TableFilterSelect
        :model-value="selectedStatus"
        label="Status"
        :options="statusOptions"
        placeholder="All Statuses"
        @update:model-value="emit('update:selectedStatus', $event)"
      />
    </template>

    <!-- Cell: Customer ID -->
    <template #cell(customerId)="{ item }">
      <span class="font-semibold text-primary dark:text-primary-400">
        {{ item.customerId }}
      </span>
    </template>

    <!-- Cell: Name with Avatar -->
    <template #cell(name)="{ item }">
      <div class="flex items-center gap-2.5">
        <img
          :src="item.avatar || '/assets/img/users/user-01.jpg'"
          :alt="item.name"
          class="size-7 rounded-full object-cover border border-gray-100 dark:border-gray-800"
        />
        <span class="font-medium text-gray-900 dark:text-gray-100">{{ item.name }}</span>
      </div>
    </template>

    <!-- Cell: Email -->
    <template #cell(email)="{ item }">
      <span class="text-gray-600 dark:text-gray-300">{{ item.email }}</span>
    </template>

    <!-- Cell: Verified Email Badge -->
    <template #cell(verifiedEmail)="{ item }">
      <span
        :class="[
          'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium border',
          item.verifiedEmail
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
            : 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-400'
        ]"
      >
        {{ item.verifiedEmail ? 'Active' : 'No' }}
      </span>
    </template>

    <!-- Cell: Subscription Badge -->
    <template #cell(subscription)="{ item }">
      <span
        :class="[
          'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium border',
          item.subscription
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400'
            : 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-400'
        ]"
      >
        {{ item.subscription ? 'Yes' : 'No' }}
      </span>
    </template>

    <!-- Cell: Status Selector Dropdown -->
    <template #cell(status)="{ item }">
      <select
        :value="item.status"
        class="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-700 focus:border-[#FE9F43] focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 cursor-pointer"
        @change="emit('status-change', item, ($event.target as HTMLSelectElement).value as any)"
      >
        <option value="Active Member">Active Member</option>
        <option value="Suspended">Suspended</option>
      </select>
    </template>

    <!-- Cell: Join Date -->
    <template #cell(createdAt)="{ item }">
      <span class="text-gray-500 dark:text-gray-400">{{ item.createdAt || '-' }}</span>
    </template>

    <!-- Cell: Actions -->
    <template #cell(actions)="{ item }">
      <div class="flex items-center justify-end gap-1.5">
        <SalesActionButton
          action="edit"
          label="Edit Member"
          @click="emit('edit', item)"
        />
        <SalesActionButton
          action="delete"
          label="Delete Member"
          @click="emit('delete', item)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>
