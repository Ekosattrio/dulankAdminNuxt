<script setup lang="ts">
import { formatMoney } from '~/utils/currency'

useLegacyPage({
  title: 'Dashboard Admin',
  styles: ['/assets/css/style.css'],
  scripts: ['/assets/js/theme-script.js'],
  sweetAlert: true
});

const { user } = useAdminAuth();
const { summary, pending, error, refresh } = useDashboard();

const isAlertVisible = ref(true);

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const welcomeName = computed(() => {
  const name = user.value?.name?.trim();

  return name ? name.split(/\s+/)[0] : 'Admin';
});

const welcomeEmail = computed(() => user.value?.email ?? '');

const primaryMetrics = computed(() => [
  {
    title: 'Total Sales',
    amount: summary.value?.totalSales ?? 0,
    icon: 'trending-up',
    bgColor: 'bg-[#ffb56b]'
  },
  {
    title: 'Total Sales Return',
    amount: summary.value?.totalSalesReturn ?? 0,
    icon: 'rotate-ccw',
    bgColor: 'bg-[#052938]'
  },
  {
    title: 'Total Purchase',
    amount: summary.value?.totalPurchase ?? 0,
    icon: 'shopping-bag',
    bgColor: 'bg-[#18b39b]'
  },
  {
    title: 'Total Purchase Return',
    amount: summary.value?.totalPurchaseReturn ?? 0,
    icon: 'file-minus',
    bgColor: 'bg-[#2f7ff5]'
  }
]);

const secondaryMetrics = computed(() => [
  {
    title: 'Profit',
    value: formatMoney(Math.max((summary.value?.totalIncome ?? 0) - (summary.value?.totalExpense ?? 0), 0), { prefix: 'Rp ' }),
    icon: 'layers',
    tone: 'primary' as const,
    link: '/profit-and-loss'
  },
  {
    title: 'Invoice Due',
    value: formatMoney(summary.value?.invoiceDue ?? 0, { prefix: 'Rp ' }),
    icon: 'pie-chart',
    tone: 'warning' as const,
    link: '/invoice-report'
  },
  {
    title: 'Total Expenses',
    value: formatMoney(summary.value?.totalExpense ?? 0, { prefix: 'Rp ' }),
    icon: 'activity',
    tone: 'danger' as const,
    link: '/expenses'
  },
  {
    title: 'Pending Payments',
    value: String(summary.value?.pendingPayments ?? 0),
    icon: 'credit-card',
    tone: 'sky' as const,
    link: '/payments'
  }
]);

const chartMax = computed(() => {
  const values = (summary.value?.monthlyTrend ?? []).flatMap((month) => [month.sales, month.purchases]);

  return Math.max(1, ...values);
});

const chartBars = computed(() =>
  (summary.value?.monthlyTrend ?? []).map((month) => ({
    month: MONTH_LABELS[(month.month - 1) % 12] ?? month.month,
    salesHeight: month.sales > 0 ? Math.max(6, (month.sales / chartMax.value) * 160) : 0,
    purchasesHeight: month.purchases > 0 ? Math.max(6, (month.purchases / chartMax.value) * 160) : 0
  }))
);

const overallInfo = computed(() => [
  { label: 'Suppliers', value: summary.value?.totalSuppliers ?? 0, icon: 'users', chip: 'bg-primary-100 text-primary dark:bg-primary/20' },
  { label: 'Customers', value: summary.value?.totalCustomers ?? 0, icon: 'user', chip: 'bg-orange-100 text-orange-600 dark:bg-orange-950' },
  { label: 'Orders', value: summary.value?.ordersTotal ?? 0, icon: 'shopping-cart', chip: 'bg-success-soft text-success dark:bg-emerald-950' }
]);

const recentOrders = computed(() => summary.value?.recentOrders ?? []);

const topProducts = computed(() => summary.value?.topProducts ?? []);
</script>

