<script setup lang="ts">
import type { BankAccountTypeView, BankAccountView } from '#server/types/bank-account'
import CurrencyDisplay from '~/components/Common/CurrencyDisplay.vue'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesStatusBadge from '~/components/Sales/SalesStatusBadge.vue'

defineProps<{ items: BankAccountView[]; accountTypes: BankAccountTypeView[]; search: string; status: string; accountTypeId: string }>()
const emit = defineEmits<{
  'update:search': [value: string]
  'update:status': [value: string]
  'update:accountTypeId': [value: string]
  'update:currentPageItems': [value: BankAccountView[]]
  edit: [item: BankAccountView]
  delete: [item: BankAccountView]
}>()

const columns = [
  { key: 'accountName', label: 'Account Name', sortable: true },
  { key: 'bankName', label: 'Bank Name', sortable: true },
  { key: 'accountNo', label: 'Account No', sortable: true },
  { key: 'accountTypeName', label: 'Type', sortable: true },
  { key: 'openingBalance', label: 'Opening Balance', sortable: true, align: 'end' as const },
  { key: 'currentBalance', label: 'Current Balance', sortable: true, align: 'end' as const },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'actions', label: 'Action', align: 'center' as const },
]
</script>

<template>
  <SalesDataTable
    :items="items"
    :columns="columns"
    :search="search"
    search-placeholder="Search account..."
    @update:search="emit('update:search', $event)"
    @update:current-page-items="emit('update:currentPageItems', $event)"
  >
    <template #filters>
      <TableFilterSelect
        :model-value="accountTypeId"
        :options="accountTypes.map((type) => ({ label: type.name, value: type.id }))"
        placeholder="All Types"
        @update:model-value="emit('update:accountTypeId', $event)"
      />
      <TableFilterSelect
        :model-value="status"
        :options="['Active', 'Inactive']"
        placeholder="All Statuses"
        @update:model-value="emit('update:status', $event)"
      />
    </template>
    <template #cell-accountName="{ item }"><span class="font-semibold text-gray-900 dark:text-white">{{ item.accountName }}</span></template>
    <template #cell-accountNo="{ item }"><span class="font-mono tabular-nums">{{ item.accountNo }}</span></template>
    <template #cell-openingBalance="{ item }"><CurrencyDisplay :value="item.openingBalance" /></template>
    <template #cell-currentBalance="{ item }"><CurrencyDisplay :value="item.currentBalance" bold /></template>
    <template #cell-status="{ item }"><SalesStatusBadge :status="item.status" /></template>
    <template #cell-actions="{ item }">
      <div class="inline-flex items-center justify-center gap-1.5">
        <SalesActionButton action="edit" label="Edit Bank Account" @click="emit('edit', item)" />
        <SalesActionButton action="delete" label="Delete Bank Account" @click="emit('delete', item)" />
      </div>
    </template>
  </SalesDataTable>
</template>

