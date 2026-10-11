<script setup lang="ts">
defineProps<{ conversion: { rate: number; thisWeek: string; lastWeek: string } }>()
defineEmits<{ detail: [] }>()
</script>

<template>
  <article class="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm xl:col-span-3 dark:border-gray-800 dark:bg-gray-900">
    <div><h2 class="app-section-title">Conversions</h2><div class="relative my-4 flex justify-center"><svg width="130" height="130" viewBox="0 0 120 120"><circle cx="60" cy="60" r="48" fill="none" stroke="#e5e7eb" stroke-width="12"/><circle cx="60" cy="60" r="48" fill="none" stroke="#22c55e" stroke-width="12" :stroke-dasharray="`${conversion.rate * 3.016} 301.6`" stroke-linecap="round" transform="rotate(-90 60 60)"/></svg><div class="absolute inset-0 flex flex-col items-center justify-center"><strong class="text-xl">{{ conversion.rate }}%</strong><span class="text-xs text-gray-400">Returning Customer</span></div></div><div class="flex justify-between border-t border-gray-100 pt-3 text-xs"><div><b>This Week</b><div class="text-success">{{ conversion.thisWeek }}</div></div><div class="text-right"><b>Last Week</b><div>{{ conversion.lastWeek }}</div></div></div></div>
    <button type="button" class="mt-4 h-9 w-full rounded-md border border-primary text-sm font-semibold text-primary" @click="$emit('detail')">View Details</button>
  </article>
</template>
