<script setup lang="ts">
import PaymentRecordsTable from '~/components/pages/payments/PaymentRecordsTable.vue'
import type { DateRangeValue } from '~/composables/useDateRange'

useLegacyPage({ title: 'Payments', sweetAlert: false })

const searchQuery = ref('')
const filterDateRange = ref<DateRangeValue | null>(null)
const filterType = ref('')
const filterMethod = ref('')
const paymentFilters = computed(() => ({
  search: searchQuery.value,
  startDate: filterDateRange.value?.start || '',
  endDate: filterDateRange.value?.end || '',
  type: filterType.value,
  method: filterMethod.value,
}))
const { payments, pending, error, refresh } = usePayments(paymentFilters)

function printTable() {
  printSalesRows(
    'Payments',
    ['Date Payment', 'Ref No', 'Name', 'Type', 'Payment Method', 'Amount (IDR)', 'Status', 'Create'],
    payments.value.map((item) => [
      item.date,
      item.refNo,
      item.name,
      item.type,
      item.method,
      item.amount.toLocaleString('id-ID'),
      item.status,
      item.created,
    ]),
  )
}
</script>

<template>
  <div class="dulank-page dulank-page-payments">
    <SalesListHeader
      title="Payments"
      subtitle="Manage payment in and payment out"
      :refreshing="pending"
      @refresh="refresh()"
      @print="printTable"
    />
    <SalesFeedback
      :pending="pending"
      :error="error ? 'Unable to load payments. Please try again.' : ''"
      @retry="refresh()"
    />
    <PaymentRecordsTable
      v-if="!pending && !error"
      :payments="payments"
      :search-query="searchQuery"
      :filter-date-range="filterDateRange"
      :filter-type="filterType"
      :filter-method="filterMethod"
      @update:search-query="searchQuery = $event"
      @update:filter-date-range="filterDateRange = $event"
      @update:filter-type="filterType = $event"
      @update:filter-method="filterMethod = $event"
    />
  </div>
</template>
