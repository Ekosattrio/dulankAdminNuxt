<script setup lang="ts">
import type { AdminDashboardOverview, AdminDashboardPeriod } from '#server/types/admin-dashboard'
withDefaults(
  defineProps<{ overview?: AdminDashboardOverview }>(),
  {
    overview: () => ({
      suppliers: 0,
      customers: 0,
      orders: 0,
      firstTime: 0,
      firstTimeChange: 0,
      returning: 0,
      returningChange: 0,
    }),
  },
)
const period = ref<AdminDashboardPeriod>('Today')
const cards = [{ key: 'suppliers', label: 'Suppliers', icon: 'users' }, { key: 'customers', label: 'Customers', icon: 'user' }, { key: 'orders', label: 'Orders', icon: 'shopping-cart' }] as const
</script>

<template>
  <article class="rounded-xl border border-gray-200 bg-white shadow-sm lg:col-span-4 dark:border-gray-800 dark:bg-gray-900">
    <header class="border-b border-gray-100 px-5 py-4 dark:border-gray-800"><h2 class="app-section-title">Overall Information</h2></header>
    <div class="p-5"><div class="grid grid-cols-3 gap-2 border-b border-gray-100 pb-5 text-center dark:border-gray-800"><div v-for="card in cards" :key="card.key"><span class="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary"><FeatherIcon :name="card.icon" :size="14" /></span><p class="text-xs text-gray-500">{{ card.label }}</p><p class="text-base font-bold">{{ (overview?.[card.key] ?? 0).toLocaleString('id-ID') }}</p></div></div>
      <div class="pt-4"><div class="mb-4 flex items-center justify-between gap-3"><h3 class="text-sm font-bold">Customers Overview</h3><TableFilterSelect v-model="period" :options="['Today', 'Monthly', 'Weekly']" placeholder="Period" aria-label="Customers overview period" /></div>
        <div class="grid grid-cols-3 items-center gap-3 text-center"><div class="mx-auto flex h-20 w-20 items-center justify-center rounded-full" style="background: conic-gradient(#7367f0 0 61%, #28c76f 61% 100%)"><span class="flex h-12 w-12 items-center justify-center rounded-full bg-white text-xs font-bold dark:bg-gray-900">{{ period }}</span></div><div><p class="text-lg font-bold text-danger">{{ ((overview?.firstTime ?? 0) / 1000).toFixed(1) }}K</p><p class="text-xs font-semibold text-danger">First Time</p><span class="mt-1 inline-flex rounded bg-red-50 px-2 py-1 text-xs text-danger">↑ {{ overview?.firstTimeChange ?? 0 }}%</span></div><div><p class="text-lg font-bold text-success">{{ ((overview?.returning ?? 0) / 1000).toFixed(1) }}K</p><p class="text-xs font-semibold text-success">Return</p><span class="mt-1 inline-flex rounded bg-emerald-50 px-2 py-1 text-xs text-success">↑ {{ overview?.returningChange ?? 0 }}%</span></div></div>
      </div>
    </div>
  </article>
</template>
