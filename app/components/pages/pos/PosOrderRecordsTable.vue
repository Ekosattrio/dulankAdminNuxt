<script setup lang="ts">
import type { PosOrderRecord } from '~/composables/usePosOrders'
import SalesDataTable from '~/components/sales/SalesDataTable.vue'
import SalesStatusBadge from '~/components/sales/SalesStatusBadge.vue'
import SalesMoreMenu from '~/components/sales/SalesMoreMenu.vue'
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'
import TableFilterSelect from '~/components/common/TableFilterSelect.vue'

const props = defineProps<{
  orders: PosOrderRecord[]
}>()

const emit = defineEmits<{
  (e: 'view', order: PosOrderRecord): void
  (e: 'show-payments', order: PosOrderRecord): void
  (e: 'create-payment', order: PosOrderRecord): void
  (e: 'print-receipt', order: PosOrderRecord): void
  (e: 'delete', order: PosOrderRecord): void
}>()

const searchQuery = ref('')
const filterStatus = ref('')
const filterPayment = ref('')

const statusOptions = [
  { label: 'All Statuses', value: '' },
  { label: 'Complete', value: 'Complete' },
  { label: 'Pending', value: 'Pending' }
]

const paymentOptions = [
  { label: 'All Payment Status', value: '' },
  { label: 'Paid', value: 'Paid' },
  { label: 'Partial', value: 'Partial' },
  { label: 'Unpaid', value: 'Unpaid' }
]

const columns = [
  { key: 'customer', label: 'Customer', sortable: true },
  { key: 'saleNo', label: 'Reference', sortable: true },
  { key: 'date', label: 'Date', sortable: true },
  { key: 'status', label: 'Status', sortable: true, align: 'center' as const },
  { key: 'grandTotal', label: 'Grand Total', sortable: true, align: 'end' as const },
  { key: 'paid', label: 'Paid', sortable: true, align: 'end' as const },
  { key: 'due', label: 'Due', sortable: true, align: 'end' as const },
  { key: 'paymentStatus', label: 'Payment Status', sortable: true, align: 'center' as const },
  { key: 'biller', label: 'Biller', sortable: true },
  { key: 'actions', label: 'Action', align: 'center' as const }
]

const filteredOrders = computed(() => {
  return props.orders.filter((order) => {
    const matchStatus = !filterStatus.value || order.status === filterStatus.value
    const matchPay = !filterPayment.value || order.paymentStatus === filterPayment.value
    const matchSearch =
      !searchQuery.value ||
      order.customer.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.saleNo.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      order.biller.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchStatus && matchPay && matchSearch
  })
})

function getActionsForOrder(order: PosOrderRecord) {
  const actions = [
    { label: 'Sale Detail', icon: 'eye', onClick: () => emit('view', order) },
    { label: 'Show Payments', icon: 'dollar-sign', onClick: () => emit('show-payments', order) }
  ]
  if (order.due > 0) {
    actions.push({ label: 'Create Payment', icon: 'plus-circle', onClick: () => emit('create-payment', order) })
  }
  actions.push(
    { label: 'Print Receipt', icon: 'printer', onClick: () => emit('print-receipt', order) },
    { label: 'Delete', icon: 'trash-2', danger: true, onClick: () => emit('delete', order) }
  )
  return actions
}
</script>

<template>
  <SalesDataTable
    :rows="filteredOrders"
    :columns="columns"
    v-model:search="searchQuery"
    search-placeholder="Search reference, customer, or biller..."
  >
    <template #filters>
      <TableFilterSelect
        v-model="filterStatus"
        :options="statusOptions"
        placeholder="All Statuses"
      />
      <TableFilterSelect
        v-model="filterPayment"
        :options="paymentOptions"
        placeholder="All Payment Status"
      />
    </template>

    <!-- Customer -->
    <template #cell(customer)="{ item }">
      <div class="flex items-center gap-3">
        <img
          :src="item.avatar"
          alt="customer"
          class="h-9 w-9 rounded-full object-cover border border-gray-200 dark:border-gray-700"
        />
        <span class="font-semibold text-gray-900 dark:text-white">{{ item.customer }}</span>
      </div>
    </template>

    <!-- Reference -->
    <template #cell(saleNo)="{ item }">
      <span class="font-mono font-semibold text-primary">{{ item.saleNo }}</span>
    </template>

    <!-- Status -->
    <template #cell(status)="{ item }">
      <span
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
        :class="item.status === 'Complete' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300' : 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300'"
      >
        {{ item.status }}
      </span>
    </template>

    <!-- Grand Total -->
    <template #cell(grandTotal)="{ item }">
      <CurrencyDisplay :value="item.grandTotal" class="font-semibold text-gray-900 dark:text-white" />
    </template>

    <!-- Paid -->
    <template #cell(paid)="{ item }">
      <CurrencyDisplay :value="item.paid" class="font-semibold text-emerald-600 dark:text-emerald-400" />
    </template>

    <!-- Due -->
    <template #cell(due)="{ item }">
      <CurrencyDisplay :value="item.due" class="font-semibold text-rose-600 dark:text-rose-400" />
    </template>

    <!-- Payment Status -->
    <template #cell(paymentStatus)="{ item }">
      <SalesStatusBadge :status="item.paymentStatus" />
    </template>

    <!-- Biller -->
    <template #cell(biller)="{ item }">
      <span class="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
        {{ item.biller }}
      </span>
    </template>

    <!-- Action -->
    <template #cell(actions)="{ item }">
      <SalesMoreMenu :actions="getActionsForOrder(item)" />
    </template>
  </SalesDataTable>
</template>

