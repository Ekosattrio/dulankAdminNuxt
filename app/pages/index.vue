<script setup lang="ts">
import FeatherIcon from '~/components/common/FeatherIcon.vue'
import AdminMetricCards from '~/components/pages/dashboard/AdminMetricCards.vue'
import AdminOverviewSection from '~/components/pages/dashboard/AdminOverviewSection.vue'
import AdminRecentTransactionsTable from '~/components/pages/dashboard/AdminRecentTransactionsTable.vue'

definePageMeta({
  layout: 'default',
  alias: ['/index.html'],
})

useLegacyPage({
  title: 'Dashboard Admin',
  sweetAlert: false,
})

const isAlertVisible = ref(true)
</script>

<template>
  <div class="dulank-page dulank-page-dashboard space-y-5 p-4 md:p-6">
    <!-- Welcome Header & Alert -->
    <div>
      <div class="mb-3">
        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Welcome, Admin</h3>
        <p class="text-xs text-gray-500 dark:text-gray-400">
          You have <span class="font-bold text-rose-600">200+</span> Orders, Today
        </p>
      </div>

      <!-- Low Stock Warning Alert -->
      <div
        v-if="isAlertVisible"
        class="flex items-center justify-between rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200"
      >
        <div class="flex items-center gap-2">
          <FeatherIcon name="alert-triangle" size="16" class="flex-shrink-0 text-amber-600 dark:text-amber-400" />
          <span>Your Product <strong>Apple Iphone 15</strong> is running Low, already below 5 Pcs.</span>
          <NuxtLink to="/create-product" class="ms-1 font-semibold text-primary underline hover:text-primary-hover">
            Add Stock
          </NuxtLink>
        </div>
        <button type="button" class="text-amber-700 hover:text-amber-900 dark:text-amber-300" @click="isAlertVisible = false">
          <FeatherIcon name="x" size="14" />
        </button>
      </div>
    </div>

    <!-- Top Metrics (Primary & Secondary) -->
    <AdminMetricCards />

    <!-- Middle Overview (Charts & Information) -->
    <AdminOverviewSection />

    <!-- Recent Transactions Table -->
    <AdminRecentTransactionsTable />
  </div>
</template>