<template>
  <div>
    <SalesFeedback
      :pending="pending"
      skeleton="card"
      :skeleton-cols="4"
      :error="error ? 'Unable to load dashboard. Please try again.' : ''"
      @retry="refresh()"
    />

    <template v-if="!pending && !error">
      <!-- Welcome Header & Alert -->
      <div class="mb-5">
        <div class="mb-3">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">Welcome, {{ welcomeName }}</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ welcomeEmail }}
            <span class="mx-1.5 text-gray-300 dark:text-gray-700">|</span>
            You have <span class="font-bold text-danger">{{ summary?.ordersToday ?? 0 }}</span> Orders, Today
          </p>
        </div>

        <!-- Low Stock Warning Alert -->
        <div
          v-if="isAlertVisible && (summary?.lowStock ?? 0) > 0"
          class="flex items-center justify-between rounded-lg border border-warning/30 bg-warning-soft px-4 py-3 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
        >
          <div class="flex items-center gap-2">
            <FeatherIcon name="alert-triangle" size="16" class="text-warning flex-shrink-0" />
            <span>
              Ada <strong>{{ summary?.lowStock }}</strong> produk yang berada di bawah ambang stok
              (quantity alert).</span>
            <NuxtLink to="/product-list" class="font-semibold underline ms-1 text-primary hover:text-primary-hover">Kelola Stok</NuxtLink>
          </div>
          <button type="button" class="text-amber-700 hover:text-amber-900 dark:text-amber-300" @click="isAlertVisible = false">
            <FeatherIcon name="x" size="14" />
          </button>
        </div>
      </div>

      <!-- Top Primary Metric Cards (4 cards) -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-5">
        <div
          v-for="(metric, idx) in primaryMetrics"
          :key="idx"
          :class="['rounded-xl p-4 shadow-sm transition-transform hover:-translate-y-0.5', metric.bgColor]"
        >
          <div class="flex items-center gap-3">
            <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
              <FeatherIcon :name="metric.icon" size="22" class="text-white" />
            </div>
            <div class="min-w-0">
              <span class="block text-xs text-white/80 font-medium">{{ metric.title }}</span>
              <h5 class="text-lg font-bold text-white tracking-tight leading-tight">
                {{ formatMoney(metric.amount, { prefix: 'Rp ' }) }}
              </h5>
            </div>
          </div>
        </div>
      </div>

      <!-- Secondary Metric Cards -->
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
        <NuxtLink
          v-for="(card, idx) in secondaryMetrics"
          :key="idx"
          :to="card.link"
          class="block transition-transform hover:-translate-y-0.5"
        >
          <StatCard
            :label="card.title"
            :value="card.value"
            :icon="card.icon"
            :tone="card.tone"
          />
        </NuxtLink>
      </div>

      <!-- Middle Grid: Sales & Purchase Chart Overview -->
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-12 mb-6">
        <!-- Sales & Purchase Chart Summary Card (8 Cols) -->
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-8 dark:border-gray-800 dark:bg-gray-900">
          <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
            <h5 class="text-sm font-bold text-gray-900 dark:text-white">Sales & Purchase Overview</h5>
            <div class="flex items-center gap-3 text-[10px] text-gray-400">
              <span class="inline-flex items-center gap-1">
                <i class="inline-block h-2.5 w-2.5 rounded-sm bg-primary"></i> Sales
              </span>
              <span class="inline-flex items-center gap-1">
                <i class="inline-block h-2.5 w-2.5 rounded-sm bg-secondary"></i> Purchase
              </span>
            </div>
          </div>

          <div class="mt-6 flex h-48 items-end justify-between gap-2 px-2">
            <div
              v-for="(bar, i) in chartBars"
              :key="i"
              class="flex flex-1 flex-col items-center gap-1.5"
            >
              <div class="flex items-end gap-1 w-full justify-center">
                <div
                  class="w-2.5 rounded-t bg-primary transition-all duration-500 hover:opacity-80"
                  :style="{ height: `${bar.salesHeight}px` }"
                  :title="`Sales ${formatMoney(summary?.monthlyTrend?.[i]?.sales ?? 0, { prefix: 'Rp ' })}`"
                />
                <div
                  class="w-2.5 rounded-t bg-secondary transition-all duration-500 hover:opacity-80"
                  :style="{ height: `${bar.purchasesHeight}px` }"
                  :title="`Purchase ${formatMoney(summary?.monthlyTrend?.[i]?.purchases ?? 0, { prefix: 'Rp ' })}`"
                />
              </div>
              <span class="text-[10px] text-gray-400">{{ bar.month }}</span>
            </div>
          </div>
        </div>

        <!-- Overall Information Card (4 Cols) -->
        <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-4 dark:border-gray-800 dark:bg-gray-900">
          <h5 class="border-b border-gray-100 pb-3 text-sm font-bold text-gray-900 dark:border-gray-800 dark:text-white">
            Overall Information
          </h5>

          <!-- 3 Quick Stats -->
          <div class="grid grid-cols-3 gap-2 py-4 text-center border-b border-gray-100 dark:border-gray-800">
            <div v-for="(stat, idx) in overallInfo" :key="idx">
              <div
                class="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-full"
                :class="stat.chip"
              >
                <FeatherIcon :name="stat.icon" size="14" />
              </div>
              <span class="text-[11px] text-gray-400">{{ stat.label }}</span>
              <p class="text-sm font-bold text-gray-800 dark:text-white">{{ stat.value }}</p>
            </div>
          </div>

          <div class="pt-4">
            <div class="flex items-center justify-between text-xs mb-2">
              <span class="font-bold text-gray-800 dark:text-white">Top Products</span>
              <span class="rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600 dark:bg-gray-800 dark:text-gray-300">Terjual</span>
            </div>
            <ul class="space-y-2">
              <li
                v-for="(product, idx) in topProducts"
                :key="idx"
                class="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-xs dark:bg-gray-800/50"
              >
                <span class="truncate font-medium text-gray-800 dark:text-gray-200">
                  <span class="me-1.5 text-gray-400">#{{ idx + 1 }}</span>{{ product.name }}
                </span>
                <span class="font-bold text-primary">{{ formatMoney(product.qty, { suffix: ' pcs' }) }}</span>
              </li>
              <li v-if="topProducts.length === 0" class="text-center text-xs text-gray-400 py-2">
                Belum ada data penjualan.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Recent Transactions Summary Table -->
      <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800 mb-4">
          <h5 class="text-sm font-bold text-gray-900 dark:text-white">Recent Orders</h5>
          <NuxtLink to="/online-orders" class="text-xs font-semibold text-primary hover:underline">View All Orders</NuxtLink>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-start text-xs">
            <thead class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
              <tr>
                <th class="px-4 py-2.5 text-start">Order No</th>
                <th class="px-4 py-2.5 text-start">Customer</th>
                <th class="px-4 py-2.5 text-start">Date</th>
                <th class="px-4 py-2.5 text-start">Total Amount</th>
                <th class="px-4 py-2.5 text-start">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-for="order in recentOrders" :key="order.no" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
                <td class="px-4 py-3 font-semibold text-primary">{{ order.no }}</td>
                <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">{{ order.customer }}</td>
                <td class="px-4 py-3 text-gray-500">{{ order.date }}</td>
                <td class="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">
                  <CurrencyDisplay :value="order.total" align="left" />
                </td>
                <td class="px-4 py-3">
                  <StatusPill :status="order.status" />
                </td>
              </tr>
              <tr v-if="recentOrders.length === 0">
                <td colspan="5" class="px-4 py-6 text-center text-gray-400">Belum ada order.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>