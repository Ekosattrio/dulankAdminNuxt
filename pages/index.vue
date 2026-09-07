<script setup lang="ts">
import PageHeader from "~/components/common/PageHeader.vue";

useHead({
  title: "Dashboard Admin - Kacetak System",
});

const isAlertVisible = ref(true);

const primaryMetrics = [
  {
    title: "Total Sales",
    amount: "Rp48.988.078",
    change: "+2.2%",
    icon: "trending-up",
    bgColor: "bg-[#ffb56b]",
    textColor: "text-white",
  },
  {
    title: "Total Sales Return",
    amount: "Rp16.478.145",
    change: "-2.2%",
    icon: "rotate-ccw",
    bgColor: "bg-[#052938]",
    textColor: "text-white",
  },
  {
    title: "Total Purchase",
    amount: "Rp24.145.789",
    change: "+3.2%",
    icon: "shopping-bag",
    bgColor: "bg-[#18b39b]",
    textColor: "text-white",
  },
  {
    title: "Total Purchase Return",
    amount: "Rp18.458.747",
    change: "+1.2%",
    icon: "file-minus",
    bgColor: "bg-[#2f7ff5]",
    textColor: "text-white",
  },
];

const secondaryMetrics = [
  {
    title: "Profit",
    amount: "Rp8.458.798",
    change: "+35%",
    changeType: "increase",
    link: "/profit-and-loss",
    icon: "layers",
  },
  {
    title: "Invoice Due",
    amount: "Rp48.988.78",
    change: "+35%",
    changeType: "increase",
    link: "/invoice-report",
    icon: "pie-chart",
  },
  {
    title: "Total Expenses",
    amount: "Rp8.980.097",
    change: "+41%",
    changeType: "increase",
    link: "/expenses",
    icon: "activity",
  },
  {
    title: "Total Payment Returns",
    amount: "Rp78.458.798",
    change: "-20%",
    changeType: "decrease",
    link: "/sales-report",
    icon: "hash",
  },
];

const recentTransactions = [
  { id: "PT001", customer: "PT. Nusantara Teknologi", date: "07/09/2026", total: "Rp1.250.000", status: "Complete" },
  { id: "PT002", customer: "Eko Satrio", date: "06/09/2026", total: "Rp899.500", status: "Pending" },
  { id: "PT003", customer: "CV Maju Jaya", date: "05/09/2026", total: "Rp3.420.000", status: "Approved" },
  { id: "PT004", customer: "Rama Nusa", date: "04/09/2026", total: "Rp550.000", status: "Complete" },
  { id: "PT005", customer: "PT. Sinar Abadi", date: "03/09/2026", total: "Rp2.100.000", status: "Need Approval" },
];
</script>

