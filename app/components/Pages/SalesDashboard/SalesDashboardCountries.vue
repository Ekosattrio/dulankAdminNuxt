<script setup lang="ts">
import type { SalesDashboardCountry } from '#server/types/sales-dashboard'
defineProps<{ items: SalesDashboardCountry[] }>()
const period = ref('This Week')
const active = ref<SalesDashboardCountry | null>(null)
</script>

<template>
  <section class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-5">
    <header class="mb-4 flex items-center justify-between"><h2 class="app-section-title">Sales by Countries</h2><TableFilterSelect v-model="period" aria-label="Country sales period" :options="['This Week', 'This Month', 'This Year']" /></header>
    <div class="relative min-h-72 overflow-hidden rounded-lg bg-slate-50 dark:bg-gray-800">
      <svg viewBox="0 0 500 280" class="absolute inset-0 size-full opacity-30" aria-hidden="true"><path d="M22 80l65-42 74 22 32 48-48 36-82-10zm180-27 43-19 38 16-13 33-46 5zm45 62 55-27 84 22 74 63-41 39-83-10-44-44zm-36 25 55 18 18 72-48 33-37-66zm190 75 55 11 24 26-57 14-34-28z" fill="#94a3b8" /></svg>
      <button v-for="item in items" :key="item.id" type="button" class="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-primary/20 bg-primary p-1.5 shadow" :style="{ left: `${item.x}%`, top: `${item.y}%` }" :aria-label="item.name" @mouseenter="active = item" @focus="active = item" @click="active = item" />
      <div v-if="active" class="absolute bottom-3 left-3 rounded-md bg-[#092c4c] px-3 py-2 text-xs text-white"><strong class="block">{{ active.name }}</strong>{{ active.sales }} · {{ active.percentage }}%</div>
    </div>
    <p class="mt-4 text-sm text-gray-500"><span class="font-semibold text-success">↑ 48%</span> increase compare to last week</p>
  </section>
</template>
