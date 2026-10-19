<script setup lang="ts">
import { formatIDR } from '~/utils/currency'
const props = withDefaults(
  defineProps<{
    statics?: {
      year: number
      revenue: number
      expense: number
      revenueChange: number
      expenseChange: number
      points: number[]
    }
  }>(),
  {
    statics: () => ({
      year: new Date().getFullYear(),
      revenue: 0,
      expense: 0,
      revenueChange: 0,
      expenseChange: 0,
      points: [0],
    }),
  },
)
const year = ref(String(props.statics?.year ?? new Date().getFullYear()))
const max = computed(() => {
  const points = props.statics?.points?.length ? props.statics.points : [1]
  return Math.max(...points, 1)
})
</script>

<template>
  <article class="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"><header class="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 dark:border-gray-800"><h2 class="app-section-title">Sales Statics</h2><TableFilterSelect v-model="year" :options="['2025', '2024', '2023', '2022']" placeholder="Year" aria-label="Sales statics year" /></header><div class="p-5"><div class="mb-5 grid grid-cols-2 gap-3"><div class="rounded-lg border border-gray-200 p-3"><p class="text-xs text-gray-500">Revenue</p><p class="text-base font-bold text-success">{{ formatIDR(statics?.revenue ?? 0, false) }}</p><span class="text-xs font-semibold text-success">+{{ statics?.revenueChange ?? 0 }}%</span></div><div class="rounded-lg border border-gray-200 p-3"><p class="text-xs text-gray-500">Expense</p><p class="text-base font-bold text-danger">{{ formatIDR(statics?.expense ?? 0, false) }}</p><span class="text-xs font-semibold text-danger">{{ statics?.expenseChange ?? 0 }}%</span></div></div><div class="flex h-40 items-end gap-2 border-b border-gray-200"><span v-for="(point, index) in (statics?.points || [])" :key="index" class="flex-1 rounded-t bg-primary/80" :style="{ height: `${(point / max) * 100}%` }"/></div></div></article>
</template>
