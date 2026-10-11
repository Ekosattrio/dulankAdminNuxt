<script setup lang="ts">
const props = defineProps<{ yearlyData: Record<string, number[]> }>()
const year = ref('2023')
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const values = computed(() => props.yearlyData[year.value] || [])
const points = computed(() => values.value.map((value, index) => `${32 + index * 52},${220 - value * 4}`).join(' '))
</script>

<template>
  <section class="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 xl:col-span-7">
    <header class="mb-4 flex items-center justify-between"><h2 class="app-section-title">Sales Analytics</h2><TableFilterSelect v-model="year" aria-label="Sales analytics year" :options="['2023', '2022', '2021']" /></header>
    <div class="overflow-x-auto"><svg viewBox="0 0 640 260" class="min-w-[600px]" role="img" aria-label="Monthly sales analytics">
      <defs><linearGradient id="sales-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff9f43" stop-opacity=".32"/><stop offset="1" stop-color="#ff9f43" stop-opacity=".02"/></linearGradient></defs>
      <g stroke="#e5e7eb" stroke-width="1"><line v-for="y in [40,80,120,160,200]" :key="y" x1="32" :y1="y" x2="620" :y2="y" /></g>
      <polygon v-if="points" :points="`32,220 ${points} 604,220`" fill="url(#sales-area)" />
      <polyline :points="points" fill="none" stroke="#ff9f43" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
      <g v-for="(value, index) in values" :key="index"><circle :cx="32 + index * 52" :cy="220 - value * 4" r="4" fill="#ff9f43"><title>{{ months[index] }}: {{ value }}K</title></circle><text :x="32 + index * 52" y="244" text-anchor="middle" class="fill-gray-500 text-xs">{{ months[index] }}</text></g>
    </svg></div>
  </section>
</template>
