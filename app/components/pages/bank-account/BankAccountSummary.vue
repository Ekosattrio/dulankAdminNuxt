<script setup lang="ts">
import CurrencyDisplay from '~/components/common/CurrencyDisplay.vue'

defineProps<{
  stats: { total: number; active: number; inactive: number; totalBalance: number }
}>()

const cards = computed(() => [
  { key: 'total', label: 'Total Accounts', icon: 'credit-card', tone: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' },
  { key: 'active', label: 'Active Accounts', icon: 'check-circle', tone: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' },
  { key: 'inactive', label: 'Inactive Accounts', icon: 'slash', tone: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40' },
])
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <div v-for="card in cards" :key="card.key" class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <span :class="['flex size-10 items-center justify-center rounded-md', card.tone]">
        <FeatherIcon :name="card.icon" :size="18" />
      </span>
      <div>
        <p class="app-supporting-text">{{ card.label }}</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ stats[card.key as 'total' | 'active' | 'inactive'] }}</p>
      </div>
    </div>
    <div class="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <span class="flex size-10 items-center justify-center rounded-md bg-amber-50 text-amber-600 dark:bg-amber-950/40">
        <FeatherIcon name="dollar-sign" :size="18" />
      </span>
      <div class="min-w-0">
        <p class="app-supporting-text">Current Balance</p>
        <CurrencyDisplay :value="stats.totalBalance" bold custom-class="text-2xl text-gray-900 dark:text-white" />
      </div>
    </div>
  </div>
</template>

