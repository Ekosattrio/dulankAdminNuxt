<script setup lang="ts">
import type { CartFilterQuery } from '#server/types/cart'
import type { DateRangeValue } from '~/composables/useDateRange'
import { useCarts } from '~/composables/useCarts'
import SalesListHeader from '~/components/sales/SalesListHeader.vue'
import CartStatsWidgets from '~/components/pages/cart/CartStatsWidgets.vue'
import CartRecordsTable from '~/components/pages/cart/CartRecordsTable.vue'

import DocumentPrintModal from '~/components/common/DocumentPrintModal.vue'
import { useTablePrint } from '~/composables/useTablePrint'

definePageMeta({
  layout: 'default'
})

useLegacyPage({
  title: 'Cart List - Dulank Admin',
  sweetAlert: false
})

const searchQuery = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const filterDateRange = ref<DateRangeValue | null>(null)

const filterParams = computed<CartFilterQuery>(() => ({
  search: searchQuery.value || undefined,
  category: filterCategory.value || undefined,
  status: filterStatus.value || undefined,
  startDate: filterDateRange.value?.start || undefined,
  endDate: filterDateRange.value?.end || undefined
}))

const { carts, stats, pending, error, refresh } = useCarts(filterParams)
const { isPrintModalOpen, defaultPrintAction, openPrintModal, closePrintModal } = useTablePrint()

const cartPrintColumns = [
  { key: 'customer', label: 'Customer' },
  { key: 'product', label: 'Product' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price', align: 'right' as const },
  { key: 'qty', label: 'Qty', align: 'center' as const },
  { key: 'total', label: 'Total Price', align: 'right' as const },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status', align: 'center' as const }
]
</script>

<template>
  <div class="dulank-page dulank-page-cart max-w-7xl mx-auto px-4 py-6">
    <!-- Header with literal title and subtitle from Netlify / legacy HTML -->
    <SalesListHeader
      title="Cart List"
      subtitle="Manage cart"
      @refresh="refresh"
      @print="openPrintModal('print')"
      @pdf="openPrintModal('pdf')"
    />

    <!-- KPI Widgets -->
    <CartStatsWidgets :stats="stats" />

    <!-- Error State -->
    <div v-if="error" class="p-4 bg-red-50 text-red-600 rounded-lg text-sm mb-4">
      Gagal memuat data keranjang: {{ error.message }}
      <button class="ml-2 underline font-semibold" @click="refresh">Coba lagi</button>
    </div>

    <!-- Cart Records Table -->
    <CartRecordsTable
      :carts="carts"
      v-model:search-query="searchQuery"
      v-model:filter-category="filterCategory"
      v-model:filter-status="filterStatus"
      v-model:filter-date-range="filterDateRange"
    />

    <!-- Standardized Print & Export PDF Modal -->
    <DocumentPrintModal
      v-if="isPrintModalOpen"
      :open="isPrintModalOpen"
      title="Laporan Keranjang Pelanggan (Cart List)"
      :columns="cartPrintColumns"
      :items="carts"
      date-field="date"
      :initial-date-range="filterDateRange"
      :default-action="defaultPrintAction"
      @close="closePrintModal"
    />
  </div>
</template>
