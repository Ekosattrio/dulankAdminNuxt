<script setup lang="ts">
import type { Purchase } from '#server/types/purchase'
import TableFilterSelect from '~/components/Common/TableFilterSelect.vue'
import SalesDataTable from '~/components/Sales/SalesDataTable.vue'
import SalesActionButton from '~/components/Sales/SalesActionButton.vue'
import { formatNumber } from '~/composables/useFormatters'
import EntityIdentity from '~/components/Common/EntityIdentity.vue'
import SalesStatusBadge from '~/components/Sales/SalesStatusBadge.vue'

defineProps<{
  purchases: Purchase[]
  searchQuery: string
  filterStatus?: string
  filterPaymentStatus?: string
}>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:filterStatus': [value: string]
  'update:filterPaymentStatus': [value: string]
  'view': [purchase: Purchase]
  'edit': [purchase: Purchase]
  'delete': [purchase: Purchase]
}>()

const statusOptions = ['Received', 'Complete', 'Ordered', 'Pending']
const paymentStatusOptions = ['Paid', 'Unpaid', 'Partial', 'Refunded']

const columns = [
  { key: 'noPurchase', label: 'No Purchase', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'supplier', label: 'Supplier', sortable: true },
  { key: 'product', label: 'Product', sortable: false },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'amount', label: 'Amount (IDR)', sortable: true, align: 'right' as const, class: 'text-right font-medium' },
  { key: 'paid', label: 'Paid (IDR)', sortable: true, align: 'right' as const, class: 'text-right font-medium text-emerald-600' },
  { key: 'due', label: 'Due (IDR)', sortable: true, align: 'right' as const, class: 'text-right font-medium' },
  { key: 'paymentStatus', label: 'Payment', sortable: true, align: 'center' as const, class: 'text-center' },
  { key: 'actions', label: 'Action', sortable: false, align: 'center' as const, class: 'text-center whitespace-nowrap' },
]

</script>

<template>
  <SalesDataTable
    :columns="columns"
    :items="purchases"
    :search="searchQuery"
    search-placeholder="Search purchase number, supplier, product..."
    @update:search="emit('update:searchQuery', $event)"
  >
    <template #filters>
      <!-- Status Filter -->
      <TableFilterSelect
        :model-value="filterStatus"
        label="Status"
        :options="statusOptions"
        @update:model-value="emit('update:filterStatus', $event)"
      />

      <!-- Payment Status Filter -->
      <TableFilterSelect
        :model-value="filterPaymentStatus"
        label="Payment"
        :options="paymentStatusOptions"
        @update:model-value="emit('update:filterPaymentStatus', $event)"
      />
    </template>

    <!-- No Purchase -->
    <template #cell(noPurchase)="{ item }">
      <button
        type="button"
        class="font-semibold text-primary hover:underline dark:text-primary-400 text-left"
        @click="emit('view', item)"
      >
        {{ item.noPurchase }}
      </button>
    </template>

    <!-- Date -->
    <template #cell(date)="{ item }">
      <div class="text-sm text-gray-600 dark:text-gray-300">
        {{ item.date }}
        <span v-if="item.created" class="block text-xs text-gray-400">
          by {{ item.created }}
        </span>
      </div>
    </template>

    <!-- Supplier -->
    <template #cell(supplier)="{ item }">
      <EntityIdentity :name="item.supplier" kind="supplier" />
    </template>

    <!-- Product Summary -->
    <template #cell(product)="{ item }">
      <div class="max-w-[200px]">
        <p class="text-sm text-gray-700 line-clamp-1 dark:text-gray-300" :title="item.product">
          {{ item.product }}
        </p>
        <p v-if="item.notes" class="text-xs text-gray-400 italic line-clamp-1">
          {{ item.notes }}
        </p>
      </div>
    </template>

    <!-- Status -->
    <template #cell(status)="{ item }">
      <SalesStatusBadge :status="item.status" />
    </template>

    <!-- Amount -->
    <template #cell(amount)="{ item }">
      <span class="font-semibold text-gray-900 dark:text-gray-100">
        Rp {{ formatNumber(item.amount) }}
      </span>
    </template>

    <!-- Paid -->
    <template #cell(paid)="{ item }">
      <span class="font-medium text-emerald-600 dark:text-emerald-400">
        Rp {{ formatNumber(item.paid) }}
      </span>
    </template>

    <!-- Due -->
    <template #cell(due)="{ item }">
      <span
        class="font-medium"
        :class="item.due > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-gray-400'"
      >
        Rp {{ formatNumber(item.due) }}
      </span>
    </template>

    <!-- Payment Status -->
    <template #cell(paymentStatus)="{ item }">
      <SalesStatusBadge :status="item.paymentStatus" />
    </template>

    <!-- Actions -->
    <template #cell(actions)="{ item }">
      <div class="flex items-center justify-center gap-1">
        <SalesActionButton
          action="view"
          label="View Detail"
          variant="ghost"
          @click="emit('view', item)"
        />
        <SalesActionButton
          action="edit"
          label="Edit"
          variant="ghost"
          @click="emit('edit', item)"
        />
        <SalesActionButton
          action="delete"
          danger
          label="Delete"
          variant="danger"
          @click="emit('delete', item)"
        />
      </div>
    </template>
  </SalesDataTable>
</template>
