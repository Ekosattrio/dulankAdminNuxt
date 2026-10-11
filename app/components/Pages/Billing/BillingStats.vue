<script setup lang="ts">
import type { BillingSummary } from '#server/types/billing'
import { formatMoney } from '~/utils/currency'

defineProps<{ summary: BillingSummary }>()
const cards = [
  { key: 'totalTransaction', label: 'Total Transaction', icon: 'file-text', tone: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40' },
  { key: 'totalSuccess', label: 'Total Success', icon: 'check-circle', tone: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40' },
  { key: 'totalFailed', label: 'Total Failed', icon: 'x-circle', tone: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40' },
] as const
</script>

<template>
  <section class="grid grid-cols-1 gap-4 sm:grid-cols-3" aria-label="Billing summary">
    <article v-for="card in cards" :key="card.key" class="flex min-w-0 items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div class="min-w-0">
        <p class="app-supporting-text truncate font-semibold">{{ card.label }}</p>
        <p class="mt-1 truncate text-2xl font-bold tabular-nums text-gray-900 dark:text-white">{{ formatMoney(summary[card.key], { thousandSeparator: ',' }) }}</p>
      </div>
      <span :class="['flex size-12 shrink-0 items-center justify-center rounded-full', card.tone]"><FeatherIcon :name="card.icon" :size="22" /></span>
    </article>
  </section>
</template>