<template>
  <div>
    <!-- Welcome Header & Alert -->
    <div class="mb-5">
      <div class="mb-3">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Welcome, Admin</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          You have <span class="font-bold text-danger">200+</span> Orders, Today
        </p>
      </div>

      <!-- Low Stock Warning Alert -->
      <div
        v-if="isAlertVisible"
        class="flex items-center justify-between rounded-lg border border-warning/30 bg-warning-soft px-4 py-3 text-xs text-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
      >
        <div class="flex items-center gap-2">
          <FeatherIcon name="alert-triangle" size="16" class="text-warning flex-shrink-0" />
          <span>Your Product <strong>Apple Iphone 15</strong> is running Low, already below 5 Pcs.</span>
          <NuxtLink to="/create-product" class="font-semibold underline ms-1 text-primary hover:text-primary-hover"
            >Add Stock</NuxtLink
          >
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
        :class="['rounded-xl p-4 shadow-sm transition-transform hover:-translate-y-0.5', metric.bgColor, metric.textColor]"
      >
        <div class="flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
            <FeatherIcon :name="metric.icon" size="22" class="text-white" />
          </div>
          <div class="min-w-0">
            <span class="block text-xs text-white/80 font-medium">{{ metric.title }}</span>
            <h5 class="text-lg font-bold text-white tracking-tight leading-tight">{{ metric.amount }}</h5>
            <span class="text-[11px] text-white/70">{{ metric.change }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Secondary Metric Cards (Profit, Invoice Due, Expenses, Returns) -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-6">
      <div
        v-for="(card, idx) in secondaryMetrics"
        :key="idx"
        class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800">
          <div>
            <h4 class="text-base font-bold text-gray-900 dark:text-white">{{ card.amount }}</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ card.title }}</p>
          </div>
          <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary dark:bg-primary/20">
            <FeatherIcon :name="card.icon" size="18" />
          </div>
        </div>
        <div class="mt-2.5 flex items-center justify-between text-xs">
          <p class="text-gray-500 dark:text-gray-400">
            <span :class="['font-bold', card.changeType === 'increase' ? 'text-success' : 'text-danger']">{{ card.change }}</span>
            vs Last Month
          </p>
          <NuxtLink :to="card.link" class="font-medium text-primary hover:underline">View All</NuxtLink>
        </div>
      </div>
    </div>

    <!-- Middle Grid: Sales Chart Overview & Overall Info -->
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-12 mb-6">
      <!-- Sales & Purchase Chart Summary Card (8 Cols) -->
      <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-8 dark:border-gray-800 dark:bg-gray-900">
        <div
          class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-3 dark:border-gray-800"
        >
          <h5 class="text-sm font-bold text-gray-900 dark:text-white">Sales & Purchase Overview</h5>
          <div class="flex gap-1">
            <button
              type="button"
              class="rounded px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400"
            >
              1D
            </button>
            <button
              type="button"
              class="rounded px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400"
            >
              1W
            </button>
            <button
              type="button"
              class="rounded px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-400"
            >
              1M
            </button>
            <button type="button" class="rounded bg-primary-100 px-2.5 py-1 text-xs font-bold text-primary dark:bg-primary/20">
              1Y
            </button>
          </div>
        </div>

        <!-- Simulated Visual Bar Graphic -->
        <div class="mt-6 flex h-48 items-end justify-between gap-2 px-2">
          <div
            v-for="(m, i) in ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']"
            :key="i"
            class="flex flex-1 flex-col items-center gap-1.5"
          >
            <div class="flex items-end gap-1 w-full justify-center">
              <div
                class="w-2.5 rounded-t bg-primary transition-all duration-500 hover:opacity-80"
                :style="{ height: `${Math.floor(40 + Math.sin(i + 1) * 35 + i * 5)}px` }"
                title="Sales"
              />
              <div
                class="w-2.5 rounded-t bg-secondary transition-all duration-500 hover:opacity-80"
                :style="{ height: `${Math.floor(30 + Math.cos(i + 1) * 25 + i * 4)}px` }"
                title="Purchase"
              />
            </div>
            <span class="text-[10px] text-gray-400">{{ m }}</span>
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
          <div>
            <div
              class="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary dark:bg-primary/20"
            >
              <FeatherIcon name="users" size="14" />
            </div>
            <span class="text-[11px] text-gray-400">Suppliers</span>
            <p class="text-sm font-bold text-gray-800 dark:text-white">6.987</p>
          </div>
          <div>
            <div
              class="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-950"
            >
              <FeatherIcon name="user" size="14" />
            </div>
            <span class="text-[11px] text-gray-400">Customers</span>
            <p class="text-sm font-bold text-gray-800 dark:text-white">4.896</p>
          </div>
          <div>
            <div
              class="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-success-soft text-success dark:bg-emerald-950"
            >
              <FeatherIcon name="shopping-cart" size="14" />
            </div>
            <span class="text-[11px] text-gray-400">Orders</span>
            <p class="text-sm font-bold text-gray-800 dark:text-white">487</p>
          </div>
        </div>

        <div class="pt-4">
          <div class="flex items-center justify-between text-xs mb-2">
            <span class="font-bold text-gray-800 dark:text-white">Customers Overview</span>
            <span class="rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600 dark:bg-gray-800 dark:text-gray-300"
              >Today</span
            >
          </div>
          <div class="grid grid-cols-2 gap-3 pt-2 text-center">
            <div class="rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800/50">
              <span class="text-base font-bold text-danger">5.5K</span>
              <p class="text-[11px] text-gray-500">First Time (↑ 25%)</p>
            </div>
            <div class="rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800/50">
              <span class="text-base font-bold text-success">3.5K</span>
              <p class="text-[11px] text-gray-500">Returning (↑ 21% )</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Transactions Summary Table -->
    <div class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800 mb-4">
        <h5 class="text-sm font-bold text-gray-900 dark:text-white">Recent Transactions</h5>
        <NuxtLink to="/sales" class="text-xs font-semibold text-primary hover:underline">View All Sales</NuxtLink>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-start text-xs">
          <thead class="bg-gray-50 text-[11px] font-semibold uppercase text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
            <tr>
              <th class="px-4 py-2.5 text-start">Invoice / Sales No</th>
              <th class="px-4 py-2.5 text-start">Customer</th>
              <th class="px-4 py-2.5 text-start">Date</th>
              <th class="px-4 py-2.5 text-start">Total Amount</th>
              <th class="px-4 py-2.5 text-start">Status</th>
              <th class="px-4 py-2.5 text-end">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr v-for="t in recentTransactions" :key="t.id" class="hover:bg-gray-50/50 dark:hover:bg-gray-800/40">
              <td class="px-4 py-3 font-semibold text-primary">
                <NuxtLink :to="`/sales-note?id=${t.id}`">{{ t.id }}</NuxtLink>
              </td>
              <td class="px-4 py-3 font-medium text-gray-900 dark:text-white">{{ t.customer }}</td>
              <td class="px-4 py-3 text-gray-500">{{ t.date }}</td>
              <td class="px-4 py-3 font-semibold text-gray-800 dark:text-gray-200">{{ t.total }}</td>
              <td class="px-4 py-3">
                <span
                  :class="[
                    'inline-block px-2 py-0.5 rounded-full text-[10px] font-bold',
                    t.status === 'Complete'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : t.status === 'Pending'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : t.status === 'Approved'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
                  ]"
                >
                  {{ t.status }}
                </span>
              </td>
              <td class="px-4 py-3 text-end">
                <div class="flex items-center justify-end gap-2">
                  <NuxtLink :to="`/sales-note?id=${t.id}`" class="rounded p-1 text-gray-400 hover:text-primary" title="View Note">
                    <FeatherIcon name="eye" size="14" />
                  </NuxtLink>
                  <NuxtLink
                    :to="`/sales-receipt?id=${t.id}`"
                    class="rounded p-1 text-gray-400 hover:text-primary"
                    title="Print Receipt"
                  >
                    <FeatherIcon name="printer" size="14" />
                  </NuxtLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
