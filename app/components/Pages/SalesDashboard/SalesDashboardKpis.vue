<script setup lang="ts">
defineEmits<{ refresh: [label: string] }>()
</script>

<template>
  <section class="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-12">
    <article class="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:col-span-2 xl:col-span-6">
      <div><h2 class="app-section-title mb-2 text-primary">Weekly Earning</h2><p class="text-2xl font-bold text-secondary dark:text-white">$95,000.45</p><p class="mt-2 text-sm text-gray-500"><span class="font-semibold text-success">↑ 48%</span> increase compare to last week</p></div>
      <img src="/assets/img/icons/weekly-earning.svg" alt="" class="w-20 shrink-0 sm:w-24" />
    </article>
    <article v-for="card in [{ label: 'No of Total Sales', value: '10,000+', icon: '/assets/img/icons/total-sales.svg', color: 'bg-primary' }, { label: 'No of Total Sales', value: '800+', icon: '/assets/img/icons/purchased-earnings.svg', color: 'bg-secondary' }]" :key="card.value" :class="[card.color, 'relative flex flex-col justify-between rounded-xl p-6 text-white shadow-sm xl:col-span-3']">
      <div class="mb-4 flex items-start justify-between"><img :src="card.icon" alt="" class="size-10 brightness-0 invert" /><SalesActionButton action="refresh" :label="`Refresh ${card.label}`" @click="$emit('refresh', card.label)" /></div>
      <div><p class="text-2xl font-bold">{{ card.value }}</p><p class="text-sm font-medium text-white/90">{{ card.label }}</p></div>
    </article>
  </section>
</template>
