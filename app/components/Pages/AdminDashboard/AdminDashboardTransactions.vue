<script setup lang="ts">
import type { AdminDashboardTransactionGroup } from '#server/types/admin-dashboard'
defineProps<{ groups: AdminDashboardTransactionGroup[] }>()
const activeId = ref<AdminDashboardTransactionGroup['id']>('sale')
</script>

<template>
  <article class="min-w-0 rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <header class="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-gray-800"><h2 class="app-section-title">Recent Transactions</h2><a href="#" class="text-sm font-semibold text-primary" @click.prevent>View All</a></header>
    <nav class="flex overflow-x-auto border-b border-gray-100 px-3" aria-label="Recent transaction type"><button v-for="group in groups" :key="group.id" type="button" class="h-10 shrink-0 border-b-2 px-3 text-sm font-semibold" :class="activeId === group.id ? 'border-primary text-primary' : 'border-transparent text-gray-500'" @click="activeId = group.id">{{ group.label }}</button></nav>
    <div v-for="group in groups" v-show="activeId === group.id" :key="group.id" class="overflow-x-auto"><table class="w-full min-w-[560px] text-sm"><thead class="bg-gray-50 text-gray-600 dark:bg-gray-800"><tr><th class="px-4 py-3 text-left">{{ group.subjectFirst ? group.subjectLabel : group.dateLabel }}</th><th class="px-4 py-3 text-left">{{ group.subjectFirst ? group.dateLabel : group.subjectLabel }}</th><th class="px-4 py-3 text-left">Status</th><th class="px-4 py-3 text-right">{{ group.amountLabel }}</th></tr></thead><tbody class="divide-y divide-gray-100 dark:divide-gray-800"><tr v-for="row in group.rows" :key="row.id"><td v-if="!group.subjectFirst" class="px-4 py-3 text-gray-500">{{ row.date }}</td><td class="px-4 py-3"><div class="flex items-center gap-2"><img v-if="row.image" :src="row.image" alt="" class="h-9 w-9 rounded object-cover"/><div><p class="font-semibold">{{ row.name }}</p><p class="text-xs text-orange-500">{{ row.code }}</p></div></div></td><td v-if="group.subjectFirst" class="px-4 py-3 text-gray-500">{{ row.date }}</td><td class="px-4 py-3"><SalesStatusBadge :status="row.status" /></td><td class="px-4 py-3 text-right"><CurrencyDisplay :value="row.amount" /></td></tr></tbody></table></div>
  </article>
</template>
