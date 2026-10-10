<script setup lang="ts">
import PaymentRecordsTable from '~/components/Pages/Payments/PaymentRecordsTable.vue'
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

import DocumentPrintModal from '~/components/Common/DocumentPrintModal.vue'
import { useTablePrint } from '~/composables/useTablePrint'

const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const paymentPrintColumns = [
  { key: 'date', label: 'Date Payment' },
  { key: 'refNo', label: 'Ref No' },
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
  { key: 'method', label: 'Payment Method' },
  { key: 'amount', label: 'Amount (IDR)', align: 'right' as const },
  { key: 'status', label: 'Status', align: 'center' as const },
  { key: 'created', label: 'Create' }
]
</script>

<template>
  <div class="dulank-page dulank-page-payments">
    <SalesListHeader
      title="Payments"
      subtitle="Manage payment in and payment out"
      :refreshing="pending"
      @refresh="refresh()"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />
    <SalesFeedback
      :pending="pending"
      skeleton="table"
      :skeleton-cols="8"
      :skeleton-rows="6"
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

    <!-- Standardized Print & Export PDF Modal -->
    <DocumentPrintModal
      v-if="isPrintModalOpen"
      :open="isPrintModalOpen"
      title="Laporan Pembayaran (Payments List)"
      :columns="paymentPrintColumns"
      :items="payments"
      date-field="date"
      :initial-date-range="filterDateRange"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
