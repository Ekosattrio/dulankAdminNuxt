<script setup lang="ts">
import type { CheckoutFilterQuery } from '#server/types/checkout'
import type { DateRangeValue } from '~/composables/useDateRange'
import { useCheckouts } from '~/composables/useCheckouts'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import CheckoutStatsWidgets from '~/components/pages/checkout/CheckoutStatsWidgets.vue'
import CheckoutRecordsTable from '~/components/pages/checkout/CheckoutRecordsTable.vue'

import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import { useTablePrint } from '~/composables/useTablePrint'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Checkout List - Dulank Admin',
  sweetAlert: false
})

const searchQuery = ref('')
const filterMethod = ref('')
const filterStatus = ref('')
const filterDateRange = ref<DateRangeValue | null>(null)

const filterParams = computed<CheckoutFilterQuery>(() => ({
  search: searchQuery.value || undefined,
  method: filterMethod.value || undefined,
  status: filterStatus.value || undefined,
  startDate: filterDateRange.value?.start || undefined,
  endDate: filterDateRange.value?.end || undefined
}))

const { checkouts, stats, pending, error, refresh } = useCheckouts(filterParams)
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const checkoutPrintColumns = [
  { key: 'transactionId', label: 'ID' },
  { key: 'customer', label: 'Customer' },
  { key: 'product', label: 'Product' },
  { key: 'method', label: 'Payment Method' },
  { key: 'payment', label: 'Payment (IDR)', align: 'right' as const },
  { key: 'deliveryFee', label: 'Delivery Fee', align: 'right' as const },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status', align: 'center' as const }
]
</script>

<template>
  <div class="dulank-page dulank-page-checkout max-w-7xl mx-auto px-4 py-6">
    <!-- Header with literal title and subtitle from Netlify / legacy HTML -->
    <SalesListHeader
      title="Checkout List"
      subtitle="Manage Checkout"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <!-- KPI Widgets -->
    <CheckoutStatsWidgets :stats="stats" />

    <!-- Error State -->
    <div v-if="error" class="p-4 bg-red-50 text-red-600 rounded-lg text-sm mb-4">
      Gagal memuat data checkout: {{ error.message }}
      <button class="ml-2 underline font-semibold" @click="refresh">Coba lagi</button>
    </div>

    <!-- Checkout Records Table -->
    <CheckoutRecordsTable
      :checkouts="checkouts"
      v-model:search-query="searchQuery"
      v-model:filter-method="filterMethod"
      v-model:filter-status="filterStatus"
      v-model:filter-date-range="filterDateRange"
    />

    <!-- Standardized Print & Export PDF Modal -->
    <DocumentPrintModal
      v-if="isPrintModalOpen"
      :open="isPrintModalOpen"
      title="Laporan Transaksi Checkout (Checkout List)"
      :columns="checkoutPrintColumns"
      :items="checkouts"
      date-field="date"
      :initial-date-range="filterDateRange"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
