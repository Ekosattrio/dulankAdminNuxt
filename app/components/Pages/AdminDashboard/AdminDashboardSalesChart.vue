<script setup lang="ts">
import type { AdminDashboardChartRange, AdminDashboardChartSeries } from '#server/types/admin-dashboard'
const props = defineProps<{ series: Record<AdminDashboardChartRange, AdminDashboardChartSeries> }>()
const range = ref<AdminDashboardChartRange>('1Y')
const ranges: AdminDashboardChartRange[] = ['1D', '1W', '1M', '1Y']
const active = computed(() => props.series[range.value])
const max = computed(() => Math.max(...active.value.sales, ...active.value.purchase, 1))
</script>

<template>
  <article class="rounded-xl border border-gray-200 bg-white shadow-sm lg:col-span-8 dark:border-gray-800 dark:bg-gray-900">
    <header class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-800"><h2 class="app-section-title">Sales &amp; Purchase</h2><div class="flex gap-1" aria-label="Sales chart range"><button v-for="item in ranges" :key="item" type="button" class="h-9 rounded-md px-3 text-sm font-semibold" :class="range === item ? 'bg-primary/10 text-primary' : 'text-gray-500 hover:bg-gray-100'" @click="range = item">{{ item }}</button></div></header>
    <div class="overflow-x-auto p-5"><div class="flex h-[260px] min-w-[520px] items-end justify-between gap-2 border-b border-gray-200 px-2">
      <div v-for="(label, index) in active.labels" :key="label" class="flex h-full min-w-8 flex-1 flex-col items-center justify-end gap-2"><div class="flex w-full flex-1 items-end justify-center gap-1"><span class="w-3 rounded-t bg-primary" :style="{ height: `${(active.sales[index]! / max) * 100}%` }" :title="`Sales ${active.sales[index]}`"/><span class="w-3 rounded-t bg-secondary" :style="{ height: `${(active.purchase[index]! / max) * 100}%` }" :title="`Purchase ${active.purchase[index]}`"/></div><span class="pb-2 text-xs text-gray-500">{{ label }}</span></div>
    </div><div class="mt-3 flex justify-center gap-4 text-xs text-gray-500"><span><i class="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-primary"/>Sales</span><span><i class="mr-1 inline-block h-2.5 w-2.5 rounded-sm bg-secondary"/>Purchase</span></div></div>
  </article>
</template>
