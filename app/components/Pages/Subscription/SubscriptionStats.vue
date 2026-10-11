<script setup lang="ts">
import type { SubscriptionSummary } from '#server/types/subscription'
import { formatMoney } from '~/utils/currency'

defineProps<{ summary: SubscriptionSummary }>()

const cards = [
  { key: 'totalTransactions', label: 'Total Transactions', icon: 'credit-card', tone: 'bg-orange-50 text-orange-600 dark:bg-orange-950/40' },
  { key: 'totalSubscribers', label: 'Total Subscribers', icon: 'users', tone: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40' },
  { key: 'activeSubscribers', label: 'Active Subscribers', icon: 'user-check', tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40' },
  { key: 'expiredSubscribers', label: 'Expired Subscribers', icon: 'user-x', tone: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40' },
] as const
</script>

<template>
  <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Subscription summary">
    <article
      v-for="card in cards"
      :key="card.key"
      class="flex min-w-0 items-center gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <span :class="['flex size-12 shrink-0 items-center justify-center rounded-lg', card.tone]">
        <FeatherIcon :name="card.icon" :size="22" />
      </span>
      <div class="min-w-0">
        <p class="app-supporting-text truncate font-semibold">{{ card.label }}</p>
        <p class="mt-1 truncate text-2xl font-bold tabular-nums text-gray-900 dark:text-white">
          {{ card.key === 'totalTransactions' ? formatMoney(summary[card.key]) : formatMoney(summary[card.key], { thousandSeparator: ',' }) }}
        </p>
      </div>
    </article>
  </section>
</template>
