<script setup lang="ts">
import type { DateRangeValue } from '~/composables/useDateRange'
import type { SalesDashboardBestSeller, SalesDashboardTransaction } from '#server/types/sales-dashboard'
const page = useSalesDashboard()
const dateRange = ref<DateRangeValue | null>(null)
const collapsed = ref(false)
const message = ref('')
const transaction = ref<SalesDashboardTransaction | null>(null)
const product = ref<SalesDashboardBestSeller | null>(null)
async function refresh() { await page.refresh(); message.value = 'Sales dashboard refreshed successfully.' }
function notify(label: string) { message.value = `${label} refreshed.` }
</script>

<template>
  <div class="mx-auto max-w-[1600px] px-4 py-4 sm:px-6">
    <SalesDashboardHeader v-model:date-range="dateRange" :collapsed="collapsed" :refreshing="page.pending.value" @refresh="refresh" @collapse="collapsed = !collapsed" />
    <SalesFeedback :pending="page.pending.value" :error="page.error.value?.message || ''" :message="message" skeleton="card" @retry="refresh" @dismiss="message = ''">
      <SalesDashboardKpis @refresh="notify" />
      <div class="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-12"><SalesDashboardBestSellers :items="page.bestSellers.value" @view="product = $event" /><SalesDashboardTransactions :items="page.recentTransactions.value" @view="transaction = $event" /></div>
      <div class="grid grid-cols-1 gap-5 xl:grid-cols-12"><SalesDashboardAnalytics :yearly-data="page.yearlyData.value" /><SalesDashboardCountries :items="page.countryMarkers.value" /></div>
    </SalesFeedback>
    <SalesDashboardDialogs :transaction="transaction" :product="product" @close-transaction="transaction = null" @close-product="product = null" />
  </div>
</template>
