<script setup lang="ts">
import type { AnalyticsBrowser, AnalyticsRegion, AnalyticsTopPage } from '#server/types/analytics-dashboard'
defineProps<{ browsers: AnalyticsBrowser[]; regions: AnalyticsRegion[]; pages: AnalyticsTopPage[] }>()
defineEmits<{ detail: [title: string, description: string] }>()
const rateClass = (rate: string) => Number.parseFloat(rate) > 20 ? 'bg-danger' : Number.parseFloat(rate) > 10 ? 'bg-amber-500' : 'bg-success'
</script>

<template>
  <section class="grid grid-cols-1 gap-5 lg:grid-cols-12">
    <article class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-3 dark:border-gray-800 dark:bg-gray-900">
      <h2 class="app-section-title mb-4">Session By Browser</h2><div class="space-y-2.5"><div v-for="item in browsers" :key="item.name" class="text-xs"><div class="flex justify-between"><span>{{ item.name }}</span><b>{{ item.percent }}% <span class="font-normal text-gray-400">{{ item.count }}</span></b></div><div class="mt-1 h-1.5 rounded-full bg-gray-100"><div class="h-full rounded-full bg-primary" :style="{ width: `${item.percent}%` }"/></div></div></div>
      <button type="button" class="mt-4 h-9 w-full rounded-md border border-primary text-sm font-semibold text-primary" @click="$emit('detail', 'Browser Traffic Breakdown', 'Complete browser session distribution.')">View All</button>
    </article>
    <article class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-4 dark:border-gray-800 dark:bg-gray-900">
      <header class="mb-4 flex justify-between border-b border-gray-100 pb-3"><h2 class="app-section-title">Sessions by Country</h2><button type="button" class="text-xs font-semibold text-primary" @click="$emit('detail', 'Sessions by Region Data', 'Regional visitor distribution data.')">View Data</button></header>
      <div class="space-y-3"><div v-for="item in regions" :key="item.name" class="text-xs"><div class="flex justify-between"><b>{{ item.name }}</b><b class="text-primary">{{ item.count }}</b></div><div class="mt-1 h-1.5 rounded-full bg-gray-100"><div class="h-full rounded-full bg-primary" :style="{ width: `${item.percent}%` }"/></div></div></div>
    </article>
    <article class="min-w-0 rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-5 dark:border-gray-800 dark:bg-gray-900">
      <header class="mb-3 flex justify-between border-b border-gray-100 pb-3"><h2 class="app-section-title">Top Pages</h2><button type="button" class="text-xs font-semibold text-primary" @click="$emit('detail', 'Top Pages Analysis', 'Most visited pages and engagement details.')">View All</button></header>
      <div class="overflow-x-auto"><table class="w-full min-w-[560px] text-left text-sm"><thead><tr class="border-b border-gray-100 text-xs text-gray-500"><th class="py-2">Page Path</th><th>Page Views</th><th>Avg Time on Page</th><th>Exit Rate</th></tr></thead><tbody><tr v-for="page in pages" :key="page.path" class="border-b border-gray-50"><td class="py-2 font-mono text-xs text-blue-600">{{ page.path }}</td><td>{{ page.views.toLocaleString() }}</td><td>{{ page.avgTime }}</td><td><span :class="['rounded px-2 py-1 text-xs font-semibold text-white', rateClass(page.exitRate)]">{{ page.exitRate }}</span></td></tr></tbody></table></div>
    </article>
  </section>
</template>
