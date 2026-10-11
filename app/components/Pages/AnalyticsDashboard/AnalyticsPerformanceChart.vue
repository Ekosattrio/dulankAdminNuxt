<script setup lang="ts">
import type { AnalyticsSeries } from '#server/types/analytics-dashboard'
const props = defineProps<{ series: Record<string, AnalyticsSeries> }>()
const selected = ref('ALL')
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const active = computed(() => props.series[selected.value] || props.series.ALL || { pageViews: [], clicks: [] })
const points = computed(() => months.map((month, index) => {
  const x = 35 + (index + .5) * (665 / months.length), views = active.value.pageViews[index] || 0, clicks = active.value.clicks[index] || 0
  return { month, x, barY: 165 - views * 1.65, barH: views * 1.65, lineY: 165 - clicks * 1.65 }
}))
const path = computed(() => points.value.map((point, index) => `${index ? 'L' : 'M'} ${point.x} ${point.lineY}`).join(' '))
</script>

<template>
  <article class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-9 dark:border-gray-800 dark:bg-gray-900">
    <header class="mb-3 flex flex-wrap justify-between gap-2"><h2 class="app-section-title">Performance</h2><div class="flex gap-1 rounded-lg border border-gray-200 p-1 dark:border-gray-700"><button v-for="timeframe in ['ALL','1M','6M','1Y']" :key="timeframe" type="button" :class="['rounded px-2.5 py-1 text-xs font-semibold', selected === timeframe ? 'bg-primary text-white' : 'text-gray-600']" @click="selected = timeframe">{{ timeframe }}</button></div></header>
    <div class="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">We regret to inform you that our server is currently experiencing technical issues.</div>
    <div class="overflow-x-auto"><svg viewBox="0 0 720 190" class="min-w-[620px]" role="img" aria-label="Performance page views and clicks"><g><rect v-for="point in points" :key="point.month" :x="point.x - 12" :y="point.barY" width="24" :height="point.barH" rx="3" fill="#14b8a6"/></g><path :d="path" fill="none" stroke="#6366f1" stroke-width="2.5"/><g v-for="point in points" :key="`dot-${point.month}`"><circle :cx="point.x" :cy="point.lineY" r="4" fill="white" stroke="#6366f1" stroke-width="2"/><text :x="point.x" y="185" text-anchor="middle" class="fill-gray-400 text-xs">{{ point.month }}</text></g></svg></div>
    <div class="mt-3 flex justify-center gap-5 text-xs text-gray-500"><span>■ Page Views</span><span class="text-indigo-500">— Clicks</span></div>
  </article>
</template>
