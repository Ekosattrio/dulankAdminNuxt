<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import SalesDashboardHeader from '~/components/pages/sales-dashboard/SalesDashboardHeader.vue'
import SalesDashboardTopCards from '~/components/pages/sales-dashboard/SalesDashboardTopCards.vue'
import SalesBestSellersCard, { type BestSellerItem } from '~/components/pages/sales-dashboard/SalesBestSellersCard.vue'
import SalesRecentTransactionsCard, { type TransactionItem } from '~/components/pages/sales-dashboard/SalesRecentTransactionsCard.vue'
import SalesAnalyticsChartCard from '~/components/pages/sales-dashboard/SalesAnalyticsChartCard.vue'
import SalesCountryMapCard from '~/components/pages/sales-dashboard/SalesCountryMapCard.vue'
import SalesDashboardDetailModals from '~/components/pages/sales-dashboard/SalesDashboardDetailModals.vue'

definePageMeta({
  layout: 'default',
  alias: ['/sales-dashboard.html'],
})

useLegacyPage({
  title: 'Sales Dashboard',
  sweetAlert: false,
})

const isRefreshing = ref(false)
const toastMessage = ref<string | null>(null)

function showToast(msg: string) {
  toastMessage.value = msg
  setTimeout(() => {
    if (toastMessage.value === msg) toastMessage.value = null
  }, 3000)
}

function handleRefreshAll() {
  isRefreshing.value = true
  setTimeout(() => {
    isRefreshing.value = false
    showToast('Sales dashboard refreshed successfully.')
  }, 600)
}

const isTxModalOpen = ref(false)
const activeTransaction = ref<TransactionItem | null>(null)

function handleViewTransaction(tx: TransactionItem) {
  activeTransaction.value = tx
  isTxModalOpen.value = true
}

const isProductModalOpen = ref(false)
const activeProduct = ref<BestSellerItem | null>(null)

function handleViewProduct(p: BestSellerItem) {
  activeProduct.value = p
  isProductModalOpen.value = true
}
</script>

<template>
  <div class="dulank-page dulank-page-sales-dashboard min-h-screen p-4 sm:p-6 space-y-5">
    <!-- Floating Toast Notification -->
    <Transition
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="toastMessage"
        class="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg bg-[#092C4C] px-4 py-3 text-xs font-semibold text-white shadow-lg"
      >
        <FeatherIcon name="check-circle" size="16" class="text-[#28C76F]" />
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>

    <!-- Welcome & Date Range Header -->
    <SalesDashboardHeader
      @refresh="handleRefreshAll"
      @range-changed="showToast(`Date range set to: ${$event}`)"
    />

    <!-- Top Sales KPI Cards -->
    <SalesDashboardTopCards @refresh-card="showToast(`Refreshed ${$event} metrics.`)" />

    <!-- Middle Row: Best Seller & Recent Transactions -->
    <div class="grid grid-cols-1 gap-5 xl:grid-cols-12">
      <SalesBestSellersCard @view-product="handleViewProduct" />
      <SalesRecentTransactionsCard @view-transaction="handleViewTransaction" />
    </div>

    <!-- Bottom Row: Sales Analytics & Sales by Countries -->
    <div class="sales-board grid grid-cols-1 gap-5 xl:grid-cols-12">
      <SalesAnalyticsChartCard />
      <SalesCountryMapCard />
    </div>

    <!-- Modals -->
    <SalesDashboardDetailModals
      :tx-modal-open="isTxModalOpen"
      :product-modal-open="isProductModalOpen"
      :active-transaction="activeTransaction"
      :active-product="activeProduct"
      @close-tx="isTxModalOpen = false"
      @close-product="isProductModalOpen = false"
    />
  </div>
</template>
