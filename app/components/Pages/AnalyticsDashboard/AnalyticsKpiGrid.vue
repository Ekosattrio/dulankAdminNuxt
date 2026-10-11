<script setup lang="ts">
import type { AnalyticsKpi } from '#server/types/analytics-dashboard'
defineProps<{ items: AnalyticsKpi[] }>()
defineEmits<{ detail: [title: string, description: string] }>()
const colors = ['text-success bg-green-50', 'text-cyan-600 bg-cyan-50', 'text-primary bg-primary/10', 'text-cyan-600 bg-cyan-50']
</script>

<template>
  <section class="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
    <article v-for="(item, index) in items" :key="item.title" class="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div :class="['flex size-14 shrink-0 items-center justify-center rounded-xl', colors[index % colors.length]]"><FeatherIcon :name="item.icon" :size="26" /></div>
      <div class="min-w-0"><div class="text-2xl font-bold text-secondary dark:text-white">{{ item.value }}</div><h2 class="text-xs font-semibold text-gray-500">{{ item.title }}</h2><div class="flex gap-1 text-xs"><span :class="item.direction === 'up' ? 'text-success' : 'text-danger'">{{ item.change }}</span><span class="text-gray-400">Last Month</span></div><button type="button" class="mt-1 text-xs font-semibold text-primary hover:underline" @click="$emit('detail', item.title, `${item.title}: ${item.value} (${item.change} Last Month)`)" >View More</button></div>
    </article>
  </section>
</template>
