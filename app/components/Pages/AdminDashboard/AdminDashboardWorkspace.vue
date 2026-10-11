<script setup lang="ts">
const { dashboard, pending, error, refresh } = useAdminDashboard()
</script>

<template>
  <div class="space-y-5">
    <SalesFeedback :pending="pending" :error="error ? 'Unable to load admin dashboard.' : ''" @retry="refresh()" />
    <template v-if="dashboard && !pending">
      <AdminDashboardWelcome :name="dashboard.welcomeName" :orders-today="dashboard.ordersToday" :notice="dashboard.lowStockNotice" />
      <AdminDashboardMetrics :primary="dashboard.primaryMetrics" :secondary="dashboard.secondaryMetrics" />
      <section class="grid grid-cols-1 gap-5 lg:grid-cols-12"><AdminDashboardSalesChart :series="dashboard.chartSeries" /><AdminDashboardOverview :overview="dashboard.overview" /></section>
      <AdminDashboardProductPanels :top-selling="dashboard.topSelling" :low-stock="dashboard.lowStock" :recent-sales="dashboard.recentSales" />
      <section class="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-2"><AdminDashboardSalesStatics :statics="dashboard.salesStatics" /><AdminDashboardTransactions :groups="dashboard.transactionGroups" /></section>
      <AdminDashboardInsights :customers="dashboard.topCustomers" :categories="dashboard.categories" :category-totals="dashboard.categoryTotals" :order-statistics="dashboard.orderStatistics" />
    </template>
  </div>
</template>
