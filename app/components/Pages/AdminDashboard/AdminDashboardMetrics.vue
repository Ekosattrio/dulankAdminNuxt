<script setup lang="ts">
import type { AdminDashboardMetric } from '#server/types/admin-dashboard'
import { formatIDR } from '~/utils/currency'
defineProps<{ primary: AdminDashboardMetric[]; secondary: AdminDashboardMetric[] }>()
const tones = { orange: 'bg-[#ffb56b]', navy: 'bg-[#052938]', green: 'bg-[#18b39b]', blue: 'bg-[#2f7ff5]', plain: 'bg-white' }
</script>

<template>
  <section class="space-y-4">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article v-for="item in primary" :key="item.id" class="rounded-xl p-4 text-white shadow-sm" :class="tones[item.tone]">
        <div class="flex items-center gap-3"><span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/20"><FeatherIcon :name="item.icon" :size="22" /></span><div><p class="text-sm text-white/85">{{ item.title }}</p><p class="text-lg font-bold tabular-nums">{{ formatIDR(item.amount, false) }}</p><p class="text-xs text-white/80">{{ item.change > 0 ? '+' : '' }}{{ item.change }}%</p></div></div>
      </article>
    </div>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article v-for="item in secondary" :key="item.id" class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-gray-800"><div><p class="text-lg font-bold tabular-nums">{{ formatIDR(item.amount, false) }}</p><p class="text-sm text-gray-500">{{ item.title }}</p></div><span class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><FeatherIcon :name="item.icon" :size="18" /></span></div>
        <div class="mt-3 flex items-center justify-between gap-2 text-sm"><p class="text-gray-500"><strong :class="item.change >= 0 ? 'text-success' : 'text-danger'">{{ item.change > 0 ? '+' : '' }}{{ item.change }}%</strong> vs Last Month</p><NuxtLink v-if="item.link" :to="item.link" class="shrink-0 font-semibold text-primary underline">View All</NuxtLink></div>
      </article>
    </div>
  </section>
</template>
